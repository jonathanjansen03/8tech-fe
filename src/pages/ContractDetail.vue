<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';
import NProgress from 'nprogress';

import config from '@/config';
import { contractStore, userStore } from '@/data/stores';
import { AppButton, AppCard } from '@/data/components';

const GET_CONTRACT_DETAIL = 'mendapatkan detail kontrak';
const ACCEPT_CONTRACT = 'menerima kontrak';
const REJECT_CONTRACT = 'menolak kontrak';
const ALREADY_PAID = 'ALREADY_PAID';

const route = useRoute();
const router = useRouter();

const { currentUserToken } = storeToRefs(userStore);

const {
  contract,
  contractCustomFields,
  payout,
  isContractCompleted,
  isContractPaid,
} = storeToRefs(contractStore);
const { fetchContract, updateContract, rejectContract, getContractPayoutLink } =
  contractStore;

const isLoading = ref(false);

const initPage = async () => {
  NProgress.start();
  try {
    await fetchContract(route.params.id, currentUserToken.value);

    if (isContractCompleted.value && isContractPaid.value) {
      await getContractPayoutLink(route.params.id, currentUserToken.value);
    }
  } catch (err) {
    if (err.message.payment !== ALREADY_PAID) {
      handleError(err, GET_CONTRACT_DETAIL);
    }
  }
  NProgress.done();
};

const capitalizeEveryWord = (str) => {
  const words = str.split(' ');
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join(' ');
};

const doAcceptContract = async () => {
  try {
    await updateContract(
      {
        id: route.params.id,
        status: config.constants.contractStatus.ongoing,
      },
      currentUserToken.value
    );
    goToAppliedJobsPage();
  } catch (err) {
    handleError(err, ACCEPT_CONTRACT);
  }
};

const doRejectContract = async () => {
  NProgress.start();
  try {
    await rejectContract(route.params.id, currentUserToken.value);
    goToAppliedJobsPage();
  } catch (err) {
    handleError(err, REJECT_CONTRACT);
  }
  NProgress.done();
};

const goToAppliedJobsPage = () => {
  router.push({
    name: config.pages.appliedJobs.name,
  });
};

const handleError = (err, message) => {
  console.error(err);
  alert(config.errors.general(message));
};

const goToPayoutLink = () => {
  isLoading.value = true;
  window.open(payout.value.payoutUrl, '_blank');
  isLoading.value = false;
};

const goToPdf = (id) => {
  isLoading.value = true;
  window.open(config.api.basePath + config.api.contract.download(id), '_blank');
  isLoading.value = false;
};

onBeforeMount(initPage);
</script>

<template>
  <div class="sm:px-20">
    <div>
      <AppCard class="px-5">
        <div class="flex flex-col">
          <h1 class="flex items-center">
            <ChevronLeftIcon
              class="cursor-pointer mr-3 stroke-2 w-6"
              @click="router.back" />
            Detail Kontrak
          </h1>

          <div class="flex flex-col mt-8">
            <h3>Judul Kontrak</h3>
            <p class="break-all">{{ contract.title }}</p>
          </div>
          <div class="flex flex-col mt-8">
            <h3>Deskripsi Kontrak</h3>
            <p class="break-all">{{ contract.description }}</p>
          </div>
          <div
            v-for="(value, key, index) in contractCustomFields"
            :key="index"
            class="flex flex-col mt-8">
            <h3>{{ capitalizeEveryWord(key) }}</h3>
            <p class="break-all">{{ value }}</p>
          </div>
          <div class="flex flex-col mt-8">
            <h3>Nominal Pembayaran</h3>
            <p>Rp{{ contract.paymentRate }}</p>
          </div>
          <div
            v-if="contract.status === config.constants.contractStatus.accepted"
            class="flex gap-x-5">
            <AppButton class="mt-12 w-1/2" @click="doAcceptContract">
              Terima kontrak
              <img
                v-if="isLoading"
                alt="loading"
                class="h-6"
                src="@/assets/images/loading.svg" />
            </AppButton>
            <AppButton
              type="danger"
              class="mt-12 w-1/2"
              @click="doRejectContract">
              Tolak kontrak
              <img
                v-if="isLoading"
                alt="loading"
                class="h-6"
                src="@/assets/images/loading.svg" />
            </AppButton>
          </div>
          <AppButton
            v-if="
              isContractCompleted &&
              isContractPaid &&
              Object.keys(payout).length
            "
            class="mt-8"
            @click="goToPayoutLink">
            Terima pembayaran
            <img
              v-if="isLoading"
              alt="loading"
              class="h-6"
              src="@/assets/images/loading.svg" />
          </AppButton>
          <AppButton class="mt-8" outline @click="goToPdf(route.params.id)">
            Unduh PDF kontrak
            <img
              v-if="isLoading"
              alt="loading"
              class="h-6"
              src="@/assets/images/loading.svg" />
          </AppButton>
        </div>
      </AppCard>
    </div>
  </div>
</template>
