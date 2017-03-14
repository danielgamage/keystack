const __DEV__ = (process.env.NODE_ENV !== "production");

// For instructions about this file refer to
// webpack and webpack-hot-middleware documentation
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    './src/main'
  ],

  output: {
    path: path.join(__dirname, 'app'),
    publicPath: '/',
    filename: 'dist/bundle.js'
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],

  devtool: __DEV__ ? "eval" : "nosources-source-map",

  module: {
    rules: [
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
      {
        test: /\.s[ac]ss$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      }
    ]
  }
};
