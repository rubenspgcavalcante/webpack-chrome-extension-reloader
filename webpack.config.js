const path = require("path");
const {BannerPlugin} = require("webpack");
const {BundleAnalyzerPlugin} = require("webpack-bundle-analyzer");
const pack = require("./package.json");

const {production, development, test} = ["production", "development", "test"].reduce((acc, env) => {
  acc[env] = (val) => process.env.NODE_ENV === env ? val : null;
  return acc;
}, {});

module.exports = (env = {analyze: false}) => ({
  target: "node",
  entry: test({"tests": "./specs/index.specs.ts"}) || {
    "webpack-chrome-extension-reloader": "./src/index.ts",
    "wcer": "./client/index.ts"
  },
  devtool: "source-map",
  output: {
    publicPath: ".",
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    libraryTarget: "umd"
  },
  plugins: [
    env.analyze && production(new BundleAnalyzerPlugin({sourceMap: true})),
    new BannerPlugin({
      banner: "#!/usr/bin/env node",
      raw: true,
      entryOnly: true,
      include: "wcer"
    })
  ].filter((plugin) => !!plugin),
  externals: [...Object.keys(pack.dependencies), "webpack", "webpack-chrome-extension-reloader"],
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    mainFiles: ["index"],
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [{
      enforce: "pre",
      test: /\.tsx?$/,
      loaders: [{loader: "tslint-loader", options: {configFile: "./tslint.json"}}]
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ["babel-loader"],
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
});