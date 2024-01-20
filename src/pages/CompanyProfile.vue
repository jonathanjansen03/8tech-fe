<script setup>
import { computed, onBeforeMount, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useJobStore } from '@/stores/job';
import { useUserStore } from '@/stores/user';
import { useMainStore } from '@/stores/main';
import { useCompanyStore } from '@/stores/company';
import { storeToRefs } from 'pinia';
import { PencilSquareIcon } from '@heroicons/vue/24/outline';

import config from '@/config';
import DefaultUserProfilePicture from '@/assets/images/default-user-profile-picture.png';
import AppCard from '@/components/AppCard.vue';
import AppButton from '@/components/AppButton.vue';
import { useRoute } from 'vue-router';
import JobCard from '@/components/JobCard.vue';

const route = useRoute();
const mainStore = useMainStore();
const userStore = useUserStore();
const companyStore = useCompanyStore();
const jobStore = useJobStore();

const {currentUser, currentUserToken} = storeToRefs(userStore);
const isPrivateProfile = ref(true);
const companyId = ref();
const companyJobList = ref();
const companyProfile = reactive({
  name: '',
  description: '',
  profilePicture: ''
});

const initPage = async () => {
  companyId.value = route.params.id;
  isPrivateProfile.value = companyId.value === currentUser.value?.companyId;
  mainStore.setRecruiterPortal(currentUser.value?.roles.includes('RECRUITER'));

  NProgress.start();
  const companyRes = await companyStore.getCompanyInfo(companyId.value);
  await jobStore.searchJobs({
    field: 'companyId',
    keyword: companyId.value,
    sort: 'createdAt',
    page: 0,
    size: 100
  }, currentUserToken.value);
  companyJobList.value = jobStore.jobList;
  NProgress.done();
  companyProfile.name = companyRes.data.name;
  companyProfile.description = companyRes.data.description;
  companyProfile.profilePicture = companyRes.data.profilePicture;
};

onBeforeMount(async () => {
  await initPage();
});

onBeforeUnmount(() => {
  mainStore.setRecruiterPortal(false);
});

watch(route, () => {
  isPrivateProfile.value = route.params.id === currentUser.value?.companyId;
  mainStore.setRecruiterPortal(currentUser.value?.roles.includes('RECRUITER'));
});

const userProfilePicture = computed(
  () => {
    return companyProfile.profilePicture || DefaultUserProfilePicture;
  }
);
</script>

<template>
  <div
    class="mt-8 px-3 min-[420px]:px-10 sm:px-20 md:px-32 lg:px-40 xl:px-52 2xl:px-72">
    <AppCard class="user-profile px-8 py-8">
      <h1>Profil</h1>
      <div class="flex justify-center mt-5">
        <img
          :src="userProfilePicture"
          alt="User profile picture."
          class="rounded-full drop-shadow w-36"/>
      </div>
      <div class="flex justify-between mt-5">
        <div class="flex flex-col">
          <h3>Nama Perusahaan</h3>
          <p>{{ companyProfile.name }}</p>
        </div>
        <div class="flex flex-col">
          <h3>Deskripsi Perusahaan</h3>
          <p>{{ companyProfile.description }}</p>
        </div>
      </div>
      <div v-if="isPrivateProfile" class="flex justify-center mt-5">
        <RouterLink :to="{ name: config.pages.companyProfileEdit.name }">
          <AppButton class="flex items-center  py-3">
            <PencilSquareIcon class="w-5"/>
            Edit Company Profile
          </AppButton>
        </RouterLink>
      </div>
      <h2 class="mt-10">Lowongan pekerjaan saat ini</h2>
      <div
        class="home__job-cards md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-3 xl:grid-cols-3 2xl:grid-cols-3">
        <div v-for="i in companyJobList" :key="i">
          <JobCard :job="i"/>
        </div>
        <div v-if="!companyJobList?.length">
          <p class="mt-8">Belum ada pekerjaan.</p>
        </div>
      </div>
    </AppCard>
  </div>
</template>
