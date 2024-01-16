import { defineStore } from 'pinia';
import { ref } from 'vue';

import jobApi from '@/api/job';

export const useJobStore = defineStore('job', () => {
  const jobList = ref([]);

  const searchJobs = async (data, token) => {
    const res = await jobApi.search(data, token);

    jobList.value = res.data.data.slice(0);
  };

  return {
    jobList,
    searchJobs,
  };
});
