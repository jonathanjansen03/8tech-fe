<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  textArea: {
    type: Boolean,
    default: false,
  },
  label: String,
  modelValue: String,
  error: String,
  textAreaHeight: {
    type: String,
    default: 'h-32',
  },
});
defineEmits(['update:modelValue', 'blur']);

const labelClasses = computed(() => {
  return {
    'absolute left-2 top-2': props.modelValue === '',
    'input__label--filled': props.modelValue !== '',
    'peer-focus:text-indigo-500': !props.error,
    'text-red-500 peer-focus:text-red-500': props.error,
  };
});
</script>

<template>
  <div class="input relative">
    <textarea
      v-if="textArea"
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
        [props.textAreaHeight]: true
      }"
    ></textarea>
    <input
      v-else
      :id="props.id"
      name="input"
      :type="props.type"
      :value="props.modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      class="border p-2 peer rounded-md w-full {{props.textAreaHeight}}"
      :class="{
        'border-gray-500 focus:outline-indigo-500': !props.error,
        'border-red-500 focus:outline-red-500': props.error,
      }"
    />
    <label
      :for="props.id"
      class="absolute left-2 top-2 transition-input-box hover:cursor-text peer-focus:text-indigo-500 peer-focus:text-xs peer-focus:-top-2 peer-focus:bg-white"
      :class="labelClasses">
      {{ props.label }}
    </label>
    <div class="error-message relative">
      <p class="absolute text-red-500 text-sm" v-if="props.error">
        {{ props.error }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.input__label--filled {
  background: white;
  font-size: 0.75rem;
  line-height: 1rem;
  top: -0.5rem;
}
</style>
