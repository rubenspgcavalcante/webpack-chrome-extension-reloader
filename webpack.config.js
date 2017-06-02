const webpack = require("webpack");
const path = require("path");
const pack = require("./package.json");

module.exports = {
  target: "node",
  entry: {
    'webpack-chrome-extension-reloader': "./src/index.ts"
  },
  devtool: "source-map",
  output: {
    publicPath: ".",
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    libraryTarget: "umd"

  },
  externals: [Object.keys(pack.dependencies)],
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    mainFiles: ["index"],
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      loader: "source-map-loader"
    }, {
      enforce: 'pre',
      test: /\.tsx?$/,
      loaders: [{ loader: "source-map-loader" }, { loader: "tslint-loader", options: { configFile: "./tslint.json" } }]
    }, {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loaders: ["babel-loader", "ts-loader"],
    }, {
      test: /\.json$/,
      exclude: /node_modules/,
      loaders: ["json-loader"]
    }, {
      test: /\.txt$/,
      exclude: /node_modules/,
      loaders: ["raw-loader"]
    }]
  }
};