'use strict'
// Template version: 1.2.5
// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')
const dev = require('./dev.env')
const prod = require('./prod.env')
let define = env()
module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'assets',
    assetsPublicPath: '/',
    proxyTable: define.proxyTable, 
  
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8090, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    // devtool: 'eval-source-map',
    devtool: 'source-map',
    // devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: true,
    // set the open page you need~
    // openPage: 'customer/home.html',
    openPage: 'changeDate/index/index.html',
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'assets',
    assetsPublicPath: '../../',

    /**
     * Source Maps
     */

    productionSourceMap: define.productionSourceMap,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },

  define: define.env
}

function env(){
  const dev = process.env.NODE_ENV
  const prod = process.argv.slice(2)[0]
  const map = process.argv.slice(2)[1]
  console.log(dev, prod)
  
  let env, define = {}
  // 正式环境地址
  if(prod === 'prod'){
    env = require('../config/prod.env')
  }
  // 预发布环境地址
  if(prod === 'pre'){
    env = require('../config/pre.env')
  }
  // 开发、测试环境地址
  if(dev === 'development' || prod === 'test'){
      env = require('../config/dev.env')
  }


  // 开发环境proxyTable和本地代理地址配置
  if(dev === 'development'){
    define.env = Object.assign({
      'process.env.NODE_ENV': '"development"'
    }, proxyTable(env).env)
    define.proxyTable = proxyTable(env).proxyTable
  }


  // 生产环境正式包、测试包、预发布地址配置
  if(prod === 'prod' || prod === 'test' || prod === 'pre'){
    define.env = Object.assign({
      'process.env.NODE_ENV': '"production"'
    }, env)
  }

  if(prod === 'native'){
    // 是否需要 map 文件
    if(map == 'map'){
      define.productionSourceMap = true;
    } else {
      define.productionSourceMap = false;
    }
    define.env = Object.assign({
      'process.env.NODE_ENV': '"production"'
    })
  }
  return define
}

// 根据环境地址个数配置本地代理
function proxyTable(obj) {
  let proxyTable = {}
  let env = {}
  let keys = Object.keys(obj)
  for(let key in obj){
    let oKey = '/' + key;
    proxyTable[oKey] = Object.assign({}, {
      'target': JSON.parse(obj[key]),
      'secure': false,
      'changeOrigin': true,
      'pathRewrite': {}
    })
    proxyTable[oKey]['pathRewrite']['^/' + key] = ''
    env[key] = '"/' + key + '"'
  }
  return {
    proxyTable: proxyTable,
    env: env
  }
}
