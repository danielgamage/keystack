const __DEV__ = (process.env.NODE_ENV !== "production");

// For instructions about this file refer to
// webpack and webpack-hot-middleware documentation
var webpack = require('webpack');
var path = require('path');

module.exports = {
  debug: true,
  devtool: '#eval-source-map',

  entry: [
    './src/main'
  ],

  output: {
    path: path.join(__dirname, 'app'),
    publicPath: '/',
    filename: 'dist/bundle.js'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  devtool: __DEV__ ? "eval" : "nosources-source-map",

  module: {
    loaders: [
      {
        loader: "babel-loader",

        // Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,

        exclude: /node_modules/,

        // Options to configure babel with
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0'],
        }
      },
    ]
  }
};
