<script setup>
import { onBeforeMount, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useMainStore } from '@/stores/main';
import { useUserStore } from '@/stores/user';
import { useContractStore } from '@/stores/contract';
import config from '@/config';
import PaginationComponent from '@/components/PaginationComponent.vue';
import NProgress from 'nprogress';

const GET_CONTRACT_LIST = 'mendapatkan daftar kontrak';

const router = useRouter();
const mainStore = useMainStore();
const userStore = useUserStore();
const contractStore = useContractStore();

const { currentUserToken } = storeToRefs(userStore);
const { recruiterContractList, recruiterContractListPagination } =
  storeToRefs(contractStore);
const { getRecruiterContractList, statusMapping } = contractStore;

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
    await getRecruiterContractList(
      {
        page: pagination.page,
        size: pagination.size,
      },
      currentUserToken.value
    );
  } catch (err) {
    console.error(err);
    alert(config.errors.general(GET_CONTRACT_LIST));
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

  if (newPagination.page > recruiterContractListPagination.value.totalPages) {
    pagination.page = recruiterContractListPagination.value.totalPages;
    return;
  }

  isLoadingFetchApi.value = true;

  try {
    await getRecruiterContractList(
      {
        page: pagination.page,
        size: pagination.size,
      },
      currentUserToken.value
    );
  } catch (err) {
    console.error(err);
    alert(config.errors.general(GET_CONTRACT_LIST));
  }

  isLoadingFetchApi.value = false;
});

const goEditContract = (id) => {
  router.push({
    name: config.pages.editContract.name,
    params: {
      id,
    },
    query: {
      update: true,
    },
  });
};
</script>

<template>
  <div class="sm:px-20">
    <div>
      <h1 class="text-center font-bold mb-8 text-white text-2xl">
        Daftar kontrak yang sedang berlangsung
      </h1>

      <div class="relative overflow-x-auto">
        <table
          v-if="recruiterContractList.length"
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th class="px-6 py-3 w-20">No.</th>
              <th class="px-6 py-3">Judul Kontrak</th>
              <th class="px-6 py-3 text-center">Terakhir di update</th>
              <th class="px-6 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in recruiterContractList"
              :key="index"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-950"
              @click="goEditContract(item.id)">
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
                {{ item.updatedAt }}
              </th>
              <th
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
                scope="row">
                {{ statusMapping(item.status) }}
              </th>
            </tr>
          </tbody>
        </table>
        <h3 v-if="!recruiterContractList.length" class="text-center text-white">
          Belum ada kontrak yang sedang berjalan.
        </h3>
      </div>

      <PaginationComponent
        v-if="recruiterContractListPagination.totalPages > 1"
        :page="pagination.page"
        :totalPages="recruiterContractListPagination.totalPages"
        @goNext="pagination.page++"
        @goPrevious="pagination.page--">
        <img
          v-if="isLoadingFetchApi"
          alt="loading"
          class="h-8 mb-2"
          src="@/assets/images/loading.svg" />
      </PaginationComponent>
    </div>
  </div>
</template>
