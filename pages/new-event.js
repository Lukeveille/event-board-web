import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import doubleZero from '../utils/double-zero';
import serverCall from '../utils/server-call';
import Router from 'next/router';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactS3Uploader from 'react-s3-uploader';
import { useState } from 'react';

const S3Uploader = props => {
  const addFile = ( file, upload ) => {
    const filename = file.name.split(/(\\|\/)/g).pop();
    this.setState(prevState => ({ 
      filenames: prevState.filenames.concat(filename) 
    }),
      () => props.input.onChange(this.state.filenames));
    upload(file)
  };

  return <ReactS3Uploader
    signingUrl={`${auth()[1]}s3/sign`}
    signingUrlMethod="GET"
    signingUrlHeaders={props.headers}
    signingUrlWithCredentials={true}
    uploadRequestHeaders={{ 'acl': 'public-read' }}
    contentDisposition="auto"
    preprocess={addFile}
  />;
};

const NewEvent = props => {
  const now = new Date(),
  date = now.toString().split(' '),
  hour = date[4].toString().slice(0, 2),
  day = parseInt(date[2]),
  month = now.getMonth() < 9? `0${now.getMonth()+1}` : now.getMonth()+1,
  start = `${doubleZero(date[3])}-${doubleZero(month)}-${doubleZero(day)}T${doubleZero(hour)}:00`,
  end = `${doubleZero(date[3])}-${doubleZero(month)}-${doubleZero(day+1)}T${doubleZero(hour)}:00`,
  [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    category_id: '1',
    limit: 10,
    start,
    end,
    file: 'Select Image',
    lat: '',
    long: '',
  });

  return (
    <Layout>
      <Header user={props.user}/>
      <h1>Create a New Event</h1>
      <form
        className="form-display"
        onSubmit={event => {
          event.preventDefault();
          console.log(newEvent)
          // serverCall('GET', 's3/direct_post').then(res => {
          //   console.log(res)
          //   const formData = new FormData();
          //   formData.append('file', newEvent.file)
          //   fetch(res.url, {
          //     headers: {
          //       ...res.fields,
          //       'Content-Type': 'multipart/form-data',
          //     },
          //     body: formData,
          //     mode: 'cors',
          //     method: 'POST'
          //   }).then(res => {
          //     console.log(res)
          //   })
          // })
          // .then(res => {
          //   console.log(res.id)
          //   Router.push(`/${res.id}`);
          // })
        }}
      >
        <select
          style={{
            maxWidth: '20rem',
            fontSize: '2rem',
            padding: '.5rem'
          }}
          onChange={event => {
            setNewEvent({...newEvent, category_id: event.target.value})
          }}
        >
          <option disabled value={0}> -- select a category -- </option>
          {props.categories.map(cat => {
            return <option key={cat.id} value={cat.id}>{cat.name}</option>
          })}
        </select>
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
        {/* <input
          type="file"
          // value={newEvent.end.split('T')[1].slice(0, 5)}
          onChange={event => {
            setNewEvent({...newEvent, file: event.target.files[0] });
          }}
        /> */}
        <S3Uploader headers={{hey: 'hi'}}/>
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
      <Footer />
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
