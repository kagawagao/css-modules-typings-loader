# css-modules-typings-loader

> css modules typings loader for webpack, compatible with [`css-loader`](https://github.com/webpack-contrib/css-loader) `v4`

[![build](https://github.com/kagawagao/css-modules-typings-loader/workflows/build/badge.svg)](https://github.com/kagawagao/css-modules-typings-loader/actions?query=workflow%3Abuild)
[![npm](https://img.shields.io/npm/v/@opd/css-modules-typings-loader.svg)](https://www.npmjs.com/package/@opd/css-modules-typings-loader)
[![npm](https://img.shields.io/npm/l/@opd/css-modules-typings-loader.svg)](https://www.npmjs.com/package/@opd/css-modules-typings-loader)
[![codecov](https://codecov.io/gh/kagawagao/css-modules-typings-loader/branch/master/graph/badge.svg)](https://codecov.io/gh/kagawagao/css-modules-typings-loader)

## Install

```bash
npm i @opd/css-modules-typings-loader --save--dev
```

## Usage

```js
// webpack config
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: '@opd/css-modules-typings-loader',
          },
          {
            loader: 'css-loader',
            options,
          },
        ],
      },
    ],
  },
}
```
