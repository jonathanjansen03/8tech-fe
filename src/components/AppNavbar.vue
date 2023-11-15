<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

import config from '@/config';
import logo from '@/assets/8tech-logo.png';
import AppButton from '@/components/AppButton.vue';

import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const isOpen = ref(false);

const toggleNavbar = () => {
  isOpen.value = !isOpen.value;
};

const goToHome = () => {
  console.log('test');
  router.push(config.pages.home);
  console.log('test2');
};
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
          <RouterLink to="/" class="mt-5">Home</RouterLink>
          <RouterLink to="/">Cari Pekerjaan</RouterLink>
          <RouterLink to="/about">Tentang Kami</RouterLink>
          <AppButton>Masuk</AppButton>
        </div>
      </div>
    </div>

    <!-- non-mobile navbar -->
    <div class="non-mobile-navbar max-md:hidden">
      <div class="bg-zinc-800 flex items-center px-5 py-5">
        <img
          :src="logo"
          alt="Logo"
          class="cursor-pointer h-auto w-36"
          @click="goToHome"
        />
        <div
          class="navbar__links flex gap-x-16 lg:gap-x-40 items-center justify-center w-full"
        >
          <RouterLink
            to="/"
            class="text-lg transition duration-300 hover:text-blue-600 after:absolute after:content-[''] after:w-0 after:h-[1px] after:block after:transition-all after:duration-300 after:bottom-1/4 hover:after:w-[3.3rem] hover:after:h-[1px] hover:after:bg-blue-600"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/"
            class="text-lg transition duration-300 hover:text-blue-600 after:absolute after:content-[''] after:w-0 after:h-[1px] after:block after:transition-all after:duration-300 after:bottom-1/4 hover:after:w-[7.75rem] hover:after:h-[1px] hover:after:bg-blue-600"
          >
            Cari Pekerjaan
          </RouterLink>
          <RouterLink
            to="/about"
            class="text-lg transition duration-300 hover:text-blue-600 after:absolute after:content-[''] after:w-0 after:h-[1px] after:block after:transition-all after:duration-300 after:bottom-1/4 hover:after:w-[7.35rem] hover:after:h-[1px] hover:after:bg-blue-600"
          >
            Tentang Kami
          </RouterLink>
        </div>
        <AppButton>Masuk</AppButton>
      </div>
    </div>
  </nav>
</template>
