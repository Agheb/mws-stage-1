const merge = require("webpack-merge");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = merge(common, {
  plugins: [
    new WorkboxPlugin.GenerateSW({ ignoreUrlParametersMatching: [/./] }),
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ]
});
