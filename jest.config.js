const preset = require('@opd/jest-preset-pangu/jest-preset')

module.exports = {
  ...preset,
  setupFiles: ['./__tests__/setup.ts'],
  testEnvironment: 'node',
}
