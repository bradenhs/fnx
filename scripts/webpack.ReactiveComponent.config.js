var path = require('path')

module.exports = {
  entry: './src/extras/react.ts',
  output: {
    path: path.resolve('./umd'),
    libraryTarget: 'umd',
    library: 'ReactiveComponent',
    filename: 'ReactiveComponent.min.js'
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
  },
  externals: {
    react: 'React',
    '../fnx': 'fnx'
  }
}