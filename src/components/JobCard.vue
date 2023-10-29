<script setup>
import { MapPinIcon } from '@heroicons/vue/24/outline';

const props = defineProps(['job']);
</script>

<template>
  <div
    class="job-card items-center bg-white drop-shadow flex flex-col mt-6 px-3 py-5 rounded-xl min-[420px]:gap-x-8 min-[420px]:flex-row min-[420px]:px-5 min-[420px]:py-4"
  >
    <img :src="props.job.logo" alt="Logo" class="rounded-xl h-16" />
    <div class="job-card__details mt-3 md:mt-1">
      <h4>{{ props.job.title }}</h4>
      <h5>{{ props.job.company }}</h5>
      <div class="job-card__location flex mt-2">
        <MapPinIcon class="text-gray-400 w-5" />
        <p class="ml-1 text-gray-400">{{ props.job.location }}</p>
      </div>
    </div>
  </div>
</template>
