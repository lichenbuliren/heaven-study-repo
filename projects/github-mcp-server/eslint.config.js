import { base, typescript, node } from "@heaven/eslint-config";

export default [
  ...base,
  ...typescript,
  ...node,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
