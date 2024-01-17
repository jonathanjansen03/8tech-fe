<script setup>
import { onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/stores/user';
import { useJobStore } from '@/stores/job';
import config from '@/config';
import SearchBar from '@/components/SearchBar.vue';
import JobCard from '@/components/JobCard.vue';
import { useRouter } from 'vue-router';
const { currentUserToken } = storeToRefs(useUserStore());
const jobStore = useJobStore();
const { jobList } = storeToRefs(jobStore);
const { searchJobs } = jobStore;

const router = useRouter();

onBeforeMount(async () => {
  JSON.parse(localStorage.getItem('userData'))?.roles?.includes('RECRUITER') &&
    router.push('/portal');
  await searchJobs(
    {
      page: 1,
      size: config.api.defaultPageSize,
    },
    currentUserToken.value
  );
});
</script>

<template>
  <div class="sm:px-20">
    <div>
      <h1 class="text-center font-bold mb-8 text-white text-2xl">
        Ketika Tech Talent Bertemu dengan Peluang Tak Terbatas.
      </h1>
      <SearchBar class="mt-5" />
      <p class="text-xl mt-10 text-white">Lowongan kerja terbaru:</p>
      <div
        class="home__job-cards md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-3 xl:grid-cols-3">
        <div v-for="(i, index) in jobList" :key="index">
          <JobCard :job="i" />
        </div>
        <div v-if="!jobList.length">
          <p class="mt-8 text-white">Belum ada pekerjaan.</p>
        </div>
      </div>
    </div>
  </div>
</template>
