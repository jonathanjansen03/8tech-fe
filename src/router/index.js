import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import config from '@/config';
import CreateJob from '@/pages/CreateJob.vue';
// import NProgress from 'nprogress';

const HomePage = () => import('@/pages/HomePage.vue');
const AboutUs = () => import('@/pages/AboutUs.vue');
const RegisterPage = () => import('@/pages/RegisterPage.vue');
const LoginPage = () => import('@/pages/LoginPage.vue');
const UserProfile = () => import('@/pages/UserProfile.vue');
const EditProfile = () => import('@/pages/EditProfile.vue');
const RecruiterPortal = () => import('@/pages/RecruiterPortal.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: config.pages.home.path,
      name: config.pages.home.name,
      component: HomePage,
      meta: {
        title: 'Beranda',
      },
    },
    {
      path: config.pages.about.path,
      name: config.pages.about.name,
      component: AboutUs,
      meta: {
        title: 'Tentang Kami',
      },
    },
    {
      path: config.pages.register.path,
      name: config.pages.register.name,
      component: RegisterPage,
      meta: {
        title: 'Daftar',
      },
    },
    {
      path: config.pages.login.path,
      name: config.pages.login.name,
      component: LoginPage,
      meta: {
        title: 'Masuk',
      },
    },
    {
      path: config.pages.profile.path,
      name: config.pages.profile.name,
      component: UserProfile,
      meta: {
        title: 'Profil',
        requiresAuth: true,
      },
    },
    {
      path: config.pages.editProfile.path,
      name: config.pages.editProfile.name,
      component: EditProfile,
      meta: {
        title: 'Edit Profil',
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
    {
      path: config.pages.createJob.path,
      name: config.pages.createJob.name,
      component: CreateJob,
      meta: {
        title: 'Create Job',
        requiresAuth: true,
        recruiterRole: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name) {
    NProgress.start()
  }
  next()
})

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start()
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

router.beforeEach(async (to) => {
  const userStore = useUserStore();
  userStore.setCurrentUser();
  const loginPage = {
    path: config.pages.login.path,
    query: { redirect: to.fullPath },
  };

  document.title = `${to.meta.title} | ${config.appName}`;

  if ((to.meta.requiresAuth && !userStore.isLoggedIn) || to.meta.recruiterRole) {
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
