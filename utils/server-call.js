import auth from './auth';
import fetch from 'isomorphic-unfetch';

export default async function(method, location, data) {
  const [headers, server] = auth(),
  req = {...headers, mode: 'cors', method };
  if (method !== 'GET') req.body = JSON.stringify(data)
  req.headers['Content-Type'] = 'application/json';

  const res = await fetch(`${server}${location? location : ''}`, req);
  return await res.json();
};
