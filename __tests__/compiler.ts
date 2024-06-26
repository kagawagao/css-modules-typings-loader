import path from 'path';
import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';
import { promisify } from 'node:util';

export default async (fixture: string, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: path.resolve(__dirname, '../src/index.ts'),
            },
            {
              loader: 'css-loader',
              options,
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: path.resolve(__dirname, '../src/index.ts'),
            },
            {
              loader: 'css-loader',
              options: {
                ...options,
                sourceMap: true,
                importLoaders: 1,
              },
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
  });

  compiler.outputFileSystem = createFsFromVolume(new Volume()) as any;
  compiler.outputFileSystem.join = path.join.bind(path);

  await promisify(compiler.run.bind(compiler))();
};
