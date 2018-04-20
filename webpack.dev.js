const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  devServer: {
    contentBase: "./dist",
    port: 8000,
    compress: true
  },
  devtool: "inline-source-map"
});
