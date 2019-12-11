import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import serverCall from '../utils/server-call';
import dateTimeString from '../utils/date-time-string';
import { useState } from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import EventTable from '../components/EventTable';
import EditControl from '../components/EditControl';
import EditField from '../components/EditField';
import Router from 'next/router';
import LoadingDisplay from '../components/LoadingDisplay';

const UserProfile = props => {
  const upcomingEvents = props.events.filter(event => dateTimeString(event.start)[2] > Date.now()),
  yourEvents = upcomingEvents.filter(event => event.user_id === props.user.id),
  attendedEvents = upcomingEvents.filter(event => event.user_id !== props.user.id),
  pastEvents = props.events.filter(event => dateTimeString(event.start)[2] < Date.now()),
  [user, setUser] = useState({...props.user,
    first_name: props.user.full_name.split(' ')[0],
    last_name: props.user.full_name.split(' ')[1]
  }),
  [file, setFile] = useState(''),
  [editing, setEditing] = useState(false),
  [cancelModal, setCancelModal] = useState('none'),
  [loading, setLoading] = useState(false),
  [modalContent, setModalContent] = useState(false),
  tempPicURL = "../static/blank-user.png",
  cancelPrompt = <div className="form-display">
    <h1>DELETE USER</h1>
    <h2>Are You Sure? This will cancel all events you are hosting!</h2>
    <button
      style={{borderColor: '#d00'}}
      onClick={() => {
        serverCall('DELETE', `users/${props.user.id}`).then(() => {
          Router.push('/');
        });
      }}
    >Yes</button>
    <button onClick={() => setCancelModal('none')}>No</button>
  </div>;

  console.log(user);

  return (
    <Layout>
      <Header user={props.user} new={props.user} />
      {loading? <LoadingDisplay /> : <div>
        <p className="name">Name</p>
        <h1 className="user-title">
          <EditField
            update={user}
            setUpdate={setUser}
            editing={editing}
            value="full_name"
            size={1.75}
            type="username"
          />
        </h1>
        <p className="name">Email</p>
        <h2 className="user-title">
          <EditField
          update={user}
          setUpdate={setUser}
          editing={editing}
          value="email"
          size={1}
          />
        </h2>
        <div className="profile-pic"></div>
        <h3 className="name">member since</h3>
        <p className="user-title">{dateTimeString(props.user.created_at)[0]}</p>
        <EditControl
          editing={editing}
          setEditing={setEditing}
          setLoading={setLoading}
          setUpdate={setUser}
          setFile={setFile}
          original={props.user}
          update={user}
          file={file}
          path="users"
          image="profile_pic"
          label="Profile"
        />
        <h2 className="event-listings">Your Events</h2>
        <EventTable events={yourEvents} user={props.user} filter="none"/>
        <h2>Events You Are Attending</h2>
        <EventTable events={attendedEvents} user={props.user} filter="none"/>
        <h2>Past Events</h2>
        <EventTable events={pastEvents} user={props.user} filter="none"/>
        {editing? <div className="cancel">
          <a
            onClick={() => {
              setModalContent(cancelPrompt)
              setCancelModal('block');
            }}
          >
            <h3 className="cancel-btn" style={{display: 'inline-block'}}>Delete User</h3>
          </a>
        </div> : ''}
        <Modal
          show={cancelModal}
          setShow={setCancelModal}
          closer={true}
          children={modalContent}
        />
      </div>}
      <Footer />
      <style jsx>{`
        .cancel {
          padding: 2em;
        }
        .cancel-btn {
          color: #d00;
        }
        .cancel-btn:hover {
          color: #b00;
          text-decoration: underline;
        }
        .user-title {
          margin-top: 0;
        }
        .name {
          margin-bottom: 0;
        }
        .event-listings {
          margin-top: 2em;
        }
        .profile-pic {
          border-radius: 15px;
          min-width: 15rem;
          min-height: 15rem;
          display: inline-block;
          background: url(${props.user.profile_pic? props.user.profile_pic : tempPicURL}) no-repeat center;
          background-size: cover;
        }
      `}</style>
    </Layout>
  )
}

UserProfile.getInitialProps = async function (ctx) {
  const [headers, server] = auth(ctx);
  try {
    const userRes = await fetch(`${server}users`, headers),
    yourEventsRes = await fetch(`${server}attendings`, headers),
    user = await userRes.json(),
    yourEvents = await yourEventsRes.json();
    if (user.error) {
      Router.push('/');
    } else {
      const events = yourEvents.map(event => event.event)
      return { user, events, yourEvents };
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

export default UserProfile;
