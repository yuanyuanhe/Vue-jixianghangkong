"use strict";

const utils = require('./utils')
const { join, resolve } = require("path")
const webpack = require("webpack")
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PostCompilePlugin = require('webpack-post-compile-plugin')
const TransformModulesPlugin = require('webpack-transform-modules-plugin')

function resolvePath (dir) {
    return join(__dirname, '..', dir)
}

// 变量导入到全局
let provideItems = {
  JuneYaoAir: join(__dirname, '../src/common/logic')
}
// 获取入口
let entries = utils.getEntry("./src/pages/**/index.js")
let chunks = Object.keys(entries)

module.exports = {
  entry: entries,
  output: {
    path: resolve(__dirname, "../dist"),
    filename: "[name].js",
    publicPath: process.env.NODE_ENV === 'production'
    ? config.build.assetsPublicPath
    : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: [".js", ".vue", ".json", ".scss"],
    alias: {
      '@': resolvePath("src/"),
      common: resolvePath("src/common/"),
      style: resolvePath("src/common/styles/"),
      components: resolvePath("src/components/"),
      store: resolvePath("src/store/"),
      root: resolvePath("node_modules")
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            css: ["css-hot-loader"].concat(
              ExtractTextPlugin.extract({
                use: "css-loader",
                fallback: "style-loader"
              })
            ),
            less: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              use: ['css-loader', 'postcss-loader', 'less-loader'],
              fallback: 'style-loader'
            })),
            scss: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              use: ['css-loader', 'postcss-loader', 'sass-loader'],
              fallback: 'style-loader'
            })),
            postcss: ["css-hot-loader"].concat(
              ExtractTextPlugin.extract({
                use: ["css-loader", "postcss-loader"],
                fallback: "style-loader"
              })
            ),
            stylus: [ 'vue-style-loader',
                  { loader: 'css-loader', options: { sourceMap: true } },
                  { loader: 'stylus-loader',
                      options: { 'resolve url': true, sourceMap: true } } ]
              ,
            styl: [ 'vue-style-loader',
                  { loader: 'css-loader', options: { sourceMap: true } },
                  { loader: 'stylus-loader',
                      options: { 'resolve url': true, sourceMap: true } } ]

          }
        }
      },
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["css-hot-loader"].concat(
          ExtractTextPlugin.extract({
            use: ["css-loader", "postcss-loader"],
            fallback: "style-loader"
          })
        )
      },
      {
        test: /\.less$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'less-loader'],
          fallback: 'style-loader'
        }))
      },
      {
        test: /\.scss$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
          fallback: 'style-loader'
        }))
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              root: resolve(__dirname, "src"),
              attrs: ["img:src", "link:href"]
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff2|svgz)(\?.+)?$/,
        exclude: /favicon\.png$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "img/[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|svg)(\?.+)?$/,
        loader: "url-loader?name=fonts/[name].[ext]"
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        filename: "common/vendors.js", 
        chunks: chunks,
        minChunks: 2
    }),
    new PostCompilePlugin(),
    new TransformModulesPlugin(),
    new webpack.ProvidePlugin(provideItems)
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  }
};

