<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import NProgress from 'nprogress';
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';

import { useUserStore } from '@/stores/user';
import { useJobStore } from '@/stores/job';
import { useContractStore } from '@/stores/contract';
import config from '@/config/';
import defaultUserProfilePicture from '@/assets/images/default-user-profile-picture.png';

import AppCard from '@/components/AppCard.vue';
import AppButton from '@/components/AppButton.vue';
import AppTicker from '@/components/AppTicker.vue';

const GET_JOB_DETAIL = 'mendapatkan detail pekerjaan';
const APPLY_JOB = 'melamar pekerjaan';
const SUCCESS_APPLY_JOB = 'Berhasil melamar pekerjaan!';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const jobStore = useJobStore();
const contractStore = useContractStore();
const { currentUserToken, isLoggedIn } = storeToRefs(userStore);
const { findJob, applyJob } = jobStore;
const { job } = storeToRefs(jobStore);
const { setContract } = contractStore;

const isLoading = ref(false);
const isError = ref(false);
const errorMessage = ref('');

const isInvisibleApplyButton = computed(() => !!route.query.ref);

const initPage = async () => {
  NProgress.start();
  try {
    await findJob(route.params.id);
  } catch (err) {
    console.error(err);
    alert(config.errors.general(GET_JOB_DETAIL));
  }
  NProgress.done();
};

const doApplyJob = async () => {
  if (!isLoggedIn.value) {
    goToLoginPage();
    return;
  }

  isLoading.value = true;
  try {
    const contract = await applyJob(route.params.id, currentUserToken.value);
    handleSuccessfulApplyJob(contract);
  } catch (err) {
    handleFailedApplyJob(err);
  }
  isLoading.value = false;
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

const goToCompanyProfile = () => {
  router.push({
    name: config.pages.companyProfile.name,
    params: { id: job.value.company.id },
  });
};

const goToLoginPage = () => {
  router.push(config.pages.login.path);
};

onBeforeMount(initPage);
</script>

<template>
  <div>
    <AppCard class="px-5">
      <div class="flex flex-col">
        <h1 class="flex items-center">
          <ChevronLeftIcon class="cursor-pointer mr-3 stroke-2 w-6" @click="router.back" />
          Detail Pekerjaan
        </h1>
        <div class="mt-5 px-24">
          <div class="items-center flex mt-5">
            <img
              :src="job.company?.profilePicture || defaultUserProfilePicture"
              alt="Company profile picture"
              class="drop-shadow-md rounded-full w-36" />
            <div class="ml-10">
              <h2>{{ job.title }}</h2>
              <p
                class="cursor-pointer mt-3 text-gray-500 w-fit hover:text-blue-800"
                @click="goToCompanyProfile">
                {{ job.company?.name }}
              </p>
            </div>
          </div>
          <h2 class="mt-10">Deskripsi pekerjaan:</h2>
          <p class="mt-5 break-all">{{ job.description }}</p>
        </div>
        <AppTicker
          :message="errorMessage"
          type="error"
          v-if="isError"
          class="mt-10" />
        <AppButton
          v-if="!isInvisibleApplyButton"
          class="mt-10"
          @click="doApplyJob">
          Lamar Pekerjaan
          <img
            v-if="isLoading"
            alt="loading"
            class="h-6 ml-1"
            src="@/assets/images/loading.svg" />
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>
