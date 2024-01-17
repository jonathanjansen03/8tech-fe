import apiUtil from '@/utils/api';
import config from '@/config';

export default {
  create: (data, token) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.job.create,
      body: data,
      headers: config.api.authTokenHeader(token),
    });
  },
  update: (data, token) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.job.update,
      body: data,
      headers: config.api.authTokenHeader(token),
    });
  },
  filter: (data, token) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.job.filter,
      body: data,
      headers: config.api.authTokenHeader(token),
    });
  },
  search: (data, token) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.job.filter,
      body: data,
      headers: config.api.authTokenHeader(token),
    });
  },
  info: (id, token) => {
    return apiUtil.hitApi({
      method: config.api.method.get,
      path: config.api.job.info + '/' + id,
      headers: config.api.authTokenHeader(token),
    });
  },
  applicant: (data, id, token) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.job.applicant + '/' + id,
      body: data,
      headers: config.api.authTokenHeader(token),
    });
  },
};
