<script setup>
import { reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

import { useUserStore } from '@/stores/user';
import config from '@/config';
import validationUtil from '@/utils/validation';

import AppCard from '@/components/AppCard.vue';
import InputBox from '@/components/InputBox.vue';
import AppButton from '@/components/AppButton.vue';
import companyApi from '@/api/company.js';

const { register } = useUserStore();
const router = useRouter();

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  isRecruiter: false,
});

const companyFormData = reactive({
  profilePicture: '',
  name: '',
  description: '',
});

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  isRecruiter: '',
  profilePicture: '',
  name: '',
  description: '',
});

const flag = reactive({
  isLoadingRegister: false,
})

const validateField = (field) => {
  if (!formData[field]) {
    return;
  }

  if (!validationUtil.validateForm(field, formData[field])) {
    errors[field] = config.errors.form[field];
  } else {
    errors[field] = '';
  }

  if (field === 'password') {
    validateConfirmPassword();
    return;
  }
};

const validateConfirmPassword = () => {
  if (!formData.password || !formData.confirmPassword) {
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = config.errors.form.confirmPassword;
  } else {
    errors.confirmPassword = '';
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

    if (!validationUtil.validateForm(key, formData[key])) {
      errors[key] = config.errors.form[key];
      isFormValid = false;
    }
  }
  return isFormValid;
};

const doRegister = async () => {
  if(flag.isLoadingRegister) {
    return;
  }

  flag.isLoadingRegister = true;
  if (!validateFormData()) {
    flag.isLoadingRegister = false;
    return;
  }

  let companyData;
  try {
    if (formData.isRecruiter) {
      companyData = await companyApi.create(companyFormData);
    }
    await register({ ...formData, confirmPassword: undefined, companyId: companyData?.data.id });
    handleSuccessfulRegister();
    flag.isLoadingRegister = false;
  } catch (err) {
    handleFailedRegister(err);
    flag.isLoadingRegister = false;
  }
};

const handleSuccessfulRegister = () => {
  router.push(config.pages.login.path);
};

const handleFailedRegister = (error) => {
  if (error.statusCode === 500) {
    alert(config.errors.server);
    return;
  }

  for (const key in error.message) {
    if (error.message === 'EMAIL_ALREADY_USEED') {
      errors.email = config.errors.form.unique;
      continue;
    }

    errors[key] = error.message[key];
  }
};

const toggleRecruiter = async () => {
  formData.isRecruiter = !formData.isRecruiter;
};

</script>

<template>
  <div
    class="mt-8 px-3 min-[420px]:px-10 sm:px-20 md:px-32 lg:px-40 xl:px-52 2xl:px-72"
  >
    <AppCard class="px-5">
      <div @keydown.enter="doRegister" class="flex flex-col">
        <h1>Daftar</h1>
        &nbsp;
        <h2>Profil pribadi</h2>
        <div class="md:flex md:justify-center md:gap-x-8">
          <InputBox
            id="first-name"
            type="text"
            label="Nama Depan"
            v-model="formData.firstName"
            :error="errors.firstName"
            class="mt-8 w-full"
            @blur="validateField('firstName')"
          />
          <InputBox
            id="last-name"
            type="text"
            label="Nama Belakang"
            v-model="formData.lastName"
            :error="errors.lastName"
            class="mt-8 w-full"
            @blur="validateField('lastName')"
          />
        </div>
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
          id="username"
          type="text"
          label="username"
          v-model="formData.username"
          :error="errors.username"
          class="mt-8"
          @blur="validateField('username')"
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
        <InputBox
          id="confirm-password"
          type="password"
          label="Konfirmasi Password"
          v-model="formData.confirmPassword"
          :error="errors.confirmPassword"
          class="mt-8"
          @blur="validateConfirmPassword"
        />
        &nbsp;
        <h2 v-if="formData.isRecruiter">Profil perusahaan</h2>
        <div v-if="formData.isRecruiter">
          <InputBox
            id="company-name"
            type="text"
            label="Nama Perusahaan"
            v-model="companyFormData.name"
            :error="errors.username"
            class="mt-8"
            @blur="validateField('email')"
          />
          <InputBox
            id="company-profile-picture"
            type="text"
            label="Profile Picture (Opsional)"
            v-model="companyFormData.profilePicture"
            :error="errors.profilePicture"
            class="mt-8"
            @blur="validateField('username')"
          />
          <InputBox
            id="company-description"
            label="Deskripsi Perusahaan"
            text-area
            text-area-height="h-40"
            v-model="companyFormData.description"
            :error="errors.description"
            class="mt-8"
            @blur="validateField('username')"
          />
        </div>
        <AppButton @click="doRegister" class="mt-12">
          <p>Daftar</p>
          <img v-if="flag.isLoadingRegister" class="h-6" src="@/assets/images/loading.svg" alt="loading">
        </AppButton>
        <p class="mt-3 text-center">
          Sudah punya akun?
          <RouterLink
            :to="{ name: 'login' }"
            class="font-semibold text-blue-800"
          >
            Masuk
          </RouterLink>
        </p>
        <div class="mt-3 flex flex-row justify-center">
          <p v-if="formData.isRecruiter">Daftar sebagai freelancer?</p>
          <p v-else>Daftar sebagai recruiter?</p>
          &nbsp;
          <p @click="toggleRecruiter" class="cursor-pointer font-semibold text-blue-800">Daftar</p>
        </div>
      </div>
    </AppCard>
  </div>
</template>
