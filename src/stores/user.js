import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import authApi from '@/api/auth';
import userApi from '@/api/user';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref({});
  const currentUserToken = ref('');

  const isLoggedIn = computed(() => !!currentUser.value?.id);
  const currentUserFullName = computed(
    () => `${currentUser.value.firstName} ${currentUser.value.lastName}`
  );
  const isUserPortfolioEmpty = computed(
    () =>
      !currentUser.value.portfolio.length ||
      currentUser.value.portfolio[0] === ''
  );

  const isTokenValid = async (token) => {
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
  };

  const setCurrentUser = () => {
    const token = localStorage.getItem('Etoken');
    const userData = localStorage.getItem('userData');

    currentUser.value = JSON.parse(userData);
    currentUserToken.value = token;
  };

  const register = async (data) => {
    await authApi.register(data);
  };

  const login = async (data) => {
    const res = await authApi.login(data);

    currentUser.value = res.data.user;
    currentUserToken.value = res.data.token;

    localStorage.setItem('Etoken', res.data.token);
    localStorage.setItem('userData', JSON.stringify(res.data.user));
  };

  const logout = function () {
    currentUser.value = {};
    currentUserToken.value = '';
    localStorage.removeItem('Etoken');
    localStorage.removeItem('userData');
    this.router.push('/');
  };

  const getUserInfo = async () => {
    const res = await userApi.getUserInfo(currentUserToken.value);

    currentUser.value = res.data;
    localStorage.setItem('userData', JSON.stringify(currentUser.value));
    return res.data;
  };

  const updateUserData = async (data) => {
    if (typeof data.profilePicture !== 'string') {
      const formData = new FormData();
      formData.append('file', data.profilePicture);

      const imageLink = await userApi.uploadProfilePicture(
        formData,
        currentUserToken.value
      );
      data.profilePicture = imageLink.data.profilePicture;
    }

    const res = await userApi.updateUserData(data, currentUserToken.value);
    currentUser.value = { ...res.data };
    localStorage.setItem('userData', JSON.stringify(currentUser.value));
  };

  return {
    currentUser,
    currentUserToken,
    isLoggedIn,
    currentUserFullName,
    isUserPortfolioEmpty,
    register,
    login,
    logout,
    getUserInfo,
    isTokenValid,
    updateUserData,
    setCurrentUser,
  };
});
