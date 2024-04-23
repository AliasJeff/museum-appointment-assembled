// @ts-check
module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    jsxPragma: "React",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  rules: {
    "vue/script-setup-uses-vars": "error",
    "vue/custom-event-name-casing": "off",
    "no-use-before-define": "off",
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "space-before-function-paren": "off",
    "vue/attributes-order": "off",
    "vue/one-component-per-file": "off",
    "vue/html-closing-bracket-newline": "off",
    "vue/max-attributes-per-line": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/attribute-hyphenation": "off",
    "vue/require-default-prop": "off",
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "never",
          component: "always",
        },
        svg: "always",
        math: "always",
      },
    ],
  },
};
