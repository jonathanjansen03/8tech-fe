<script setup>
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/stores/user';
import { useContractStore } from '@/stores/contract';
import config from '@/config';

import PaginationComponent from '@/components/PaginationComponent.vue';
import AppButton from '@/components/AppButton.vue';
import NProgress from 'nprogress';

const GET_APPLIED_JOBS = 'mendapatkan daftar pekerjaan';
const REJECT_CONTRACT = 'membatalkan lamaran pekerjaan';

const router = useRouter();
const userStore = useUserStore();
const contractStore = useContractStore();

const { currentUserToken, userAppliedJobs, userAppliedJobsPagination } =
  storeToRefs(userStore);
const { getUserAppliedJobs } = userStore;
const { rejectContract } = contractStore;

const pagination = reactive({
  page: 1,
  size: 5,
});
const isLoadingFetchApi = ref(false);

const initPage = async () => {
  isLoadingFetchApi.value = true;
  NProgress.start();
  try {
    await getUserAppliedJobs(pagination);
  } catch (err) {
    console.error(err);
    alert(config.errors.general(GET_APPLIED_JOBS));
  }
  isLoadingFetchApi.value = false;
  NProgress.done();
};

const goToJobDetailPage = (id) => {
  router.push({
    name: config.pages.jobDetail.name,
    params: { id },
    query: { ref: 'appliedJobs' },
  });
};

const goToContractDetailPage = (id) => {
  router.push({
    name: config.pages.contractDetail.name,
    params: { id },
  });
};

const trimJobDescription = (description) => {
  if (description.length > 30) {
    return `${description.slice(0, 30)}...`;
  }
  return description;
};

const unapplyJob = async (id) => {
  try {
    await rejectContract(id, currentUserToken.value);
    await getUserAppliedJobs(pagination);
  } catch (err) {
    console.error(err);
    alert(config.errors.general(REJECT_CONTRACT));
  }
};

onBeforeMount(initPage);

watch(pagination, async (newPagination) => {
  if (newPagination.page < 1) {
    pagination.page = 1;
    return;
  }

  if (newPagination.page > userAppliedJobsPagination.value.totalPages) {
    pagination.page = userAppliedJobsPagination.value.totalPages;
    return;
  }

  isLoadingFetchApi.value = true;

  try {
    await getUserAppliedJobs(pagination);
  } catch (err) {
    console.error(err);
    alert(config.errors.general(GET_APPLIED_JOBS));
  }

  isLoadingFetchApi.value = false;
});
</script>

<template>
  <div>
    <div class="sm:px-20">
      <div>
        <h1 class="text-center font-bold mb-8 text-white text-2xl">
          Daftar Lamaran Pekerjaan
        </h1>

        <div class="relative overflow-x-auto">
          <table
            v-if="userAppliedJobs.length"
            class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th class="px-6 py-3 w-16">No.</th>
                <th class="px-6 py-3 w-10">Judul Pekerjaan</th>
                <th class="px-6 py-3">Deskripsi Pekerjaan</th>
                <th class="px-6 py-3 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(job, index) in userAppliedJobs"
                :key="index"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-950">
                <td class="px-6 py-4">
                  {{ (pagination.page - 1) * pagination.size + index + 1 }}
                </td>
                <td
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {{ job.title }}
                </td>
                <td
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {{ trimJobDescription(job.description) }}
                </td>
                <td class="px-6 py-4">
                  <div
                    v-if="
                      job.contractStatus ===
                      config.constants.contractStatus.pending
                    "
                    class="flex justify-center gap-x-3">
                    <AppButton
                      class="w-full"
                      @click="goToJobDetailPage(job.id)">
                      Lihat detail
                    </AppButton>
                    <AppButton
                      type="danger"
                      class="w-full"
                      @click="unapplyJob(job.contractId)">
                      Batal melamar pekerjaan
                    </AppButton>
                  </div>
                  <div
                    v-if="
                      job.contractStatus !==
                      config.constants.contractStatus.pending
                    ">
                    <AppButton
                      class="w-full"
                      @click="goToContractDetailPage(job.contractId)">
                      Lihat kontrak
                    </AppButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 v-if="!userAppliedJobs.length" class="text-center text-white">
            Belum ada pekerjaan yang dilamar.
          </h3>
        </div>

        <PaginationComponent
          v-if="userAppliedJobsPagination.totalPages > 1"
          @goNext="pagination.page++"
          @goPrevious="pagination.page--"
          :page="pagination.page"
          :totalPages="userAppliedJobsPagination.totalPages">
          <img
            v-if="isLoadingFetchApi"
            alt="loading"
            class="h-8 mb-2"
            src="@/assets/images/loading.svg" />
        </PaginationComponent>
      </div>
    </div>
  </div>
</template>
