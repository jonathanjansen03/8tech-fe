import apiUtil from '@/utils/api';
import config from '@/config';

export default {
  register: (data) => {
    return apiUtil.hitApi({
      method: 'POST',
      url: config.api.auth.register,
      data,
    });
  },
};
