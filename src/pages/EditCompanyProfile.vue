<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { CheckIcon, TrashIcon } from '@heroicons/vue/24/outline';

import config from '@/config';
import defaultUserProfilePicture from '@/assets/images/default-user-profile-picture.png';
import AppCard from '@/components/AppCard.vue';
import AppTicker from '@/components/AppTicker.vue';
import AppButton from '@/components/AppButton.vue';
import InputBox from '@/components/InputBox.vue';
import ImageInput from '@/components/ImageInput.vue';
import { useCompanyStore } from '@/stores/company.js';

const router = useRouter();
const userStore = useUserStore();
const companyStore = useCompanyStore();
const {currentUser, currentUserToken} = storeToRefs(userStore);

const isLoading = ref(false);
const formData = ref({
  name: '',
  description: '',
  profilePicture: null
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

const updateProfile = async () => {
  if (isLoading.value) {
    return;
  }
  try {
    isLoading.value = true;
    await companyStore.updateCompanyData({
      ...formData.value,
      id: currentUser.value.companyId
    }, currentUserToken.value);
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
  const company = await companyStore.getCompanyInfo(currentUser.value.companyId);
  formData.value = {
    name: company.data.name,
    description: company.data.description,
    profilePicture: company.data.profilePicture
  };
});
</script>

<template>
  <div
    class="mt-8 px-3 min-[420px]:px-10 sm:px-20 md:px-32 lg:px-40 xl:px-52 2xl:px-72">
    <AppCard class="edit-profile px-8 py-8">
      <h1>Edit Profil</h1>
      <div class="flex justify-center mt-5">
        <ImageInput
          :defaultImage="defaultUserProfilePicture"
          :image="userProfilePicture"
          @change="updateUserProfilePicture"/>
      </div>
      <div class="flex flex-col">
        <InputBox
          id="firstName"
          v-model="formData.name"
          label="Nama Depan"/>
      </div>
      <div class="flex flex-col mt-5">
        <InputBox
          id="description"
          v-model="formData.description"
          label="Deskripsi"/>
      </div>
      <AppTicker
        v-if="isError"
        :message="errorMessage"
        class="mt-8"
        type="error"/>

      <div class="flex justify-center mt-5">
        <RouterLink :to="{ name: config.pages.profile.name }">
          <AppButton
            class="flex items-center py-3"
            outline
            @click="returnToHome">
            <TrashIcon class="mr-2 w-5"/>
            Batal
          </AppButton>
        </RouterLink>
        <AppButton class="flex items-center ml-12 py-3" @click="updateProfile">
          <CheckIcon class="mr-2 w-5"/>
          Simpan
          <img v-if="true" alt="loading" class="h-6" src="@/assets/images/loading.svg">
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>
