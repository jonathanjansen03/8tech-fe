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
  },
  api: {
    basePath: 'https://api-8-tech.koyeb.app',
    method: {
      get: 'GET',
      post: 'POST',
      put: 'PUT',
      delete: 'DELETE',
    },
    authTokenHeader: (token) => `Bearer ${token}`,
    auth: {
      register: '/auth/register',
      login: '/auth/login',
    },
    user: {
      info: '/user/info',
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
