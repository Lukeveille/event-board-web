import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import { Cookies } from 'react-cookie';

export default props => {
  const [menu, setMenu] = useState(false),
  cookies = new Cookies();

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #ddd',
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
          <a onClick={() => {
            Router.push('/login').then(() => window.location.reload());
          }}>Login</a>
          &nbsp;/&nbsp;
          <a onClick={() => {
            Router.push(`/login?signup=true`).then(() => window.location.reload());
          }}>Signup</a>
        </section> :
        <section>
          <img
            className="profile-pic"
            src={props.user.gravatar_url}
            alt={props.user.full_name}
            onClick={() => setMenu(!menu)}
          />
          <ul className="menu">
            <li>Profile</li>
            <li>Messages</li>
            <li onClick={() => {
              cookies.set('token', null);
              window.location.reload();
            }}>Logout</li>
          </ul>
          {/* <a
            
          >Logout</a>&nbsp;&nbsp;&nbsp; */}
        </section>
      }
      <style jsx>{`
        img {
          max-width: 20rem;
        }
        a {
          cursor: pointer;
        }
        .profile-pic {
          border-radius: 50%;
          max-height: 3.5rem;
          cursor: pointer;
        }
        .new-event {
          margin-left: -15rem;
        }
        .menu {
          display: ${menu? 'inline-block' : 'none' };
          position: absolute;
          right: 2em;
          top: 4rem;
          list-style-type: none;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 0;
        }
        .menu li {
          cursor: pointer;
          padding: 0.5em;
          border: 1px solid #ddd;
        }
        .menu li:hover {
          border: 1px solid #000;
        }
        .logo {
          cursor: pointer
        }
      `}</style>
    </header>
  );
};
