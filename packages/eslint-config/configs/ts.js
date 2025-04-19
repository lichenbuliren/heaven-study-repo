const base = require("./base");

module.exports = {
  ...base,
  plugins: ["@typescript-eslint"],
  extends: [...base.extends, "plugin:@typescript-eslint/recommended"],
  rules: {
    ...base.rules,
    // TypeScript 特有规则
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "warn",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ...base.parserOptions,
    project: "./tsconfig.json",
  },
};
