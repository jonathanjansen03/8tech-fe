import { defineStore } from 'pinia';
import { ref } from 'vue';

import jobApi from '@/api/job';

export const useJobStore = defineStore('job', () => {
  const jobList = ref([]);
  const job = ref({});

  const searchJobs = async (data, token) => {
    const res = await jobApi.search(data, token);

    jobList.value = res.data.data.slice(0);
  };

  const findJob = async (id) => {
    const res = await jobApi.findOne(id);

    job.value = Object.assign({}, res.data);
  };

  const applyJob = async (id, token) => {
    const res = await jobApi.apply(id, token);

    return res.data;
  };

  return {
    jobList,
    job,
    searchJobs,
    findJob,
    applyJob,
  };
});
