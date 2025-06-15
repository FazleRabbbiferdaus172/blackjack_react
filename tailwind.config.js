/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'casino-green': '#0f5132',
                'casino-red': '#dc3545',
                'casino-gold': '#ffd700',
            },
        },
    },
    plugins: [],
} 