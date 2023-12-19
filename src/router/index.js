import { createRouter, createWebHistory } from 'vue-router';
import config from '@/config';

const HomePage = () => import('@/pages/HomePage.vue');
const AboutPage = () => import('@/pages/AboutPage.vue');
const RegisterPage = () => import('@/pages/RegisterPage.vue');
const LoginPage = () => import('@/pages/LoginPage.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: config.pages.home.path,
      name: config.pages.home.name,
      component: HomePage,
      meta: {
        title: 'Home',
      },
    },
    {
      path: config.pages.about.path,
      name: config.pages.about.name,
      component: AboutPage,
      meta: {
        title: 'About',
      },
    },
    {
      path: config.pages.register.path,
      name: config.pages.register.name,
      component: RegisterPage,
      meta: {
        title: 'Register',
      },
    },
    {
      path: config.pages.login.path,
      name: config.pages.login.name,
      component: LoginPage,
      meta: {
        title: 'Log In',
      },
    },
  ],
});

router.beforeEach((to) => {
  document.title = `${to.meta.title} | ${config.appName}`;
});

export default router;
