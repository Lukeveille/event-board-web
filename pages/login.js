import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import serverCall from '../utils/server-call';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Cookies } from 'react-cookie';

const Login = () => {
  const [error, setError] = useState(''),
  router = useRouter(),
  [login, setLogin] = useState(router.query.signup? false : true),
  [showPass, setShowPass] = useState('password'),
  blankForm = {
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  },
  [user, setUser] = useState(blankForm),
  cookies = new Cookies();

  return (
    <Layout>
      <Header user={{error: 'Must login'}}/>
      {<div>
        <img src="../static/android-chrome-512x512.png" className="logo" />
        <h1>Welcome</h1>
        <form
          className="form-display"
          onSubmit={e => {
            e.preventDefault();
            serverCall('POST', login? 'login' : 'signup', user)
            .then(res => {
              if (res.auth_token) {
                cookies.set('token', res.auth_token);
                Router.push('/');
              } else if (res.error || res.first_name) {
                setError(
                  user.email === '' || user.password === ''? 'fields cannot be blank' : res.error.user_authentication
                );
              } else if (!login) {
                serverCall('POST', 'login', user)
                .then(res => {
                  if (res.auth_token) {
                    cookies.set('token', res.auth_token);
                    Router.push('/');
                  } else {
                    console.error(res);
                  };
                });
              };
            });
          }}
        >
          {login? '' : <div>
            <input type="text" onChange={e => setUser({...user, first_name: e.target.value})} value={user.first_name} placeholder="first name" />
            <input type="text" onChange={e => setUser({...user, last_name: e.target.value})} value={user.last_name} placeholder="last name" />
          </div>}
          <input type="email" onChange={e => setUser({...user, email: e.target.value})} value={user.email} placeholder="email" />
          <div className="relative">

            <input
            type={showPass}
            id="password"
            onChange={e => setUser({...user, password: e.target.value})}
            value={user.password}
            placeholder="password" />

            {login? '' : <i
            className={`glyphicon form-display-feedback glyphicon-eye-${showPass == 'password'? 'open' : 'close'}`}
            onClick={() => setShowPass(showPass === 'password'? 'text' : 'password')}></i>}

          </div>
          <button type="submit">
            {login? "Login" : "Sign Up"}
          </button>
      </form>
        <p className="error-display">{error}</p>
        <a href='' onClick={e => {
            e.preventDefault();
            setLogin(!login);
            setShowPass('password');
            setError('')
          }}>{login? "Create Account" : "Login"}
        </a>
        <style jsx>{`
          h1 {
            font-size: 4.5rem;
            margin: 0;
          }
          form {
            margin: 1rem;
            max-width: 400px;
            margin: auto;
          }
          img {
            max-width: 8rem;
            margin-top: 5rem;
          }
          .error-display {
            color: #d00
          }
          .glyphicon {
            cursor: pointer;
            pointer-events: all;
          }
          .relative {
            position: relative;
          }
        `}</style>
      </div>}
      <Footer />
    </Layout>
  );
};

Login.getInitialProps = async function (ctx) {
  const [headers, server] = auth(ctx);
  try {
    const userRes = await fetch(server + 'users', headers),
    data = await userRes.json();
    if (data.error) {
      return data;
    } else {
      Router.push('/');
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

export default Login;
