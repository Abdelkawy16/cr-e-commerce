/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F06292',
          light: '#F06292',
          dark: '#F06292',
        },
        secondary: {
          DEFAULT: '#03A9F4',
          light: '#4FC3F7',
          dark: '#0288D1',
        },
        accent: {
          DEFAULT: '#ECF0F1',
          light: '#FFFFFF',
          dark: '#BDC3C7',
        },
        success: {
          DEFAULT: '#27AE60',
          light: '#2ECC71',
          dark: '#219A52',
        },
        warning: {
          DEFAULT: '#F1C40F',
          light: '#F9E79F',
          dark: '#D4AC0D',
        },
        error: {
          DEFAULT: '#E74C3C',
          light: '#F1948A',
          dark: '#CB4335',
        },
      },
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
};