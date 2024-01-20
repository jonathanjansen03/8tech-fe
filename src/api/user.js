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
  getUserInfoWithId: (id, token) => {
    return apiUtil.hitApi({
      method: config.api.method.get,
      path: config.api.user.info + `/${id}`,
      headers: config.api.authTokenHeader(token),
    });
  },
  updateUserData: (data, token) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.user.updateData,
      body: data,
      headers: config.api.authTokenHeader(token),
    });
  },
  uploadProfilePicture: (data, token) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.user.uploadProfilePicture,
      body: data,
      headers: config.api.authTokenHeader(token),
      isUploadingFile: true,
    });
  },
  uploadCompanyProfilePicture: (token, data) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.user.uploadCompanyProfilePicture,
      body: data,
      headers: config.api.authTokenHeader(token),
      isUploadingFile: true,
    });
  },
};
