import Layout from '../components/Layout';
import Header from '../components/Header';
import { useState } from 'react';
import { Cookies } from 'react-cookie';

export default () => {
  const [error, setError] = useState(''),
  [login, setLogin] = useState(true),
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
      <Header />
      <img src="../static/android-chrome-512x512.png" className="logo" />
      <h1>Welcome</h1>
      <form
        className="form-display"
      >
      {login? '' : <div>
        <input type="text" onChange={event => setUser({...user, first_name: event.target.value})} value={user.first_name} placeholder="first name" />
        <input type="text" onChange={event => setUser({...user, last_name: event.target.value})} value={user.last_name} placeholder="last name" />
      </div>}
      <input type="email" onChange={event => setUser({...user, email: event.target.value})} value={user.email} placeholder="email" />
      <div className="relative">
          
          <input
          type={showPass}
          id="password"
          onChange={event => setUser({...user, password: event.target.value})}
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
      <a href='' onClick={event => {
          event.preventDefault();
          setLogin(!login);
          setShowPass('password');
          setError('')
        }}>{login? "Create Account" : "Login"}</a>
      <style jsx>{`
        h1 {
          font-size: 4.5rem;
          margin: 0;
        }
        form {
          margin: 1rem;
          max-width: 500px;
          margin: auto;
        }
        img {
          max-width: 8rem;
          margin-top: 5rem;
        }
      `}</style>
    </Layout>
  );
};