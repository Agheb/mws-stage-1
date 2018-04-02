const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

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
      },
      {
        test: /\.(jpg|png|gif|svg|json)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./assets/data/"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    // html-webpack-plugin instantiation
    new HtmlWebpackPlugin({
      template: "index.html"
    }),
    new ExtractTextPlugin("styles.css")
  ],

  devServer: {
    contentBase: path.resolve(__dirname, "./dist/assets/data"),
    port: 8000
  },
  devtool: "inline-source-map"
};

module.exports = config;
