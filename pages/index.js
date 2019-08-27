import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import Link from 'next/link';
import Router from 'next/router';
import Layout from '../components/Layout';
import Header from '../components/Header';
import dateTimeString from '../utils/date-time-string';
import { useState } from 'react';

const Index = props => {
  const displayLimit = 25,
  [events, setEvents] = useState(props.events || []);

  return (
    <Layout>
      <Header user={props.user} new={props.user}/>
      <h1>All Events</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>Name</th>
            <th>Description</th>
            <th>Attending</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
        {events.map(event => {
          const [dateString, timeString] = dateTimeString(event.start);
          return (
            <Link href="/[event]" as={`${event.id}`} key={event.id}>
            <tr
              className="event-listing"
            >
              <td>{dateString}</td>
              <td>{timeString}</td>
              <td>{event.name}</td>
              <td>{event.description.length > displayLimit? event.description.slice(0, displayLimit) + '...' : event.description}</td>
              <td>{event.users_attending.length} / {event.limit}</td>
              <td>
                <img src={`http://${event.image_link}`} alt={event.name}/>
              </td>
            </tr>
            </Link>
          )
        })}
        </tbody>
      </table>
      <style jsx>{`
        table {
          margin: 1rem auto;
        }
        tr {
          outline: 1px solid #666
        }
        td, th {
          padding: 1rem;
        }
        .event-listing {
          cursor: pointer;
        }
        img {
          max-width: 5rem;
        }
      `}</style>
    </Layout>
  )
};

Index.getInitialProps = async function (ctx) {
  const [headers, server] = auth(ctx);
  try {
    const eventRes = await fetch(`${server}events`, headers),
    userRes = await fetch(server + 'users', headers),
    events = await eventRes.json(),
    user = await userRes.json();

    return {events, user};
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

export default Index;
