<script setup>
import { MapPinIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  job: Object,
});
</script>

<template>
  <div
    class="job-card cursor-pointer items-center bg-white shadow-md flex flex-col mt-6 px-3 py-5 rounded-xl min-[420px]:gap-x-8 min-[420px]:flex-row min-[420px]:px-5 min-[420px]:py-4"
  >
    <img :src="props.job.logo" alt="Company logo" class="rounded-xl h-16" />
    <div class="job-card__details mt-3 md:mt-1">
      <p
        class="font-bold text-ellipsis max-[420px]:text-center min-[420px]:text-[1.25rem]"
      >
        {{ props.job.title }}
      </p>
      <p class="font-bold max-[420px]:text-center min-[420px]:text-[1rem]">
        {{ props.job.company }}
      </p>
      <div class="job-card__location flex mt-2">
        <MapPinIcon class="text-gray-400 w-5" />
        <p class="ml-2 text-gray-400">{{ props.job.location }}</p>
      </div>
    </div>
  </div>
</template>
