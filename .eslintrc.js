module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',

    'prettier'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}']
    }
  ],
  parser: '@typescript-eslint/parser',

  plugins: ['@typescript-eslint', 'eslint-plugin-prettier'],
  ignorePatterns: ['components/ui/*'], // ignore lint for all files in the /components folder
  rules: {
    'react/no-unescaped-entities': 'off',
    '@next/next/no-page-custom-font': 'off',
    'template-curly-spacing': 'off',
    'no-template-curly-in-string': 'off',
    indent: 'off',
    camelcase: 'off',
    'no-return-assign': 'off',
    'one-var': 'off',
    'no-prototype-builtins': 'warn',
    'prefer-promise-reject-errors': 'off',
    'standard/object-curly-even-spacing': 'off',
    'react/prop-types': 'off',
    'react/no-unused-prop-types': 'off',
    'react/self-closing-comp': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-pascal-case': 'off',
    'react/jsx-handler-names': 'off',
    // 'react-hooks/exhaustive-deps': 'off',
    'react/jsx-indent-props': [2, 2],
    'jsx-quotes': ['error', 'prefer-double'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-use-before-define': 'off',
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'avoid',
        trailingComma: 'none',
        semi: false,
        endOfLine: 'auto',
        tabWidth: 2,
        printWidth: 80,
        useTabs: false,
        singleQuote: true,
        jsxSingleQuote: false
      }
    ],
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'off'
  }
}
