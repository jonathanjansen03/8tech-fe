/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      backgroundImage: {
        hero: 'url("@/assets/hero-grid-dark.png")',
      },
      transitionProperty: {
        'input-box': 'font-size, left, top',
      },
    },
  },
  mode: 'jit',
  plugins: [],
};
