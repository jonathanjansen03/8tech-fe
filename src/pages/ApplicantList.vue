<script setup>
import { onBeforeMount, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useMainStore } from '@/stores/main';
import { useUserStore } from '@/stores/user';
import { useJobStore } from '@/stores/job';
import config from '@/config';
import SideBar from '@/components/SideBar.vue';
import AppButton from '@/components/AppButton.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';

const GET_APPLICANT_LIST = 'mendapatkan daftar pelamar';

const route = useRoute();
const router = useRouter();
const mainStore = useMainStore();
const userStore = useUserStore();
const jobStore = useJobStore();

const { currentUserToken } = storeToRefs(userStore);
const { jobApplicants, jobApplicantsTotalPages } = storeToRefs(jobStore);
const { getApplicants } = jobStore;

const pagination = reactive({
  page: 1,
  size: 5,
  isLastPage: false,
  isFirstPage: true,
});
const isLoadingFetchApi = ref(false);

const initPage = async () => {
  mainStore.setRecruiterPortal(true);
  isLoadingFetchApi.value = true;

  try {
    await getApplicants(
      {
        page: pagination.page,
        size: pagination.size,
      },
      route.params.id,
      currentUserToken.value
    );
  } catch (err) {
    console.log(err);
    alert(config.errors.general(GET_APPLICANT_LIST));
  }
  isLoadingFetchApi.value = false;
};

onBeforeMount(initPage);

onBeforeUnmount(() => {
  mainStore.setRecruiterPortal(false);
  mainStore.closePortalNavbar();
});

watch(pagination, async (newPagination) => {
  if (newPagination.page < 1) {
    pagination.page = 1;
    return;
  }

  if (newPagination.page > jobApplicantsTotalPages.value) {
    pagination.page = jobApplicantsTotalPages.value;
    return;
  }

  isLoadingFetchApi.value = true;
  let applicantListResponse;

  try {
    applicantListResponse = await getApplicants(
      {
        page: pagination.page,
        size: pagination.size,
      },
      route.params.id,
      userStore.currentUserToken
    );
  } catch (err) {
    console.log(err);
    alert(config.errors.general(GET_APPLICANT_LIST));
  }

  if (applicantListResponse.data.length === 0) {
    isLoadingFetchApi.value = false;
    return;
  }

  pagination.isLastPage = !applicantListResponse.hasNext;
  pagination.isFirstPage = !applicantListResponse.hasPrevious;
  isLoadingFetchApi.value = false;
});
</script>

<template>
  <div class="sm:px-20">
    <SideBar class="sidebar" v-if="mainStore.showPortalNavbar" />
    <div>
      <h1 class="text-center font-bold mb-8 text-white text-2xl">
        Daftar Pelamar untuk lowongan pekerjaan
      </h1>

      <div class="relative overflow-x-auto">
        <table
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th class="px-6 py-3 w-20">No.</th>
              <th class="px-6 py-3">Nama Pelamar</th>
              <th class="px-6 py-3 text-center w-48">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in jobApplicants"
              :key="index"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-950"
              @click="router.push(`/user/${item.id}`)">
              <td class="px-6 py-4">
                {{ (pagination.page - 1) * pagination.size + index + 1 }}
              </td>
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ item.firstName + ' ' + item.lastName }}
              </th>
              <th scope="row" class="px-6 py-4 flex flex-row-reverse">
                <AppButton class="mr-3">
                  <p>Lihat Detail</p>
                </AppButton>
              </th>
            </tr>
          </tbody>
        </table>
      </div>

      <PaginationComponent
        @goNext="pagination.page++"
        @goPrevious="pagination.page--"
        :page="pagination.page"
        :totalPages="jobApplicantsTotalPages">
        <img
          v-if="isLoadingFetchApi"
          alt="loading"
          class="h-8 mb-2"
          src="@/assets/images/loading.svg" />
      </PaginationComponent>
    </div>
  </div>
</template>

<style>
.sidebar {
  transition: 0.2s ease-in-out;
}
</style>
