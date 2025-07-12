/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Color Palette: FFFFFF E5E5E5 FCA311 14213D 000000
        primary: {
          50: '#fef7ec',
          100: '#fdebd0',
          200: '#fbd3a1',
          300: '#f9b772',
          400: '#fc9b43',
          500: '#fca311', // Main orange
          600: '#e6930f',
          700: '#cc830e',
          800: '#b3730c',
          900: '#996309',
        },
        secondary: {
          50: '#f8f9fb',
          100: '#eef1f6',
          200: '#dde2ec',
          300: '#bcc5d4',
          400: '#8b98b0',
          500: '#14213d', // Main navy
          600: '#121e36',
          700: '#0f1a2f',
          800: '#0d1628',
          900: '#0a1221',
        },
        neutral: {
          50: '#ffffff', // Pure white
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#e5e5e5', // Light gray from palette
          400: '#d4d4d4',
          500: '#a3a3a3',
          600: '#737373',
          700: '#525252',
          800: '#404040',
          900: '#262626',
          950: '#000000', // Pure black
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fef7ec',
          100: '#fdebd0',
          200: '#fbd3a1',
          300: '#f9b772',
          400: '#fc9b43',
          500: '#fca311', // Using primary orange for warnings too
          600: '#e6930f',
          700: '#cc830e',
          800: '#b3730c',
          900: '#996309',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Direct palette colors for easy access
        brand: {
          white: '#ffffff',
          'light-gray': '#e5e5e5',
          orange: '#fca311',
          navy: '#14213d',
          black: '#000000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'], // For headings
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
        xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.05em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.05em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.075em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.075em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.1em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.1em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.1em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.1em' }],
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(20, 33, 61, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(20, 33, 61, 0.1), 0 1px 2px 0 rgba(20, 33, 61, 0.06)',
        'md': '0 4px 6px -1px rgba(20, 33, 61, 0.1), 0 2px 4px -1px rgba(20, 33, 61, 0.06)',
        'lg': '0 10px 15px -3px rgba(20, 33, 61, 0.1), 0 4px 6px -2px rgba(20, 33, 61, 0.05)',
        'xl': '0 20px 25px -5px rgba(20, 33, 61, 0.1), 0 10px 10px -5px rgba(20, 33, 61, 0.04)',
        '2xl': '0 25px 50px -12px rgba(20, 33, 61, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(20, 33, 61, 0.06)',
        'none': 'none',
        // Modern elevation shadows
        'subtle': '0 1px 3px rgba(20, 33, 61, 0.06)',
        'gentle': '0 4px 12px rgba(20, 33, 61, 0.08)',
        'strong': '0 12px 32px rgba(20, 33, 61, 0.12)',
        'intense': '0 32px 64px rgba(20, 33, 61, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #fca311' },
          '100%': { boxShadow: '0 0 20px #fca311, 0 0 30px #fca311' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
