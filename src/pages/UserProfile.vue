<script setup>
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  ArrowLeftOnRectangleIcon,
  PencilSquareIcon,
} from '@heroicons/vue/24/outline';
import NProgress from 'nprogress';

import { useMainStore } from '@/stores/main';
import { useUserStore } from '@/stores/user';
import userApi from '@/api/user';
import config from '@/config';
import defaultUserProfilePicture from '@/assets/images/default-user-profile-picture.png';

import AppCard from '@/components/AppCard.vue';
import AppButton from '@/components/AppButton.vue';

const NO_DESCRIPTION = 'Belum ada deskripsi.';
const NO_PORTFOLIO = 'Belum ada portofolio.';

const route = useRoute();
const mainStore = useMainStore();
const userStore = useUserStore();

const { currentUser, isUserPortfolioEmpty } = storeToRefs(userStore);

const isPrivateProfile = ref(true);
const publicUserProfile = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  description: '',
  portfolio: [],
  profilePicture: '',
});

const userProfilePicture = computed(() => {
  if (isPrivateProfile.value) {
    return currentUser.value.profilePicture ?? defaultUserProfilePicture;
  }
  return publicUserProfile.profilePicture ?? defaultUserProfilePicture;
});

const initPage = async () => {
  isPrivateProfile.value = route.params.id === undefined;
  mainStore.setRecruiterPortal(currentUser.value.roles.includes('RECRUITER'));
  if (!isPrivateProfile.value) {
    NProgress.start();
    const res = await userApi.getUserInfoWithId(
      route.params.id,
      userStore.currentUserToken
    );
    NProgress.done();
    publicUserProfile.firstName = res.data.firstName;
    publicUserProfile.lastName = res.data.lastName;
    publicUserProfile.username = res.data.username;
    publicUserProfile.email = res.data.email;
    publicUserProfile.description = res.data.description;
    publicUserProfile.portfolio = res.data.portfolio;
    publicUserProfile.profilePicture = res.data.profilePicture;
  }
};

onBeforeMount(initPage);

watch(route, () => {
  isPrivateProfile.value = route.params.id === undefined;
  mainStore.setRecruiterPortal(currentUser.value.roles.includes('RECRUITER'));
});
</script>

<template>
  <div
    class="mt-8 px-3 min-[420px]:px-10 sm:px-20 md:px-32 lg:px-40 xl:px-52 2xl:px-72">
    <AppCard class="user-profile px-8 py-8">
      <h1>Profil</h1>
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
      <div class="flex flex-col mt-5" v-if="isPrivateProfile">
        <h3>Password</h3>
        <p>********</p>
      </div>
      <div class="flex flex-col mt-5">
        <h3>Deskripsi</h3>
        <p>
          {{
            (isPrivateProfile ? currentUser : publicUserProfile).description ??
            NO_DESCRIPTION
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
        <p v-if="isUserPortfolioEmpty">
          {{ NO_PORTFOLIO }}
        </p>
      </div>
      <div v-if="isPrivateProfile" class="flex justify-center mt-5">
        <AppButton
          outline
          class="flex items-center py-3"
          @click="userStore.logout">
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
