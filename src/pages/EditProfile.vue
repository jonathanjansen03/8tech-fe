<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { CheckIcon, TrashIcon } from '@heroicons/vue/24/outline';
import {
  PlusCircleIcon,
  TrashIcon as SolidTrashIcon,
} from '@heroicons/vue/24/solid';
import NProgress from 'nprogress';

import config from '@/config';
import defaultUserProfilePicture from '@/assets/images/default-user-profile-picture.png';
import validationUtil from '@/utils/validation';
import { userStore } from '@/data/stores';
import {
  AppButton,
  AppCard,
  AppTicker,
  ImageInput,
  InputBox,
} from '@/data/components';

const router = useRouter();
const { currentUser } = storeToRefs(userStore);

const formData = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  description: '',
  portfolio: '',
});
const errors = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
});
const base64UserProfileImage = ref('');
const isLoading = ref(false);
const isError = ref(false);
const errorMessage = ref('');

const userProfilePicture = computed(() => {
  return base64UserProfileImage.value
    ? base64UserProfileImage.value
    : currentUser.value.profilePicture || defaultUserProfilePicture;
});

const initPage = () => {
  NProgress.start();

  formData.value = {
    ...currentUser.value,
  };

  if (!formData.value.portfolio?.length) {
    formData.value.portfolio = [''];
  }

  NProgress.done();
};

const updateUserProfilePicture = (image) => {
  formData.value.profilePicture = image.file;
  base64UserProfileImage.value = image.base64;
};

const validateField = (field) => {
  if (!formData.value[field]) {
    return;
  }

  if (!validationUtil.form(field, formData.value[field])) {
    errors.value[field] = config.errors.form[field];
  } else {
    errors.value[field] = '';
  }
};

const validateFormData = () => {
  let isFormValid = true;

  for (const key in formData.value) {
    if (key !== 'description' && key !== 'portfolio' && !formData.value[key]) {
      errors.value[key] = config.errors.form.required;
      isFormValid = false;
      continue;
    }

    if (!validationUtil.form(key, formData.value[key])) {
      errors.value[key] = config.errors.form[key];
      isFormValid = false;
    }
  }
  return isFormValid;
};

const updateProfile = async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  if (!validateFormData()) {
    isLoading.value = false;
    return;
  }

  try {
    await userStore.updateUserData(formData.value);
    handleSucccessfulUpdateProfile();
  } catch (err) {
    handleFailedUpdateProfile(err);
  }
  isLoading.value = false;
};

const handleSucccessfulUpdateProfile = () => {
  isError.value = false;
  returnToUserProfile();
};

const handleFailedUpdateProfile = (err) => {
  if (err.statusCode === 500) {
    errorMessage.value = config.errors.server;
  } else {
    errorMessage.value = err.message;
  }
  isError.value = true;
};

const returnToUserProfile = () => {
  router.push({ name: config.pages.profile.name });
};

const incrementPortfolio = () => {
  formData.value.portfolio.push('');
};

const decrementPortfolio = () => {
  if (formData.value.portfolio.length === 1) {
    formData.value.portfolio[0] = '';
    return;
  }
  formData.value.portfolio.pop();
};

onMounted(initPage);
</script>

<template>
  <div
    class="mt-8 px-3 min-[420px]:px-10 sm:px-20 md:px-32 lg:px-40 xl:px-52 2xl:px-72">
    <AppCard class="edit-profile px-8 py-8">
      <h1>Edit Profil</h1>
      <div class="flex justify-center mt-5">
        <ImageInput
          :image="userProfilePicture"
          :defaultImage="defaultUserProfilePicture"
          @change="updateUserProfilePicture" />
      </div>
      <div class="flex justify-between mt-8">
        <div class="flex flex-col">
          <InputBox
            id="firstName"
            label="Nama Depan"
            v-model="formData.firstName"
            :error="errors.firstName"
            @blur="validateField('firstName')" />
        </div>
        <div class="flex flex-col">
          <InputBox
            id="lastName"
            label="Nama Belakang"
            v-model="formData.lastName"
            :error="errors.lastName"
            @blur="validateField('lastName')" />
        </div>
      </div>
      <div class="flex flex-col mt-8">
        <InputBox
          id="username"
          label="Username"
          v-model="formData.username"
          :error="errors.username"
          @blur="validateField('username')" />
      </div>
      <div class="flex flex-col mt-8">
        <InputBox
          id="email"
          label="Email"
          v-model="formData.email"
          :error="errors.email"
          @blur="validateField('email')" />
      </div>
      <div class="flex flex-col mt-8">
        <InputBox
          id="description"
          label="Deskripsi"
          v-model="formData.description"
          textArea />
      </div>
      <div>
        <div
          class="flex mt-8"
          v-for="(i, index) in formData.portfolio.length"
          :key="index">
          <InputBox
            :id="`portfolio${i}`"
            class="w-full"
            :label="`Link portofolio ${i}`"
            v-model="formData.portfolio[i - 1]" />
          <SolidTrashIcon
            class="cursor-pointer ml-3 w-6"
            @click="decrementPortfolio" />
        </div>
        <div class="flex justify-center mt-3">
          <PlusCircleIcon
            class="cursor-pointer w-6"
            @click="incrementPortfolio" />
        </div>
      </div>
      <AppTicker
        v-if="isError"
        type="error"
        :message="errorMessage"
        class="mt-8" />
      <div class="flex justify-center mt-5">
        <RouterLink :to="{ name: config.pages.profile.name }">
          <AppButton
            outline
            class="flex items-center py-3"
            @click="returnToUserProfile">
            <TrashIcon class="mr-2 w-5" />
            Batal
          </AppButton>
        </RouterLink>
        <AppButton class="flex items-center ml-12 py-3" @click="updateProfile">
          <CheckIcon class="mr-2 w-5" />
          Simpan
          <img
            v-if="isLoading"
            alt="loading"
            class="h-6 ml-1"
            src="@/assets/images/loading.svg" />
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>
