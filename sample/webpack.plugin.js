const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackChromeReloaderPlugin = require("..");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    "content-script": "./sample/plugin/my-content-script.js",
    "background": "./sample/plugin/my-background.js"
  },
  output: {
    publicPath: ".",
    path: __dirname + "/dist",
    filename: "[name].js",
    libraryTarget: "umd"
  },
  plugins: [
    new WebpackChromeReloaderPlugin(),
    new ExtractTextPlugin({ filename: 'sample.css' }),
    new CopyWebpackPlugin([{ from: './sample/plugin/manifest.json', flatten: true }])
  ],
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [require('babel-preset-es2015')]
        }
      }
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader!postcss-loader?sourceMap',
      }),
    }]
  }
};
