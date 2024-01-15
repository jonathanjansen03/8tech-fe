<script setup>
import SideBar from '@/components/SideBar.vue';
import { onBeforeUnmount, onMounted } from 'vue';
import { useMainStore } from '@/stores/main.js';

const mainStore = useMainStore();

onMounted(() => {
  mainStore.setRecruiterPortal(true);
})

onBeforeUnmount(() => {
  mainStore.setRecruiterPortal(false);
  mainStore.closePortalNavbar();
})

</script>

<template>
  <div class="sm:px-20">
    <SideBar class="sidebar" v-if="mainStore.showPortalNavbar"/>
    <div>
      <h1 class="text-center font-bold mb-8 text-white text-2xl">
        Ketika Tech Talent Bertemu dengan Peluang Tak Terbatas.
      </h1>
      <p class="text-xl mt-10 text-white">Lowongan pekerjaan kamu:</p>

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
            <th class="">
              Color
            </th>
          </tr>
          </thead>
          <tbody>
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="px-6 py-4">
              1.
            </td>
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Apple MacBook Pro 17"
            </th>
            <td class="px-6 py-4">
              Silver
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
.sidebar{
  transition: .2s ease-in-out;
}
</style>
