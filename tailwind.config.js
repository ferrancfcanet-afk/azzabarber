/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b0c10',
          900: '#0d0e12',
          800: '#131419',
          700: '#1a1b22',
          600: '#22232c',
        },
        violet: {
          glow: '#a855f7',
          DEFAULT: '#8b5cf6',
          deep: '#6d28d9',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Poppins', 'sans-serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(168, 85, 247, 0.55)',
        'glow-sm': '0 0 18px -4px rgba(168, 85, 247, 0.65)',
        card: '0 8px 30px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.16), transparent 60%)',
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.06)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 3.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
