/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#26272A',
          text: '#F1EFDF',
          accent: '#E86029',
          border: '#3B3C3F',
        },
        titlebar: {
          bg: '#DDD8C4',
        },
        secondary: {
          bg: '#DDD8C4',
        }
      },
      fontFamily: {
        'dotgothic': ['DotGothic16', 'monospace'],
      },
    },
  },
  plugins: [],
}