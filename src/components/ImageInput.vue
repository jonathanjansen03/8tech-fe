<script setup>
import { computed, ref } from 'vue';

import { CameraIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  image: {
    required: true,
  },
  defaultImage: {
    required: true,
  },
});
const emit = defineEmits(['change']);

const imageInput = ref(null);

const displayedImage = computed(() => props.image ?? props.defaultImage);

const uploadImage = () => {
  const fileReader = new FileReader();

  fileReader.addEventListener('load', () => {
    emit('change', {
      file: imageInput.value.files[0],
      base64: fileReader.result,
    });
  });
  fileReader.readAsDataURL(imageInput.value.files[0]);
};
</script>

<template>
  <label for="image-input" class="cursor-pointer relative">
    <input
      type="file"
      id="image-input"
      class="hidden peer"
      accept="image/*"
      ref="imageInput"
      @change="uploadImage" />
    <img
      :src="displayedImage"
      alt="User profile picture."
      class="brightness-100 drop-shadow duration-200 rounded-full transition w-36 hover:brightness-50 peer-hover:brightness-[.25]" />
    <span
      class="absolute bottom-20 duration-200 hidden left-6 peer text-center transition text-white hover:inline-block peer-hover:inline-block">
      Ganti gambar<br />
      profil.
    </span>
    <div class="bg-black bottom-8 p-2 relative left-28 rounded-full w-fit">
      <CameraIcon class="text-white w-4" />
    </div>
  </label>
</template>
