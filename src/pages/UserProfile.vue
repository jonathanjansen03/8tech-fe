<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import {
  ArrowLeftOnRectangleIcon,
  PencilIcon,
} from '@heroicons/vue/24/outline';

import DefaultUserProfilePicture from '@/assets/images/default-user-profile-picture.png';
import AppCard from '@/components/AppCard.vue';
import AppButton from '@/components/AppButton.vue';

const NO_DESCRIPTION = 'Belum ada deskripsi.';

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const userProfilePicture = computed(
  () => currentUser.profilePicture ?? DefaultUserProfilePicture
);

onMounted(() => {});
</script>

<template>
  <div
    class="mt-8 px-3 min-[420px]:px-10 sm:px-20 md:px-32 lg:px-40 xl:px-52 2xl:px-72"
  >
    <AppCard class="user-profile px-5">
      <h1>Profil</h1>
      <div class="flex justify-center mt-5">
        <img
          :src="userProfilePicture"
          alt="User profile picture."
          class="rounded-full drop-shadow w-36"
        />
      </div>
      <div class="flex justify-between mt-5">
        <div class="flex flex-col">
          <h3>Nama Depan</h3>
          <p>{{ currentUser.firstName }}</p>
        </div>
        <div class="flex flex-col">
          <h3>Nama Belakang</h3>
          <p>{{ currentUser.lastName }}</p>
        </div>
      </div>
      <div class="flex flex-col mt-5">
        <h3>Username</h3>
        <p>{{ currentUser.username }}</p>
      </div>
      <div class="flex flex-col mt-5">
        <h3>Email</h3>
        <p>{{ currentUser.email }}</p>
      </div>
      <div class="flex flex-col mt-5">
        <h3>Password</h3>
        <p>********</p>
      </div>
      <div class="flex flex-col mt-5">
        <h3>Deskripsi</h3>
        <p>{{ currentUser.description ?? NO_DESCRIPTION }}</p>
      </div>
      <div class="flex justify-center mt-5">
        <AppButton
          outline
          class="flex items-center py-3"
          @click="userStore.logout"
        >
          <ArrowLeftOnRectangleIcon class="mr-2 w-5" />
          Keluar
        </AppButton>
        <AppButton class="flex items-center ml-12 py-3">
          <PencilIcon class="mr-2 w-5" />
          Edit profil
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>
