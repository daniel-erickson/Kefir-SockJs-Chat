var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

var config = {
  entry: {
    app: path.resolve(__dirname + '/app', 'index.js')
  },
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js' // Notice we use a variable
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: [node_modules_dir],
      loader: 'babel-loader'
    }]
  },
  resolve: {
    modulesDirectories: ['node_modules']
  },
  plugins: [
  ]
};

module.exports = config;