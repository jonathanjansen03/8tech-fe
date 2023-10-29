<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import config from '@/config';

import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import AppButton from '@/components/AppButton.vue';
import logo from '@/assets/8tech-logo.png';

const router = useRouter();
const isOpen = ref(false);

const toggleNavbar = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <nav
    class="navbar sticky -top-1 w-full drop-shadow-[0_4px_5px_rgba(0,0,0,0.5)] z-10"
  >
    <!-- mobile navbar -->
    <div class="bg-zinc-800 flex items-center justify-between px-5 py-5">
      <img
        :src="logo"
        alt="Logo"
        class="cursor-pointer h-auto w-36"
        @click="router.push(config.pages.home)"
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
        <AppButton>Daftar</AppButton>
      </div>
    </div>
  </nav>
</template>
