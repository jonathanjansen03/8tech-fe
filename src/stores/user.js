import { defineStore } from 'pinia';
import { ref } from 'vue';

import authApi from '@/api/auth';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref({});
  const currentUserToken = ref('');

  async function register(data) {
    await authApi.register(data);
  }

  async function login(data) {
    const res = await authApi.login(data);

    currentUser.value = res.data.user;
    currentUserToken.value = res.data.token;
  }

  return {
    currentUser,
    currentUserToken,
    register,
    login,
  };
});
