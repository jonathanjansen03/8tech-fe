import config from '@/config';

const BASE_PATH = config.api.basePath;
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

const _buildFetchOptions = (method, body, headers, isUploadingFile) => {
  const options = {
    method,
    headers: { ...BASE_HEADERS, ...headers },
  };

  if (method === 'GET') {
    return options;
  }

  let requestBody = JSON.stringify(body);

  if (isUploadingFile) {
    delete options.headers['Content-Type'];
    requestBody = body;
  }

  return {
    ...options,
    body: requestBody,
  };
};

export default {
  hitApi: async ({
    method,
    path,
    params = {},
    body = {},
    headers = {},
    isUploadingFile = false,
  }) => {
    if (!_isValidMethod(method)) {
      throw new Error(config.errors.invalidMethod);
    }

    const res = await fetch(
      BASE_PATH + path + _buildQuery(params),
      _buildFetchOptions(method, body, headers, isUploadingFile)
    );
    const data = await res.json();

    if (data.statusCode !== 200) {
      throw data;
    }

    return data;
  },
};
