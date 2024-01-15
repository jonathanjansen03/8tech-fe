<script setup>
import SearchBar from '@/components/SearchBar.vue';
import JobCard from '@/components/JobCard.vue';
import SideBar from '@/components/SideBar.vue';
</script>

<template>
  <div class="sm:px-20">
    <SideBar />
    <div>
      <h1 class="text-center font-bold mb-8 text-white text-2xl">
        Ketika Tech Talent Bertemu dengan Peluang Tak Terbatas.
      </h1>
      <SearchBar class="mt-5" />
      <p class="text-xl mt-10 text-white">Lowongan kerja terbaru:</p>
      <div
        class="home__job-cards md:grid md:grid-cols-2 md:gap-x-8 xl:grid-cols-3 2xl:grid-cols-4"
      >
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

        <JobCard
          :job="{
            title: 'Senior Data Scientist',
            company: 'Amazon',
            logo: 'https://i.pinimg.com/originals/01/ca/da/01cada77a0a7d326d85b7969fe26a728.jpg',
            location: 'Washington, United States',
          }"
        />
      </div>
    </div>
  </div>
</template>
