import config from '@/config';

const INVALID_METHOD_ERROR = 'Method must be GET, POST, PUT or DELETE';
const BASE_URL = config.api.base;
const BASE_HEADERS = {
  'Content-Type': 'application/json',
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

const _buildFetchOptions = (method, body, headers) => {
  const options = {
    method,
    headers: { ...BASE_HEADERS, ...headers },
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
  hitApi: async ({ method, url, params = {}, body = {}, headers = {} }) => {
    if (!_isValidMethod(method)) {
      throw new Error(INVALID_METHOD_ERROR);
    }

    const res = await fetch(
      BASE_URL + url + _buildQuery(params),
      _buildFetchOptions(method, body, headers)
    );
    const data = await res.json();

    if (data.statusCode !== 200) {
      throw data;
    }

    return data;
  },
};
