const path = require("path");

// 导出配置加载函数
module.exports.loadLintStagedConfig = (framework) => {
  const configMap = {
    react: require("./react"),
    // vue: require("./lint-staged/vue"),
    // 默认回退到 base
    default: require("./base").base,
  };

  return configMap[framework] || configMap.default;
};
