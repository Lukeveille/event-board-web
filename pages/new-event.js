import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import doubleZero from '../utils/double-zero';
import serverCall from '../utils/server-call';
import handleUpload from '../utils/handle-upload';
import Router from 'next/router';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingDisplay from '../components/LoadingDisplay';
import { useState } from 'react';

const NewEvent = props => {
  const now = new Date(),
  date = now.toString().split(' '),
  hour = date[4].toString().slice(0, 2),
  day = parseInt(date[2]),
  month = now.getMonth() < 9? `0${now.getMonth()+1}` : now.getMonth()+1,
  start = `${doubleZero(date[3])}-${doubleZero(month)}-${doubleZero(day)}T${doubleZero(hour)}:00`,
  end = `${doubleZero(date[3])}-${doubleZero(month)}-${doubleZero(day+1)}T${doubleZero(hour)}:00`,
  [loading, setLoading] = useState(false),
  [error, setError] = useState(''),
  [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    category_id: '1',
    limit: 10,
    start,
    end,
    image_link: null,
    lat: '',
    long: '',
  });

  return (
    <Layout>
      <Header user={props.user}/>
        {loading?
        <LoadingDisplay />
        :
        <main>
          <h1>Create a New Event</h1>
          <form
            className="form-display"
            onSubmit={e => {
              event.preventDefault();
              if (newEvent.name && newEvent.description) {
                handleUpload(newEvent.image_link, setLoading).then(res => {
                  const sendNewEvent = ({...newEvent, image_link: `http://d2b7dtg3ypekdu.cloudfront.net${res.split('com')[1]}`})
                  serverCall('POST', 'events', sendNewEvent)
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
                });
              } else {
                setError("fields can't be blank");
              }
            }}
          >
            <select
              style={{
                maxWidth: '20rem',
                fontSize: '2rem',
                padding: '.5rem'
              }}
              onChange={e => {
                setNewEvent({...newEvent, category_id: e.target.value})
              }}
            >
              <option disabled value={0}> -- select a category -- </option>
              {props.categories.map(cat => {
                return <option key={cat.id} value={cat.id}>{cat.name}</option>
              })}
            </select>
            {<p className="error-display">{error}</p>}
            <input
              placeholder="Event Name"
              value={newEvent.name}
              onChange={e => setNewEvent({...newEvent, name: e.target.value })}
            />
            <textarea
              rows={5}
              placeholder="Event Description"
              value={newEvent.description}
              onChange={e => setNewEvent({...newEvent, description: e.target.value })}
            />
            <h3 className="capacity-display">Capacity</h3>
            <input
              type="number"
              value={newEvent.limit}
              onChange={e => setNewEvent({...newEvent, limit: e.target.value })}
            />
            <h3>Start Time</h3>
            <input
              type="date"
              value={newEvent.start.split('T')[0]}
              onChange={e => setNewEvent({...newEvent, start: `${e.target.value}T${newEvent.start.split('T')[1]}:00Z` })}
            />
            <input
              type="time"
              value={newEvent.start.split('T')[1].slice(0, 5)}
              onChange={e => setNewEvent({...newEvent, start: `${newEvent.start.split('T')[0]}T${e.target.value}:00Z` })}
            />
            <h3>End Time</h3>
            <input
              type="date"
              value={newEvent.end.split('T')[0]}
              onChange={e => setNewEvent({...newEvent, end: `${e.target.value}T${newEvent.end.split('T')[1]}:00Z` })}
            />
            <input
              type="time"
              value={newEvent.end.split('T')[1].slice(0, 5)}
              onChange={e => setNewEvent({...newEvent, end: `${newEvent.end.split('T')[0]}T${e.target.value}:00Z` })}
            />
            <input
              type="file"
              onChange={e => {
                setNewEvent({...newEvent, image_link: e.target.files[0] });
              }}
            />
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
        <Footer />
      </main>}
    </Layout>
  );
};

NewEvent.getInitialProps = async function (ctx) {
  const [headers, server] = auth(ctx);
  try {
    const userRes = await fetch(server + 'users', headers),
    catRes = await fetch(server + 'categories', headers),
    user = await userRes.json(),
    categories = await catRes.json();
    if (user.error) {
      Router.push('/');
    } else {
      return {user, categories};
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
