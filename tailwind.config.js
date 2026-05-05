/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'inha-blue': '#0099CC',
        'inha-blue-light': '#33B5E5',
        'inha-blue-dark': '#007299',
      },
    },
  },
}
