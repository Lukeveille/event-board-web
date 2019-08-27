import Link from 'next/link';
import { Cookies } from 'react-cookie';
import Router from 'next/router';

const Header = props => {
  const cookies = new Cookies();
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px solid #666',
      padding: '1rem'
    }}>
      <Link href="/">
        <img src="../static/logo.png" className="logo" />
      </Link>
      {!props.new || props.new.error? '' : <section className="new-event">
        <Link href="/new-event"><a>+ New Event</a></Link>
      </section>}
      {props.user.error?
        <section>
          <a onClick={event => {
            Router.push('/login').then(() => window.location.reload());
          }}>Login</a>
          &nbsp;/&nbsp;
          <a onClick={event => {
            Router.push(`/login?signup=true`).then(() => window.location.reload());
          }}>Signup</a>
        </section> :
        <section>
          <a
            onClick={() => {
              cookies.set('token', null);
              window.location.reload();
            }}
          >Logout</a>
        </section>
      }
      <style jsx>{`
        img {
          max-width: 20rem;
        }
        a {
          cursor: pointer;
        }
        .new-event {
          margin-left: -10rem;
        }
        .logo {
          cursor: pointer
        }
      `}</style>
    </header>
  );
};

export default Header;
