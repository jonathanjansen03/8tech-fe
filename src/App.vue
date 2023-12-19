<script setup>
import { RouterView } from 'vue-router';

import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>

<template>
  <AppNavbar class="text-white" />
  <main class="min-h-screen px-5 py-10 sm:px-10">
    <RouterView />
  </main>
  <AppFooter />
</template>
