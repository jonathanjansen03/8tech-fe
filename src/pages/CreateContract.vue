<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useMainStore } from '@/stores/main.js';
import { useUserStore } from '@/stores/user.js';
import { useContractStore } from '@/stores/contract.js';
import config from '@/config/index.js';
import validationUtil from '@/utils/validation.js';
import SideBar from '@/components/SideBar.vue';
import AppCard from '@/components/AppCard.vue';
import InputBox from '@/components/InputBox.vue';
import AppButton from '@/components/AppButton.vue';
import contractTemplate from '@/assets/docs/contractTemplate.json';
import NProgress from 'nprogress';

const {currentUserToken} = useUserStore();

const router = useRouter();
const route = useRoute();
const mainStore = useMainStore();
const contractStore = useContractStore();

const {fetchStoreContract, recruiterRejectContract} = contractStore;

const formData = reactive({
  title: '',
  description: '',
  details: '',
  paymentRate: ''
});

const errors = reactive({
  title: '',
  description: '',
  details: '',
  paymentRate: ''
});
const isLoading = ref(false);
const isUpdating = ref(false);
const template = ref('');

onMounted(async () => {
  await initPage();
});

const initPage = async () => {
  NProgress.start();
  mainStore.setRecruiterPortal(true);
  isUpdating.value = route.query.update === 'true';
  await fetchStoreContract(route.params.id, currentUserToken);
  formData.paymentRate = contractStore.contract?.paymentRate;
  formData.title = contractStore.contract?.title;
  formData.description = contractStore.contract?.description;

  formData.details = contractStore.contract?.customField?.split(';').map((fieldList) => {
    const [key, value] = fieldList.split('=');
    if (key === 'details') {
      return value;
    }
  });

  template.value = contractTemplate.default;
  NProgress.done();
};

onBeforeUnmount(() => {
  mainStore.setRecruiterPortal(false);
  mainStore.closePortalNavbar();
});

const validateField = (field) => {
  if (!formData[field]) {
    return;
  }

  if (!validationUtil.validateForm(field, formData[field])) {
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

    if (!validationUtil.validateForm(key, formData[key])) {
      errors[key] = config.errors.form[key];
      isFormValid = false;
    }
  }
  return isFormValid;
};

const handleSuccess = () => {
  router.back();
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
    await contractStore.updateContract({
      title: formData.title,
      description: formData.description,
      paymentRate: parseInt(formData.paymentRate),
      customField: 'details=' + formData.details,
      id: route.params.id,
      status: config.constants.contractStatus.ACCEPTED,
      template: template.value
    }, currentUserToken);
    handleSuccess();
    isLoading.value = false;
  } catch (err) {
    handleFail(err);
    isLoading.value = false;
  }
};

const rejectContract = async () => {
  isLoading.value = true;
  await recruiterRejectContract(route.params.id, currentUserToken);
  isLoading.value = false;
  router.back();
};

const goToPdf = (id) => {
  isLoading.value = true;
  window.open(config.api.basePath + config.api.contract.download(id), '_blank');
  isLoading.value = false;
};
</script>

<template>
  <div class="sm:px-20">
    <SideBar v-if="mainStore.showPortalNavbar" class="sidebar"/>
    <div>
      <AppCard class="px-5">
        <div class="flex flex-col items-center" @keydown.enter="doUpdateContract">
          <h1 v-if="!isUpdating">Buat Kontrak</h1>
          <h1 v-else>Detail Kontrak</h1>
          <InputBox
            id="create-contract-title"
            v-model="formData.title"
            :error="errors.title"
            class="mt-8 w-full"
            label="Judul Kontrak"
            type="text"
            @blur="validateField('title')"/>
          <InputBox
            id="create-contract-description"
            v-model="formData.description"
            :error="errors.description"
            class="mt-8 w-full"
            label="Deskripsi Kontrak"
            text-area
            text-area-height="h-40"
            @blur="validateField('description')"/>
          <InputBox
            id="create-contract-details"
            v-model="formData.details"
            :error="errors.details"
            class="mt-8 w-full"
            label="Detail Kontrak"
            text-area
            text-area-height="h-40"
            @blur="validateField('details')"/>
          <InputBox
            id="create-contract-paymentRate"
            v-model="formData.paymentRate"
            :error="errors.paymentRate"
            class="mt-8 w-full"
            label="Pembayaran Kontrak"
            @blur="validateField('paymentRate')"/>
          <div class="flex flex-row w-full">
            <AppButton class="mt-12 w-1/2 m-5" @click="doUpdateContract">
              <p v-if="!isUpdating">Ajukan Kontrak</p>
              <p v-else>Simpan Perubahan</p>
              <img
                v-if="isLoading"
                alt="loading"
                class="h-6"
                src="@/assets/images/loading.svg"/>
            </AppButton>
            <AppButton v-if="isUpdating" class="mt-12 w-1/2 m-5" @click="rejectContract()">
              <p>Batalkan</p>
              <img
                v-if="isLoading"
                alt="loading"
                class="h-6"
                src="@/assets/images/loading.svg"/>
            </AppButton>
            <AppButton v-if="isUpdating" class="mt-12 w-1/2 m-5" @click="goToPdf(route.params.id)">
              <p>Download PDF</p>
              <img
                v-if="isLoading"
                alt="loading"
                class="h-6"
                src="@/assets/images/loading.svg"/>
            </AppButton>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<style>
.sidebar {
  transition: 0.2s ease-in-out;
}
</style>
