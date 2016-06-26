var path = require('path');
var webpack = require('webpack');

var uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
  compress: { warnings: false },
});

module.exports = [
  configForEnvironment('development'),
  configForEnvironment('production', '.min', [uglifyPlugin]),
];

function configForEnvironment(env, suffix = '', extraPlugins = []) {
  return {
    entry: path.join(process.cwd(), 'src', 'index.js'),
    output: {
      path: './lib',
      filename: `remote-data-umd${suffix}.js`,
      libraryTarget: 'umd',
      library: 'RemoteData',
    },
    module: {
      loaders: [{
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      }],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
    ].concat(extraPlugins),
  };
}
