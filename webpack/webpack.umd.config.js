var path = require('path');

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
  }
}
