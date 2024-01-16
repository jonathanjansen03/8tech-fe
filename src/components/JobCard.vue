<script setup>
import { MapPinIcon } from '@heroicons/vue/24/outline';

import AppCard from '@/components/AppCard.vue';
import defaultUserProfilePicture from '@/assets/images/default-user-profile-picture.png';

const props = defineProps({
  job: Object,
});
</script>

<template>
  <AppCard
    class="items-center h-44 mt-6 min-[420px]:px-5 min-[420px]:py-4 flex">
    <div
      class="job-card cursor-pointer items-center flex flex-col min-[420px]:gap-x-8 min-[420px]:flex-row">
      <img
        :src="props.job.logo || defaultUserProfilePicture"
        alt="Company logo"
        class="rounded-xl h-16" />
      <div class="job-card__details mt-3 md:mt-1">
        <p
          class="font-bold text-ellipsis max-[420px]:text-center min-[420px]:text-[1.25rem]">
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
  </AppCard>
</template>
