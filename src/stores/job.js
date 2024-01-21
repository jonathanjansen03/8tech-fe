import { defineStore } from 'pinia';
import { ref } from 'vue';

import jobApi from '@/api/job';

export const useJobStore = defineStore('job', () => {
  const job = ref({});
  const jobList = ref([]);
  const jobApplicants = ref([]);
  const jobApplicantsTotalPages = ref(0);

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

  const getApplicants = async (id, data, token) => {
    const res = await jobApi.applicant(id, data, token);

    jobApplicants.value = res.data.data ? res.data.data.slice(0) : [];
    jobApplicantsTotalPages.value = res.data.totalPages;

    return {
      data: res.data.data,
      hasNext: res.data.hasNext,
      hasPrev: res.data.hasPrevious,
    };
  };

  return {
    jobList,
    job,
    jobApplicants,
    jobApplicantsTotalPages,
    searchJobs,
    findJob,
    applyJob,
    getApplicants,
  };
});
