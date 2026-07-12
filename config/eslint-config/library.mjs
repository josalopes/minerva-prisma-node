import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default tseslint.config(
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    plugins: {
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      /*
       * Imports
       */
      'simple-import-sort/imports': 'error',

      /*
       * TypeScript
       */
      '@typescript-eslint/no-explicit-any': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      /*
       * Geral
       */
      'no-console': 'off',
    },
  },
)
