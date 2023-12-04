import config from '@/config';

const INVALID_METHOD_ERROR = 'Method must be GET, POST, PUT or DELETE';
const BASE_URL = config.api.base;
const HEADERS = {
  'Content-Type': 'application/json',
  accept: '*/*',
};

const _isValidMethod = (method) => {
  return (
    method === 'GET' ||
    method === 'POST' ||
    method === 'PUT' ||
    method === 'DELETE'
  );
};

const _buildQuery = (params) => {
  return Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&');
};

const _buildFetchOptions = (method, body) => {
  const options = {
    method,
    headers: HEADERS,
  };

  if (method === 'GET') {
    return options;
  }

  return {
    ...options,
    body: JSON.stringify(body),
  };
};

export default {
  hitApi: async ({ method, url, params = {}, body = {} }) => {
    if (!_isValidMethod(method)) {
      throw new Error(INVALID_METHOD_ERROR);
    }

    const res = await fetch(
      BASE_URL + url + _buildQuery(params),
      _buildFetchOptions(method, body)
    );
    const data = await res.json();

    if (data.statusCode !== 200) {
      throw data;
    }

    return data;
  },
};
