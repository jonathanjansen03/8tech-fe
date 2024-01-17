<script setup>
import SideBar from '@/components/SideBar.vue';
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useMainStore } from '@/stores/main.js';
import AppCard from '@/components/AppCard.vue';
import InputBox from '@/components/InputBox.vue';
import validationUtil from '@/utils/validation.js';
import config from '@/config/index.js';
import AppButton from '@/components/AppButton.vue';
import jobApi from '@/api/job.js';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.js';

const {currentUserToken} = useUserStore();

const router = useRouter();
const route = useRoute();
const mainStore = useMainStore();

const jobData = reactive({
  title: '',
  description: ''
});

const errors = reactive({
  title: '',
  description: ''
});

const isLoadingFetchApi = ref(false);

onMounted(async () => {
  NProgress.start();
  mainStore.setRecruiterPortal(true);
  const res = await jobApi.info(route.params.id, currentUserToken);
  jobData.title = res.data.title;
  jobData.description = res.data.description;
  NProgress.done();
});

onBeforeUnmount(() => {
  mainStore.setRecruiterPortal(false);
  mainStore.closePortalNavbar();
});

watch(
  () => route.params.id,
  async newId => {
    const res = await jobApi.info(newId, currentUserToken);
    jobData.value = res.data;
  }
);

const validateField = (field) => {
  if (!jobData[field]) {
    return;
  }

  if (!validationUtil.validateForm(field, jobData[field])) {
    errors[field] = config.errors.form[field];
  } else {
    errors[field] = '';
  }
};

const validateFormData = () => {
  let isFormValid = true;

  for (const key in jobData) {
    if (!jobData[key]) {
      errors[key] = config.errors.form.required;
      isFormValid = false;
      continue;
    }

    if (!validationUtil.validateForm(key, jobData[key])) {
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

const doUpdateJob = async () => {
  if (isLoadingFetchApi.value) {
    return;
  }

  isLoadingFetchApi.value = true;
  if (!validateFormData()) {
    isLoadingFetchApi.value = false;
    return;
  }

  try {
    await jobApi.update({
      ...jobData,
      'id': route.params.id
    }, currentUserToken);
    handleSuccess();
    isLoadingFetchApi.value = false;
  } catch (err) {
    handleFail(err);
    isLoadingFetchApi.value = false;
  }
};

</script>

<template>
  <div class="sm:px-20">
    <SideBar v-if="mainStore.showPortalNavbar" class="sidebar"/>
    <div>
      <AppCard class="px-5">
        <div class="flex flex-col items-center" @keydown.enter="doUpdateJob">
          <h1>Detail Lowongan Pekerjaan</h1>
          <InputBox
            id="create-job-title"
            v-model="jobData.title"
            :error="errors.title"
            class="mt-8 w-full"
            label="Judul Pekerjaan"
            type="text"
            @blur="validateField('title')"
          />
          <InputBox
            id="create-job-description"
            v-model="jobData.description"
            :error="errors.description"
            class="mt-8 w-full"
            label="Deskripsi Pekerjaan"
            text-area
            text-area-height="h-40"
            @blur="validateField('description')"
          />
          <div class="flex flex-row justify-around w-full">
            <AppButton class="mt-12 w-1/2 m-5" @click="doUpdateJob">
              <p>Simpan perubahan informasi</p>
              <img v-if="isLoadingFetchApi" alt="loading" class="h-6" src="@/assets/images/loading.svg">
            </AppButton>
            <AppButton class="mt-12 w-1/2 m-5" @click="router.push(`/job-applicant/${route.params.id}`)">
              <p>Lihat pelamar</p>
            </AppButton>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<style>
.sidebar {
  transition: .2s ease-in-out;
}
</style>
