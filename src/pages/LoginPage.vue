<script setup>
import { computed, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

import config from '@/config';
import { userStore } from '@/data/stores';
import { AppButton, AppCard, AppTicker, InputBox } from '@/data/components';

const LOGIN = 'login';
const NOT_FOUND = 'NOT_FOUND';
const NOT_MATCH = 'NOT_MATCH';

const route = useRoute();
const router = useRouter();

const { login } = userStore;

const isError = ref(false);
const errorMessage = ref('');
const formData = reactive({
  email: '',
  password: '',
});
const errors = reactive({
  email: '',
  password: '',
});
const isLoadingLogin = ref(false);

const redirectPath = computed(
  () => route.query.redirect || config.pages.home.path
);

const validateField = (field) => {
  if (formData[field]) {
    errors[field] = '';
  }
};

const validateFormData = () => {
  let isFormValid = true;

  for (const key in formData) {
    if (!formData[key]) {
      errors[key] = config.errors.form.required;
      isFormValid = false;
      continue;
    }

    return isFormValid;
  }
};

const doLogin = async () => {
  if (isLoadingLogin.value) {
    return;
  }

  isLoadingLogin.value = true;
  if (!validateFormData()) {
    isLoadingLogin.value = false;
    return;
  }

  try {
    formData.email = formData.email.trim().toLowerCase();
    await login(formData);
    handleSucccessfulLogin();
    isLoadingLogin.value = false;
  } catch (err) {
    handleFailedLogin(err);
    isLoadingLogin.value = false;
  }
};

const handleSucccessfulLogin = () => {
  isError.value = false;
  router.push(redirectPath.value);
};

const handleFailedLogin = (err) => {
  if (err.statusCode === 500) {
    errorMessage.value = config.errors.server;
  } else {
    errorMessage.value =
      err.message.user === NOT_FOUND || err.message.password === NOT_MATCH
        ? config.errors.invalidCredentials
        : config.errors.general(LOGIN);
  }
  isError.value = true;
};
</script>

<template>
  <div
    class="mt-8 px-3 min-[420px]:px-10 sm:px-20 md:px-32 lg:px-40 xl:px-52 2xl:px-72">
    <AppCard class="px-5">
      <div @keydown.enter="doLogin" class="flex flex-col">
        <h1>Masuk</h1>
        <InputBox
          id="email"
          label="Email"
          v-model="formData.email"
          class="mt-8"
          @blur="validateField('email')" />
        <InputBox
          id="password"
          type="password"
          label="Password"
          v-model="formData.password"
          class="mt-8"
          @blur="validateField('password')" />
        <AppTicker
          v-if="isError"
          type="error"
          :message="errorMessage"
          class="mt-8" />
        <AppButton @click="doLogin" class="mt-8">
          <p>Masuk</p>
          <img
            v-if="isLoadingLogin"
            class="h-6"
            src="@/assets/images/loading.svg"
            alt="loading" />
        </AppButton>
        <p class="mt-3 text-center">
          Belum punya akun?
          <RouterLink
            :to="{ name: 'register' }"
            class="font-semibold text-blue-800">
            Daftar
          </RouterLink>
        </p>
      </div>
    </AppCard>
  </div>
</template>
