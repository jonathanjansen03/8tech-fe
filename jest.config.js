export default {
  rootDir: './',
  cache: false,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
  errorOnDeprecated: true,
  // fakeTimers: {
  //   "enableGlobally": false
  // },
  // maxWorkers: "50%",
  moduleFileExtensions: ['js', 'json', 'vue'],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/empty.js',
    '^@/(.*)': '<rootDir>/src/$1',
  },
  resetModules: true,
  restoreMocks: true,
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['<rootDir>/src/__tests__/coverage'],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
};
