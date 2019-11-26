import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import Router from 'next/router';
import { useRouter } from 'next/router'
import Layout from '../components/Layout';
import Header from '../components/Header';
import EventTable from '../components/EventTable';
import { useState } from 'react';

const offset = 8;

const Index = props => {
  const events = props.events,
  total = events.length > 0? events[0].total_events : 0,
  [filter, setFilter] = useState('none'),
  query = useRouter().query,
  count = num => {
    let array = [];
    for (let i = 0; i < num; i++) {
      array.push(i+1);
    };
    return array;
  };

  return (
    <Layout>
      <Header user={props.user} new={props.user}/>
      <div className="form-display">
        <select
          style={{
            maxWidth: '12rem',
            fontSize: '2rem',
            padding: '.5rem'
          }}
          onChange={e => {
            setFilter(e.target.value)
          }}
        >
          <option value={'none'}>All Events</option>
          {props.categories.map(category => {
            return <option key={category.id} value={category.name}>{category.name}</option>
          })}
        </select>
      </div>
      <EventTable events={events} user={props.user} filter={filter}/>
      {isNaN(query.page) || query.page < 2? ''
      :
      <a href={`?page=${query.page - 1}`} onClick={() => window.location.reload()}>
        &lt;
      </a>}
      &nbsp;
        {
          count(Math.ceil(total / offset)).map(num => {
            return (
              <span key={num}>
                {parseInt(query.page) === num || (query.page === undefined && num == 1)? num : <a href={`?page=${num}`}>{num}</a>}
                &nbsp;
              </span>
            )
          })
        }
      &nbsp;
      {query.page * offset > total - 1? '' : <a href={`?page=${isNaN(query.page)? 2 : parseInt(query.page) + 1}`}>
        &gt;
      </a>}
    </Layout>
  )
};

Index.getInitialProps = async function (ctx) {
  const [headers, server] = auth(ctx);

  try {
    const catRes = await fetch(`${server}categories`, headers),
    eventRes = await fetch(`${server}events?length=${offset}&page=${ctx.query.page? ctx.query.page - 1 : 0}`, headers),
    userRes = await fetch(`${server}users`, headers),
    categories = await catRes.json(),
    events = await eventRes.json(),
    user = await userRes.json();
    
    return {categories, events, user};;
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
