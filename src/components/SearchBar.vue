<script setup>
import { computed } from 'vue';
import AppButton from '@/components/AppButton.vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

const isMobile = computed(() => window.innerWidth < 768);
</script>

<template>
  <!-- <div v-if="!isMobile" class="flex relative rounded-2xl w-full">
    <div class="w-full">
      <MagnifyingGlassIcon
        class="search-bar__job-name absolute left-3 text-gray-800 top-4 w-5"
      />
      <input
        type="text"
        class="flex-1 px-10 py-3 rounded-2xl w-full"
        placeholder="Cari pekerjaan"
      />
    </div>
    <AppButton class="absolute right-1.5 top-1.5">Cari</AppButton>
  </div> -->

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
      class="max-md:mt-2 max-md:w-32 max-md:py-2 md:absolute md:right-1.5 md:top-1.5"
    >
      Cari
    </AppButton>
  </div>
</template>
