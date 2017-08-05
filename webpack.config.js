const __DEV__ = (process.env.NODE_ENV !== 'production')

// For instructions about this file refer to
// webpack and webpack-hot-middleware documentation
var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var packageJSON = require('./package.json')

function resolve (dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = {
  entry: [
    './src/main'
  ],

  output: {
    path: path.join(__dirname, 'app'),
    publicPath: __DEV__ ? '/' : packageJSON.homepage,
    filename: 'dist/bundle.js'
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new ExtractTextPlugin('dist/style.css')
  ],

  devtool: __DEV__ ? 'eval' : 'nosources-source-map',

  resolve: {
    extensions: [".js", ".jsx", ".json"],
    alias: {
      '@': resolve('src'),
    },
  },

  module: {
    rules: [
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
            'transform-react-jsx'
          ],
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.s[ac]ss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader', // creates style nodes from JS strings
          use: [
            'css-loader', // translates CSS into CommonJS
            'sass-loader' // compiles Sass to CSS
          ]
        })
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  }
}
