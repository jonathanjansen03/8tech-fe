import apiUtil from '@/utils/api';
import config from '@/config';

export default {
  getInfo: (id, token) => {
    return apiUtil.hitApi({
      method: config.api.method.get,
      path: config.api.contract.info(id),
      headers: config.api.authTokenHeader(token),
    });
  },
  update: (data, token) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.contract.update,
      body: data,
      headers: config.api.authTokenHeader(token),
    });
  },
  getRecruiterContractList: (data, token) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.contract.recruiterList,
      body: data,
      headers: config.api.authTokenHeader(token),
    });
  },
  reject: (id, token) => {
    return apiUtil.hitApi({
      method: config.api.method.get,
      path: config.api.contract.reject(id),
      headers: config.api.authTokenHeader(token),
    });
  },
  getPayoutLink: (id, token) => {
    return apiUtil.hitApi({
      method: config.api.method.get,
      path: config.api.contract.payoutLink(id),
      headers: config.api.authTokenHeader(token),
    });
  },
  createPaymentRequest: (id, token) => {
    return apiUtil.hitApi({
      method: config.api.method.post,
      path: config.api.contract.paymentRequest,
      body: {
        "ewalletCode": 'SHOPEEPAY',
        "contractId": id
      },
      headers: config.api.authTokenHeader(token)
    });
  }
};
