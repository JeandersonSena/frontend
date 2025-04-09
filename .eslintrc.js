module.exports = {
    root: true,
    env: {
      node: true,
      'vue/setup-compiler-macros': true
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      '@vue/eslint-config-standard' // <---- String simples aqui
    ],
    parserOptions: {
      parser: '@babel/eslint-parser',
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    rules: {
      // Adicione regras personalizadas aqui, se necessário
    }
  }