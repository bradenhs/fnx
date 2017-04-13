var path = require('path')

module.exports = {
  entry: './src/fnx.ts',
  output: {
    path: path.resolve('./umd'),
    libraryTarget: 'umd',
    library: 'fnx',
    filename: 'fnx.min.js'
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, use: 'awesome-typescript-loader?configFileName=tsconfig.build.json',
        exclude: /(node_modules)/,
      },
    ]
  }
}