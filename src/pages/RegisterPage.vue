<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/stores/user';
import { useCompanyStore } from '@/stores/company';
import config from '@/config';
import validationUtil from '@/utils/validation';

import AppCard from '@/components/AppCard.vue';
import InputBox from '@/components/InputBox.vue';
import AppButton from '@/components/AppButton.vue';

const router = useRouter();
const userStore = useUserStore();
const companyStore = useCompanyStore();

const { register } = userStore;

const { company } = storeToRefs(companyStore);
const { createCompany } = companyStore;

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
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
  profilePicture: '',
  name: '',
  description: '',
});
const isRecruiter = ref(false);
const isLoadingRegister = ref(false);

const validateField = (field) => {
  if (!formData[field]) {
    return;
  }

  if (!validationUtil.form(field, formData[field])) {
    errors[field] = config.errors.form[field];
  } else {
    errors[field] = '';
  }

  if (field === 'password') {
    validateConfirmPassword();
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

    if (!validationUtil.form(key, formData[key])) {
      errors[key] = config.errors.form[key];
      isFormValid = false;
    }
  }
  return isFormValid;
};

const doRegister = async () => {
  if (isLoadingRegister.value) {
    return;
  }

  isLoadingRegister.value = true;
  if (!validateFormData()) {
    isLoadingRegister.value = false;
    return;
  }

  try {
    formData.email = formData.email.trim().toLowerCase();
    if (isRecruiter.value) {
      await createCompany(companyFormData);
    }
    await register({
      ...formData,
      confirmPassword: undefined,
      companyId: company.value.id,
      roles: isRecruiter.value ? ['RECRUITER', 'USER'] : ['USER'],
    });
    handleSuccessfulRegister();
    isLoadingRegister.value = false;
  } catch (err) {
    console.error(err);
    handleFailedRegister(err);
    isLoadingRegister.value = false;
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

const toggleIsRecruiter = async () => {
  isRecruiter.value = !isRecruiter.value;
};
</script>

<template>
  <div
    class="mt-8 px-3 min-[420px]:px-10 sm:px-20 md:px-32 lg:px-40 xl:px-52 2xl:px-72">
    <AppCard class="px-5">
      <div @keydown.enter="doRegister" class="flex flex-col">
        <h1>Daftar</h1>
        <h2 class="mt-5">Profil pribadi</h2>
        <div class="md:flex md:justify-center md:gap-x-8">
          <InputBox
            id="first-name"
            label="Nama Depan"
            v-model="formData.firstName"
            :error="errors.firstName"
            class="mt-8 w-full"
            @blur="validateField('firstName')" />
          <InputBox
            id="last-name"
            label="Nama Belakang"
            v-model="formData.lastName"
            :error="errors.lastName"
            class="mt-8 w-full"
            @blur="validateField('lastName')" />
        </div>
        <InputBox
          id="email"
          label="Email"
          v-model="formData.email"
          :error="errors.email"
          class="mt-8"
          @blur="validateField('email')" />
        <InputBox
          id="username"
          label="Username"
          v-model="formData.username"
          :error="errors.username"
          class="mt-8"
          :class="{ 'min-[320px]:mt-20': errors.email }"
          @blur="validateField('username')" />
        <InputBox
          id="password"
          type="password"
          label="Password"
          v-model="formData.password"
          :error="errors.password"
          class="mt-8"
          :class="{ 'min-[320px]:mt-20': errors.username }"
          @blur="validateField('password')" />
        <InputBox
          id="confirm-password"
          type="password"
          label="Konfirmasi Password"
          v-model="formData.confirmPassword"
          :error="errors.confirmPassword"
          class="mt-8"
          :class="{ 'min-[320px]:mt-20': errors.password }"
          @blur="validateConfirmPassword" />
        &nbsp;
        <h2 v-if="isRecruiter">Profil perusahaan</h2>
        <div v-if="isRecruiter">
          <InputBox
            id="company-name"
            type="text"
            label="Nama Perusahaan"
            v-model="companyFormData.name"
            :error="errors.username"
            class="mt-8"
            @blur="validateField('email')" />
          <InputBox
            id="company-profile-picture"
            type="text"
            label="Profile Picture (Opsional)"
            v-model="companyFormData.profilePicture"
            :error="errors.profilePicture"
            class="mt-8"
            @blur="validateField('username')" />
          <InputBox
            id="company-description"
            label="Deskripsi Perusahaan"
            text-area
            text-area-height="h-40"
            v-model="companyFormData.description"
            :error="errors.description"
            class="mt-8"
            @blur="validateField('description')" />
        </div>
        <AppButton @click="doRegister" class="mt-12">
          <p>Daftar</p>
          <img
            v-if="isLoadingRegister"
            class="h-6"
            src="@/assets/images/loading.svg"
            alt="loading" />
        </AppButton>
        <p class="mt-3 text-center">
          Sudah punya akun?
          <RouterLink
            :to="{ name: 'login' }"
            class="font-semibold text-blue-800">
            Masuk
          </RouterLink>
        </p>
        <div class="mt-3 flex flex-row justify-center">
          <p v-if="isRecruiter">Daftar sebagai freelancer?</p>
          <p v-else>Daftar sebagai recruiter?</p>
          &nbsp;
          <p
            @click="toggleIsRecruiter"
            class="cursor-pointer font-semibold text-blue-800">
            Daftar
          </p>
        </div>
      </div>
    </AppCard>
  </div>
</template>
