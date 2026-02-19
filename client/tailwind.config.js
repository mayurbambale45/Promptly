/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,tsx,jsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                slate: {
                    950: '#020617',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin-slow 8s linear infinite',
            },
            keyframes: {
                'spin-slow': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                }
            }
        },
    },
    plugins: [],
}
