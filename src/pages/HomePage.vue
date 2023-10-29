<script setup>
import SearchBar from '@/components/SearchBar.vue';
import JobCard from '@/components/JobCard.vue';
</script>

<template>
  <div class="px-10 py-10 sm:px-20">
    <div>
      <h1 class="text-center font-bold text-white text-2xl">
        Ketika Tech Talent Bertemu Dengan Peluang Tak Terbatas.
      </h1>
      <SearchBar class="mt-5" />
      <p class="text-xl mt-8 text-white">Lowongan kerja terbaru:</p>
      <JobCard
        :job="{
          title: 'Software Engineer',
          company: 'Google',
          logo: 'https://banner2.cleanpng.com/20180324/iww/kisspng-google-logo-g-suite-google-5ab6f1cee66464.5739288415219388949437.jpg',
          location: 'California, United States',
        }"
      />
      <JobCard
        :job="{
          title: 'UI/UX Designer',
          company: 'Spotify',
          logo: 'https://i.pinimg.com/originals/1d/f4/6e/1df46e5b59ceaf54b63302e95644fd80.png',
          location: 'Stockholm, Sweden',
        }"
      />
    </div>
  </div>
</template>
