const webpack = require('webpack')
const path = require('path')
const externals = require('webpack-node-externals')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('lib'),
    filename: 'glamor-jss.cjs.js',
    libraryTarget: 'commonjs2',
  },
  externals: [externals()],
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
    new UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
}
