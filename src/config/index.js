export default {
  appName: '8Tech',
  pages: {
    home: {
      name: 'home',
      path: '/',
    },
    about: {
      name: 'about',
      path: '/about',
    },
    register: {
      name: 'register',
      path: '/register',
    },
    login: {
      name: 'login',
      path: '/login',
    },
    profile: {
      name: 'profile',
      path: '/profile',
    },
    userProfile: {
      name: 'user-profile',
      path: '/user/:id',
    },
    editProfile: {
      name: 'editProfile',
      path: '/profile/edit',
    },
    recruiterPortal: {
      name: 'recruiter-portal',
      path: '/portal',
    },
    createJob: {
      name: 'create-job',
      path: '/create-job',
    },
    jobDetail: {
      name: 'job-detail',
      path: '/job-detail/:id',
    },
    applicantList: {
      name: 'job-applicant',
      path: '/job-applicant/:id',
    },
  },
  api: {
    basePath: 'https://api-8-tech.koyeb.app',
    method: {
      get: 'GET',
      post: 'POST',
      put: 'PUT',
      delete: 'DELETE',
    },
    authTokenHeader: (token) => ({
      Authorization: `Bearer ${token}`,
    }),
    defaultPageSize: 12,
    jobFilterFields: { Judul: 'title', Deskripsi: 'description' },
    auth: {
      register: '/auth/register',
      login: '/auth/login',
    },
    user: {
      info: '/user/info',
      updateData: '/user/update/me',
      uploadProfilePicture: '/user/uploadProfilePicture',
    },
    company: {
      create: '/company/create',
    },
    job: {
      create: '/job/create',
      filter: '/job/filter',
      update: '/job/update',
      info: '/job',
      applicant: '/job/applicants',
    },
  },
  errors: {
    general: (action) => `Gagal ${action}. Silakan coba lagi nanti.`,
    server: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
    invalidCredentials: 'Email atau password salah.',
    form: {
      firstName: 'Minimal 2 karakter.',
      lastName: 'Minimal 2 karakter.',
      email: 'Masukkan email yang valid.',
      password: 'Password harus memiliki minimal 8 karakter dan 1 angka.',
      confirmPassword: 'Harus sama dengan password.',
      unique: 'Email sudah terdaftar. Silakan gunakan email lain.',
      required: 'Harus diisi.',
    },
  },
};
