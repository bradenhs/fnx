var path = require('path');

module.exports = {
  entry: [ './playground/playground' ],
  output: {
    path: path.resolve('./playground'),
    filename: 'bundle.js'
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: 'playground',
    inline: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          compilerOptions: {
            declaration: false,
          }
        }
      }
    ]
  }
}