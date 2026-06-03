import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],

    languageOptions: {
      globals: globals.node,
    },

    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "off",
    },
  },

  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
