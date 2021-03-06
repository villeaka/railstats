module.exports = {
  settings: {
    "import/resolver": {
      typescript: {
        // Fixes .d.ts node_modules import.
        alwaysTryTypes: true,
      },
    },
  },
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    quotes: ["error", "double"],
    // Allow relative imports without extensions.
    "import/extensions": "off",
    "no-use-before-define": "off",
    // Allow one-line object destructuring.
    "object-curly-newline": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "padding-line-between-statements": ["error",
      {
        blankLine: "always",
        prev: ["const", "let", "var"],
        next: "block-like",
      },
      {
        blankLine: "always",
        prev: "*",
        next: "return",
      },
    ],
    // Linebreak between npm modules and relative modules.
    "import/order": [
      "error",
      {
        groups: [
          ["builtin", "external"],
        ],
        "newlines-between": "always",
      },
    ],
  },
  overrides: [
    {
      files: [
        "**/*.test.ts",
        "**/*.config.js",
      ],
      rules: {
        // Allow importing dev dependencies.
        "import/no-extraneous-dependencies": "off",
      },
    },
  ],
};
