<script setup>
import { onBeforeMount, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useMainStore } from '@/stores/main';
import { useUserStore } from '@/stores/user';
import { useJobStore } from '@/stores/job';
import config from '@/config';
import AppButton from '@/components/AppButton.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import NProgress from 'nprogress';

const GET_APPLICANT_LIST = 'mendapatkan daftar pelamar';

const route = useRoute();
const router = useRouter();
const mainStore = useMainStore();
const userStore = useUserStore();
const jobStore = useJobStore();

const { currentUserToken } = storeToRefs(userStore);
const { jobApplicants, jobApplicantsPagination } = storeToRefs(jobStore);
const { getApplicants } = jobStore;

const pagination = reactive({
  page: 1,
  size: 5,
});
const isLoadingFetchApi = ref(false);

const initPage = async () => {
  NProgress.start();
  mainStore.setRecruiterPortal(true);
  isLoadingFetchApi.value = true;

  try {
    await getApplicants(
      route.params.id,
      {
        page: pagination.page,
        size: pagination.size,
      },
      currentUserToken.value
    );
  } catch (err) {
    console.error(err);
    alert(config.errors.general(GET_APPLICANT_LIST));
  }
  isLoadingFetchApi.value = false;
  NProgress.done();
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

  if (newPagination.page > jobApplicantsPagination.value.totalPages) {
    pagination.page = jobApplicantsPagination.value.totalPages;
    return;
  }

  isLoadingFetchApi.value = true;

  try {
    await getApplicants(
      route.params.id,
      pagination,
      userStore.currentUserToken
    );
  } catch (err) {
    console.error(err);
    alert(config.errors.general(GET_APPLICANT_LIST));
  }

  isLoadingFetchApi.value = false;
});

const goCreateContract = (id) => {
  router.push({
    name: config.pages.createContract.name,
    params: {
      id
    },
  });
};

</script>

<template>
  <div class="sm:px-20">
    <div>
      <h1 class="text-center font-bold mb-8 text-white text-2xl">
        Daftar Pelamar untuk Lowongan Pekerjaan
      </h1>

      <div class="relative overflow-x-auto">
        <table
          v-if="jobApplicants.length"
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
                  <p @click.stop="goCreateContract(item.contractId)">Terima lamaran</p>
                </AppButton>
              </th>
            </tr>
          </tbody>
        </table>
        <h3 v-if="!jobApplicants.length" class="text-center text-white">
          Belum ada pelamar untuk lowongan pekerjaan ini.
        </h3>
      </div>

      <PaginationComponent
        v-if="jobApplicantsPagination.totalPages > 1"
        @goNext="pagination.page++"
        @goPrevious="pagination.page--"
        :page="pagination.page"
        :totalPages="jobApplicantsPagination.totalPages">
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
