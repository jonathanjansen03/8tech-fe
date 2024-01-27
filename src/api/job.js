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
  delete: (id, token) => {
    return apiUtil.hitApi({
      method: config.api.method.get,
      path: config.api.job.delete(id),
      headers: config.api.authTokenHeader(token),
    });
  },
  search: (data) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.job.filter,
      body: data,
    });
  },
  findOne: (id) => {
    return apiUtil.hitApi({
      method: config.api.method.get,
      path: config.api.job.findOne(id),
    });
  },
  apply: (id, token) => {
    return apiUtil.hitApi({
      method: config.api.method.get,
      path: config.api.job.apply(id),
      headers: config.api.authTokenHeader(token),
    });
  },
  getApplicants: (id, data, token) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.job.applicant + '/' + id,
      body: data,
      headers: config.api.authTokenHeader(token),
    });
  },
};
