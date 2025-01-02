/** @type {import('tailwindcss').Config} */
import scrollbar from 'tailwind-scrollbar'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primaryColor: "#818CF8",
        headingColor: "#181A1E",
        textColor: "#4E545F",
      }
    },
  },
  plugins: [
    scrollbar,
  ],
}