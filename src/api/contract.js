import apiUtil from '@/utils/api';
import config from '@/config';

export default {
  info: (id, token) => {
    return apiUtil.hitApi({
      method: config.api.method.get,
      path: config.api.contract.info(id),
      headers: config.api.authTokenHeader(token)
    });
  },
  update: (data, token) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.contract.update,
      body: data,
      headers: config.api.authTokenHeader(token)
    });
  }
};
