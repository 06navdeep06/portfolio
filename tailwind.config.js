/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'hsl(var(--border) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        serif: ['var(--font-cinzel)', ...fontFamily.serif],
        japanese: ['var(--font-noto-sans-jp)', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
          light: '#3b82f6',
        },
        secondary: {
          DEFAULT: '#7c3aed',
          dark: '#6d28d9',
          light: '#8b5cf6',
        },
        dark: {
          DEFAULT: '#1e293b',
          light: '#334155',
          lighter: '#64748b',
        },
        // Samurai Theme Colors
        'primary-black': '#0a0a0a',
        'primary-red': '#e63946',
        'primary-gold': '#d4af37',
        'sakura-pink': '#ffb7c5',
        'bamboo-green': '#3a5f0b',
        'paper-beige': '#f5f5f0',
        'ink-black': '#1a1a1a',
        'gold-light': '#f4e5c2',
        'red-dark': '#8b0000',
        'gray-samurai': '#2d2d2d',
        'gray-light': '#e5e7eb',
        'gray-dark': '#1f2937',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
};