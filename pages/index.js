import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import Link from 'next/link';
import Router from 'next/router';
import Layout from '../components/Layout';
import Header from '../components/Header';
import dateTimeString from '../utils/date-time-string';
import { useState } from 'react';

const Index = props => {
  const [events, setEvents] = useState(props.events),
  displayLimit = 25,
  [filter, setFilter] = useState('none');

  return (
    <Layout>
      <Header user={props.user} new={props.user}/>
      <div className="form-display">
        <select
          style={{
            maxWidth: '12rem',
            fontSize: '2rem',
            padding: '.5rem'
          }}
          onChange={e => {
            setFilter(e.target.value)
          }}
        >
          <option value={'none'}>All Events</option>
          {props.categories.map(category => {
            return <option key={category.id} value={category.name}>{category.name}</option>
          })}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>Name</th>
            <th>Image</th>
            <th>Attending</th>
            <th>Host</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
        {events.map(event => {
          const [dateString, timeString, utc] = dateTimeString(event.start),
          owner = props.user.id === event.user.id,
          attending = event.users_attending.map(user => user.id).includes(props.user.id);
          
          return (filter === 'none' || filter === event.category_name)? (
            <Link href="/[event]" as={`${event.id}`} key={event.id}>
              <tr
                className="event-listing"
                style={{
                  backgroundColor: attending? owner? '#eef' : '#efe' : '#fff'
                }}
              >
                <td>{dateString}</td>
                <td>{timeString}</td>
                <td>{event.name}</td>
                <td>
                  {event.image_link? <img src={event.image_link} alt={event.name}/> : ''}
                </td>
                {attending? <th>{event.users_attending.length} / {event.limit}</th> :
                <td>{event.users_attending.length} / {event.limit}</td>}
                {owner?<th>You</th> : <td>{event.user.full_name}</td>}
                <td>{event.category_name}</td>
              </tr>
            </Link>
          ) : (null)
        })}
        </tbody>
      </table>
      <style jsx>{`
        table {
          margin: 1rem auto;
        }
        tr {
          outline: 1px solid #ddd
        }
        tbody tr:hover {
          outline: 1px solid #444
        }
        td, th {
          padding: 2rem 1rem;
        }
        .event-listing {
          cursor: pointer;
        }
        img {
          max-height: 2rem;
        }
      `}</style>
    </Layout>
  )
};

Index.getInitialProps = async function (ctx) {
  const [headers, server] = auth(ctx);
  try {
    const eventRes = await fetch(`${server}events?length=${displayLimit}&page=0`, headers),
    userRes = await fetch(`${server}users`, headers),
    catRes = await fetch(`${server}categories`, headers),
    events = await eventRes.json(),
    categories = await catRes.json(),
    user = await userRes.json();

    return {events, user, categories};
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
