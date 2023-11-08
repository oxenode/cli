const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const app = express();

// serve static files from 'dist' folder
app.use(express.static('dist'));

const compiler = webpack(webpackConfig);

// use webpack's watch API
compiler.watch({}, function(err, stats) {
  if (err) {
    console.error(err);
  } else {
    console.log(stats.toString({ chunks: false, colors: true }));
  }
});

// start server
app.listen(5500, function() {
  console.log('Server running on port 5500');
});
