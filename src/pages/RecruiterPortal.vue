<script setup>
import { onBeforeMount, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { PlusCircleIcon } from '@heroicons/vue/24/outline';

import { useMainStore } from '@/stores/main';
import { useUserStore } from '@/stores/user';
import { useJobStore } from '@/stores/job';
import config from '@/config';

import SideBar from '@/components/SideBar.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';

const COMPANY_ID = 'companyId';
const CREATED_AT = 'createdAt';
const GET_JOB_LIST = 'mendapatkan daftar pekerjaan';

const router = useRouter();
const mainStore = useMainStore();
const userStore = useUserStore();
const jobStore = useJobStore();

const { showPortalNavbar } = storeToRefs(mainStore);
const { setRecruiterPortal, closePortalNavbar } = mainStore;

const { currentUser, currentUserToken } = storeToRefs(userStore);

const { jobListPagination } = storeToRefs(jobStore);
const { searchJobs } = jobStore;

const jobList = reactive([]);
const pagination = reactive({
  page: 1,
  size: 5
});
const isLoadingFetchApi = ref(false);

const initPage = async () => {
  setRecruiterPortal(true);
  isLoadingFetchApi.value = true;

  try {
    await searchJobs(
      {
        field: COMPANY_ID,
        keyword: currentUser.value.companyId,
        sort: CREATED_AT,
        page: pagination.page,
        size: pagination.size,
      },
      currentUserToken.value
    );
  } catch (err) {
    console.error(err);
    alert(config.errors.general(GET_JOB_LIST));
  }
  isLoadingFetchApi.value = false;
};

onBeforeMount(initPage);

onBeforeUnmount(() => {
  setRecruiterPortal(false);
  closePortalNavbar();
});

watch(pagination, async (newPagination) => {
  if (newPagination.page < 1) {
    pagination.page = 1;
    return;
  }

  if (newPagination.page > jobListPagination.value.totalPages) {
    pagination.page = jobListPagination.value.totalPages;
    return;
  }
  isLoadingFetchApi.value = true;

  try {
    await searchJobs(
      {
        field: COMPANY_ID,
        keyword: currentUser.value.companyId,
        sort: CREATED_AT,
        page: pagination.page,
        size: pagination.size,
      },
      currentUserToken.value
    );
  } catch (err) {
    console.error(err);
    alert(config.errors.general(GET_JOB_LIST));
  }
  isLoadingFetchApi.value = false;
});
</script>

<template>
  <div class="sm:px-20">
    <SideBar v-if="showPortalNavbar" class="sidebar" />
    <div>
      <div class="flex justify-between">
        <h1 class="text-center font-bold mb-8 text-white text-2xl">
          Lowongan pekerjaanmu
        </h1>
        <h1
          class="text-center font-bold mb-8 text-white text-base"
          title="Tambahkan lowongan pekerjaan baru">
          <a
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            @click="router.push(config.pages.createJob.path)">
            <PlusCircleIcon class="cursor-pointer w-10 text-gray-500" />
          </a>
        </h1>
      </div>

      <div class="relative overflow-x-auto">
        <table
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th class="px-6 py-3 w-20">No.</th>
              <th class="px-6 py-3 text-center">Judul</th>
              <th class="px-6 py-3 text-center">Tanggal dibuat</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in jobList"
              :key="index"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-950"
              @click="router.push(`/job-edit/${item.id}`)">
              <td class="px-6 py-4">
                {{ (pagination.page - 1) * pagination.size + index + 1 }}
              </td>
              <th
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                scope="row">
                {{ item.title }}
              </th>
              <th
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
                scope="row">
                {{
                  new Date(item.createdAt).toLocaleDateString() +
                  ' ' +
                  new Date(item.createdAt).toLocaleTimeString()
                }}
              </th>
            </tr>
          </tbody>
        </table>
      </div>

      <PaginationComponent
        @goNext="pagination.page++"
        @goPrevious="pagination.page--"
        :page="pagination.page"
        :totalPages="jobListPagination.totalPages">
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
