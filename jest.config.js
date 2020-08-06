const preset = require('@cisdi/jest-preset-cisdi/jest-preset')

module.exports = {
  ...preset,
  setupFiles: ['./__tests__/setup.ts'],
  testEnvironment: 'node',
}
