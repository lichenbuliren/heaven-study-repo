'use strict';

var tsPlugin = require('@typescript-eslint/eslint-plugin');
var tsParser = require('@typescript-eslint/parser');
var reactPlugin = require('eslint-plugin-react');
var reactHooksPlugin = require('eslint-plugin-react-hooks');
var nodePlugin = require('eslint-plugin-n');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var tsPlugin__default = /*#__PURE__*/_interopDefault(tsPlugin);
var tsParser__default = /*#__PURE__*/_interopDefault(tsParser);
var reactPlugin__default = /*#__PURE__*/_interopDefault(reactPlugin);
var reactHooksPlugin__namespace = /*#__PURE__*/_interopNamespace(reactHooksPlugin);
var nodePlugin__default = /*#__PURE__*/_interopDefault(nodePlugin);

// src/configs/base.ts
var base = [
  {
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
      "no-unused-vars": "warn",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"]
    }
  }
];
var typescript = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser__default.default,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin__default.default
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-non-null-assertion": "warn"
    }
  }
];
var react = [
  {
    files: ["**/*.jsx", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: reactPlugin__default.default,
      "react-hooks": reactHooksPlugin__namespace
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];
var node = [
  {
    plugins: {
      n: nodePlugin__default.default
    },
    rules: {
      "n/no-unsupported-features/es-syntax": "off",
      "n/no-missing-import": "off",
      "n/no-unpublished-import": "off"
    }
  }
];

exports.base = base;
exports.node = node;
exports.react = react;
exports.typescript = typescript;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map