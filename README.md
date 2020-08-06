# css-modules-typings-loader

> css modules typings loader for webpack, compatible with [`css-loader`](https://github.com/webpack-contrib/css-loader) `v4`

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
