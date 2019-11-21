import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Router from 'next/router';

const UserProfile = props => {
  return (
    <Layout>
      <Header user={props} new={props} />
        <p className="name">Name</p>
        <h1 className="user-title">{props.full_name}</h1>
        <p className="name">Email</p>
        <h2 className="user-title">{props.email}</h2>
        <h2 className="event-listings">Your Events</h2>
        <h2>Events You Are Attending</h2>
        <h2>Past Events</h2>
      <Footer />
      <style jsx>{`
        .user-title {
          margin-top: 0;
        }
        .name {
          margin-bottom: 0;
        }
        .event-listings {
          margin-top: 3em;
        }
      `}</style>
    </Layout>
  )
}

UserProfile.getInitialProps = async function (ctx) {
  const [headers, server] = auth(ctx);
  try {
    const userRes = await fetch(`${server}users`, headers),
    user = await userRes.json();
    if (user.error) {
      Router.push('/');
    } else {
      return user;
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