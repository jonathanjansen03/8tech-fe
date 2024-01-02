<script setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink, useRouter } from 'vue-router';
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import { UserCircleIcon } from '@heroicons/vue/24/solid';

import { useUserStore } from '@/stores/user';
import config from '@/config';
import logo from '@/assets/images/8tech-logo.png';
import AppButton from '@/components/AppButton.vue';
import AppCard from '@/components/AppCard.vue';

const store = useUserStore();
const router = useRouter();
const { currentUser, isLoggedIn, currentUserFullName } = storeToRefs(store);
const { logout } = store;

const isOpen = ref(false);

const toggleNavbar = () => {
  isOpen.value = !isOpen.value;
};

const goToHome = () => {
  router.push(config.pages.home.path);
};

const userFullName = computed(() => {
  if (currentUserFullName.value.length > 12) {
    return `${currentUserFullName.value.slice(0, 12)}...`;
  }
  return currentUserFullName.value;
});
</script>

<template>
  <nav
    class="navbar sticky -top-1 w-full drop-shadow-[0_4px_5px_rgba(0,0,0,0.5)] z-10"
  >
    <!-- mobile navbar -->
    <div class="mobile-navbar md:hidden">
      <div class="bg-zinc-800 flex items-center justify-between px-5 py-5">
        <img
          :src="logo"
          alt="Logo"
          class="cursor-pointer h-auto w-36"
          @click="goToHome"
        />
        <Bars3Icon
          v-show="!isOpen"
          @click="toggleNavbar"
          class="cursor-pointer w-10"
        />
        <XMarkIcon
          v-show="isOpen"
          @click="toggleNavbar"
          class="cursor-pointer w-10"
        />
      </div>
      <div class="duration-500 overflow-x-clip relative">
        <div
          class="navbar__links absolute bg-zinc-900 flex flex-col gap-8 min-h-screen items-end px-5 py-5 w-52 duration-500 z-10"
          :class="isOpen ? 'right-0' : '-right-52'"
        >
          <RouterLink :to="{ name: config.pages.home.name }" class="mt-5">
            Beranda
          </RouterLink>
          <RouterLink to="/">Cari Pekerjaan</RouterLink>
          <RouterLink :to="{ name: config.pages.about.name }">
            Tentang Kami
          </RouterLink>
          <RouterLink :to="{ name: config.pages.login.name }">
            <AppButton> Masuk </AppButton>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- non-mobile navbar -->
    <div class="max-md:hidden">
      <div class="bg-zinc-800 flex items-center justify-around py-3 w-full">
        <img
          :src="logo"
          alt="Logo"
          class="cursor-pointer h-auto w-36"
          @click="goToHome"
        />
        <div
          class="navbar__links flex gap-x-16 lg:gap-x-40 items-center justify-center w-8/12"
        >
          <RouterLink
            to="/"
            class="text-md transition duration-300 hover:text-blue-600 after:absolute after:content-[''] after:w-0 after:h-[3px] after:block after:transition-all after:duration-300 after:bottom-1/4 hover:after:w-[4rem] hover:after:h-[3px] hover:after:bg-blue-600"
          >
            Beranda
          </RouterLink>
          <RouterLink
            to="/"
            class="text-md transition duration-300 hover:text-blue-600 after:absolute after:content-[''] after:w-0 after:h-[3px] after:block after:transition-all after:duration-300 after:bottom-1/4 hover:after:w-[6.8rem] hover:after:h-[3px] hover:after:bg-blue-600"
          >
            Cari Pekerjaan
          </RouterLink>
          <RouterLink
            :to="{ name: config.pages.about.name }"
            class="text-md transition duration-300 hover:text-blue-600 after:absolute after:content-[''] after:w-0 after:h-[3px] after:block after:transition-all after:duration-300 after:bottom-1/4 hover:after:w-[6.5rem] hover:after:h-[3px] hover:after:bg-blue-600"
          >
            Tentang Kami
          </RouterLink>
        </div>
        <div>
          <RouterLink
            :to="{ name: config.pages.login.name }"
            v-if="!isLoggedIn"
          >
            <AppButton>Masuk</AppButton>
          </RouterLink>
          <div v-if="isLoggedIn" class="cursor-pointer peer relative">
            <div class="cursor-pointer flex items-center p-4 peer">
              <UserCircleIcon class="mr-2 w-8" />
              <span>{{ userFullName }}</span>
            </div>
            <AppCard
              class="absolute invisible duration-300 left-4 opacity-0 top-14 transition w-36 hover:opacity-100 hover:visible peer-hover:opacity-100 peer-hover:visible"
            >
              <RouterLink
                :to="{ name: config.pages.profile.name }"
                class="flex text-black hover:text-blue-800"
              >
                <UserIcon class="mr-2 w-5" />
                Lihat profil
              </RouterLink>
              <span
                class="flex mt-2 text-black hover:text-blue-800"
                @click="logout"
              >
                <ArrowLeftOnRectangleIcon class="mr-2 w-5" />
                Keluar
              </span>
            </AppCard>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
