import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import dateTimeString from '../utils/date-time-string';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';

const Event = props => {
  const [attending, setAttending] = useState(false)
  return (
    <Layout>
      <Header />
      <div className="event-display">
        <div className="event-header">
          <h3>- {props.category_name} -</h3>
          <h1>{props.name}</h1>
        </div>
        <main>
          <img src={`http://${props.image_link}`} />
          <h3>Starts {dateTimeString(props.start)[1]} {dateTimeString(props.start)[0]}</h3>
          <p>{props.description}</p>
          <h3>Ends {dateTimeString(props.end)[1]} {dateTimeString(props.end)[0]}</h3>
        </main>
        <aside>
          <article>
            <h2>Event Host</h2>
            <h3>{props.user.full_name}</h3>
            <h3>{props.user.email}</h3>
          </article>
          <article>
            <button
              disabled={attending}
              onClick={() => setAttending(true)}
            >
              {attending? 'You are going' : 'I would like to attend'}
            </button>
            <p>({props.limit - props.users_attending.length} Spots Left)</p>
            <p>Capacity {props.limit}</p>
          </article>
          <article>
            <h2>Attending</h2>
            <ul>
              {props.users_attending.map(user => {
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
    const res = await fetch(`${server}events/${event}`, headers);

    return await res.json();
    
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
