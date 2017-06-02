const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackChromeReloaderPlugin = require("..");

module.exports = {
  entry: {
    "content-script": "./sample/plugin/content-script.js",
    "background": "./sample/plugin/background.js"
  },
  output: {
    publicPath: ".",
    path: "./sample/dist",
    filename: "[name].js",
    libraryTarget: "umd"
  },
  plugins: [
    new WebpackChromeReloaderPlugin(),
    new CopyWebpackPlugin([{ from: './sample/plugin/manifest.json', flatten: true}])
  ],
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loaders: ["babel-loader"]
    }]
  }
};