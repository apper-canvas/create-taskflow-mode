/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5B47E0',
          light: '#8B7FE8',
          dark: '#4A38C2'
        },
        accent: '#FFB547',
        surface: '#FFFFFF',
        background: '#F8F9FB',
        border: '#E5E7EB',
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
          muted: '#9CA3AF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'check': 'check 0.3s ease-out',
        'slide-out': 'slideOut 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out',
        'progress-fill': 'progressFill 0.8s ease-out'
      },
      keyframes: {
        check: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        progressFill: {
          '0%': { strokeDasharray: '0 100' },
          '100%': { strokeDasharray: 'var(--progress) 100' }
        }
      }
    },
  },
  plugins: [],
}