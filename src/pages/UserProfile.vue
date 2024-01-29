<script setup>
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  ArrowLeftOnRectangleIcon,
  PencilSquareIcon,
} from '@heroicons/vue/24/outline';
import NProgress from 'nprogress';

import config from '@/config';
import defaultUserProfilePicture from '@/assets/images/default-user-profile-picture.png';
import { userStore } from '@/data/stores';
import { AppButton, AppCard } from '@/data/components';

const NO_DESCRIPTION = 'Belum ada deskripsi.';
const NO_CV = 'Belum ada CV.';
const NO_PORTFOLIO = 'Belum ada portofolio.';
const NO_RATING = 'Belum ada rating.';
const GET_PROFILE_DATA = 'mendapatkan profil';

const route = useRoute();
const router = useRouter();

const {
  currentUser,
  currentUserToken,
  userRating,
  userProfile,
  isRecruiter,
  isUserPortfolioEmpty,
} = storeToRefs(userStore);
const { logout, getUserInfoById, getUserRating } = userStore;

const isPrivateProfile = ref(true);
const publicUserProfile = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  description: '',
  cv: '',
  portfolio: [],
  profilePicture: '',
});

const userProfilePicture = computed(() => {
  if (isPrivateProfile.value) {
    return currentUser.value.profilePicture || defaultUserProfilePicture;
  }
  return publicUserProfile.profilePicture || defaultUserProfilePicture;
});

const isPortfolioEmpty = computed(() => {
  if (isPrivateProfile.value) {
    return isUserPortfolioEmpty.value;
  }
  return !publicUserProfile.portfolio.length ||
    publicUserProfile.portfolio[0] === '';
});

const initPage = async () => {
  NProgress.start();
  try {
    isPrivateProfile.value = route.params.id === undefined;
    await getUserRating(route.params.id || currentUser.value.id);
    if (!isPrivateProfile.value) {
      await getUserInfoById(route.params.id, currentUserToken.value);

      for (const key in publicUserProfile) {
        publicUserProfile[key] = userProfile.value[key];
      }
    }
  } catch (err) {
    console.error(err);
    alert(config.errors.general(GET_PROFILE_DATA));
  }
  NProgress.done();
};

const goToCompanyProfile = () => {
  router.push({
    name: config.pages.companyProfile.name,
    params: { id: currentUser.value.companyId },
  });
};

const doLogout = () => {
  logout();
  router.push({ name: config.pages.login.name });
};

onBeforeMount(initPage);

watch(route, () => {
  isPrivateProfile.value = route.params.id === undefined;
});
</script>

<template>
  <div
    class="mt-8 px-3 min-[420px]:px-10 sm:px-20 md:px-32 lg:px-40 xl:px-52 2xl:px-72">
    <AppCard class="user-profile px-8 py-8">
      <div class="flex flex-row justify-between mb-2">
        <h1 @click="console.log(currentUser.portfolio)">Profil</h1>
        <h3
          v-if="isPrivateProfile && isRecruiter"
          @click="goToCompanyProfile"
          class="cursor-pointer text-blue-700 hover:text-blue-500">
          Lihat profil perusahaan
        </h3>
      </div>

      <div class="flex justify-center mt-5">
        <img
          :src="userProfilePicture"
          alt="User profile picture."
          class="rounded-full drop-shadow-md w-36" />
      </div>
      <div class="flex justify-between mt-5">
        <div class="flex flex-col">
          <h3>Nama Depan</h3>
          <p>
            {{ (isPrivateProfile ? currentUser : publicUserProfile).firstName }}
          </p>
        </div>
        <div class="flex flex-col">
          <h3>Nama Belakang</h3>
          <p>
            {{ (isPrivateProfile ? currentUser : publicUserProfile).lastName }}
          </p>
        </div>
      </div>
      <div class="flex flex-col mt-5">
        <h3>Username</h3>
        <p>
          {{ (isPrivateProfile ? currentUser : publicUserProfile).username }}
        </p>
      </div>
      <div class="flex flex-col mt-5">
        <h3>Email</h3>
        <p>{{ (isPrivateProfile ? currentUser : publicUserProfile).email }}</p>
      </div>
      <div class="flex flex-col mt-5">
        <h3>Deskripsi</h3>
        <p>
          {{
            (isPrivateProfile ? currentUser : publicUserProfile).description ||
            NO_DESCRIPTION
          }}
        </p>
      </div>
      <div class="flex flex-col mt-5">
        <h3>CV</h3>
        <p>
          {{
            (isPrivateProfile ? currentUser : publicUserProfile).cv ||
            NO_CV
          }}
        </p>
      </div>
      <div class="flex flex-col mt-5">
        <h3>Portofolio</h3>
        <p
          v-for="(i, index) in (isPrivateProfile
            ? currentUser
            : publicUserProfile
          ).portfolio"
          :key="index">
          {{ i }}
        </p>
        <p v-if="isPortfolioEmpty">
          {{ NO_PORTFOLIO }}
        </p>
      </div>
      <div v-if="!isRecruiter" class="flex flex-col mt-5">
        <h3>Rata-Rata Rating</h3>
        <p v-if="userRating.count">
          {{ userRating.average }} dari 10 ({{ userRating.count }} orang memberi
          rating)
        </p>
        <p v-if="!userRating.count">
          {{ NO_RATING }}
        </p>
      </div>
      <div v-if="isPrivateProfile" class="flex justify-center mt-5">
        <AppButton outline class="flex items-center py-3" @click="doLogout">
          <ArrowLeftOnRectangleIcon class="mr-2 w-5" />
          Keluar
        </AppButton>
        <RouterLink :to="{ name: config.pages.editProfile.name }">
          <AppButton class="flex items-center ml-12 py-3">
            <PencilSquareIcon class="mr-2 w-5" />
            Edit profil
          </AppButton>
        </RouterLink>
      </div>
    </AppCard>
  </div>
</template>
