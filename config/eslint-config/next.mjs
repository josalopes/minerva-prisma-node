import nextPlugin from '@next/eslint-plugin-next'

import library from './library.mjs'

export default [
  ...library,

  {
    plugins: {
      '@next/next': nextPlugin,
    },

    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
]
