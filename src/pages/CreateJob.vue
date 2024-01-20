<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useMainStore } from '@/stores/main';
import { useUserStore } from '@/stores/user';
import { useJobStore } from '@/stores/job';
import config from '@/config';
import validationUtil from '@/utils/validation';

import SideBar from '@/components/SideBar.vue';
import AppCard from '@/components/AppCard.vue';
import InputBox from '@/components/InputBox.vue';
import AppButton from '@/components/AppButton.vue';

const router = useRouter();
const mainStore = useMainStore();
const userStore = useUserStore();
const jobStore = useJobStore();

const { currentUser, currentUserToken } = storeToRefs(userStore);
const { createJob } = jobStore;

const formData = reactive({
  title: '',
  description: '',
});
const errors = reactive({
  title: '',
  description: '',
});
const isLoadingCreateJob = ref(false);

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

    if (!validationUtil.validateForm(key, formData[key])) {
      errors[key] = config.errors.form[key];
      isFormValid = false;
    }
  }
  return isFormValid;
};

const handleSuccess = () => {
  router.push(config.pages.recruiterPortal.path);
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

const doCreateJob = async () => {
  if (isLoadingCreateJob.value) {
    return;
  }

  isLoadingCreateJob.value = true;
  if (!validateFormData()) {
    isLoadingCreateJob.value = false;
    return;
  }

  try {
    await createJob(
      {
        ...formData,
        companyId: currentUser.value.companyId,
      },
      currentUserToken.value
    );
    handleSuccess();
  } catch (err) {
    handleFail(err);
  }
  isLoadingCreateJob.value = false;
};

const initPage = () => {
  mainStore.setRecruiterPortal(true);
};

onMounted(initPage);

onBeforeUnmount(() => {
  mainStore.setRecruiterPortal(false);
  mainStore.closePortalNavbar();
});
</script>

<template>
  <div class="sm:px-20">
    <SideBar class="sidebar" v-if="mainStore.showPortalNavbar" />
    <div>
      <AppCard class="px-5">
        <div @keydown.enter="doCreateJob" class="flex flex-col items-center">
          <h1>Buat Lowongan Pekerjaan</h1>
          <InputBox
            id="create-job-title"
            type="text"
            label="Judul Pekerjaan"
            v-model="formData.title"
            :error="errors.title"
            class="mt-8 w-full"
            @blur="validateField('title')" />
          <InputBox
            id="create-job-description"
            label="Deskripsi Pekerjaan"
            text-area
            text-area-height="h-40"
            v-model="formData.description"
            :error="errors.description"
            class="mt-8 w-full"
            @blur="validateField('description')" />
          <AppButton @click="doCreateJob" class="mt-12 w-1/2">
            <p>Buat Lowongan Pekerjaan</p>
            <img
              v-if="isLoadingCreateJob"
              class="h-6"
              src="@/assets/images/loading.svg"
              alt="loading" />
          </AppButton>
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
