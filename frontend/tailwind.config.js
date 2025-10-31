/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'slide-up': 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 1s ease-out forwards',
        'float-random': 'float-random 6s ease-in-out infinite',
        'scroll': 'scroll 1.5s ease-in-out infinite',
      },
      keyframes: {
        'slide-up': {
          '0%': {
            transform: 'translateY(100%)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: 1,
          },
        },
        'fade-in': {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        'float-random': {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px) rotate(0deg)',
          },
          '25%': {
            transform: 'translateY(-20px) translateX(10px) rotate(5deg)',
          },
          '50%': {
            transform: 'translateY(-40px) translateX(-10px) rotate(-5deg)',
          },
          '75%': {
            transform: 'translateY(-20px) translateX(5px) rotate(3deg)',
          },
        },
        'scroll': {
          '0%': {
            transform: 'translateY(0)',
            opacity: 0,
          },
          '40%': {
            opacity: 1,
          },
          '80%': {
            transform: 'translateY(20px)',
            opacity: 0,
          },
          '100%': {
            opacity: 0,
          },
        },
      },
    },
  },
  plugins: [],
}