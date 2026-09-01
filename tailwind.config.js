/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#efeee9",
      },
      fontFamily: {
        // Editorial hero
        hn: ['"Helvetica Neue ME"', 'Helvetica', 'Arial', 'sans-serif'],
        sansserif: ['"Helvetica Neue ME"', 'Helvetica', 'Arial', 'sans-serif'],
        // Rest of the portfolio
        kanit: ['"Kanit"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
