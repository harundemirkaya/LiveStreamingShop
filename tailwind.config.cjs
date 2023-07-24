/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      screens: {
        '3xl': '1600px'
      },
      colors: {
        primary: '#36454F',
        secondary: '#7A7A7A',
        info: '#FF7643',
        cream: '#e6e6e6',
      },
      backgroundImage: {
        'linear-bg':
          'linear-gradient(89.98deg, #252525 -0.73%, rgba(51, 51, 51, 0.84) 102.21%)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
