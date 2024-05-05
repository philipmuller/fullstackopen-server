import globals from "globals";
import stylistic from "@stylistic/eslint-plugin-js";

export default [
  {
    files: ["**/*.js"], 
    plugins: { stylistic: stylistic },
    rules: {
      'stylistic/indent': [
        'error',
        2
      ],
      'stylistic/linebreak-style': [
        'error',
        'unix'
      ],
      'stylistic/quotes': [
          'error',
          'single'
      ],
      'stylistic/semi': [
          'error',
          'never'
      ],
    },
    languageOptions: {sourceType: "commonjs"}
  },
  {languageOptions: { globals: globals.browser }},
  {ignores: ["**/*.mjs", "dist"]}
];