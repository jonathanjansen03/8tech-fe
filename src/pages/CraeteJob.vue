<script setup>
import SideBar from '@/components/SideBar.vue';
import { onBeforeUnmount, onMounted, reactive } from 'vue';
import { useMainStore } from '@/stores/main.js';
import AppCard from '@/components/AppCard.vue';
import InputBox from '@/components/InputBox.vue';
import validationUtil from '@/utils/validation.js';
import config from '@/config/index.js';
import AppButton from '@/components/AppButton.vue';
import jobApi from '@/api/job.js';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.js';
const { getUserInfo, currentUserToken } = useUserStore();

const router = useRouter();
const mainStore = useMainStore();

onMounted(() => {
  mainStore.setRecruiterPortal(true);
})

onBeforeUnmount(() => {
  mainStore.setRecruiterPortal(false);
})

const formData = reactive({
  title: '',
  description: ''
});
const errors = reactive({
  title: '',
  description: ''
});
const flag = reactive({
  isLoadingCreateJob: false
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
  if(flag.isLoadingCreateJob) {
    return;
  }

  flag.isLoadingCreateJob = true;
  if (!validateFormData()) {
    flag.isLoadingCreateJob = false;
    return;
  }

  try {
    const userInfo = await getUserInfo();
    await jobApi.create({
      ...formData,
      companyId: userInfo.companyId
    }, currentUserToken);
    handleSuccess();
    flag.isLoadingCreateJob = false;
  } catch (err) {
    handleFail(err);
    flag.isLoadingCreateJob = false;
  }
};

</script>

<template>
  <div class="sm:px-20">
    <SideBar class="sidebar" v-if="mainStore.showPortalNavbar"/>
    <div>
      <AppCard class="px-5">
        <div @keydown.enter="doCreateJob" class="flex flex-col items-center">
          <InputBox
            id="craete-job-title"
            type="text"
            label="Judul Pekerjaan"
            v-model="formData.title"
            :error="errors.title"
            class="mt-8 w-full"
            @blur="validateField('title')"
          />
          <InputBox
            id="create-job-description"
            label="Deskripsi Pekerjaan"
            text-area
            text-area-height="h-40"
            v-model="formData.description"
            :error="errors.description"
            class="mt-8 w-full"
            @blur="validateField('description')"
          />
          <AppButton @click="doCreateJob" class="mt-12 w-1/2">
            <p>Buat Lowongan Pekerjaan</p>
            <img v-if="flag.isLoadingCreateJob" class="h-6" src="@/assets/images/loading.svg" alt="loading">
          </AppButton>
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
