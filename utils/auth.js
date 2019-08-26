
import { Cookies } from 'react-cookie';

const server = 'http://localhost:3443/api/v1/';
const cookies = new Cookies();

export const handleAuthSSR = (ctx) => {
  let token = null;
  
  if (ctx && ctx.req && ctx.req.headers.cookie) {
    token = ctx.req.headers.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  } else {
    token = cookies.get('auth_token');
  };

  return [{ headers: { Authorization: 'Bearer ' + token } }, server];
};