import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Make all rules warnings instead of errors
      "no-unused-vars": ["warn", { 
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      // Add more rules to be warnings here if needed
      "@typescript-eslint/no-unused-vars": ["warn", {
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      // Make all other rules warnings
      "no-console": "warn",
      "no-debugger": "warn",
      "no-alert": "warn",
      "no-var": "warn",
      "prefer-const": "warn",
      "prefer-arrow-callback": "warn",
      "no-duplicate-imports": "warn",
      "no-multiple-empty-lines": "warn",
      "no-trailing-spaces": "warn",
      "no-unused-expressions": "warn",
      "no-unreachable": "warn",
      "no-constant-condition": "warn",
      "no-empty": "warn",
      "no-empty-function": "warn",
      "no-extra-semi": "warn",
      "no-fallthrough": "warn",
      "no-irregular-whitespace": "warn",
      "no-mixed-spaces-and-tabs": "warn",
      "no-redeclare": "warn",
      "no-undef": "warn",
      "no-undef-init": "warn",
      "no-unexpected-multiline": "warn",
      "no-unused-labels": "warn",
      "no-useless-catch": "warn",
      "no-useless-escape": "warn",
      "no-with": "warn",
      "require-yield": "warn",
      "valid-typeof": "warn",
      "react/jsx-no-undef": "warn",
      "react/jsx-uses-react": "warn",
      "react/jsx-uses-vars": "warn",
      "react/no-children-prop": "warn",
      "react/no-deprecated": "warn",
      "react/no-direct-mutation-state": "warn",
      "react/no-find-dom-node": "warn",
      "react/no-is-mounted": "warn",
      "react/no-render-return-value": "warn",
      "react/no-string-refs": "warn",
      "react/no-unknown-property": "warn",
      "react/require-render-return": "warn",
      "react/self-closing-comp": "warn",
      "react/sort-comp": "warn",
      "react/sort-prop-types": "warn",
      "react/void-dom-elements-no-children": "warn",
      "react/jsx-boolean-value": "warn",
      "react/jsx-closing-bracket-location": "warn",
      "react/jsx-closing-tag-location": "warn",
      "react/jsx-curly-spacing": "warn",
      "react/jsx-equals-spacing": "warn",
      "react/jsx-first-prop-new-line": "warn",
      "react/jsx-indent": "warn",
      "react/jsx-indent-props": "warn",
      "react/jsx-key": "warn",
      "react/jsx-max-props-per-line": "warn",
      "react/jsx-no-bind": "warn",
      "react/jsx-no-comment-textnodes": "warn",
      "react/jsx-no-duplicate-props": "warn",
      "react/jsx-no-target-blank": "warn",
      "react/jsx-no-undef": "warn",
      "react/jsx-pascal-case": "warn",
      "react/jsx-sort-default-props": "warn",
      "react/jsx-sort-props": "warn",
      "react/jsx-space-before-closing": "warn",
      "react/jsx-tag-spacing": "warn",
      "react/jsx-uses-react": "warn",
      "react/jsx-uses-vars": "warn",
      "react/jsx-wrap-multilines": "warn",
      "react/no-array-index-key": "warn",
      "react/no-children-prop": "warn",
      "react/no-danger": "warn",
      "react/no-deprecated": "warn",
      "react/no-did-mount-set-state": "warn",
      "react/no-did-update-set-state": "warn",
      "react/no-direct-mutation-state": "warn",
      "react/no-find-dom-node": "warn",
      "react/no-is-mounted": "warn",
      "react/no-render-return-value": "warn",
      "react/no-string-refs": "warn",
      "react/no-unknown-property": "warn",
      "react/require-render-return": "warn",
      "react/self-closing-comp": "warn",
      "react/sort-comp": "warn",
      "react/sort-prop-types": "warn",
      "react/void-dom-elements-no-children": "warn"
    }
  }
];

export default eslintConfig;
