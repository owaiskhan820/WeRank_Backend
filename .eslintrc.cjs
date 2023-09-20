module.exports = {
    env: {
      node: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module', // Make sure this line is present
    },
    rules: {
      // Add your custom rules here
    },
  };
  