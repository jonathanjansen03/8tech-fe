import { createRouter, createWebHistory } from 'vue-router';
import config from '@/config';

const HomePage = () => import('@/pages/HomePage.vue');
const AboutPage = () => import('@/pages/AboutPage.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: config.pages.home,
      name: 'home',
      component: HomePage,
    },
    {
      path: config.pages.about,
      name: 'about',
      component: AboutPage,
    },
  ],
});

export default router;
