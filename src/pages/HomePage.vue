<script setup>
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/stores/user';
import { useJobStore } from '@/stores/job';
import config from '@/config';
import SearchBar from '@/components/SearchBar.vue';
import JobCard from '@/components/JobCard.vue';

const router = useRouter();
const userStore = useUserStore();
const jobStore = useJobStore();

const { currentUserToken } = storeToRefs(userStore);
const { jobList } = storeToRefs(jobStore);
const { searchJobs } = jobStore;

const goToJobDetail = (id) => {
  router.push({
    name: config.pages.jobDetail.name,
    params: { id },
  });
};

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
        <div v-for="(job, index) in jobList" :key="index">
          <JobCard :job="job" @click="goToJobDetail(job.id)" />
        </div>
        <div v-if="!jobList.length">
          <p class="mt-8 text-white">Belum ada pekerjaan.</p>
        </div>
      </div>
    </div>
  </div>
</template>
