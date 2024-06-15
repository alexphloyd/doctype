/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{tsx,jsx,ts}'],
    theme: {
        fontFamily: {
            sans: ['"Roboto"'],
        },
        extend: {
            colors: {
                accent: '#007AFF',
                danger: '#E03131',

                backgroundPrimaryDarker: '#f7f7fa',

                fontPrimary: '#333333',
                fontSecondary: 'rgba(51, 51, 51, 0.7)',

                borderPrimary: '#f2f2f7',
                borderDark: '#EEEEEE',
                borderLight: 'rgb(229 231 235 / 0.7)',
            },
            fontSize: {
                sm: '0.81rem',
                base: '0.89rem',
                md: '0.94',
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
