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
  disabled: {
    type: Boolean,
    default: false,
  },
});

const classes = computed(() => {
  if (props.disabled) {
    return {
      'bg-gray-300 text-gray-500 cursor-not-allowed': true,
    };
  }

  const hoverClasses = {
    'hover:-translate-y-[0.1rem] hover:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.3)]': true
  };

  if (props.type  === 'primary') {
    if (props.outline) {
      return {
        ...hoverClasses,
        'bg-white ring-1 ring-blue-700 text-blue-800 active:bg-blue-200 hover:bg-blue-100 hover:shadow-indigo-300': true,
      };
    }
    return {
      ...hoverClasses,
      'bg-blue-800 text-white active:bg-blue-600 hover:bg-blue-700 hover:shadow-indigo-500': true,
    };
  }

  if (props.type === 'danger') {
    if (props.outline) {
      return {
        ...hoverClasses,
        'bg-white ring-1 ring-red-700 text-red-800 active:bg-red-200 hover:bg-red-100 hover:shadow-pink-300': true,
      };
    }
    return {
      ...hoverClasses,
      'bg-red-800 text-white active:bg-red-600 hover:bg-red-700 hover:shadow-pink-500': true,
    };
  }

  return {};
});
</script>

<template>
  <button
    class="duration-300 px-5 py-2 rounded-xl transition focus:outline-blue-200 flex flex-row justify-center items-center"
    :class="classes" :disabled="props.disabled">
    <slot></slot>
  </button>
</template>
