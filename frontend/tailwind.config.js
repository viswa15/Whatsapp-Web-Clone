/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'whatsapp': {
          'primary': '#25D366',
          'secondary': '#128C7E',
          'light': '#DCF8C6',
          'dark': '#075E54',
          'gray': '#f0f0f0',
          'message-in': '#ffffff',
          'message-out': '#DCF8C6',
        }
      },
      fontFamily: {
        'sans': ['Segoe UI', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}