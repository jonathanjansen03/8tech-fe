<script setup>
import { reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

import { useUserStore } from '@/stores/user';
import config from '@/config';

import AppCard from '@/components/AppCard.vue';
import InputBox from '@/components/InputBox.vue';
import AppButton from '@/components/AppButton.vue';

const { login } = useUserStore();
const router = useRouter();

const LOGIN = 'login';
const NOT_FOUND = 'NOT_FOUND';

const formData = reactive({
  email: '',
  password: '',
});

const errors = reactive({
  email: '',
  password: '',
});

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
  if (!validateFormData()) {
    return;
  }

  try {
    await login(formData);
    handleSucccessfulLogin();
  } catch (err) {
    handleFailedLogin(err);
  }
};

const handleSucccessfulLogin = () => {
  router.push(config.pages.home.path);
};

const handleFailedLogin = (error) => {
  if (error.statusCode === 500) {
    alert(config.errors.server);
    return;
  }

  const alertMessage =
    error.message.user === NOT_FOUND
      ? config.errors.invalidCredentials
      : config.errors.general(LOGIN);
  alert(alertMessage);
};
</script>

<template>
  <div
    class="mt-8 px-3 min-[420px]:px-10 sm:px-20 md:px-32 lg:px-40 xl:px-52 2xl:px-72"
  >
    <AppCard class="px-5">
      <div class="flex flex-col">
        <h1>Masuk</h1>
        <InputBox
          id="email"
          type="text"
          label="Email"
          v-model="formData.email"
          :error="errors.email"
          class="mt-8"
          @blur="validateField('email')"
        />
        <InputBox
          id="password"
          type="password"
          label="Password"
          v-model="formData.password"
          :error="errors.password"
          class="mt-8"
          @blur="validateField('password')"
        />
        <AppButton @click="doLogin" class="mt-12">Masuk</AppButton>
        <p class="mt-3 text-center">
          Belum punya akun?
          <RouterLink
            :to="{ name: 'register' }"
            class="font-semibold text-blue-800"
          >
            Daftar
          </RouterLink>
        </p>
      </div>
    </AppCard>
  </div>
</template>
