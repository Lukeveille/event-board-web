import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import serverCall from '../utils/server-call';
import dateTimeString from '../utils/date-time-string';
import Router from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Event = props => {
  const owner = props.user.id === props.event.user.id,
  [users, setUsers] = useState(props.event.users_attending),
  userIds = props.event.users_attending.map(user => user.id),
  [attending, setAttending] = useState(userIds.includes(props.user.id)),
  atLimit = props.event.limit === props.event.users_attending.length,
  upcoming = dateTimeString(props.event.start)[2] > Date.now(),
  over = dateTimeString(props.event.end)[2] > Date.now();

  return (
    <Layout>
      <Header user={props.user} new={props.user}/>
      <div className="event-display">
        <div className="event-header">
          <h3>- {props.event.category_name} -</h3>
          <h1>{props.event.name}</h1>
        </div>
        <main>
          {props.event.image_link? <img src={props.event.image_link} /> : ''}
          {over? <h3>{upcoming? 'Starts' : 'This event started at '} {dateTimeString(props.event.start)[1]} {dateTimeString(props.event.start)[0]}</h3> : ''}
          <p>{props.event.description}</p>
          <h3>{over? 'Ends ' + dateTimeString(props.event.end)[1] : 'This event ended '} {dateTimeString(props.event.end)[0]}</h3>
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
                disabled={owner || attending || atLimit || !upcoming? true : false}
                onClick={() => {
                  serverCall('POST', 'attendings', { event_id: props.event.id }).then(() => {
                    setUsers([...users, props.user]);
                    setAttending(true);
                  });
                }}
              >
                {
                  atLimit? 'Event is at capacity' :
                  owner? 'This is your event' :
                  attending? 'You are attending' :
                  upcoming? 'I would like to attend' :
                  over? 'This event has started' : 'This event has ended'
                }
              </button>
              {owner? '' : attending? <a
                onClick={() => {
                  serverCall('DELETE', 'attendings', { event_id: props.event.id }).then(res => {
                    setAttending(false);
                    setUsers(users.filter(user => (user.id !== props.user.id)));
                  });
                }}
              >I can no longer attend</a> : ''}
            </div>
            }
            <p style={{margin: 0}}>({props.event.limit - users.length} Spots Left)</p>
            <p>Capacity {props.event.limit}</p>
          </article>
          <article>
            <h2>{users.length} Attending</h2>
            <ul>
              {users.map(user => {
                return <li key={user.id}>{user.full_name}</li>
              })}
            </ul>
          </article>
        </aside>
        <Footer />
      </div>
      <style jsx>{`
        a {
          cursor: pointer;
        }
        p, h2 {
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
        button {
          color: #ddd;
        }
        button:hover {
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
        .event-header {
          grid-column: span 2;
        }
      `}</style>
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
