/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  plugins: [
    'import',
    'unused-imports',
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-alert': 0,
    'no-extra-semi': 2,
    'import/prefer-default-export': 0,
    'unused-imports/no-unused-imports-ts': 2,
    '@typescript-eslint/explicit-member-accessibility': ['error'],
  }
};
