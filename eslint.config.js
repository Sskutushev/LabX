const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        process: "readonly",
        fetch: "readonly",
        document: "readonly",
        localStorage: "readonly",
        navigator: "readonly",
        FormData: "readonly",
        Response: "readonly",
        HTMLFormElement: "readonly",
        HTMLParagraphElement: "readonly",
        HTMLButtonElement: "readonly",
        HTMLAnchorElement: "readonly",
        HTMLDivElement: "readonly",
        HTMLTextAreaElement: "readonly",
        NodeJS: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
    }
  },
  {
    rules: {
      "no-console": "off"
    }
  }
];
