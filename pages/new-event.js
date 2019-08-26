import Layout from '../components/Layout';
import Header from '../components/Header';
import { useState } from 'react';

// DRY me up
export default () => {
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    limit: 1,
    start: '2019-08-21T00:00:00Z',
    end: '2019-08-29T15:30:00Z',
    lat: '',
    long: '',
  })
  return (
    <Layout>
      <Header />
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
      </form>
    </Layout>
  );
};
