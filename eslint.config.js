import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "coverage", "node_modules", "*.config.js", "*.config.ts"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/prefer-const": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      
      // Performance rules
      "react-hooks/exhaustive-deps": "error",
      
      // Code quality rules
      "prefer-const": "error",
      "no-var": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "error",
      "no-duplicate-imports": "error",
      "no-unused-expressions": "error",
      
      // Best practices
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "default-case": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-script-url": "error",
    },
  },
  
  // Test files configuration
  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "**/test/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  }
);
