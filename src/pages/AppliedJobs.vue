<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/stores/user';
import { useContractStore } from '@/stores/contract';
import config from '@/config';

import PaginationComponent from '@/components/PaginationComponent.vue';
import AppButton from '@/components/AppButton.vue';

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

  try {
    await getUserAppliedJobs(pagination);
  } catch (err) {
    console.error(err);
    alert(config.errors.general(GET_APPLIED_JOBS));
  }
  isLoadingFetchApi.value = false;
};

const goToJobDetailPage = (id) => {
  router.push({
    name: config.pages.jobDetail.name,
    params: { id },
    query: { ref: 'appliedJobs' },
  });
};

const trimJobDescription = (description) => {
  if (description.length > 100) {
    return `${description.slice(0, 100)}...`;
  }
  return description;
};

const unapplyJob = async (id) => {
  console.log(userAppliedJobs.value)
  try {
    await rejectContract(id, currentUserToken.value);
    await getUserAppliedJobs(pagination);
  } catch (err) {
    console.error(err);
    alert(config.errors.general(REJECT_CONTRACT));
  }
};

onBeforeMount(initPage);
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
                <th class="px-6 py-3 w-20">No.</th>
                <th class="px-6 py-3">Judul Pekerjaan</th>
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
                <td class="px-6 py-4 flex justify-center gap-x-3">
                  <AppButton
                    class="w-[12.754rem]"
                    @click="goToJobDetailPage(job.id)">
                    <p>Lihat detail</p>
                  </AppButton>
                  <AppButton type="danger" @click="unapplyJob(job.contractId)">
                    <p>Batal melamar pekerjaan</p>
                  </AppButton>
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
