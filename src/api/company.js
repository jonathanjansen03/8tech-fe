import apiUtil from '@/utils/api';
import config from '@/config';

export default {
  create: (data) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.company.create,
      body: data,
    });
  },
  info: (id) => {
    return apiUtil.hitApi({
      method: config.api.method.get,
      path: config.api.company.info(id),
    });
  },
  update: (token, data) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.company.update ,
      headers: config.api.authTokenHeader(token),
      body: data,
    });
  },
};
