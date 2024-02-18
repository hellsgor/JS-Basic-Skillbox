module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'globals': {
    __dirname: true,
  },
  'extends': ['eslint:recommended', 'plugin:prettier/recommended'],
  'overrides': [
    {
      'env': {
        'node': true,
      },
      'files': [
        '.eslintrc.{js,cjs}',
      ],
      'parserOptions': {
        'sourceType': 'script',
      },
    },
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'rules': {
    // 'indent': [
    //   'error',
    //   2,
    // ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'no-var': 'error',
    'no-console': 'warn',
    'no-alert': 'warn',
    'prettier/prettier': [
      'warn', { endOfLine: 'auto' },
    ],
  },
};
