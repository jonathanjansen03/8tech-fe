import { defineStore } from 'pinia';
import { ref } from 'vue';

import companyApi from '@/api/company';
import userApi from '@/api/user';

export const useCompanyStore = defineStore('company', () => {
  const company = ref({});

  const createCompany = async (data) => {
    const res = await companyApi.create(data);

    company.value = Object.assign({}, res.data);
  };

  const getCompanyInfo = async (id) => {
    return await companyApi.info(id);
  };

  const updateCompany = async (data, token) => {
    return await companyApi.update(data, token);
  };

  const uploadCompanyProfilePicture = async (data, token) => {
    if (typeof data.profilePicture !== 'string') {
      const formData = new FormData();
      formData.append('file', data);

      const imageLink = await userApi.uploadCompanyProfilePicture(
        token,
        formData
      );
      return imageLink.data.profilePicture;
    }
  };

  const updateCompanyData = async (data, token) => {
    if (typeof data.profilePicture !== 'string') {
      const formData = new FormData();
      formData.append('file', data.profilePicture);

      data.profilePicture = await uploadCompanyProfilePicture(
        data.profilePicture,
        token
      );
    }
    await companyApi.update(token, data);
  };

  return {
    company,
    createCompany,
    getCompanyInfo,
    updateCompany,
    updateCompanyData,
  };
});
