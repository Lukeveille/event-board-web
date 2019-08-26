import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import dateTimeString from '../utils/date-time-string';
import Link from 'next/link';
import Layout from '../components/Layout';
import Header from '../components/Header';

const Event = props => {
  return (
    <Layout>
      <Header />
      <div className="event-display">
        <main>
          <h3>- {props.category_name} -</h3>
          <h1>{props.name}</h1>
          <img src={`http://${props.image_link}`} />
          <h3>Starts {dateTimeString(props.start)[1]} {dateTimeString(props.start)[0]}</h3>
          <p>{props.description}</p>
          <h3>Ends {dateTimeString(props.end)[1]} {dateTimeString(props.end)[0]}</h3>
          <Link href="/"><a>&lt; All Events</a></Link>
        </main>
        <aside>
          <article>
            <h2>Event Host</h2>
            <h3>{props.user.full_name}</h3>
            <h3>{props.user.email}</h3>
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
      </div>
      <style jsx>{`
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
          padding-top: 5rem;
        }
        .event-display {
          display: grid;
          grid-template-columns: 3fr 1fr;
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
