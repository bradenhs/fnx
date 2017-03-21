var path = require('path')

module.exports = {
  entry: './playground/index.tsx',
  devServer: {
    publicPath: "/",
    contentBase: "./playground",
  },
  output: {
    path: path.resolve('playground'),
    publicPath: '/playground/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, use: 'awesome-typescript-loader',
        exclude: /(node_modules)/,
      },
    ]
  }
}