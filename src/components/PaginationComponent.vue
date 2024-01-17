<script setup>
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/vue/24/outline/index.js';

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['goNext', 'goPrevious']);
const goBack = () => {
  emit('goPrevious');
};

const goNext = () => {
  emit('goNext');
};

</script>

<template>

  <div class="flex flex-col items-center mt-5">
    <slot></slot>
    <div class="flex flex-row">
      <button class="flex items-center justify-center px-3 font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900"
              @click="goBack">
        <ChevronDoubleLeftIcon class="cursor-pointer w-5"/>
        Prev
      </button>
      <p
        class="flex items-center justify-center px-3 font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900">
        Page {{ props.page }} of {{ props.totalPages }}</p>
      <button class="flex items-center justify-center px-3 font-medium text-white bg-gray-800 rounded-e hover:bg-gray-900"
              @click="goNext">
        Next
        <ChevronDoubleRightIcon class="cursor-pointer w-5"/>
      </button>
    </div>
  </div>
</template>
