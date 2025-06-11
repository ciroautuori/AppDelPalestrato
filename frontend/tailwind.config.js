/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#FFD700',
        'brand-dark': '#121212',
        'brand-dark-secondary': '#1E1E1E',
        'brand-light': '#E0E0E0',
        'brand-gray': '#333333',
      }
    },
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    themes: ["night"],
  },
} 