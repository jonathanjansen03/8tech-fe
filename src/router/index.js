import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';

import { useUserStore } from '@/stores/user';
import config from '@/config';

const HomePage = () => import('@/pages/HomePage.vue');
const AboutUs = () => import('@/pages/AboutUs.vue');
const RegisterPage = () => import('@/pages/RegisterPage.vue');
const LoginPage = () => import('@/pages/LoginPage.vue');
const UserProfile = () => import('@/pages/UserProfile.vue');
const EditProfile = () => import('@/pages/EditProfile.vue');
const RecruiterPortal = () => import('@/pages/RecruiterPortal.vue');
const CreateJob = () => import('@/pages/CreateJob.vue');
const EditJob = () => import('@/pages/EditJob.vue');
const JobDetail = () => import('@/pages/JobDetail.vue');
const ApplicantList = () => import('@/pages/ApplicantList.vue');
const CompanyProfile = () => import('@/pages/CompanyProfile.vue');
const EditCompanyProfile = () => import('@/pages/EditCompanyProfile.vue');
const CreateContract = () => import('@/pages/CreateContract.vue');
const AppliedJobs = () => import('@/pages/AppliedJobs.vue');
const ContractList = () => import('@/pages/ContractList.vue');
const ContractDetail = () => import('@/pages/ContractDetail.vue');

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
      path: config.pages.userProfile.path,
      name: config.pages.userProfile.name,
      component: UserProfile,
      meta: {
        title: 'Profil',
      },
    },
    {
      path: config.pages.companyProfile.path,
      name: config.pages.companyProfile.name,
      component: CompanyProfile,
      meta: {
        title: 'Profil Perusahaan',
      },
    },
    {
      path: config.pages.companyProfileEdit.path,
      name: config.pages.companyProfileEdit.name,
      component: EditCompanyProfile,
      meta: {
        title: 'Ubah Profil Perusahaan',
        requiresAuth: true,
        recruiterRole: true,
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
        title: 'Portal Recruiter',
        requiresAuth: true,
        recruiterRole: true,
      },
    },
    {
      path: config.pages.createJob.path,
      name: config.pages.createJob.name,
      component: CreateJob,
      meta: {
        title: 'Buat Pekerjaan',
        requiresAuth: true,
        recruiterRole: true,
      },
    },
    {
      path: config.pages.jobDetail.path,
      name: config.pages.jobDetail.name,
      component: JobDetail,
      meta: {
        title: 'Detail Pekerjaan',
      },
    },
    {
      path: config.pages.jobEditDetail.path,
      name: config.pages.jobEditDetail.name,
      component: EditJob,
      meta: {
        title: 'Ubah Detail Pekerjaan',
      },
    },
    {
      path: config.pages.applicantList.path,
      name: config.pages.applicantList.name,
      component: ApplicantList,
      meta: {
        title: 'Daftar Pelamar Kerja',
        requiresAuth: true,
      },
    },
    {
      path: config.pages.contractList.path,
      name: config.pages.contractList.name,
      component: ContractList,
      meta: {
        title: 'Daftar Kontrak',
        requiresAuth: true,
        recruiterRole: true,
      },
    },
    {
      path: config.pages.appliedJobs.path,
      name: config.pages.appliedJobs.name,
      component: AppliedJobs,
      meta: {
        title: 'Daftar Pekerjaan yang Dilamar',
        requiresAuth: true,
      },
    },
    {
      path: config.pages.editContract.path,
      name: config.pages.editContract.name,
      component: CreateContract,
      meta: {
        title: 'Buat Kontrak',
        requiresAuth: true,
        recruiterRole: true,
      },
    },
    {
      path: config.pages.contractDetail.path,
      name: config.pages.contractDetail.name,
      component: ContractDetail,
      meta: {
        title: 'Detail Kontak',
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }
  next();
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

router.beforeEach(async (to) => {
  document.title = `${to.meta.title} | ${config.appName}`;

  const userStore = useUserStore();
  userStore.setCurrentUser();
  const loginPage = {
    path: config.pages.login.path,
    query: { redirect: to.fullPath },
  };

  if (to.path === config.pages.home.path && userStore.isRecruiter) {
    return {
      path: config.pages.recruiterPortal.path,
    };
  }

  if (
    (to.meta.requiresAuth && !userStore.isLoggedIn) ||
    to.meta.recruiterRole
  ) {
    const token = localStorage.getItem('Etoken');

    if (!token) {
      return loginPage;
    }

    const { valid } = await userStore.isTokenValid(token);

    if (!valid) {
      return loginPage;
    }

    userStore.$patch({
      currentUserToken: localStorage.getItem('Etoken'),
      currentUser: JSON.parse(localStorage.getItem('userData')),
    });


    if (to.meta.recruiterRole && !userStore.isRecruiter) {
      return {
        path: config.pages.home.path,
      };
    }
  }
});

export default router;
