<script setup>
import { RouterView } from 'vue-router';
import { AppFooter, AppNavbar } from '@/data/components';
</script>

<template>
  <AppNavbar class="text-white" />
  <main class="min-h-screen px-5 py-10 sm:px-10">
    <RouterView />
  </main>
  <AppFooter />
</template>
