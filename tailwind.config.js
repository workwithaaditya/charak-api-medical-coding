/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          primary: 'hsl(158, 43%, 40%)',
          accent: 'hsl(25, 85%, 53%)',
          light: 'hsl(158, 43%, 95%)',
          dark: 'hsl(158, 43%, 20%)'
        }
      }
    },
  },
  plugins: [],
}