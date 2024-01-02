import apiUtil from '@/utils/api';
import config from '@/config';

export default {
  getUserInfo: (token) => {
    return apiUtil.hitApi({
      method: config.api.method.get,
      path: config.api.user.info,
      headers: config.api.authTokenHeader(token),
    });
  },
};
