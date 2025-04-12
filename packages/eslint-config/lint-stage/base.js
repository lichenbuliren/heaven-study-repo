module.exports = {
  // 通用规则（所有项目继承）
  base: {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix --max-warnings 0",
      "prettier --write --list-different",
    ],
    "*.{json,md}": "prettier --write",
  },

  // CSS 相关（默认启用）
  css: {
    "*.{css,scss}": ["stylelint --fix"],
  },
};
