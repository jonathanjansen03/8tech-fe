<script setup>
import SideBar from '@/components/SideBar.vue';
import { onBeforeMount, onBeforeUnmount, reactive, watch } from 'vue';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/vue/24/outline';
import { useMainStore } from '@/stores/main.js';
import { useUserStore } from '@/stores/user.js';
import jobApi from '@/api/job.js';
import router from '@/router/index.js';
import config from '@/config/index.js';
import { PlusCircleIcon } from '@heroicons/vue/24/outline/index.js';

const mainStore = useMainStore();
const userStore = useUserStore();

const jobList = reactive([]);

const pagination = reactive({
  page: 1,
  size: 5,
  isLastPage: false,
  isFirstPage: true,
  totalPages: 0,
});

const flag = reactive({
  isLoadingFetchApi: false,
});

onBeforeMount(async () => {
  mainStore.setRecruiterPortal(true);
  flag.isLoadingFetchApi = true;
  const jobListResponse = await jobApi.filter(
    {
      field: 'companyId',
      keyword: userStore.currentUser?.companyId,
      sort: 'craetedAt',
      page: pagination.page,
      size: pagination.size,
    },
    userStore.currentUserToken
  );
  jobList.push(...jobListResponse.data.data);
  pagination.totalPages = jobListResponse.data.totalPages;
  flag.isLoadingFetchApi = false;
});

onBeforeUnmount(() => {
  mainStore.setRecruiterPortal(false);
  mainStore.closePortalNavbar();
});

watch(pagination, async (newPagination) => {
  if (newPagination.page < 1) {
    pagination.page = 1;
    return;
  }
  if (newPagination.page > pagination.totalPages) {
    pagination.page = pagination.totalPages;
    return;
  }
  flag.isLoadingFetchApi = true;
  const jobListResponse = await jobApi.filter(
    {
      field: 'companyId',
      keyword: userStore.currentUser?.companyId,
      sort: 'craetedAt',
      page: pagination.page,
      size: pagination.size,
    },
    userStore.currentUserToken
  );

  if (jobListResponse.data.data.length === 0) {
    flag.isLoadingFetchApi = false;
    return;
  }

  pagination.totalPages = jobListResponse.data.totalPages;
  pagination.isLastPage = !jobListResponse.data['hasNext'];
  pagination.isFirstPage = !jobListResponse.data['hasPrevious'];

  jobList.splice(0, jobList.length);
  jobList.push(...jobListResponse.data.data);
  flag.isLoadingFetchApi = false;
});
</script>

<template>
  <div class="sm:px-20">
    <SideBar v-if="mainStore.showPortalNavbar" class="sidebar" />
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
              @click="router.push(`/job-detail/${item.id}`)">
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

      <div class="flex flex-col items-center mt-5">
        <img
          v-if="flag.isLoadingFetchApi"
          alt="loading"
          class="h-8 mb-2"
          src="@/assets/images/loading.svg" />
        <div class="flex flex-row">
          <button
            class="flex items-center justify-center px-3 font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900"
            @click="pagination.page--">
            <ChevronDoubleLeftIcon class="cursor-pointer w-5" />
            Prev
          </button>
          <p
            class="flex items-center justify-center px-3 font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900">
            Page {{ pagination.page }} of {{ pagination.totalPages }}
          </p>
          <button
            class="flex items-center justify-center px-3 font-medium text-white bg-gray-800 rounded-e hover:bg-gray-900"
            @click="pagination.page++">
            Next
            <ChevronDoubleRightIcon class="cursor-pointer w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.sidebar {
  transition: 0.2s ease-in-out;
}
</style>
