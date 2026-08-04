/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cinzel Decorative"', "serif"],
        title: ['"Cinzel"', "serif"],
        sans: ['"Manrope"', "system-ui", "sans-serif"],
      },
      colors: {
        stone: {
          950: "#120d08",
          900: "#1a130c",
          800: "#241a10",
          700: "#332415",
          600: "#4a3520",
        },
        gold: {
          300: "#f0d98c",
          400: "#e8c46a",
          500: "#d4af37",
          600: "#b8912a",
        },
        ember: {
          400: "#ff8a5c",
          500: "#ff6a3d",
          600: "#e0502a",
        },
      },
    },
  },
  plugins: [],
};
