/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1d4ed8', light: '#3b82f6', dark: '#1e3a8a' },
        teal: { DEFAULT: '#0d9488', light: '#14b8a6', dark: '#0f766e' },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
}
