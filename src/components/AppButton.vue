<script setup>
const props = defineProps({
  outline: Boolean,
});
</script>

<template>
  <button
    class="duration-300 px-5 py-2 rounded-xl transition focus:outline-blue-200 hover:-translate-y-[0.1rem] hover:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.3)]"
    :class="{
      'bg-blue-800': !outline,
      'text-white': !outline,
      'hover:bg-blue-900': !outline,
      'hover:shadow-indigo-500': !outline,
      'active:bg-blue-950': !outline,
      'bg-white': outline,
      'text-blue-800': outline,
      'ring-1 ring-blue-700': outline,
      'hover:bg-blue-100': outline,
      'active:bg-blue-200': outline,
      'hover:shadow-indigo-300': outline,
    }"
  >
    <slot></slot>
  </button>
</template>
