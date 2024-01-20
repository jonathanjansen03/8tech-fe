<script setup>
import { ref } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'blur']);

const showDropdown = ref(false);

const select = (value) => {
  showDropdown.value = false;
  emit('update:modelValue', value);
};
</script>

<template>
  <div class="flex flex-col">
    <div
      class="bg-white flex justify-between px-3 py-2 rounded-xl shadow-md"
      @click="showDropdown = !showDropdown">
      {{ props.modelValue }} <ChevronDownIcon class="ml-3 w-3" />
    </div>
    <Transition>
      <div
        v-if="showDropdown"
        class="bg-white flex flex-col py-3 mt-3 rounded-xl shadow-md">
        <div
          v-for="(i, index) in props.options"
          :key="index"
          @click="select(i)"
          class="cursor-pointer text-left hover:bg-gray-200 px-3"
          :class="{ 'mt-1': index!==0 }">
          {{ i }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
