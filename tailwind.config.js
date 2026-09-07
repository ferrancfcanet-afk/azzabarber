/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0a0d',
          900: '#111115',
          800: '#18181d',
          700: '#232329',
          600: '#323238',
          500: '#48484f',
        },
        violet: {
          light: '#a976fa',
          DEFAULT: '#8544f0',
          deep: '#5b21b6',
        },
        bone: '#f3f1ed',
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Manrope"', 'sans-serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 14px 30px -12px rgba(0,0,0,0.6)',
        button: '0 6px 16px -6px rgba(133, 68, 240, 0.45)',
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.3s ease both',
      },
    },
  },
  plugins: [],
}
