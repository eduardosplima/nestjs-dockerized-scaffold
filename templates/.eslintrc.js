module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'unused-imports'],
  root: true,
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': [
      'error',
      {
        fixToUnknown: true,
        ignoreRestArgs: true
      }
    ],
    '@typescript-eslint/no-unused-vars': 'error',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'prettier/prettier': ['error'],
    'unused-imports/no-unused-imports-ts': 'error'
  },
  overrides: [
    {
      files: ['*.entity.ts'],
      rules: {
        'import/no-cycle': 'off'
      }
    }
  ]
};
