const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const config = {
  context: path.resolve(__dirname, "src"),
  entry: {
    main: "./main.js",
    restaurant: "./restaurant_info.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./js/[name].bundle.js"
  },
  module: {
    rules: [
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
        test: /\.(jpg|png)$/,
        use: [
          {
            loader: "responsive-loader",
            options: {
              sizes: [400, 600, 800]
            }
          }
        ]
      },
      {
        test: /\.(gif|svg|json)$/,
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

    new ExtractTextPlugin("styles.css")
  ],

  devServer: {
    contentBase: path.resolve(__dirname, "./dist/assets/data"),
    port: 8000
  },
  devtool: "inline-source-map"
};

module.exports = config;
