<script setup>
import SideBar from '@/components/SideBar.vue';
import { onBeforeMount, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useMainStore } from '@/stores/main.js';
import { useUserStore } from '@/stores/user.js';
import jobApi from '@/api/job.js';
import router from '@/router/index.js';
import AppButton from '@/components/AppButton.vue';
import { useRoute } from 'vue-router';
import PaginationComponent from '@/components/PaginationComponent.vue';

const mainStore = useMainStore();
const userStore = useUserStore();
const route = useRoute();

const applicantList = reactive([]);

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

const jobInfo = ref();

onBeforeMount(async () => {
  mainStore.setRecruiterPortal(true);
  flag.isLoadingFetchApi = true;
  const applicantListResponse = await jobApi.applicant(
    {
      page: pagination.page,
      size: pagination.size,
    },
    route.params.id,
    userStore.currentUserToken
  );
  applicantList.push(...applicantListResponse.data.data);
  pagination.totalPages = applicantListResponse.data.totalPages;
  flag.isLoadingFetchApi = false;

  jobInfo.value = await jobApi.info(
    route.params.id,
    userStore.currentUserToken
  );
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
  const applicantListResponse = await jobApi.applicant(
    {
      page: pagination.page,
      size: pagination.size,
    },
    route.params.id,
    userStore.currentUserToken
  );

  if (applicantListResponse.data.data.length === 0) {
    flag.isLoadingFetchApi = false;
    return;
  }

  pagination.totalPages = applicantListResponse.data.totalPages;
  pagination.isLastPage = !applicantListResponse.data['hasNext'];
  pagination.isFirstPage = !applicantListResponse.data['hasPrevious'];

  applicantList.splice(0, applicantList.length);
  applicantList.push(...applicantListResponse.data.data);
  flag.isLoadingFetchApi = false;
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
              v-for="(item, index) in applicantList"
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
        :totalPages="pagination.totalPages">
        <img
          v-if="flag.isLoadingFetchApi"
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
