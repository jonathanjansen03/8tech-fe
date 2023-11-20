<script setup>
import { reactive, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';

import InputBox from '@/components/InputBox.vue';
import AppButton from '@/components/AppButton.vue';

const formData = reactive({
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  confirmPassword: '',
});

const errors = ref({
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  confirmPassword: '',
});

watch(
  () => formData.confirmPassword,
  (newValue) => {
    if (newValue !== formData.confirmPassword) {
      formData.confirmPassword;
    }
  }
);

const validateConfirmPassword = () => {
  console.log('validated');
  if (formData.password !== formData.confirmPassword) {
    errors.value.confirmPassword = 'Harus sama dengan password.';
  } else {
    errors.value.confirmPassword = '';
  }
};

const register = () => {
  console.log(formData);
};
</script>

<template>
  <div
    class="mt-8 px-3 min-[420px]:px-10 sm:px-20 md:px-32 lg:px-40 xl:px-52 2xl:px-72"
  >
    <div class="bg-white shadow-lg flex flex-col px-3 py-5 rounded-xl md:px-5">
      <h1>Daftar</h1>
      <div class="md:flex md:justify-center md:gap-x-8">
        <InputBox
          type="text"
          label="Nama Depan"
          v-model="formData.firstName"
          class="mt-8 w-full"
        />
        <InputBox
          type="text"
          label="Nama Belakang"
          v-model="formData.lastName"
          class="mt-8 w-full"
        />
      </div>
      <InputBox
        type="text"
        label="Username"
        v-model="formData.username"
        class="mt-8"
      />
      <InputBox
        type="password"
        label="Password"
        v-model="formData.password"
        class="mt-8"
      />
      <InputBox
        type="password"
        label="Konfirmasi Password"
        v-model="formData.confirmPassword"
        class="mt-8"
        @blur="validateConfirmPassword"
      />
      <AppButton @click="register" class="mt-12">Daftar</AppButton>
      <p class="mt-3 text-center">
        Sudah punya akun?
        <RouterLink to="/" class="text-blue-800">Masuk</RouterLink>
      </p>
    </div>
  </div>
</template>
