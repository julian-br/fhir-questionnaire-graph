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
        'primary-light': '#A8A4FF',
        'secondary': ' hsla(226, 50%, 54%, 0.25)',
        'secondary-light': 'hsla(226, 50%, 54%, 0.1)',
      },
    },
  },
  plugins: [],
}
