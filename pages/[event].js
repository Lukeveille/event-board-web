import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import symbols from '../utils/symbols';
import handleUpload from '../utils/handle-upload';
import serverCall from '../utils/server-call';
import dateTimeString from '../utils/date-time-string';
import Router from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import EditField from '../components/EditField';
import LoadingDisplay from '../components/LoadingDisplay';

const Event = props => {
  const [currentEvent, setCurrentEvent] = useState(props.event),
  owner = currentEvent && currentEvent.user && props.user? props.user.id === currentEvent.user.id : false,
  [users, setUsers] = useState(currentEvent.users_attending),
  [editing, setEditing] = useState(false),
  [loading, setLoading] = useState(false),
  [file, setFile] = useState(''),
  userIds = currentEvent && currentEvent.users_attending? currentEvent.users_attending.map(user => user.id) : null,
  [attending, setAttending] = useState(userIds? userIds.includes(props.user.id) : userIds),
  [atLimit, setAtLimit] = useState(currentEvent && currentEvent.users_attending? currentEvent.limit === currentEvent.users_attending.length : null),
  [cancelModal, setCancelModal] = useState('none'),
  upcoming = props.event && props.event.start? dateTimeString(props.event.start)[2] > Date.now() : false,
  over = props.event && props.event.end? dateTimeString(props.event.end)[2] > Date.now() : false,
  cancelPrompt = <div className="form-display">
    <h1>CANCEL EVENT</h1>
    <h2>Are You Sure?</h2>
    <button
      onClick={() => {
        serverCall('DELETE', `events/${props.event.id}`).then(() => {
          Router.push('/');
        });
      }}
    >Yes</button>
    <button onClick={() => setCancelModal('none')}>No</button>
  </div>,
  eventDisplay = currentEvent.error?
  <h1>404 - Event not found</h1>
  :
  loading?
  <LoadingDisplay />
  :
  <div className="event-display">
    <div className="two-col">
      <h3>- {currentEvent.category_name} -</h3>
      <h1>
        <EditField
          currentEvent={currentEvent}
          setCurrentEvent={setCurrentEvent}
          editing={editing}
          value="name"
          size={1.8}
        />
      </h1>
    </div>
    <main>
      {currentEvent.image_link?
      <EditField
        file={file}
        setFile={setFile}
        currentEvent={currentEvent}
        setCurrentEvent={setCurrentEvent}
        editing={editing}
        value="start"
        type="image"
        size={0.5}
      /> : ''}
      {over? <h3>{upcoming? 'Starts ' : 'This event started at '}
        <EditField
          currentEvent={currentEvent}
          setCurrentEvent={setCurrentEvent}
          editing={editing}
          value="start"
          type="time"
          size={0.5}
        />
      </h3> : ''}
      <div className="p">
        <EditField
          currentEvent={currentEvent}
          setCurrentEvent={setCurrentEvent}
          editing={editing}
          value="description"
          type="textarea"
          size={0.5}
        />
      </div>
      <h3>{over? 'Ends ' : 'This event ended '}
        <EditField
          currentEvent={currentEvent}
          setCurrentEvent={setCurrentEvent}
          value="end"
          editing={editing}
          size={0.5}
          type="time"
        />
      </h3>
    </main>
    <aside>
      <article>
        <h2>Event Host</h2>
        <h3>{currentEvent.user.full_name}</h3>
        <p>member since {dateTimeString(currentEvent.user.created_at)[0]}</p>
        {props.user.error? '' : <h3>{currentEvent.user.email}</h3>}
      </article>
      <article style={{padding: 0}}>
        {props.user.error? '' :
        <div className="form-display">
          <button
            className="attend-btn"
            disabled={owner || attending || atLimit || !upcoming? true : false}
            onClick={() => {
              serverCall('POST', 'attendings', { event_id: currentEvent.id }).then(() => {
                setUsers([...users, props.user]);
                setAttending(true);
              });
            }}
          >
            {
              owner? 'This is your event' :
              attending? 'You are attending' :
              atLimit? 'Event is at capacity' :
              upcoming? 'I would like to attend' :
              over? 'This event has started' : 'This event has ended'
            }
          </button>
          {owner? '' : attending? <a
            onClick={() => {
              serverCall('DELETE', 'attendings', { event_id: currentEvent.id }).then(res => {
                setAttending(false);
                setAtLimit(false)
                setUsers(users.filter(user => (user.id !== props.user.id)));
              });
            }}
          >I can no longer attend</a> : ''}
        </div>
        }
        {upcoming? <div>
          <p style={{margin: 0}}>({currentEvent.limit - users.length} Spots Left)</p>
          <div className="p">
            Capacity&nbsp;
            <EditField
              currentEvent={currentEvent}
              setCurrentEvent={setCurrentEvent}
              editing={editing}
              value="limit"
              type="number"
              size={0.5}
            />
          </div>
        </div> : ''}
      </article>
      <article>
        <h2>{users.length} Attend{over? 'ing' : 'ed'}</h2>
        <ul>
          {users.map(user => {
            return <li key={user.id}>{user.full_name}</li>
          })}
        </ul>
      </article>
    </aside>
    {owner? <div className="two-col edit-btn">
      {editing?
        <div>
          <a
            onClick={() => {
              setEditing(false);
              if (file) {
                handleUpload(file, setLoading).then(res => {
                  const eventUpdate = ({...currentEvent, image_link: `http://d2b7dtg3ypekdu.cloudfront.net${res.split('com')[1]}` });
                  serverCall('DELETE', `s3/delete`, { filename: symbols(currentEvent.image_link.split('%2F')[1]) }).then(() => {
                    serverCall('PUT', `events/${currentEvent.id}`, eventUpdate)
                    .then(response => {
                      if (response.id) {
                        setLoading(false);
                        Router.push(`/${response.id}`);
                      } else {
                        setError('error, see console');
                        console.error(response);
                      }
                    })
                    .catch(error => {
                      setError('error, see console');
                      console.error(error);
                    });
                  })
                })
              } else {
                serverCall('PUT', `events/${currentEvent.id}`, currentEvent);
              }
            }}
          >
            Save
          </a> - <a
            onClick={() => {
              setEditing(false);
              setCurrentEvent(props.event);
              setFile('')
            }}
          >
            Discard
          </a>
          <div className="cancel">
            <a
              onClick={() => {
                setCancelModal('block');
              }}
            >
              <h3 style={{display: 'inline-block'}}>Cancel Event</h3>
            </a>
          </div>
        </div>
      :
        <a onClick={() => setEditing(true)}>Edit</a>
      }
    </div> : ''}
    <Modal
      show={cancelModal}
      setShow={setCancelModal}
      closer={true}
      children={cancelPrompt}
    />
    <style jsx>{`
        a {
          cursor: pointer;
        }
        aside p,
        aside h2 {
          margin-top 0rem;
        }
        h3 {
          margin: 0;
        }
        img {
          max-width: 35em;
        }
        ul {
          padding: 0;
          list-style: none;
        }
        button {
          max-width: 12rem;
        }
        input[type=number] {
          width: 18px;
        }
        ${owner || attending || atLimit || !upcoming? `
        .attend-btn {
          color: #ddd;
        }
        .attend-btn:hover {
          background-color: #fff;
          color: #ddd;
        }` : ''}
        article {
          padding-bottom: 2rem;
        }
        .event-display {
          display: grid;
          grid-template-columns: 3fr 1fr;
          grid-template-rowss: 1fr 1fr;
        }
        .two-col {
          grid-column: span 2;
        }
        .edit-btn {
          margin-top: 3rem;
        }
        .cancel {
          padding: 2em;
        }
        .p {
          margin: 1em 0;
        }
      `}
    </style>
  </div>;
  
  return (
    <Layout>
      <Header user={props.user} new={props.user}/>
      {eventDisplay}
      <Footer />
    </Layout>
  );
};

Event.getInitialProps = async function (ctx) {
  const { event } = ctx.query,
  [headers, server] = auth(ctx);
  try {
    const eventRes = await fetch(`${server}events/${event}`, headers),
    userRes = await fetch(`${server}users`, headers),
    user = await userRes.json(),
    eventData = await eventRes.json();
    return { event: eventData, user }
  } catch (err) {
    if (ctx.res) {
      ctx.res.writeHead(302, {
        Location: '/'
      });
      ctx.res.end();
    } else {
      Router.push('/');
    };
  };
};

export default Event;
