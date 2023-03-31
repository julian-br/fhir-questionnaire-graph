/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'node': 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;'
      },
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
        'inter': ['Inter var', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [],
}
