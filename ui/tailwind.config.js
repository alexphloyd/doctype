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
                danger: '#FF3B30',

                backgroundActive: '#1A6DFF',
                backgroundPrimary: '#E3E1E1',
                backgroundPrimaryDarker: '#e5eeee',
                backgroundApp: '#f5f5f5',

                fontPrimary: '#333333',
                fontSecondary: 'rgba(51, 51, 51, 0.7)',

                borderPrimary: '#D7DBE0',
                borderLight: 'rgb(229 231 235 / 0.7)',
            },
            fontSize: {
                sm: '0.81rem',
                base: '0.87rem',
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
