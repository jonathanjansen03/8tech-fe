<script setup>
import { computed } from 'vue';
import AppButton from '@/components/AppButton.vue';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/vue/24/outline';

const isMobile = computed(() => window.innerWidth < 768);
</script>

<template>
  <div v-if="!isMobile" class="bg-white flex relative rounded-2xl w-72">
    <div class="w-full">
      <MagnifyingGlassIcon
        class="search-bar__job-name absolute left-3 text-gray-800 top-4 w-5"
      />
      <input
        type="text"
        class="flex-1 px-10 py-3 rounded-2xl"
        placeholder="Cari pekerjaan"
      />
    </div>
    <div class="w-full">
      <input
        type="text"
        class="flex-1 px-10 py-3"
        placeholder="Cari pekerjaan"
      />
    </div>
    <!-- <AppButton class="absolute right-1.5 top-1.5">Cari</AppButton> -->
  </div>

  <div
    v-if="isMobile"
    class="flex flex-col items-center mt-5 relative rounded-2xl text-center w-full -z-10"
  >
    <div class="w-full">
      <MagnifyingGlassIcon
        class="search-bar__job-name absolute left-3 text-gray-400 top-[0.9rem] w-5"
      />
      <input
        type="text"
        class="flex-1 px-10 py-3 rounded-2xl w-full"
        placeholder="Cari pekerjaan"
      />
    </div>
    <div class="mt-3 w-full">
      <MapPinIcon
        class="search-bar__job-name absolute left-3 text-gray-400 top-[4.6rem] w-5"
      />
      <input
        type="text"
        class="flex-1 px-10 py-3 rounded-2xl w-full"
        placeholder="Cari pekerjaan"
      />
    </div>
    <AppButton class="mt-3 w-32 py-2">Cari</AppButton>
  </div>
</template>
