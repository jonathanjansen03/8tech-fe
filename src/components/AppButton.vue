<script setup>
const props = defineProps({
  outline: Boolean,
});
</script>

<template>
  <button
    class="px-5 py-2 rounded-xl transition focus:outline-none"
    :class="{
      'bg-blue-800': !outline,
      'text-white': !outline,
      'hover:bg-blue-900': !outline,
      'active:bg-blue-950': !outline,
      'bg-white': outline,
      'text-blue-800': outline,
      'hover:bg-blue-200': outline,
      'active:bg-blue-300': outline,
    }"
  >
    <slot></slot>
  </button>
</template>
