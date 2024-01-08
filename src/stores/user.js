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
    try {
      await userApi.getUserInfo(token);
    } catch (e) {
      tokenFlag = false;
    }
    return tokenFlag;
  }

  async function register(data) {
    await authApi.register(data);
  }

  async function setCurrentUser(user) {
    currentUser.value = user;
  }

  async function setUserToken(token) {
    currentUserToken.value = token;
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
    setCurrentUser,
    setUserToken,
    isTokenValid,
  };
});
