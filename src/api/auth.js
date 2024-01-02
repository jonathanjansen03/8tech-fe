import apiUtil from '@/utils/api';
import config from '@/config';

export default {
  register: (data) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.auth.register,
      body: data,
    });
  },
  login: (data) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.auth.login,
      body: data,
    });
  },
};
