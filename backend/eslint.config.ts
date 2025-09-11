// eslint.config.cjs
import tsParser from '@typescript-eslint/parser';
import eslintPluginTS from '@typescript-eslint/eslint-plugin';

export default [
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTS,
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
