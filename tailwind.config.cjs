/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'hsla(226, 50%, 54%)',
        'primary-highlight': 'hsla(226, 70%, 74%, 0.7)',
        'primary-light': 'hsla(226, 50%,  54%, 0.4)',
        'secondary': ' hsla(226, 50%, 54%, 0.25)',
        'secondary-light': 'hsla(226, 50%, 54%, 0.1)',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
