<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import NProgress from 'nprogress';

import config from '@/config';
import validationUtil from '@/utils/validation';
import contractTemplate from '@/assets/docs/contractTemplate.json';
import { contractStore, userStore } from '@/data/stores';
import { AppButton, AppCard, InputBox } from '@/data/components';

const RATE_FREELANCER = 'memberikan penilaian';

const route = useRoute();
const router = useRouter();

const { currentUser, currentUserToken } = storeToRefs(userStore);

const { contract, isContractEditable, isContractCompleted, isContractRated } =
  storeToRefs(contractStore);
const { fetchContract, recruiterRejectContract, rateFreelancer } =
  contractStore;

const formData = reactive({
  title: '',
  description: '',
  details: '',
  paymentRate: 0,
});
const errors = reactive({
  title: '',
  description: '',
  details: '',
  paymentRate: '',
});
const isLoading = ref(false);
const isUpdating = ref(false);
const isPaying = ref(false);
const statusOngoing = ref(false);
const template = ref('');
const freelancerRating = ref(1);
const isRecruiterAgreeingToPayFreelancer = ref(false);

const canRejectContract = computed(
  () => isUpdating.value && !statusOngoing.value && !isContractCompleted.value
);

const initPage = async () => {
  NProgress.start();
  isUpdating.value = route.query.update === 'true';
  await fetchContract(route.params.id, currentUserToken.value);
  formData.paymentRate = contractStore.contract?.paymentRate;
  formData.title = contractStore.contract?.title;
  formData.description = contractStore.contract?.description;
  statusOngoing.value =
    contractStore.contract?.status === config.constants.contractStatus.ongoing;

  formData.details = contractStore.contract?.customField
    ?.split(';')
    .map((fieldList) => {
      const [key, value] = fieldList.split('=');
      if (key === 'details') {
        return value;
      }
    });

  template.value = contractTemplate.default;
  NProgress.done();
};

const validateField = (field) => {
  if (!formData[field]) {
    return;
  }

  if (!validationUtil.form(field, formData[field])) {
    errors[field] = config.errors.form[field];
  } else {
    errors[field] = '';
  }
};

const validateFormData = () => {
  let isFormValid = true;

  for (const key in formData) {
    if (!formData[key]) {
      errors[key] = config.errors.form.required;
      isFormValid = false;
      continue;
    }

    if (isNaN(formData.paymentRate)) {
      errors.paymentRate = config.errors.form.paymentRateNumber;
      isFormValid = false;
      continue;
    }

    if (formData.paymentRate < 10000) {
      errors.paymentRate = config.errors.form.paymentRateMin;
      isFormValid = false;
      continue;
    }

    if (!validationUtil.form(key, formData[key])) {
      errors[key] = config.errors.form[key];
      isFormValid = false;
    }
  }
  return isFormValid;
};

const handleSuccess = () => {
  router.push(config.pages.contractList.path);
};

const handleFail = (error) => {
  if (error.statusCode === 500) {
    alert(config.errors.server);
    return;
  }

  for (const key in error.message) {
    errors[key] = error.message[key];
  }
};

const doUpdateContract = async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  if (!validateFormData()) {
    isLoading.value = false;
    return;
  }

  try {
    await contractStore.updateContract(
      {
        title: formData.title,
        description: formData.description,
        paymentRate: parseInt(formData.paymentRate),
        customField: 'details=' + formData.details,
        id: route.params.id,
        status: config.constants.contractStatus.accepted,
        template: template.value,
      },
      currentUserToken.value
    );
    handleSuccess();
    isLoading.value = false;
  } catch (err) {
    handleFail(err);
    isLoading.value = false;
  }
};

const rejectContract = async () => {
  isLoading.value = true;
  await recruiterRejectContract(route.params.id, currentUserToken.value);
  isLoading.value = false;
  router.back();
};

const goToPdf = (id) => {
  isLoading.value = true;
  window.open(config.api.basePath + config.api.contract.download(id), '_blank');
  isLoading.value = false;
};

const pay = async (id) => {
  isPaying.value = true;
  const url = await contractStore.recruiterPayContract(
    id,
    currentUserToken.value
  );
  window.open(url, '_self');
  await contractStore.updateContract(
    {
      status: config.constants.contractStatus.completed,
    },
    currentUserToken.value
  );
  isPaying.value = false;
};

const doRateFreelancer = async () => {
  try {
    await rateFreelancer(
      {
        userId: contract.value.userId,
        recruiterUserId: currentUser.value.id,
        ratingOf10: parseInt(freelancerRating.value),
        contractId: contract.value.id,
      },
      currentUserToken.value
    );
    handleSuccess();
  } catch (err) {
    handleFail(err, RATE_FREELANCER);
  }
};

onMounted(initPage);
</script>

<template>
  <div class="sm:px-20">
    <div>
      <AppCard class="px-5">
        <div class="flex flex-col">
          <h1 v-if="!isUpdating">Buat Kontrak</h1>
          <h1 v-else>Detail Kontrak</h1>
          <InputBox
            id="create-contract-title"
            v-model="formData.title"
            :error="errors.title"
            class="mt-8 w-full"
            label="Judul Kontrak"
            type="text"
            :disabled="!isContractEditable"
            @blur="validateField('title')" />
          <InputBox
            id="create-contract-description"
            v-model="formData.description"
            :error="errors.description"
            class="mt-8 w-full"
            label="Deskripsi Kontrak"
            text-area
            text-area-height="h-40"
            :disabled="!isContractEditable"
            @blur="validateField('description')" />
          <InputBox
            id="create-contract-details"
            v-model="formData.details"
            :error="errors.details"
            class="mt-8 w-full"
            label="Detail Kontrak"
            text-area
            text-area-height="h-40"
            :disabled="!isContractEditable"
            @blur="validateField('details')" />
          <InputBox
            id="create-contract-paymentRate"
            v-model="formData.paymentRate"
            label="Pembayaran Kontrak"
            type="number"
            min="10000"
            :error="errors.paymentRate"
            class="mt-8 w-full"
            :disabled="!isContractEditable"
            @blur="validateField('paymentRate')" />
          <InputBox
            id="create-contract-agreement"
            v-model="isRecruiterAgreeingToPayFreelancer"
            label="Saya setuju untuk membayar jasa freelancer melalui website 8Tech."
            class="mt-8 w-full"
            type="checkbox"
            :disabled="!isContractEditable" />
          <div class="flex flex-row w-full gap-x-5">
            <AppButton
              class="mt-12"
              :class="{
                'w-1/2': canRejectContract,
                'w-full': !canRejectContract,
              }"
              @click="doUpdateContract"
              v-if="!statusOngoing && !isContractCompleted"
              :disabled="!isRecruiterAgreeingToPayFreelancer">
              <p v-if="!isUpdating">Ajukan kontrak</p>
              <p v-if="isUpdating">Simpan perubahan</p>
              <img
                v-if="isLoading"
                alt="loading"
                class="h-6"
                src="@/assets/images/loading.svg" />
            </AppButton>
            <AppButton
              v-if="canRejectContract"
              type="danger"
              class="mt-12 w-1/2"
              @click="rejectContract">
              <p>Batalkan</p>
              <img
                v-if="isLoading"
                alt="loading"
                class="h-6"
                src="@/assets/images/loading.svg" />
            </AppButton>
          </div>
          <AppButton
            v-if="statusOngoing && !isContractCompleted"
            class="mt-12 w-full"
            @click="pay(route.params.id)">
            <p>Bayar jasa freelancer</p>
            <img
              v-if="isPaying"
              alt="loading"
              class="h-6"
              src="@/assets/images/loading.svg" />
          </AppButton>
          <InputBox
            v-if="isUpdating && isContractCompleted && !isContractRated"
            v-model="freelancerRating"
            id="freelancer-rating"
            type="number"
            min="1"
            max="10"
            label="Penilaian Freelancer (1-10)"
            class="mt-12 w-1/6" />
          <AppButton
            v-if="isUpdating && isContractCompleted && !isContractRated"
            class="mt-5 w-full"
            @click="doRateFreelancer">
            Beri penilaian Freelancer
            <img
              v-if="isLoading"
              alt="loading"
              class="h-6"
              src="@/assets/images/loading.svg" />
          </AppButton>
          <AppButton
            v-if="isUpdating"
            class="mt-12 w-full"
            outline
            @click="goToPdf(route.params.id)">
            <p>Unduh PDF kontrak</p>
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
