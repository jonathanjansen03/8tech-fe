import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import authApi from '@/api/auth';
import userApi from '@/api/user';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref({});
  const currentUserToken = ref('');

  const isLoggedIn = computed(() => !!currentUser.value.id);
  const currentUserFullName = computed(
    () => `${currentUser.value.firstName} ${currentUser.value.lastName}`
  );

  async function register(data) {
    await authApi.register(data);
  }

  const login = async (data) => {
    const res = await authApi.login(data);

    currentUser.value = res.data.user;
    currentUserToken.value = res.data.token;
  };

  const logout = () => {
    currentUser.value = {};
    currentUserToken.value = '';
  };

  const getUserInfo = async () => {
    const res = await userApi.getUserInfo(currentUserToken.value);

    currentUser.value = res.data;
  };

  return {
    currentUser,
    currentUserToken,
    isLoggedIn,
    currentUserFullName,
    register,
    login,
    logout,
    getUserInfo,
  };
});
