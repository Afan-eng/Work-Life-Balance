/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        linen: {
          50: '#FDFCF9',
          100: '#F7F6F0',
          200: '#EFECE1',
          300: '#E3DFC9',
          400: '#D2CCAE',
          500: '#BDB38D',
        },
        ink: {
          950: '#0A1A12',
          900: '#102A1E',
          800: '#173D2C',
          700: '#21533C',
          600: '#2C6D4F',
          500: '#3A8C67',
        },
        sage: {
          50: '#F2F8F4',
          100: '#E3F2E9',
          200: '#C7E4D3',
          300: '#9ECDAC',
          400: '#5FB37F',
          500: '#2F9A5D',
          600: '#25824E',
          700: '#1F683F',
          800: '#1A5333',
          900: '#144329',
        },
        warmAmber: {
          50: '#FFFDF5',
          100: '#FFF9E5',
          200: '#FEF0BF',
          300: '#FDE494',
          400: '#FCD466',
          500: '#E6A817',
          600: '#B87E0E',
        },
        terracotta: {
          500: '#D97757',
          600: '#B8583B',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(23, 61, 44, 0.06), 0 2px 6px -1px rgba(23, 61, 44, 0.04)',
        'lift': '0 12px 30px -4px rgba(23, 61, 44, 0.12), 0 4px 10px -2px rgba(23, 61, 44, 0.06)',
        'glow': '0 0 25px -5px rgba(47, 154, 93, 0.3)',
      },
      animation: {
        'breath-box': 'boxBreath 16s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        boxBreath: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '25%': { transform: 'scale(1.3)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.9' },
          '75%': { transform: 'scale(1)', opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
