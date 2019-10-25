import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import serverCall from '../utils/server-call';
import dateTimeString from '../utils/date-time-string';
import Router from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import EditField from '../components/EditField';

const Event = props => {
  const owner = props.event && props.event.user && props.user? props.user.id === props.event.user.id : false,
  [users, setUsers] = useState(props.event.users_attending),
  [editing, setEditing] = useState(false),
  userIds = props.event && props.event.users_attending? props.event.users_attending.map(user => user.id) : null,
  [attending, setAttending] = useState(userIds? userIds.includes(props.user.id) : userIds),
  [atLimit, setAtLimit] = useState(props.event && props.event.users_attending? props.event.limit === props.event.users_attending.length : null),
  [cancelModal, setCancelModal] = useState('none'),
  upcoming = props.event && props.event.start? dateTimeString(props.event.start)[2] > Date.now() : false,
  over = props.event && props.event.end? dateTimeString(props.event.end)[2] > Date.now() : false,
  cancelPrompt = <div className="form-display">
    <h1>CANCEL EVENT</h1>
    <h2>Are You Sure?</h2>
    <button>Yes</button>
    <button onClick={() => setCancelModal('none')}>No</button>
  </div>

  const eventDisplay = props.event.error?
  <h1>404 - Event not found</h1>
  :
  <div className="event-display">
    <div className="two-col">
      <h3>- {props.event.category_name} -</h3>
      <h1>
        <EditField
          value={props.event.name}
          editing={editing}
          size={1.8}
        />
      </h1>
    </div>
    <main>
      {props.event.image_link? <img src={props.event.image_link} /> : ''}
      {over? <h3>{upcoming? 'Starts ' : 'This event started at '}
        <EditField
          value= {props.event.start}
          // value= {dateTimeString(props.event.start)[1] + ' ' + dateTimeString(props.event.start)[0]}
          editing={editing}
          size={0.5}
        />
      </h3> : ''}
      <p>
        <EditField
          value={props.event.description}
          editing={editing}
          size={0.5}
        />
      </p>
      {/* {over? <h3>{over? 'Ends ' + dateTimeString(props.event.end)[1] : 'This event ended '} {dateTimeString(props.event.end)[0]}</h3> : ''} */}
      <h3>{over? 'Ends ' : 'This event ended '}
        <EditField
          value={props.event.end}
          editing={editing}
          size={0.5}
        />
      </h3>
    </main>
    <aside>
      <article>
        <h2>Event Host</h2>
        <h3>{props.event.user.full_name}</h3>
        <p>member since {dateTimeString(props.event.user.created_at)[0]}</p>
        {props.user.error? '' : <h3>{props.event.user.email}</h3>}
      </article>
      <article style={{padding: 0}}>
        {props.user.error? '' :
        <div className="form-display">
          <button
            className="attend-btn"
            disabled={owner || attending || atLimit || !upcoming? true : false}
            onClick={() => {
              serverCall('POST', 'attendings', { event_id: props.event.id }).then(() => {
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
              serverCall('DELETE', 'attendings', { event_id: props.event.id }).then(res => {
                setAttending(false);
                setAtLimit(false)
                setUsers(users.filter(user => (user.id !== props.user.id)));
              });
            }}
          >I can no longer attend</a> : ''}
        </div>
        }
        {upcoming? <div>
          <p style={{margin: 0}}>({props.event.limit - users.length} Spots Left)</p>
          <p>Capacity&nbsp;
            <EditField
              value={props.event.limit}
              editing={editing}
              size={0.5}
            />
          </p>
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
            onClick={() => setEditing(false)}
          >
            Save
          </a> - <a
            onClick={() => setEditing(false)}
          >
            Discard
          </a>
          <div className="cancel">
            <a
              onClick={() => setCancelModal('block')}
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
      value={cancelPrompt}
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
      `}
    </style>
  </div>
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
    console.error(err)
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
