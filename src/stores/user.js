import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import authApi from '@/api/auth';
import userApi from '@/api/user';
import ratingApi from '@/api/rating';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref({});
  const currentUserToken = ref('');
  const userProfile = ref({});
  const userAppliedJobs = ref([]);
  const userAppliedJobsPagination = ref({});
  const userRating = ref({});

  const isLoggedIn = computed(() => !!currentUser.value?.id);
  const isRecruiter = computed(() => {
    if (!currentUser.value.roles) {
      return false;
    }

    return currentUser.value?.roles.includes('RECRUITER');
  });
  const isUserPortfolioEmpty = computed(
    () =>
      !currentUser.value.portfolio.length ||
      currentUser.value.portfolio[0] === ''
  );
  const currentUserFullName = computed(
    () => `${currentUser.value.firstName} ${currentUser.value.lastName}`
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
    const token = localStorage.getItem('Etoken') || '';
    const userData = localStorage.getItem('userData') || '{}';

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
  };

  const getUserInfo = async () => {
    const res = await userApi.getUserInfo(currentUserToken.value);

    currentUser.value = res.data;
    localStorage.setItem('userData', JSON.stringify(currentUser.value));
    return res.data;
  };

  const getUserInfoById = async (id) => {
    const res = await userApi.getUserInfoById(id, currentUserToken.value);

    userProfile.value = Object.assign({}, res.data);
  };

  const updateUserData = async (data) => {
    if (data.profilePicture && typeof data.profilePicture !== 'string') {
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

  const getUserAppliedJobs = async (data) => {
    const res = await userApi.getAppliedJobs(data, currentUserToken.value);
    userAppliedJobs.value = res.data.data ? res.data.data.slice(0) : [];
    userAppliedJobsPagination.value = {
      totalPages: res.data.totalPages,
      hasNext: res.data.hasNext,
      hasPrevious: res.data.hasPrevious,
      isLast: res.data.isLast,
      isFirst: res.data.isFirst,
    };
  };

  const getUserRating = async (id) => {
    const res = await ratingApi.getAverageRating(id, currentUserToken.value);
    userRating.value = Object.assign(
      {},
      {
        average: res.data._avg.ratingOf10,
        count: res.data._count.ratingOf10,
      }
    );
  };

  return {
    currentUser,
    currentUserToken,
    userProfile,
    userAppliedJobs,
    userAppliedJobsPagination,
    userRating,
    isLoggedIn,
    isRecruiter,
    isUserPortfolioEmpty,
    currentUserFullName,
    register,
    login,
    logout,
    getUserInfo,
    getUserInfoById,
    isTokenValid,
    updateUserData,
    setCurrentUser,
    getUserAppliedJobs,
    getUserRating,
  };
});
