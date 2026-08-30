// The package has no node_modules of its own: it is consumed as sources.
// Tooling (jest, jest-preset-angular, @angular/*) comes from synapse-ui, the
// same installation the library is built against.
const UI_MODULES = new URL('../synapse-ui/node_modules/', import.meta.url).pathname;

export default {
  displayName: 'synapse-components',
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  // Absolute path so bare specifiers (@angular/*, rxjs, ...) resolve.
  modulePaths: [UI_MODULES],
  testMatch: ['<rootDir>/components/**/*.spec.ts'],
  collectCoverageFrom: [
    '<rootDir>/components/**/*.ts',
    '!<rootDir>/components/**/*.spec.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      // jest resolves the transform itself before modulePaths apply, so this
      // one has to be absolute.
      `${UI_MODULES}jest-preset-angular`,
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};
