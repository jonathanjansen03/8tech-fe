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
};
