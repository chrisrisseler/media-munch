// Specifies the PostCSS plugins used by the project,
// in this case, Tailwind CSS and autoprefixer
module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer')
  ]
};
