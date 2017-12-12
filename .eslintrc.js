module.exports = {
  extends: ['unobtrusive', 'prettier'],
  plugins: ['prettier'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    jest: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': 'error',
  },
}
