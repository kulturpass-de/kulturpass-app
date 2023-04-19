module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-nested-ternary': 'error',
        'one-var': ['error', 'never'],
        'react/jsx-no-literals': ['error'],
        'react/jsx-no-bind': 'error',
        'react-native/no-unused-styles': 'error',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/ban-ts-comment': ['error', {
          "ts-ignore": true,
        }],
        'no-shadow': 'off',
        'no-undef': 'off',
        semi: ['error', 'never'],
        'max-len': [
          'error',
          { code: 120, tabWidth: 2, ignoreStrings: true, ignoreUrls: true, ignoreTemplateLiterals: true }
        ],
        'eslint-comments/no-unlimited-disable': 'error',
        'eslint-comments/no-unused-disable': 'error',
        'import/first': 'error'
      },
    },
  ],
};
