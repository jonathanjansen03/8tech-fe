import { defineStore } from 'pinia';
import { ref } from 'vue';

import jobApi from '@/api/job';

export const useJobStore = defineStore('job', () => {
  const job = ref({});
  const jobList = ref([]);
  const jobListPagination = ref({});
  const jobApplicants = ref([]);
  const jobApplicantsPagination = ref({});

  const findJob = async (id) => {
    const res = await jobApi.findOne(id);

    job.value = Object.assign({}, res.data);
  };

  const createJob = async (data, token) => {
    await jobApi.create(data, token);
  };

  const updateJob = async (data, token) => {
    await jobApi.update(data, token);
  };

  const searchJobs = async (data, token) => {
    const res = await jobApi.search(data, token);

    jobList.value = res.data.data.slice(0);
    jobListPagination.value = {
      totalPage: res.data.totalPages,
      hasNext: res.data.hasNext,
      hasPrevious: res.data.hasPrevious,
    };
  };

  const applyJob = async (id, token) => {
    const res = await jobApi.apply(id, token);

    return res.data;
  };

  const getApplicants = async (id, data, token) => {
    const res = await jobApi.applicant(id, data, token);

    jobApplicants.value = res.data.data.slice(0);
    jobApplicantsPagination.value = {
      totalPages: res.data.totalPages,
      hasNext: res.data.hasNext,
      hasPrevious: res.data.hasPrevious,
    };
  };

  return {
    job,
    jobList,
    jobListPagination,
    jobApplicants,
    jobApplicantsPagination,
    findJob,
    createJob,
    updateJob,
    searchJobs,
    applyJob,
    getApplicants,
  };
});
