'use strict'
const utils = require('./utils')
const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

let entries = baseWebpackConfig.entry;
Object.keys(entries).forEach(function (key) {
	let arr = [entries[key]];
	arr.unshift("babel-polyfill");
	entries[key] = arr;
});
baseWebpackConfig.entry = entries;
console.info(baseWebpackConfig.entry)

const webpackConfig = merge(baseWebpackConfig, {
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
        filename: "[name].js",
        chunkFilename: "[id].[chunkhash].js"
    },
    plugins: [
        new webpack.DefinePlugin(config.define),
        new webpack.optimize.UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            sourceMap: config.build.productionSourceMap,
            parallel: true
        }),
        new ExtractTextPlugin({
            filename: (getPath) => {
                if(getPath('[name]') == 'vendors'){
                    return 'common/common.css'
                } else {
                    return getPath('[name].css')
                }
            },
            allChunks: true
        }),
        new OptimizeCSSPlugin({
          cssProcessorOptions: config.build.productionSourceMap
            ? { safe: true, map: { inline: false } }
            : { safe: true }
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            filename: "common/manifest.js", 
            minChunks: 2
        }),
        // enable scope hoisting
    ]
})

let entriesHtml = utils.getEntry("./src/pages/**/*.html")
for (var filename in entriesHtml) {
    // 配置生成的html文件，定义路径等
    const htmlConf = {
        filename: filename + '.html',
        template: entriesHtml[filename],
        inject: 'body',
        favicon: './src/common/imgs/favicon.ico',
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        },
        hash: false,
        chunks: ['manifest', 'vendors', filename],
        chunksSortMode: 'dependency'
    }
    webpackConfig.plugins.push(new HtmlWebpackPlugin(htmlConf))
}

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')
  
    webpackConfig.plugins.push(
      new CompressionWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          config.build.productionGzipExtensions.join('|') +
          ')$'
        ),
        threshold: 10240,
        minRatio: 0.8
      })
    )
  }
  
  if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
  }
  
  module.exports = webpackConfig