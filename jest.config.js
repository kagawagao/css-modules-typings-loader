const preset = require('@wii/jest-preset-wii').default;

/** @type {import('jest').Config} */
const config = {
  ...preset,
  setupFiles: [],
  testEnvironment: 'node',
};

module.exports = config;
