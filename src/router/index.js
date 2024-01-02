import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import config from '@/config';

const HomePage = () => import('@/pages/HomePage.vue');
const AboutUs = () => import('@/pages/AboutUs.vue');
const RegisterPage = () => import('@/pages/RegisterPage.vue');
const LoginPage = () => import('@/pages/LoginPage.vue');
const UserProfile = () => import('@/pages/UserProfile.vue');

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
      component: AboutUs,
      meta: {
        title: 'About Us',
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
    {
      path: config.pages.profile.path,
      name: config.pages.profile.name,
      component: UserProfile,
      meta: {
        title: 'Profile',
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to) => {
  const userStore = useUserStore();

  document.title = `${to.meta.title} | ${config.appName}`;

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return {
      path: config.pages.login.path,
      query: { redirect: to.fullPath },
    };
  }
});

export default router;
