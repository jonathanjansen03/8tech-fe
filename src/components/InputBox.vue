<script setup>
import { computed, onMounted } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  label: String,
  modelValue: String,
  error: String,
});
defineEmits(['update:modelValue', 'blur']);

const labelClasses = computed(() => {
  return {
    'absolute left-2 top-2': props.modelValue === '',
    'peer-focus:text-indigo-500': !props.error,
    'text-red-500 peer-focus:text-red-500': props.error,
  };
});
</script>

<template>
  <div class="relative">
    <input
      :id="props.id"
      name="input"
      :type="props.type"
      :value="props.modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      class="border p-2 peer rounded-md w-full"
      :class="{
        'border-gray-500 focus:outline-indigo-500': !props.error,
        'border-red-500 focus:outline-red-500': props.error,
      }"
    />
    <label
      :for="props.id"
      class="absolute left-2 top-2 transition-all hover:cursor-text peer-focus:text-indigo-500 peer-focus:text-xs peer-focus:-top-2 peer-focus:bg-white"
      :class="{
        ...labelClasses,
        'bg-white text-xs -top-[0.5rem]': props.modelValue !== '',
      }"
      >{{ props.label }}</label
    >
    <div class="relative">
      <p class="absolute text-red-500 text-sm" v-if="props.error">
        {{ props.error }}
      </p>
    </div>
  </div>
</template>
