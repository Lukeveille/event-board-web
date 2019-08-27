import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import Link from 'next/link';
import Router from 'next/router';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { useState } from 'react';

// DRY me up
const NewEvent = props => {
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    limit: 1,
    start: '2019-08-21T00:00:00Z',
    end: '2019-08-29T15:30:00Z',
    lat: '',
    long: '',
  });
  console.log(props)
  // if (!props.user || props.user.error) Router.push('/');
  return (
    <Layout>
      <Header user={props}/>
      <h1>Create a New Event</h1>
      <form className="form-display">
        <input
          placeholder="Event Name"
          value={newEvent.name}
          onChange={event => setNewEvent({...newEvent, name: event.target.value })}
        />
        <textarea
          rows={5}
          placeholder="Event Description"
          value={newEvent.description}
          onChange={event => setNewEvent({...newEvent, description: event.target.value })}
        />
        <h3 className="capacity-display">Capacity</h3>
        <input
          type="number"
          value={newEvent.limit}
          onChange={event => setNewEvent({...newEvent, limit: event.target.value })}
        />
        <h3>Start Time</h3>
        <input
          type="date"
          value={newEvent.start.split('T')[0]}
          onChange={event => setNewEvent({...newEvent, start: `${event.target.value}T${newEvent.start.split('T')[1]}:00Z` })}
        />
        <input
          type="time"
          value={newEvent.start.split('T')[1].slice(0, 5)}
          onChange={event => setNewEvent({...newEvent, start: `${newEvent.start.split('T')[0]}T${event.target.value}:00Z` })}
        />
        <h3>End Time</h3>
        <input
          type="date"
          value={newEvent.end.split('T')[0]}
          onChange={event => setNewEvent({...newEvent, end: `${event.target.value}T${newEvent.end.split('T')[1]}:00Z` })}
        />
        <input
          type="time"
          value={newEvent.end.split('T')[1].slice(0, 5)}
          onChange={event => setNewEvent({...newEvent, end: `${newEvent.end.split('T')[0]}T${event.target.value}:00Z` })}
        />
        {/* <h3>Location</h3>
        <input
          placeholder="Latitude"
          value={newEvent.lat}
          onChange={event => setNewEvent({...newEvent, lat: event.target.value })}
        />
        <input
          placeholder="Longitude"
          value={newEvent.long}
          onChange={event => setNewEvent({...newEvent, long: event.target.value })}
        /> */}
        <style jsx>{`
          h3 {
            margin: 0;
          }
          form {
            max-width: 350px;
            margin: auto;
          }
          input {
            display: block;
            margin: 1rem auto;
          }
          input[type = 'number'] {
            max-width: 75px;
            margin: 1rem 2rem;
          }
          .capacity-display,
          input[type = 'number'] {
            display: inline;
          }
          input[type = 'time'],
          input[type = 'date'] {
            display: inline;
            max-width: 175px;
          }
        `}</style>
        <button>Create Event</button>
        <footer>
          <Link href="/"><a>&lt; All Events</a></Link>
        </footer>
      </form>
    </Layout>
  );
};

NewEvent.getInitialProps = async function (ctx) {
  const [headers, server] = auth(ctx);
  try {
    const userRes = await fetch(server + 'users', headers),
    data = await userRes.json();
    if (data.error) {
      Router.push('/');
    } else {
      return data;
    }
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

export default NewEvent;
