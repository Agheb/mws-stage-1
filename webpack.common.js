const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const CleanWebpackPlugin = require("clean-webpack-plugin");
module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    main: "./main.js",
    restaurant: "./restaurant_info.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.[chunkhash].js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [{ loader: "css-loader", options: { minimize: true } }]
        })
      },
      // html-loader
      {
        test: /\.html$/,
        use: ["html-loader"]
      },
      {
        test: /\.(jpg|png)$/,
        use: [
          {
            loader: "responsive-loader",
            options: {
              sizes: [400, 600, 800],
              placeholder: true
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      },

      {
        test: /\.(gif|json)$/,
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
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      chunks: ["main"]
    }),
    new HtmlWebpackPlugin({
      filename: "restaurant.html",
      template: "restaurant.html",
      chunks: ["restaurant"]
    }),
    new ExtractTextPlugin("styles.[contenthash].css")
  ]
};
