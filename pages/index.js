import fetch from 'isomorphic-unfetch';
import auth from '../utils/auth';
import Router from 'next/router';
import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '../components/Layout';
import Header from '../components/Header';
import EventTable from '../components/EventTable';

const offset = 8;

const Index = props => {
  const query = useRouter().query,
  count = num => {
    let array = [];
    for (let i = 0; i < num; i++) {
      array.push(i+1);
    };
    return array;
  },
  [category, setCategory] = useState(query.category? query.category : '');

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
          value={category}
          onChange={e => {
            setCategory(e.target.value);
            Router.push(e.target.value? `/?category=${e.target.value}` : '/');
          }}
        >
          <option value={''}>All Events</option>
          {props.categories.map(category => {
            return <option key={category.id} value={category.name}>{category.name}</option>
          })}
        </select>
      </div>
      <EventTable events={props.events} user={props.user} />
      {isNaN(query.page) || query.page < 2? ''
      :
      <a href={`?page=${query.page - 1}`} onClick={() => window.location.reload()}>
        &lt;
      </a>}
      &nbsp;
        {
          count(Math.ceil(props.total / offset)).map(num => {
            return (
              <span key={num}>
                {parseInt(query.page) === num || (query.page === undefined && num == 1)? num : <a href={`?page=${num}${query.category? `&category=${query.category}` : ''}`}>{num}</a>}
                &nbsp;
              </span>
            )
          })
        }
      &nbsp;
      {props.total < offset || query.page * offset > props.total - 1? '' : <a href={`?page=${isNaN(query.page)? 2 : parseInt(query.page) + 1}${query.category? `&category=${query.category}` : ''}`}>
        &gt;
      </a>}
    </Layout>
  )
};

Index.getInitialProps = async function (ctx) {
  const [headers, server] = auth(ctx);

  try {
    const catRes = await fetch(`${server}categories`, headers),
    categories = await catRes.json(),
    eventRes = await fetch(
      `${server}events?length=${offset}&page=${ctx.query.page? ctx.query.page - 1 : 0}${ctx.query.category? `&category=${categories.filter(cat => cat.name === ctx.query.category)[0].id}` : ''}`, headers
    ),
    userRes = await fetch(`${server}users`, headers),
    events = await eventRes.json(),
    user = await userRes.json();
    
    return {categories, events: events.events, user, total: events.total};

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
