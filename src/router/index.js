import { createRouter, createWebHistory } from 'vue-router';
import config from '@/config';

const HomePage = () => import('@/pages/HomePage.vue');
const AboutPage = () => import('@/pages/AboutPage.vue');
const SignUp = () => import('@/pages/SignUp.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: config.pages.home,
      name: 'home',
      component: HomePage,
      meta: {
        title: 'Home',
      },
    },
    {
      path: config.pages.about,
      name: 'about',
      component: AboutPage,
      meta: {
        title: 'About',
      },
    },
    {
      path: config.pages.signUp,
      name: 'sign-up',
      component: SignUp,
      meta: {
        title: 'Sign Up',
      },
    },
  ],
});

router.beforeEach((to) => {
  document.title = `${to.meta.title} | ${config.appName}`;
});

export default router;
