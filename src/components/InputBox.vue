<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  label: String,
  modelValue: String,
  error: Boolean,
});
defineEmits(['update:modelValue', 'blur']);
</script>

<template>
  <div>
    <label for="input">{{ props.label }}</label>
    <input
      name="input"
      :type="props.type"
      :value="props.modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      class="border border-gray-500 p-2 rounded-md w-full focus:outline-indigo-500"
    />
  </div>
</template>
