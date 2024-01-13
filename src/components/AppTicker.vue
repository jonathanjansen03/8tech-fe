<script setup>
import { computed } from 'vue';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const isSuccessType = computed(() => props.type === 'success');
const colors = computed(() =>
  isSuccessType.value
    ? {
        darkBackground: { 'bg-green-700': true },
        lightBackground: { 'bg-green-50': true },
        border: { 'border-green-700': true },
        text: { 'text-green-700': true },
      }
    : {
        darkBackground: { 'bg-red-700': true },
        lightBackground: { 'bg-red-50': true },
        border: { 'border-red-700': true },
        text: { 'text-red-700': true },
      }
);
</script>

<template>
  <div class="ticker border-2 flex rounded-md" :class="colors.border">
    <div class="p-4" :class="colors.darkBackground">
      <CheckCircleIcon v-if="isSuccessType" class="text-green-50 w-6" />
      <ExclamationCircleIcon v-if="!isSuccessType" class="text-red-50 w-6" />
    </div>
    <div
      class="flex items-center pl-4 rounded-md w-full"
      :class="{ ...colors.text, ...colors.lightBackground }"
    >
      {{ props.message }}
    </div>
  </div>
</template>
