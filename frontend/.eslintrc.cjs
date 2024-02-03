module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'prettier',
    'airbnb-base',
    'plugin:import/recommended',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
    'no-console': 'warn',
    'no-alert': 0,
    'no-param-reassign': [2, { props: false }],
    'no-plusplus': 0,
    'no-iterator': 0,
    'no-restricted-syntax': [2, 'WithStatement'],
    'func-style': 0,
    'import/no-unresolved': 'off',
    'import/prefer-default-export': ['off', { target: 'single' }],
    'class-methods-use-this': 'off',
    'import/extensions': ['error', 'ignorePackages', {
      js: 'always',
      cjs: 'always',
    }],
  },
};
