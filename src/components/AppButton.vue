<script setup>
const props = defineProps({
  outline: Boolean,
});
</script>

<template>
  <button
    class="duration-300 px-5 py-2 rounded-xl transition focus:outline-blue-200 hover:-translate-y-[0.1rem]
    hover:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.3)] flex flex-row justify-center items-center"
    :class="{
      'bg-blue-800 text-white active:bg-blue-600 hover:bg-blue-700 hover:shadow-indigo-500':
        !outline,
      'bg-white ring-1 ring-blue-700 text-blue-800 active:bg-blue-200 hover:bg-blue-100 hover:shadow-indigo-300':
        outline,
    }"
  >
    <slot></slot>
  </button>
</template>
