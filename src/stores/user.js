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

  async function isTokenValid(token) {
    let tokenFlag = true;
    let userInfo = {};
    try {
      userInfo = await userApi.getUserInfo(token);
    } catch (e) {
      tokenFlag = false;
    }
    return {
      valid: tokenFlag,
      roles: userInfo?.data?.roles,
    };
  }

  const setCurrentUser = () => {
    const token = localStorage.getItem('Etoken');
    const userData = localStorage.getItem('userData');

    currentUser.value = JSON.parse(userData);
    currentUserToken.value = token;
  };

  async function register(data) {
    await authApi.register(data);
  }

  const login = async (data) => {
    const res = await authApi.login(data);

    currentUser.value = res.data.user;
    currentUserToken.value = res.data.token;

    localStorage.setItem('Etoken', res.data.token);
    localStorage.setItem('userData', JSON.stringify(res.data.user));
  };

  const logout = () => {
    currentUser.value = {};
    currentUserToken.value = '';
  };

  const getUserInfo = async () => {
    const res = await userApi.getUserInfo(currentUserToken.value);

    currentUser.value = res.data;
    return res.data;
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
    isTokenValid,
    setCurrentUser
  };
});
