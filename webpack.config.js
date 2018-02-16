const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('lib/cjs'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
  },
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
}
