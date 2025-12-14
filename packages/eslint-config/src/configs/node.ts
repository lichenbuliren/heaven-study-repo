import type { Linter } from 'eslint';
import nodePlugin from 'eslint-plugin-n';

export const node: Linter.Config[] = [
  {
    plugins: {
      n: nodePlugin as any,
    },
    rules: {
      'n/no-unsupported-features/es-syntax': 'off',
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
    },
  },
];
