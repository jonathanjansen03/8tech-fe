<script setup>
import SideBar from '@/components/SideBar.vue';
import { onBeforeMount, onBeforeUnmount, reactive, watch } from 'vue';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/vue/24/outline';
import { useMainStore } from '@/stores/main.js';
import { useUserStore } from '@/stores/user.js';
import jobApi from '@/api/job.js';
import AppButton from '@/components/AppButton.vue';

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
  isLoadingFetchApi: false
});

onBeforeMount(async () => {
  mainStore.setRecruiterPortal(true);
  flag.isLoadingFetchApi = true;
  const jobListResponse = await jobApi.list({
    field: "companyId",
    keyword: userStore.currentUser?.companyId,
    sort: "craetedAt",
    page: pagination.page,
    size: pagination.size
  }, userStore.currentUserToken);
  jobList.push(...jobListResponse.data.data);
  pagination.totalPages = jobListResponse.data.totalPages;
  flag.isLoadingFetchApi = false;
})

onBeforeUnmount(() => {
  mainStore.setRecruiterPortal(false);
  mainStore.closePortalNavbar();
})

watch (pagination, async (newPagination) => {
  if(newPagination.page < 1) {
    pagination.page = 1;
    return;
  }
  if (newPagination.page > pagination.totalPages) {
    pagination.page = pagination.totalPages;
    return;
  }
  flag.isLoadingFetchApi = true;
  const jobListResponse = await jobApi.list({
    field: "companyId",
    keyword: userStore.currentUser?.companyId,
    sort: "craetedAt",
    page: pagination.page,
    size: pagination.size
  }, userStore.currentUserToken);

  if(jobListResponse.data.data.length === 0) {
    flag.isLoadingFetchApi = false;
    return;
  }

  pagination.totalPages = jobListResponse.data.totalPages;
  pagination.isLastPage = !jobListResponse.data["hasNext"];
  pagination.isFirstPage = !jobListResponse.data["hasPrevious"];

  jobList.splice(0, jobList.length);
  jobList.push(...jobListResponse.data.data);
  flag.isLoadingFetchApi = false;
})

</script>

<template>
  <div class="sm:px-20">
    <SideBar class="sidebar" v-if="mainStore.showPortalNavbar"/>
    <div>
      <h1 class="text-center font-bold mb-8 text-white text-2xl">
        Lowongan pekerjaanmu
      </h1>

      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th class="px-6 py-3 w-20">
              No.
            </th>
            <th class="px-6 py-3">
              Title
            </th>
            <th class="px-6 py-3">
              Created date
            </th>
            <th class="px-6 py-3">
              Info
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in jobList" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="px-6 py-4">
              {{ (( pagination.page - 1 ) * pagination.size ) + index + 1 }}
            </td>
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ item.title }}
            </th>
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ new Date(item.createdAt).toLocaleDateString() + " " + new Date(item.createdAt).toLocaleTimeString() }}
            </th>
            <td class="px-6 py-4">
              <AppButton> Detail </AppButton>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col items-center mt-5">
        <img v-if="flag.isLoadingFetchApi" class="h-8 mb-2" src="@/assets/images/loading.svg" alt="loading">
        <div class="flex flex-row">
          <button @click="pagination.page--" class="flex items-center justify-center px-3 font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900">
            <ChevronDoubleLeftIcon class="cursor-pointer w-5"/>
            Prev
          </button>
          <p class="flex items-center justify-center px-3 font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900">Page {{pagination.page}} of {{pagination.totalPages}}</p>
          <button  @click="pagination.page++" class="flex items-center justify-center px-3 font-medium text-white bg-gray-800 rounded-e hover:bg-gray-900">
            Next
            <ChevronDoubleRightIcon class="cursor-pointer w-5"/>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style>
.sidebar{
  transition: .2s ease-in-out;
}
</style>
