<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

import AppButton from '@/components/AppButton.vue';
</script>

<template>
  <div
    class="flex flex-col items-center mt-5 relative text-center w-full md:flex-row"
  >
    <div class="w-full">
      <MagnifyingGlassIcon
        class="search-bar__job-name absolute left-3 text-gray-400 top-[0.9rem] w-5 md:top-4"
      />
      <input
        type="text"
        class="flex-1 px-10 py-3 rounded-xl w-full"
        placeholder="Cari pekerjaan"
      />
    </div>
    <AppButton
      class="max-md:mt-2 max-md:w-32 max-md:py-2 md:absolute md:right-1.5 md:top-1.3"
    >
      Cari
    </AppButton>
  </div>
</template>
