'use strict';
var path = require('path');
var webpack = require('webpack');

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.optimize.OccurenceOrderPlugin()
];

let name = '[name].js';
if (process.env.NODE_ENV === 'production') {
  name = '[name].min.js';
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  );
}

module.exports = {
  module: {
    loaders: [
      {test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/}
    ]
  },
  entry: {
    overt: __dirname + '/src/index',
    streamline: __dirname + '/src/timelines/index',
  },
  output: {
    library: '[name]',
    libraryTarget: 'umd',
    filename: name,
    path: path.join(__dirname, 'dist'),
  },
  externals: {
    react: 'React',
  },
  plugins: plugins,
  resolve: {
    extensions: ['', '.js']
  }
};
