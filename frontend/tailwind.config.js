/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'college-blue': '#1e3a8a', // Dark blue
        'college-light': '#f3f4f6', // Light background
        'college-dark': '#111827', // Dark navy
      }
    },
  },
  plugins: [],
}
