import path from 'path'
import webpack from 'webpack'
import { createFsFromVolume, Volume } from 'memfs'

export default (fixture, options = {}): Promise<webpack.Stats> => {
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
  })

  compiler.outputFileSystem = createFsFromVolume(new Volume()) as any
  compiler.outputFileSystem.join = path.join.bind(path)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err)
      if (stats.hasErrors()) {
        console.log(stats.toJson().errors)
        reject(new Error(stats.toJson().errors.toString()))
      }

      resolve(stats)
    })
  })
}
