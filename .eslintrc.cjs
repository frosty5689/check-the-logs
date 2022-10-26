module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
  plugins: ['@typescript-eslint'],
  root: true,
  ignorePatterns: ['jest.config.js', 'build/**/*'],
  env: {
    node: true,
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
}
