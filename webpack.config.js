const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
  context: path.resolve(__dirname, "src"),
  entry: {
    main: "./main.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./js/[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      // html-loader
      {
        test: /\.html$/,
        use: ["html-loader"]
      }
    ]
  },
  plugins: [
    // html-webpack-plugin instantiation
    new HtmlWebpackPlugin({
      template: "index.html"
    }),
    new ExtractTextPlugin("styles.css")
  ],

  devServer: {
    contentBase: path.resolve(__dirname, "dist/assets/media/"),
    stats: "errors-only",
    port: 8000,
    open: true
  },
  devtool: "inline-source-map"
};

module.exports = config;
