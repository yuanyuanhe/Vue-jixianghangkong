'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('../config')
const glob = require('glob')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
    devtool: config.dev.devtool,

    devServer: {
        contentBase: './',
        clientLogLevel: 'warning',
        historyApiFallback: true,
        inline: true,
        hot: true,
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay
        ? { warnings: false, errors: true }
        : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll,
        },
        openPage: config.dev.openPage
    },

    plugins: [
        new webpack.DefinePlugin(config.define),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        })
    ]
})

console.log(`http://${devWebpackConfig.devServer.host}:${devWebpackConfig.devServer.port}`);

let entries = utils.getEntry("./src/pages/**/*.html")
for (var filename in entries) {
    console.log(filename + '.html')
    // 配置生成的html文件，定义路径等
    const htmlConf = {
        // 生成的html文件名
        filename: filename + '.html',
        // 模板路径
        template: entries[filename],
        // js插入位置 true是放在body底部，flase是不加载相关文件，head是加载在头部
        inject: 'body',
        favicon: './src/common/imgs/favicon.ico',
        hash: false,
        // 每个html引用的js模块
        chunks: ['vendors', filename],
        // 决定了 script 标签的引用顺序
        chunksSortMode: 'dependency'
    }
    devWebpackConfig.plugins.push(new HtmlWebpackPlugin(htmlConf))
}

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
        // publish the new Port, necessary for e2e tests
        process.env.PORT = port
        // add port to devServer config
        devWebpackConfig.devServer.port = port
  
        // Add FriendlyErrorsPlugin
        devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
            },
            onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined
        }))
        resolve(devWebpackConfig)
      }
    })
})