<script setup>
import SideBar from '@/components/SideBar.vue';
import { onBeforeUnmount, onMounted, reactive, watch } from 'vue';
import { useMainStore } from '@/stores/main.js';
import AppCard from '@/components/AppCard.vue';
import InputBox from '@/components/InputBox.vue';
import validationUtil from '@/utils/validation.js';
import config from '@/config/index.js';
import AppButton from '@/components/AppButton.vue';
import jobApi from '@/api/job.js';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user.js';
const { currentUserToken } = useUserStore();

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

const flag = reactive({
  isLoadingFetchApi: false
});

onMounted(async () => {
  NProgress.start()
  mainStore.setRecruiterPortal(true);
  const res  = await jobApi.info(route.params.id, currentUserToken);
  jobData.title = res.data.title;
  jobData.description = res.data.description;
  NProgress.done()
})

onBeforeUnmount(() => {
  mainStore.setRecruiterPortal(false);
  mainStore.closePortalNavbar();
})

watch (
  () => route.params.id,
  async newId => {
    const res  = await jobApi.info(newId, currentUserToken);
    jobData.value = res.data;
  }
)

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
  if(flag.isLoadingFetchApi) {
    return;
  }

  flag.isLoadingFetchApi = true;
  if (!validateFormData()) {
    flag.isLoadingFetchApi = false;
    return;
  }

  try {
    await jobApi.update({
      ...jobData,
      'id': route.params.id,
    }, currentUserToken);
    handleSuccess();
    flag.isLoadingFetchApi = false;
  } catch (err) {
    handleFail(err);
    flag.isLoadingFetchApi = false;
  }
};

</script>

<template>
  <div class="sm:px-20">
    <SideBar class="sidebar" v-if="mainStore.showPortalNavbar"/>
    <div>
      <AppCard class="px-5">
        <div @keydown.enter="doUpdateJob" class="flex flex-col items-center">
          <h1>Detail Lowongan Pekerjaan</h1>
          <InputBox
            id="create-job-title"
            type="text"
            label="Judul Pekerjaan"
            v-model="jobData.title"
            :error="errors.title"
            class="mt-8 w-full"
            @blur="validateField('title')"
          />
          <InputBox
            id="create-job-description"
            label="Deskripsi Pekerjaan"
            text-area
            text-area-height="h-40"
            v-model="jobData.description"
            :error="errors.description"
            class="mt-8 w-full"
            @blur="validateField('description')"
          />
          <div class="flex flex-row justify-around w-full">
            <AppButton @click="doUpdateJob" class="mt-12 w-1/2 m-5">
              <p>Simpan perubahan informasi</p>
              <img v-if="flag.isLoadingFetchApi" class="h-6" src="@/assets/images/loading.svg" alt="loading">
            </AppButton>
            <AppButton @click="router.push(`/job-applicant/${route.params.id}`)" class="mt-12 w-1/2 m-5">
              <p>Lihat pelamar</p>
            </AppButton>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<style>
.sidebar{
  transition: .2s ease-in-out;
}
</style>
