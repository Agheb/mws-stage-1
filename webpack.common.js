const path = require("path");
const glob = require("glob-all");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    main: "./main.js",
    restaurant: "./restaurant_info.js"
  },
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.[chunkhash].js"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            { loader: "css-loader" },
            {
              loader: "sass-loader",
              options: {
                includePaths: ["./node_modules"]
              }
            }
          ]
        })
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
        test: /\.(jpg|png)$/,
        use: [
          {
            loader: "responsive-loader",
            options: {
              sizes: [400, 600, 800],
              placeholder: true,
              placeholderSize: 100
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
              name: "[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin("dist"),
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
    new ExtractTextPlugin("styles.[contenthash].css"),
    new PurifyCSSPlugin({
      paths: glob.sync([
        path.join(__dirname, "src/*.html"),
        path.join(__dirname, "src/*.js")
      ]),
      minimize: true
    })
  ]
};
