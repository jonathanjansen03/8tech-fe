<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

import { useUserStore } from '@/stores/user';
import { useJobStore } from '@/stores/job';
import config from '@/config';
import AppButton from '@/components/AppButton.vue';
import DropdownList from '@/components/DropdownList.vue';

const { currentUserToken } = storeToRefs(useUserStore());
const { searchJobs } = useJobStore();
const searchTerm = ref('');
const field = ref('Judul');

const search = async () => {
  if (!searchTerm.value) {
    return;
  }

  try {
    await searchJobs(
      {
        keyword: searchTerm.value,
        field: config.api.jobFilterFields[field.value],
        page: 1,
        size: config.api.defaultPageSize,
      },
      currentUserToken.value
    );
  } catch (err) {
    alert(config.errors.general('mencari pekerjaan'));
  }
};
</script>

<template>
  <div
    class="flex flex-col items-center mt-5 relative text-center w-full md:flex-row"
    @keydown.enter="search">
    <div class="w-full">
      <MagnifyingGlassIcon
        class="search-bar__job-name absolute left-3 text-gray-400 top-[0.9rem] w-5 md:top-[0.9rem]" />
      <input
        type="text"
        class="flex-1 pl-44 pr-20 py-3 rounded-xl w-full"
        placeholder="Cari pekerjaan"
        v-model="searchTerm" />
    </div>
    <AppButton
      class="max-md:mt-2 max-md:w-32 max-md:py-2 md:absolute md:right-1.5 md:top-1.3"
      @click="search">
      Cari
    </AppButton>
    <DropdownList
      class="absolute left-11 top-1 w-[7.5rem]"
      :options="Object.keys(config.api.jobFilterFields)"
      v-model="field" />
  </div>
</template>
