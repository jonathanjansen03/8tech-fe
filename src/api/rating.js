import apiUtil from '@/utils/api.js';
import config from '@/config/index.js';

export default {
  create: (data, token) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.rating.create,
      body: data,
      headers: config.api.authTokenHeader(token),
    });
  },
};
