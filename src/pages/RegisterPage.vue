<script setup>
import { reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

import config from '@/config';
import { useUserStore } from '@/stores/user';

import InputBox from '@/components/InputBox.vue';
import AppButton from '@/components/AppButton.vue';
import AppCard from '@/components/AppCard.vue';

const ERROR_MESSAGES = {
  REQUIRED: 'Harus diisi.',
  MIN_LENGTH: 'Minimal {minLength} karakter.',
  MAX_LENGTH: 'Maksimal {maxLength} karakter.',
  UNIQUE: 'Sudah terdaftar.',
  CONFIRM_PASSWORD: 'Harus sama dengan password.',
};

const { register } = useUserStore();
const router = useRouter();

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
});

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
});

const validateEmail = () => {
  if (formData.email === '') {
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(formData.email)) {
    errors.email = 'Masukkan email yang valid.';
  } else {
    errors.email = '';
  }
};

const validateConfirmPassword = () => {
  if (!formData.confirmPassword) {
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Harus sama dengan password.';
  } else {
    errors.confirmPassword = '';
  }
};

const doRegister = async () => {
  try {
    await register({ ...formData, confirmPassword: undefined });
    handleSuccessfulRegister();
  } catch (err) {
    handleFailedRegister(err);
  }
};

const handleSuccessfulRegister = () => {
  router.push(config.pages.home);
};

const handleFailedRegister = (error) => {
  if (error.statusCode === 500) {
    alert('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
    return;
  }

  for (const key in error.message) {
    errors[key] = error.message[key];
  }
};
</script>

<template>
  <div
    class="mt-8 px-3 min-[420px]:px-10 sm:px-20 md:px-32 lg:px-40 xl:px-52 2xl:px-72"
  >
    <AppCard class="px-5">
      <div class="flex flex-col">
        <h1>Daftar</h1>
        <div class="md:flex md:justify-center md:gap-x-8">
          <InputBox
            id="first-name"
            type="text"
            label="Nama Depan"
            v-model="formData.firstName"
            :error="errors.firstName"
            class="mt-8 w-full"
          />
          <InputBox
            id="last-name"
            type="text"
            label="Nama Belakang"
            v-model="formData.lastName"
            :error="errors.lastName"
            class="mt-8 w-full"
          />
        </div>
        <InputBox
          id="email"
          type="text"
          label="Email"
          v-model="formData.email"
          :error="errors.email"
          class="mt-8"
          @blur="validateEmail"
        />
        <InputBox
          id="username"
          type="text"
          label="username"
          v-model="formData.username"
          :error="errors.username"
          class="mt-8"
        />
        <InputBox
          id="password"
          type="password"
          label="Password"
          v-model="formData.password"
          :error="errors.password"
          class="mt-8"
          @blur="validateConfirmPassword"
        />
        <InputBox
          id="confirm-password"
          type="password"
          label="Konfirmasi Password"
          v-model="formData.confirmPassword"
          :error="errors.confirmPassword"
          class="mt-8"
          @blur="validateConfirmPassword"
        />
        <AppButton @click="doRegister" class="mt-12">Daftar</AppButton>
        <p class="mt-3 text-center">
          Sudah punya akun?
          <RouterLink to="/" class="font-semibold text-blue-800"
            >Masuk</RouterLink
          >
        </p>
      </div>
    </AppCard>
  </div>
</template>
