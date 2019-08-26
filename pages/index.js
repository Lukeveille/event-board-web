    
import fetch from 'isomorphic-unfetch';
import Router from 'next/router';
import { useState } from 'react';
import { handleAuthSSR } from '../utils/auth';

const Index = props => {
  const stuff = Object.values(props),
  [events, setEvents] = useState(stuff.slice(0, stuff.length-1) || []);

  console.log(events)

  return (
    <div>
      <h1>Events</h1>
      {events.map(event => {
        return <p key={event.id}>{event.name}</p>
      })}
    </div>
  )
};

Index.getInitialProps = async function (ctx) {
  const [headers, server] = handleAuthSSR(ctx);
  try {
    const res = await fetch(server + 'events', headers);
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

export default Index;