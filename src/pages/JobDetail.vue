<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/stores/user.js';
import { useJobStore } from '@/stores/job';
import { useContractStore } from '@/stores/contract.js';
import config from '@/config/index.js';
import AppCard from '@/components/AppCard.vue';
import AppButton from '@/components/AppButton.vue';
import AppTicker from '@/components/AppTicker.vue';
import defaultUserProfilePicture from '@/assets/images/default-user-profile-picture.png';

const GET_JOB_DETAIL = 'mendapatkan detail pekerjaan';
const APPLY_JOB = 'melamar pekerjaan';
const SUCCESS_APPLY_JOB = 'Berhasil melamar pekerjaan!';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const jobStore = useJobStore();
const contractStore = useContractStore();
const { currentUserToken } = storeToRefs(userStore);
const { findJob, applyJob } = jobStore;
const { job } = storeToRefs(jobStore);
const { setContract } = contractStore;

const isError = ref(false);
const errorMessage = ref('');

const doApplyJob = async () => {
  try {
    const contract = await applyJob(route.params.id, currentUserToken.value);
    handleSuccessfulApplyJob(contract);
  } catch (err) {
    handleFailedApplyJob(err);
  }
};

const handleSuccessfulApplyJob = (contract) => {
  setContract(contract);
  isError.value = false;
  alert(SUCCESS_APPLY_JOB);
  router.push(config.pages.home.path);
};

const handleFailedApplyJob = (err) => {
  isError.value = true;

  if (err.message && err.message.jobId) {
    errorMessage.value = config.errors[err.message.jobId];
  } else {
    errorMessage.value = config.errors.general(APPLY_JOB);
  }
};

onBeforeMount(async () => {
  try {
    await findJob(route.params.id);
  } catch (err) {
    console.log(err);
    alert(config.errors.general(GET_JOB_DETAIL));
  }
});
</script>

<template>
  <div>
    <AppCard class="px-5">
      <div class="flex flex-col">
        <h1>Detail Pekerjaan</h1>
        <div class="mt-5 px-24">
          <div class="items-center flex mt-5">
            <img
              :src="job.company?.profilePicture || defaultUserProfilePicture"
              alt="Company profile picture"
              class="drop-shadow-md rounded-full w-36" />
            <div class="ml-10">
              <h2>{{ job.title }}</h2>
              <p class="mt-3 text-gray-500">{{ job.company?.name }}</p>
            </div>
          </div>
          <h2 class="mt-10">Deskripsi pekerjaan:</h2>
          <p class="mt-5 break-all">{{ job.description }}</p>
        </div>
        <AppTicker :message="errorMessage" type="error" v-if="isError" class="mt-10" />
        <AppButton class="mt-10" @click="doApplyJob">Lamar Pekerjaan</AppButton>
      </div>
    </AppCard>
  </div>
</template>
