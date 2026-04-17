module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ['import', 'unused-imports'],
  extends: ['eslint:recommended'],
  rules: {
    // default esslint rules
    'no-extra-semi': 2,

    // import plugin
    'import/prefer-default-export': 0,
    'import/no-default-export': 1,
    'import/no-unresolved': 1,
    'unused-imports/no-unused-imports-ts': 2,

    // typescript
    '@typescript-eslint/explicit-member-accessibility': 2,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-empty-interface': 1,
    '@typescript-eslint/ban-types': 0,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
  },
};
