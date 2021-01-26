module.exports = {
  extends: [
    "../.eslintrc.js",
  ],
  overrides: [
    {
      files: [
        "lambdas/**/*.handler.ts",
      ],
      rules: {
        // Allow logging in Lambda handlers.
        "no-console": "off",
        // Allow named export for Lambda handler function.
        "import/prefer-default-export": "off",
        // Allow importing dev dependencies.
        "import/no-extraneous-dependencies": "off",
      },
    },
  ],
};
