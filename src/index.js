import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import perfectionist from "eslint-plugin-perfectionist";
import globals from "globals";
import { dirname, resolve } from "path";
import tseslint from "typescript-eslint";

export function config({ tsconfigPath: userTsconfigPath } = {}) {
  const tsconfigPath = userTsconfigPath ?? resolve(process.cwd(), "tsconfig.app.json");
  const tsconfigDirectoryPath = dirname(tsconfigPath);

  return tseslint.config(
    { ignores: ["dist"] },

    // javascript
    js.configs.recommended,
    {
      rules: {
        "no-console": ["warn", { allow: ["warn", "error", "info"] }],
        "no-duplicate-imports": "error",
      }
    },

    // typescript
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
      rules: {
        "@typescript-eslint/no-unnecessary-condition": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off"
      }
    },

    //style linters
    {
      plugins: { "@stylistic": stylistic },
      rules: {
        "@stylistic/indent": ["error", 2],
        "@stylistic/lines-between-class-members": [
          "error", 
          {
            enforce: [
              { blankLine: "always", next: "method", prev: "*" }
            ],
          }, 
          { 
            exceptAfterOverload: true,
            exceptAfterSingleLine: true
          },
        ],
        "@stylistic/multiline-ternary": ["error", "always-multiline"],
        "@stylistic/no-multi-spaces": "error",
        "@stylistic/object-curly-newline": [
          "error",
          {
            ExportDeclaration: { consistent: true },
            ImportDeclaration: { consistent: true },
            ObjectExpression: { consistent: true },
            ObjectPattern: { consistent: true },
          },
        ],
        "@stylistic/object-curly-spacing": ["error", "always"],
        "@stylistic/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
        "@stylistic/operator-linebreak": ["error", "before"],
        "@stylistic/quotes": ["error", "double"],
        "@stylistic/semi": ["error", "always"]
      }
    },  
    perfectionist.configs["recommended-natural"],
    {
      rules: {
      // vue plugin already has a standard way to sort that considers the attribute type like if it is an event or a id definition
        "perfectionist/sort-vue-attributes": "off",
      }
    },

    // language settings
    {
    // this line tells eslint to link the typescript service with all file types used by the project
      files: ["**/*.ts", "**/*.js"],
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.node
        },
        parserOptions: {
          parser: "@typescript-eslint/parser",
          project: [tsconfigPath],
          projectService: true,
          sourceType: "module",
          tsconfigRootDir: tsconfigDirectoryPath
        }      
      },
    },  
  );
};