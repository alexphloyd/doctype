/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,jsx,ts}'],
  theme: {
    fontFamily: {
      sans: ['"Roboto"'],
    },
    extend: {
      colors: {
        primary: 'rga(35, 39, 47)',
        secondary: 'rgb(64, 71, 86)',

        accent: '#007AFF',
        danger: '#E03131',

        fontPrimary: 'rga(35, 39, 47)',
        fontSecondary: 'rgba(51, 51, 51, 0.7)',

        bgPrimary: '#f7f7fa',

        borderDark: '#E7E7E7',
        borderLight: 'rgb(229 231 235 / 0.7)',
      },
      fontSize: {
        sm: '0.75rem',
        base: '0.91rem',
        md: '0.95rem',
        lg: '1rem',
        xl: '1.13rem',
      },
      screens: {
        sm: '690px',

        md: '898px',

        lg: '1024px',

        xl: '1300px',

        '2xl': '1536px',
      },
    },
  },

  plugins: [],
};
