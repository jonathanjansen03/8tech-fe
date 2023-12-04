import { defineStore } from 'pinia';
import { ref } from 'vue';

import authApi from '@/api/auth';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref({});

  async function register(data) {
    const res = await authApi.register(data);

    currentUser.value = res.data;
  }

  return {
    currentUser,
    register,
  };
});
