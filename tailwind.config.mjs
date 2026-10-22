import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.sky,
        accent: colors.rose,
      },
    },
  },
  plugins: [],
};

export default config;
