const base = require("./base");

module.exports = {
  ...base,
  env: {
    ...base.env,
    node: true,
  },
  extends: [...base.extends, "plugin:node/recommended"],
  rules: {
    ...base.rules,
    // Node.js 规则
    "node/no-missing-require": "error",
  },
};
