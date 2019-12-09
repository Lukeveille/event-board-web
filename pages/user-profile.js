import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import dateTimeString from '../utils/date-time-string';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventTable from '../components/EventTable';
import Router from 'next/router';

const UserProfile = props => {
  const upcomingEvents = props.events.filter(event => dateTimeString(event.start)[2] > Date.now()),
  yourEvents = upcomingEvents.filter(event => event.user_id === props.user.id),
  attendedEvents = upcomingEvents.filter(event => event.user_id !== props.user.id),
  pastEvents = props.events.filter(event => dateTimeString(event.start)[2] < Date.now());

  return (
    <Layout>
      <Header user={props.user} new={props.user} />
        <p className="name">Name</p>
        <h1 className="user-title">{props.user.full_name}</h1>
        <p className="name">Email</p>
        <h2 className="user-title">{props.user.email}</h2>
        <div className="profile-pic"></div>
        <h3 className="name">member Since</h3>
        <p className="user-title">{dateTimeString(props.user.created_at)[0]}</p>
        <a href='/'>Edit Profile</a>
        <h2 className="event-listings">Your Events</h2>
        <EventTable events={yourEvents} user={props.user} filter="none"/>
        <h2>Events You Are Attending</h2>
        <EventTable events={attendedEvents} user={props.user} filter="none"/>
        <h2>Past Events</h2>
        <EventTable events={pastEvents} user={props.user} filter="none"/>
      <Footer />
      <style jsx>{`
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
          background: url(${props.user.gravatar_url}) no-repeat center;
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
      return { user, events };
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

export default UserProfile