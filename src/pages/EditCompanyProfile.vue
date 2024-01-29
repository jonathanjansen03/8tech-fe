<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { CheckIcon, TrashIcon } from '@heroicons/vue/24/outline';

import config from '@/config';
import defaultUserProfilePicture from '@/assets/images/default-user-profile-picture.png';
import validationUtil from '@/utils/validation';
import { companyStore, userStore } from '@/data/stores';
import {
  AppCard,
  AppButton,
  AppTicker,
  ImageInput,
  InputBox,
} from '@/data/components';

const router = useRouter();
const { currentUser, currentUserToken } = storeToRefs(userStore);

const isLoading = ref(false);
const formData = ref({
  name: '',
  description: '',
  profilePicture: null,
});
const errors = ref({
  name: '',
  description: '',
});
const base64UserProfileImage = ref(null);
const isError = ref(false);
const errorMessage = ref('');

const userProfilePicture = computed(() => {
  return base64UserProfileImage.value
    ? base64UserProfileImage.value
    : formData.value.profilePicture || defaultUserProfilePicture;
});

const updateUserProfilePicture = (image) => {
  formData.value.profilePicture = image.file;
  base64UserProfileImage.value = image.base64;
};

const initPage = async () => {
  const company = await companyStore.getCompanyInfo(
    currentUser.value.companyId
  );
  formData.value = {
    name: company.data.name,
    description: company.data.description,
    profilePicture: company.data.profilePicture,
  };
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
    if (!formData.value[key]) {
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
    await companyStore.updateCompanyData(
      {
        ...formData.value,
        id: currentUser.value.companyId,
      },
      currentUserToken.value
    );
    handleSucccessfulUpdateProfile();
    isLoading.value = false;
  } catch (err) {
    handleFailedUpdateProfile(err);
    isLoading.value = false;
  }
};

const handleSucccessfulUpdateProfile = () => {
  isError.value = false;
  returnToHome();
};

const handleFailedUpdateProfile = (err) => {
  if (err.statusCode === 500) {
    errorMessage.value = config.errors.server;
  } else {
    errorMessage.value = err.message;
  }
  isError.value = true;
};

const returnToHome = () => {
  router.push(config.pages.home.path);
};

onMounted(async () => {
  await initPage();
});
</script>

<template>
  <div
    class="mt-8 px-3 min-[420px]:px-10 sm:px-20 md:px-32 lg:px-40 xl:px-52 2xl:px-72">
    <AppCard class="edit-profile px-8 py-8">
      <h1>Edit Profil Perusahaan</h1>
      <div class="flex justify-center mt-5">
        <ImageInput
          :defaultImage="defaultUserProfilePicture"
          :image="userProfilePicture"
          @change="updateUserProfilePicture" />
      </div>
      <div class="flex flex-col">
        <InputBox
          id="firstName"
          v-model="formData.name"
          label="Nama Perusahaan" :error="errors.name" @blur="validateField('name')" />
      </div>
      <div class="flex flex-col mt-5">
        <InputBox
          id="description"
          v-model="formData.description"
          label="Deskripsi" :error="errors.description" @blur="validateField('description')" />
      </div>
      <AppTicker
        v-if="isError"
        :message="errorMessage"
        class="mt-8"
        type="error" />

      <div class="flex justify-center mt-5">
        <RouterLink :to="{ name: config.pages.profile.name }">
          <AppButton
            class="flex items-center py-3"
            outline
            @click="returnToHome">
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
            class="h-6"
            src="@/assets/images/loading.svg" />
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>
