/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      './**/templates/**/*.html', // Looks in all app template folders
      './templates/**/*.html'      // Looks in project-level template folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}