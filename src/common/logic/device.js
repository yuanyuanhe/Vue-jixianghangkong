'use strict';

/**
 * define device client type interface
 */

import { regMatch } from './utils';

let viewport = document.querySelector("meta[name=viewport]");
let ua = navigator.userAgent,
    chrome = ua.match(/chrome/i),
    safari = ua.match(/.*AppleWebKit(?!.*Safari)/i),
    android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
    ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
    ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
    iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
    weibo = ua.match(/WeiBo/i),
    weixin = ua.match(/MicroMessenger/i),
    mQQ = ua.match(/MQQBrowser/),
    isApp = ua.match(/juneyaoairapp/i),
    isSymbian = ua.match(/SymbianOS/i),
    isWinPhone = ua.match(/Windows Phone/i);

let device = {
        ios: false,
        android: false,
        symbian: false,
        winphone: false,
        iphone: false,
        iphoneX: !!iphone && !!(window.screen.height === 812 && window.screen.width === 375),
        ipad: false,
        androidChrome: false,
        weibo: !!weibo,
        isWeixin: !!weixin,
        isQQ: !!mQQ,
        isApp: !!isApp,
        browser: !isApp && !weixin,
        os: ''
    }
    // Android
if (android) {
    device.os = 'Android';
    device.osVersion = android[2];
    device.android = true;
    device.androidChrome = chrome;
}
if (ipad || iphone || ipod) {
    device.os = 'Ios';
    device.ios = true;
}
if (isSymbian) {
    device.symbian = true;
}
if (isWinPhone) {
    device.winphone = true;
}
if (isSymbian) {
    device.symbian = true;
}
// iOS
if (iphone && !ipod) {
    device.osVersion = iphone[2].replace(/_/g, '.');
    device.iphone = true;
}
if (ipad) {
    device.osVersion = ipad[2].replace(/_/g, '.');
    device.ipad = true;
}
if (ipod) {
    device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    device.iphone = true;
}
// iOS 8+ changed UA
if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
    if (device.osVersion.split('.')[0] === '10') {
        device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
    }
}
//pixelRatio
device.isRetina = window.devicePixelRatio && devicePixelRatio >= 2;
// Webview
device.webView = (iphone || ipad || ipod) && safari;
// Minimal UI
if (device.ios) {
    let osVersionArr = device.osVersion.split('.');
    device.minimalUi = !device.webView &&
        (ipod || iphone) &&
        (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
        viewport.length > 0 && viewport.getAttribute('content').indexOf('minimal-ui') >= 0;
}

export default device