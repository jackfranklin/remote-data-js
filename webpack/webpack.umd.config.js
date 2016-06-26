var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.join(process.cwd(), 'src', 'index.js'),
  output: {
    path: './lib',
    filename: 'remote-data-umd.js',
    libraryTarget: 'umd',
    library: 'RemoteData'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}
