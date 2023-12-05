export default {
  appName: '8Tech',
  pages: {
    home: '/',
    about: '/about',
    register: '/register',
  },
  api: {
    base: 'https://api-8-tech.koyeb.app/',
    auth: {
      register: '/auth/register',
    },
  },
  error: {
    form: {
      INVALID_PASSWORD:
        'Password harus memiliki minimal 8 karakter dan 1 angka.',
    },
  },
};
