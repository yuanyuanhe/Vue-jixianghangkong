'use strict'
const packageConfig = require('../package.json')
const path = require('path')
const config = require('../config')

// 引入glob工具（node的glob模块允许使用*等符号来进行匹配）
const glob = require('glob')

exports.getEntry = (globPath) => {
    let entries = {}, tmp, pathname;
    glob.sync(globPath).forEach(function(entry){
        tmp = entry.split('/').splice(3);
        tmp.pop();
        
        pathname = tmp.join('/') + '/index'

        entries[pathname] = entry
    })
    return entries
}

exports.createNotifierCallback = () => {
    const notifier = require("node-notifier");

    return (severity, errors) => {
        if (severity !== "error") return;

        const error = errors[0];
        const filename = error.file && error.file.split("!").pop();

        notifier.notify({
            title: packageConfig.name,
            message: severity + ": " + error.name,
            subtitle: filename || "",
            icon: path.join(__dirname, "logo.png")
        });
    };
};