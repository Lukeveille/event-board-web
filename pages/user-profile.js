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
        <h1>User Profile</h1>
      <Footer />
    </Layout>
  )
}

UserProfile.getInitialProps = async function (ctx) {
  const [headers, server] = auth(ctx);
  try {
    const userRes = await fetch(`${server}users`, headers),
    user = await userRes.json();

    return user;
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