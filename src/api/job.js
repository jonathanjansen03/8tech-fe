import apiUtil from '@/utils/api';
import config from '@/config';

export default {
  create: (data, token) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.job.create,
      body: data,
      headers: {
        Authorization: config.api.authTokenHeader(token),
      },
    });
  },
};
