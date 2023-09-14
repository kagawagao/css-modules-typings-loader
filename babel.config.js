module.exports = {
  presets: [
    [
      '@wii/babel-preset-lib',
      {
        targets: { node: 18 },
      },
    ],
  ],
  env: {
    test: {
      presets: [
        [
          '@wii/babel-preset-lib',
          {
            modules: 'commonjs',
            targets: { node: 18 },
          },
        ],
      ],
    },
  },
};
