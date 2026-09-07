/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0a0d',
          900: '#0d0e13',
          800: '#14151b',
          700: '#1b1c24',
          600: '#25262f',
          500: '#33343f',
        },
        violet: {
          glow: '#a976fa',
          DEFAULT: '#8b5cf6',
          deep: '#5b21b6',
          ink: '#2e1065',
        },
        gold: {
          light: '#f3dfa8',
          DEFAULT: '#cda45e',
          deep: '#9c7a3f',
        },
        bone: '#f6f3ee',
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Manrope"', 'sans-serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 32px -10px rgba(169, 118, 250, 0.45)',
        'glow-sm': '0 0 16px -4px rgba(169, 118, 250, 0.5)',
        'glow-gold': '0 0 22px -6px rgba(205, 164, 94, 0.5)',
        card: '0 10px 40px -8px rgba(0,0,0,0.55), inset 0 1px 0 0 rgba(255,255,255,0.06)',
        'lift': '0 1px 2px rgba(0,0,0,0.4), 0 12px 24px -10px rgba(0,0,0,0.5)',
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
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.45s ease both',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.16,1,0.3,1) both',
        shimmer: 'shimmer 3.5s linear infinite',
      },
    },
  },
  plugins: [],
}
