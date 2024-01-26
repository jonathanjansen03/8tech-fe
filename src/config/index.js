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
    companyProfile: {
      name: 'company-profile',
      path: '/company/:id',
    },
    companyProfileEdit: {
      name: 'company-edit',
      path: '/company/edit',
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
      path: '/job/create',
    },
    jobDetail: {
      name: 'job-detail',
      path: '/job/:id',
    },
    jobEditDetail: {
      name: 'job-edit',
      path: '/job/:id/edit',
    },
    applicantList: {
      name: 'job-applicant',
      path: '/job/:id/applicants',
    },
    contractList: {
      name: 'contract-list',
      path: '/contracts',
    },
    appliedJobs: {
      name: 'applied-jobs',
      path: '/applied-jobs',
    },
    editContract: {
      name: 'contract-edit',
      path: '/contract-edit/:id',
    },
    contractDetail: {
      name: 'contract-detail',
      path: '/contract/:id',
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
    jobFilterFields: {
      Judul: 'title',
      Deskripsi: 'description',
    },
    auth: {
      register: '/auth/register',
      login: '/auth/login',
    },
    user: {
      info: '/user/info',
      updateData: '/user/update/me',
      uploadProfilePicture: '/user/uploadProfilePicture',
      uploadCompanyProfilePicture: '/user/uploadCompanyProfilePicture',
      appliedJobs: '/user/applied',
    },
    company: {
      create: '/company/create',
      info: (id) => `/company/info/${id}`,
      update: '/company/update',
    },
    contract: {
      info: (id) => `/contract/id/${id}`,
      recruiterList: '/contract/recruiterContractList',
      paymentRequest: '/contract/paymentRequest',
      download: (id) => `/contract/generate/${id}`,
      update: '/contract/update',
      reject: (id) => `/contract/reject/${id}`,
      payoutLink: (id) => `/contract/payoutLink/${id}`,
    },
    job: {
      create: '/job/create',
      filter: '/job/filter',
      update: '/job/update',
      findOne: (id) => `/job/${id}`,
      apply: (id) => `/job/apply/${id}`,
      applicant: '/job/applicants',
    },
    rating: {
      create: '/rating/create',
      getAverageRating: (id) => `/rating/averageCount/${id}`,
    },
  },
  errors: {
    general: (action) => `Gagal ${action}. Silakan coba lagi nanti.`,
    server: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
    invalidMethod: 'Method must be GET, POST, PUT or DELETE.',
    invalidCredentials: 'Email atau password salah.',
    form: {
      firstName: 'Minimal 2 karakter.',
      lastName: 'Minimal 2 karakter.',
      email: 'Masukkan email yang valid.',
      password: 'Minimal 8 karakter yang terdiri dari minimal 1 huruf besar, 1 huruf kecil, dan 1 angka.',
      confirmPassword: 'Harus sama dengan password.',
      unique: 'Email sudah terdaftar. Silakan gunakan email lain.',
      required: 'Harus diisi.',
      paymentRate: 'Harus diisi.',
      paymentRateNumber: 'Harus diisi dengan angka.',
      paymentRateMin: 'Harus lebih besar dari Rp10.000.',
    },
    USER_ALREADY_APPLIED: 'Anda sudah melamar pekerjaan ini.',
  },
  constants: {
    contractStatus: {
      pending: 'PENDING',
      accepted: 'ACCEPTED',
      rejected: 'REJECTED',
      ongoing: 'ONGOING',
      completed: 'COMPLETED',
    },
    paymentStatus: {
      pending: 'PENDING',
      paid: 'PAID',
      failed: 'FAILED',
    },
  },
};
