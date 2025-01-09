/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: [
        '*.{js,jsx,ts,tsx}',  // Including the main App file
        './src/screens/LoginScreen/*.{js,jsx,ts,tsx}'
        //'./src/**/*.{js,jsx,ts,tsx}', // Including all files in the 'src' folder
        //'./src/components/**/*.{js,jsx,ts,tsx}',  // Including all files in the 'components' folder
        //'./src/components/**/**/*.{js,jsx,ts,tsx}', // Specifically including files in 'atoms' folder
        //'./src/screens/**/*.{js,jsx,ts,tsx}' // Including all files in the 'screens' folder
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            keyframes: {
                'caret-blink': {
                    '0%,70%,100%': {opacity: '1'},
                    '20%,50%': {opacity: '0'},
                },
            },
            animation: {
                'caret-blink': 'caret-blink 1.2s ease-out infinite',
            },
            fontFamily: {
                poppins: ['var(--font-poppins)'],
                inter: ['var(--font-inter)']
            },
            fontSize: {
                '4xs': '8px',
                '3xs': '10px',
                '2xs': '12px',
                'xs': '14px',
                'sm': '16px',
                'md': '24px',
                'lg': '36px',
                'xl': '40px'
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            screens: {
                'xs': '320px',   // Custom extra small screen
                'sm': '480px',   // Max Mobile Scren
                'md': '769px',   // Tab screen
                'lg': '1025px',  // Max Tab Screen
                'xl': '1280px',  // Desktop Screen
                '2xl': '1536px', // Custom double extra large screen
            },
            colors: {
                'primary': '#6647FF',
                'primary-500': '#6744FF',
                'primary-700': '#3A169C',
                'primary-800': '#6400E6',
                'secondary': '#F3F2FF',
                'neutral-200': '#E5E7EB',
                'neutral-500': '#6B7280',
                'neutral-900': '#18191A',
                'neutral-800': '#242526',
                'neutral-700': '#3A3B3C',
                'gray-dark': '#525252',
                'gray': '#8492a6',
                'gray-light': '#d3dce6',
                'gray-1': '#737373',
                'border': '#D4D4D4',
                'shade-button-border': '#E9E8FF',
                'surface-primary-50': '#F3F2FF',
                'warning-500': '#F59E0B',
                'success-500': "#22C55E",
                'destructive-600': "#DC2626"
            },
            boxShadow: {
                'logo': '0px 0px 6px 0px #00000040',
                'medium': '0px 6px 15px -2px rgba(16, 24, 40, 0.08), 0px 6px 15px -2px rgba(16, 24, 40, 0.08);',
                'card': '0px 6px 15px -2px rgba(16, 24, 40, 0.08)',
                'button': '0px 1px 2px 0px rgba(16, 24, 40, 0.04), 0px 1px 2px 0px rgba(16, 24, 40, 0.04);',
                'popper': '0px 8px 24px -3px rgba(16, 24, 40, 0.05), 0px 8px 24px -3px rgba(16, 24, 40, 0.10);'
            }

        },
    },
    plugins: [],
}