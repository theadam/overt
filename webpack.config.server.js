var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config.js');

config.devtool = 'source-map';

config.output.path = path.join(__dirname, 'dist');
config.output.filename = 'overt.js';
config.output.publicPath = '/dist';

config.plugins = [...config.plugins, new webpack.NoErrorsPlugin()];

module.exports = config;
