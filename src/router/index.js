import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import config from '@/config';

const HomePage = () => import('@/pages/HomePage.vue');
const AboutUs = () => import('@/pages/AboutUs.vue');
const RegisterPage = () => import('@/pages/RegisterPage.vue');
const LoginPage = () => import('@/pages/LoginPage.vue');
const UserProfile = () => import('@/pages/UserProfile.vue');
const RecruiterPortal = () => import('@/pages/RecruiterPortal.vue');

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
    {
      path: config.pages.recruiterPortal.path,
      name: config.pages.recruiterPortal.name,
      component: RecruiterPortal,
      meta: {
        title: 'Recruiter Portal',
        requiresAuth: true,
        recruiterRole: true,
      },
    },
  ],
});

router.beforeEach(async (to) => {
  const userStore = useUserStore();
  userStore.setCurrentUser();
  const loginPage = {
    path: config.pages.login.path,
    query: { redirect: to.fullPath },
  };

  document.title = `${to.meta.title} | ${config.appName}`;

  if (to.meta.recruiterRole || to.meta.requiresAuth && !userStore.isLoggedIn) {
    const token = localStorage.getItem('Etoken');
    if (!token) {
      return loginPage;
    }
    const {valid, roles} = await userStore.isTokenValid(token)

    if(!valid) {
      return loginPage;
    }

    userStore.$patch({
      currentUserToken: localStorage.getItem('Etoken'),
      currentUser: JSON.parse(localStorage.getItem('userData')),
    });
    if(to.meta.recruiterRole && !roles.includes('RECRUITER')) {
      return {
        path: config.pages.home.path,
      };
    }
  }
});

export default router;
