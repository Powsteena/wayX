/* @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// module.exports = {
//   content: ['./src/**/*.{html,js}', './public/index.html'],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#530C0C',    // Dark red
        secondary: '#F7F6DE',  // Light cream
        accent: '#FA7E0A',     // Orange
        text: '#333333',       // Dark gray
      }
    },
  },
  plugins: [],
}