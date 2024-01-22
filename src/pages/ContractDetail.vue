<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';

import { useUserStore } from '@/stores/user';
import { useContractStore } from '@/stores/contract';
import config from '@/config';

import AppCard from '@/components/AppCard.vue';
import AppButton from '@/components/AppButton.vue';

const GET_CONTRACT_DETAIL = 'mendapatkan detail kontrak';
const ACCEPT_CONTRACT = 'menerima kontrak';
const REJECT_CONTRACT = 'menolak kontrak';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const contractStore = useContractStore();

const { currentUserToken } = storeToRefs(userStore);

const { contract, contractCustomFields } = storeToRefs(contractStore);
const { fetchContract, updateContract, rejectContract } = contractStore;

const isLoading = ref(false);

const initPage = async () => {
  try {
    await fetchContract(route.params.id, currentUserToken.value);
  } catch (err) {
    console.error(err);
    alert(config.errors.general(GET_CONTRACT_DETAIL));
  }
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
        ...contract.value,
        status: config.constants.contractStatus.ongoing,
      },
      currentUserToken.value
    );
  } catch (err) {
    console.error(err);
    alert(config.errors.general(ACCEPT_CONTRACT));
  }
};

const doRejectContract = async () => {
  try {
    await rejectContract(route.params.id, currentUserToken.value);
  } catch (err) {
    console.error(err);
    alert(config.errors.general(REJECT_CONTRACT));
  }
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
      <AppCard
        class="px-5"
        @click="console.log(contract, contractCustomFields)">
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
            <p>{{ contract.paymentRate }}</p>
          </div>
          <div v-if="contract.status === config.constants.contractStatus.accepted" class="flex gap-x-5">
            <AppButton class="mt-12 w-1/2" @click="doAcceptContract">
              Terima Kontrak
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
              Tolak Kontrak
              <img
                v-if="isLoading"
                alt="loading"
                class="h-6"
                src="@/assets/images/loading.svg" />
            </AppButton>
          </div>
          <AppButton class="mt-8" outline @click="goToPdf(route.params.id)">
            Unduh PDF Kontrak
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
