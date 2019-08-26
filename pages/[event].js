import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import dateTimeString from '../utils/date-time-string';
import Link from 'next/link';
import Layout from '../components/Layout';
import Header from '../components/Header';

const Event = props => {
  return (
    <Layout>
      <Header />
      <main>
        <h3>- {props.category_name} -</h3>
        <h1>{props.name}</h1>
        <img src={`http://${props.image_link}`} />
        <h3>Starts {dateTimeString(props.start)[1]} {dateTimeString(props.start)[0]}</h3>
        <p>{props.description}</p>
        <h3>Ends {dateTimeString(props.end)[1]} {dateTimeString(props.end)[0]}</h3>
        <Link href="/">&lt; All Events</Link>
      </main>
      <aside>

      </aside>
      <style jsx>{`
        img {
          max-width: 10rem;
        }
      `}</style>
    </Layout>
  );
}

Event.getInitialProps = async function (ctx) {
  const { event } = ctx.query,
  [headers, server] = auth(ctx);
  try {
    const res = await fetch(`${server}events/${event}`, headers);

    return await res.json();
    
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

export default Event;
