import config from '@/config';

const INVALID_METHOD_ERROR = 'Method must be GET, POST, PUT or DELETE';
const BASE_URL = config.api.base;
const HEADERS = {
  'Content-Type': 'application/json',
  accept: '*/*',
};

const isValidMethod = (method) => {
  return (
    method !== 'GET' ||
    method !== 'POST' ||
    method !== 'PUT' ||
    method !== 'DELETE'
  );
};

const buildQuery = (params) => {
  return Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&');
};

export default {
  hitApi: ({ method, url, params = {}, data = {} }) => {
    if (!isValidMethod(method)) {
      throw new Error(INVALID_METHOD_ERROR);
    }

    return fetch(BASE_URL + url + buildQuery(params), {
      method,
      mode: 'no-cors',
      headers: HEADERS,
      body: JSON.stringify({
        firstName: 'first',
        lastName: 'last',
        email: 'gmail@gmail.com',
        userName: 'username',
        password: 'password',
        repeatPassword: 'password',
      }),
    });
  },
};
