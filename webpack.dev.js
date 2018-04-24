const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = merge(common, {
  devServer: {
    contentBase: "./dist",
    port: 8000,
    quiet: true
  },
  devtool: "source-map",
  plugins: [new DashboardPlugin()]
});
