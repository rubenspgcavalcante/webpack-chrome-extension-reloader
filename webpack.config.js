const path = require("path");
const { BannerPlugin } = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const pack = require("./package.json");
const { isDevelopment, isProduction, test } = require("./src/utils/env");

const mode = isDevelopment ? "development" : "production";

module.exports = (env = { analyze: false }) => ({
  mode,
  target: "node",
  entry: test({ tests: "./specs/index.ts" }) || {
    "webpack-chrome-extension-reloader": "./src/index.ts",
    wcer: "./client/index.ts"
  },
  devtool: "inline-source-map",
  output: {
    publicPath: ".",
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    libraryTarget: "umd"
  },
  plugins: [
    env.analyze && isProduction(new BundleAnalyzerPlugin({ sourceMap: true })),
    new BannerPlugin({
      banner: "#!/usr/bin/env node",
      raw: true,
      entryOnly: true,
      include: "wcer"
    })
  ].filter(plugin => !!plugin),
  externals: [
    ...Object.keys(pack.dependencies),
    "webpack",
    "webpack-chrome-extension-reloader"
  ],
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    mainFiles: ["index"],
    extensions: [".ts", ".tsx", ".js"]
  },
  optimization: {
    minimize: false,
    nodeEnv: false
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: "pre",
        use: [
          {
            loader: "tslint-loader",
            options: {
              configFile: "./tslint.json"
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loaders: ["babel-loader", "ts-loader"]
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loaders: ["json-loader"]
      },
      {
        test: /\.txt$/,
        exclude: /node_modules/,
        loaders: ["raw-loader"]
      }
    ]
  }
});
