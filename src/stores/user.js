import { defineStore } from 'pinia';
import authApi from '@/api/auth';
import { reactive } from 'vue';

export const useUserStore = defineStore('user', () => {
  const currentUser = reactive({});

  function register(data) {
    return authApi
      .register(data)
      .then((res) => {
        console.log('success', res);
        currentUser = res.body.data;
      })
      .catch((err) => {
        console.log(err, 'err');
      });
  }

  return {
    currentUser,
    register,
  };
});
