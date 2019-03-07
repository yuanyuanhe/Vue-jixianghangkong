const express = require('express');
var proxyMiddleWare= require('http-proxy-middleware');
var app = express();
// 测试地址
var proxyPathMALLIP = "http://172.22.0.12:8088";//目标后端服务地址
var proxyOption ={
    target: proxyPathMALLIP,
    changeOrigoin: true,
    ws: true,
    pathRewrite: { '^/MALLIP': '' }
};
app.use(express.static('./dist'));
app.use("http://172.22.0.12:8088",proxyMiddleWare(proxyOption));
app.listen(4000);//4000是我要启动的端口