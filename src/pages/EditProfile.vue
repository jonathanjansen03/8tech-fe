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

import { useUserStore } from '@/stores/user';
import config from '@/config';
import defaultUserProfilePicture from '@/assets/images/default-user-profile-picture.png';

import AppCard from '@/components/AppCard.vue';
import AppTicker from '@/components/AppTicker.vue';
import AppButton from '@/components/AppButton.vue';
import InputBox from '@/components/InputBox.vue';
import ImageInput from '@/components/ImageInput.vue';

const router = useRouter();
const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const formData = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  description: '',
  portfolio: '',
});
const base64UserProfileImage = ref('');
const isError = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

const userProfilePicture = computed(() => {
  return base64UserProfileImage.value
    ? base64UserProfileImage.value
    : currentUser.value.profilePicture || defaultUserProfilePicture;
});

const updateUserProfilePicture = (image) => {
  formData.value.profilePicture = image.file;
  base64UserProfileImage.value = image.base64;
};

const updateProfile = async () => {
  isLoading.value = true;
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
      <div class="flex justify-between mt-5">
        <div class="flex flex-col">
          <InputBox
            id="firstName"
            label="Nama Depan"
            v-model="formData.firstName" />
        </div>
        <div class="flex flex-col">
          <InputBox
            id="lastName"
            label="Nama Belakang"
            v-model="formData.lastName" />
        </div>
      </div>
      <div class="flex flex-col mt-5">
        <InputBox id="username" label="Username" v-model="formData.username" />
      </div>
      <div class="flex flex-col mt-5">
        <InputBox id="email" label="Email" v-model="formData.email" />
      </div>
      <div class="flex flex-col mt-5">
        <InputBox
          id="description"
          label="Deskripsi"
          v-model="formData.description"
          textArea />
      </div>
      <div>
        <div
          class="flex mt-5"
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
        <div class="flex justify-center mt-5">
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
