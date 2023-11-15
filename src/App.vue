<script setup>
import AppNavbar from '@/components/AppNavbar.vue';
import HomePage from '@/pages/HomePage.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>

<template>
  <AppNavbar class="text-white" />
  <main class="min-h-screen">
    <HomePage />
  </main>
  <AppFooter />
</template>
