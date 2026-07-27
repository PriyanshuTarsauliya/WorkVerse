/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        main: 'var(--bg-main)',
        surface: 'var(--bg-surface)',
        nested: 'var(--bg-surface-nested)',
        borderSubtle: 'var(--border-subtle)',
        borderStrong: 'var(--border-strong)',
        txtMain: 'var(--text-main)',
        txtMuted: 'var(--text-muted)',
        accent: {
          DEFAULT: 'var(--brand-accent)',
          gradient: 'var(--brand-accent-gradient)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          bg: 'var(--color-success-bg)',
        },
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.88, transform: 'scale(1.02)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(129, 116, 246, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(129, 116, 246, 0.6)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
        'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
