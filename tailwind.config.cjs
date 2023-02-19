/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          '50': '#f2f6fc',
          '100': '#e2ebf7',
          '200': '#ccdcf1',
          '300': '#a9c6e7',
          '400': '#7fa7db',
          '500': '#618ad0',
          '600': '#4d71c3',
          '700': '#435fb2',
          '800': '#40559c',
          '900': '#344574',
        },
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
