import { createRequire } from 'node:module';

// The package has no node_modules of its own — it is consumed as sources — so
// tooling is resolved from synapse-ui, the same installation it is built and
// tested against. See jest.config.mjs for the same arrangement.
const requireFromUi = createRequire(new URL('../synapse-ui/package.json', import.meta.url));

const js = requireFromUi('@eslint/js');
const tseslint = requireFromUi('typescript-eslint');
const angular = requireFromUi('angular-eslint');

export default tseslint.config(
  {
    // `tokens/` is generator output, not source.
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', '.synapse/**', 'tokens/**'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // The library prefixes everything with `syn`; components are elements,
      // attribute selectors are used deliberately (button[syn-button]).
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'syn', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: ['element', 'attribute'], prefix: 'syn', style: 'kebab-case' },
      ],

      // Host metadata is used throughout instead of decorators.
      '@angular-eslint/no-host-metadata-property': 'off',

      // Host directives expose their inputs under the host's own names
      // (`errors` as `error`, `disabledInput` as `disabled`), which is the
      // whole point of the alias.
      '@angular-eslint/no-input-rename': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },
  {
    // Specs mount components through host wrappers and reach into protected
    // members on purpose.
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/dot-notation': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
  {
    // Inline templates inside specs are fixtures, not shipped markup.
    files: ['**/*.spec.ts/**'],
    rules: {
      '@angular-eslint/template/elements-content': 'off',
    },
  },
);
