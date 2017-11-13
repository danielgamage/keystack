// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var packageJSON = require('../package.json')

function resolve (dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = {
  plugins: [
    // your custom plugins
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
  ],

  resolve: {
    extensions: [".js", ".jsx", ".json"],
    alias: {
      '@': resolve('src'),
    },
  },

  module: {
    rules: [
      // add your custom loaders.
      {
        loader: 'babel-loader',

        // Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,

        exclude: /node_modules/,

        // Options to configure babel with
        query: {
          plugins: [
            'transform-runtime',
            'transform-decorators-legacy',
            'transform-react-jsx',
            'transform-react-jsx-source'
          ],
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.s[ac]ss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ],
  },
};
