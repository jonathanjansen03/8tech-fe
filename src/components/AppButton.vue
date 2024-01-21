<script setup>
import { computed } from 'vue';

const props = defineProps({
  outline: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'primary',
  },
});

const classes = computed(() => {
  if (props.type  === 'primary') {
    if (props.outline) {
      return {
        'bg-white ring-1 ring-blue-700 text-blue-800 active:bg-blue-200 hover:bg-blue-100 hover:shadow-indigo-300': true,
      };
    }
    return {
      'bg-blue-800 text-white active:bg-blue-600 hover:bg-blue-700 hover:shadow-indigo-500': true,
    };
  }

  if (props.type === 'danger') {
    if (props.outline) {
      return {
        'bg-white ring-1 ring-red-700 text-red-800 active:bg-red-200 hover:bg-red-100 hover:shadow-pink-300': true,
      };
    }
    return {
      'bg-red-800 text-white active:bg-red-600 hover:bg-red-700 hover:shadow-pink-500': true,
    };
  }

  return {};
});
</script>

<template>
  <button
    class="duration-300 px-5 py-2 rounded-xl transition focus:outline-blue-200 hover:-translate-y-[0.1rem] hover:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.3)] flex flex-row justify-center items-center"
    :class="classes">
    <slot></slot>
  </button>
</template>
