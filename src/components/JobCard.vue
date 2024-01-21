<script setup>
import { computed } from 'vue';
import AppCard from '@/components/AppCard.vue';
import defaultUserProfilePicture from '@/assets/images/default-user-profile-picture.png';

const props = defineProps({
  job: Object,
});

const jobTitle = computed(() => {
  if (props.job.title.length > 42) {
    return `${props.job.title.slice(0, 42)}...`;
  }
  return props.job.title;
});
</script>

<template>
  <AppCard
    class="cursor-pointer items-center h-44 mt-6 min-[420px]:px-5 min-[420px]:py-4 flex hover:drop-shadow-[0_8px_8px_rgba(0,0,0,0.25)] transition duration-300">
    <div
      class="job-card cursor-pointer items-center flex flex-col min-[420px]:gap-x-8 min-[420px]:flex-row">
      <img
        :src="props.job.company.profilePicture || defaultUserProfilePicture"
        alt="Company logo"
        class="rounded-xl h-16" />
      <div class="job-card__details mt-3 md:mt-1">
        <p
          class="break-all font-bold text-ellipsis max-[420px]:text-center min-[420px]:text-[1.25rem]">
          {{ jobTitle }}
        </p>
        <p
          class="font-bold max-[420px]:text-center min-[420px]:text-[1rem] text-gray-500">
          {{ props.job.company.name }}
        </p>
      </div>
    </div>
  </AppCard>
</template>
