/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090A'
      },

      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))'
      },

      animation: {
        slideIn: 'slideIn 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        hide: 'hide 100ms ease-in'
      },

      keyframes: {
        slideIn: {
          from: { transform: 'translateX(320px)' },
          to: { transform: 'translateX(0)' }
        },
        hide: {
          from: { opacity: 1 },
          to: { opacity: 0 }
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true })
  ],
}
