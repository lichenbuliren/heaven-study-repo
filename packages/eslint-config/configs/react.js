const base = require("./base");
const tsConfig = require("./ts");

module.exports = {
  ...tsConfig, // 继承 TypeScript 配置
  plugins: [...tsConfig.plugins, "react"],
  extends: [
    ...tsConfig.extends,
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    ...tsConfig.rules,
    // React 规则
    "react/prop-types": "off", // 如果使用 TypeScript，关闭 propTypes 检查
    "react-hooks/exhaustive-deps": "warn",
  },
};
