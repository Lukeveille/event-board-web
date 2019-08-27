import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import dateTimeString from '../utils/date-time-string';
import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';

const Event = props => {
  const [attending, setAttending] = useState(false);
  console.log(props);
  return (
    <Layout>
      <Header user={props.user} new={props.user}/>
      <div className="event-display">
        <div className="event-header">
          <h3>- {props.event.category_name} -</h3>
          <h1>{props.event.name}</h1>
        </div>
        <main>
          <img src={`http://${props.event.image_link}`} />
          <h3>Starts {dateTimeString(props.event.start)[1]} {dateTimeString(props.event.start)[0]}</h3>
          <p>{props.event.description}</p>
          <h3>Ends {dateTimeString(props.event.end)[1]} {dateTimeString(props.event.end)[0]}</h3>
        </main>
        <aside>
          <article>
            <h2>Event Host</h2>
            <h3>{props.event.user.full_name}</h3>
            <h3>{props.event.user.email}</h3>
          </article>
          <article>
            {props.user.error? '' : <button
              disabled={attending}
              onClick={() => setAttending(true)}
            >
              {attending? 'You are going' : 'I would like to attend'}
            </button>}
            <p>({props.event.limit - props.event.users_attending.length} Spots Left)</p>
            <p>Capacity {props.event.limit}</p>
          </article>
          <article>
            <h2>Attending</h2>
            <ul>
              {props.event.users_attending.map(user => {
                return <li key={user.id}>{user.full_name}</li>
              })}
            </ul>
          </article>
        </aside>
        <footer>
          <Link href="/"><a>&lt; All Events</a></Link>
        </footer>
      </div>
      <style jsx>{`
        p {
          margin .5rem;
        }
        h2, h3 {
          margin: 1rem;
        }
        img {
          max-width: 10rem;
        }
        ul {
          padding: 0;
          list-style: none;
        }
        article {
          padding-bottom: 5rem;
        }
        .event-display {
          display: grid;
          grid-template-columns: 3fr 1fr;
          grid-template-rowss: 1fr 1fr;
        }
        .event-header, footer {
          grid-column: span 2;
        }
      `}</style>
    </Layout>
  );
}

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
