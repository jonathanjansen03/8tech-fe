<script setup>
import {
  XMarkIcon,
  PlusCircleIcon,
  HomeIcon
} from '@heroicons/vue/24/outline';
import { useMainStore } from '@/stores/main.js';
import router from '@/router/index.js';
import config from '@/config/index.js';

const mainStore = useMainStore();
</script>

<template>
  <div>
    <aside class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
          <li>
            <XMarkIcon
              @click="mainStore.togglePortalNavbar()"
              class="cursor-pointer w-10 text-gray-500"/>
          </li>
          <li>
            <a @click="router.push(config.pages.recruiterPortal.path)" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <HomeIcon
                class="cursor-pointer w-10 text-gray-500"/>
              <span class="ms-3">Portal</span>
            </a>
          </li>
          <li>
            <a @click="router.push(config.pages.createJob.path)" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <PlusCircleIcon
                class="cursor-pointer w-10 text-gray-500"/>
              <span class="ms-3">Buat Lowongan Pekerjaan</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>
