<script setup>
const props = defineProps({
  outline: Boolean,
});
</script>

<template>
  <button
    class="border-2 border-blue-800 px-5 py-1 rounded-xl duration-500 linear"
    :class="{
      'bg-blue-800': !outline,
      'bg-white': outline,
      'text-blue-800': outline,
      'text-white': !outline,
    }"
  >
    <slot></slot>
  </button>
</template>
