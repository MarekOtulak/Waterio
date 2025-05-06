/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#B3EDFF',
        secondary: '#99CAFF',
        light: {
          100: '',
          200: '',
          300: '',
        },
        dark: {
          100: '',
          200: '',
          300: '',
        }
      }
    },
  },
  plugins: [],
}