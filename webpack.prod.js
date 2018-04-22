const merge = require("webpack-merge");
const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const WorkboxPlugin = require("workbox-webpack-plugin");
const HtmlCriticalPlugin = require("html-critical-webpack-plugin");

module.exports = merge(common, {
  plugins: [
    new HtmlCriticalPlugin({
      base: path.resolve(__dirname, "dist"),
      src: "index.html",
      dest: "index.html",
      inline: true,
      extract: true,
      width: 375,
      height: 565,
      penthouse: {
        blockJSRequests: false
      }
    }),
    new HtmlCriticalPlugin({
      base: path.resolve(__dirname, "dist"),
      src: "restaurant.html",
      dest: "restaurant.html",
      inline: true,
      extract: true,
      width: 375,
      height: 565,
      penthouse: {
        blockJSRequests: false
      }
    }),
    new WorkboxPlugin.GenerateSW({ ignoreUrlParametersMatching: [/./] }),
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ]
});
