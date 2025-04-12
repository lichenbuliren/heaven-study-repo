const { base } = require("./base");

module.exports = {
  ...base,
  // React 独有规则
  "*.{jsx,tsx}": [...base["*.{js,jsx,ts,tsx}"]],
};
