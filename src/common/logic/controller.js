JuneYaoAir;
import { ConfirmComponent, LoadingComponent, CalendarComponent} from './component'
import { Toast, Dialog, ActionSheet } from 'cube-ui'
import Vue from 'vue'
import lsKey from 'common/deploy/localstorage'
import axios from 'axios'
import device from './device'
import { getChannelCode, urlParam} from './utils'
let loadComponent = null;
let msgComponent = null;
let calComponent = null;
let toastComponet = null
Vue.use( Toast )
Vue.use( Dialog )
Vue.use( ActionSheet )
let vueComponent = new Vue();
/*
* H5 和 native 的通用接口
* */

const native = {
    confirm({ title, message, buttons, callback }) {
        let data = [title, message];
        Array.prototype.push.apply(data, buttons);
        JSBridge.invoke('HOWindow', 'confirm', data, function (result) {
            let status = parseInt(result[0]);
            let data = result[1];
            if (status === 1) {
                callback(data);
            }
        })
    },
    hiddenNaviBar() {
        JSBridge.invoke('HOWindow', 'hiddenNaviBar');
    },
    showNaviBar() {
        JSBridge.invoke('HOWindow', 'showNaviBar');
    },
    nativeCallBack() {
        JSBridge.invoke('HOWindow', 'nativeCallBack');
    }
}

const controller = {
    /**
     * 客户端已经传递给h5页面所有需要的数据信息
     * @param {Function} callback 获得数据产生的回调
     */
    ready() {
        return new Promise((resolve, reject) => {
            const saveData = (data) => {
                console.log('ready data:' + JSON.stringify(data))
                const dataObj = data || {};
                dataObj.data = dataObj.data || {};
                window._memberInfo = dataObj.memberInfo;
                window._deviceInfo = dataObj.deviceInfo;
                window._pageData = dataObj.data;
                // 获取接口地址
                let environment = dataObj.environment;
                if(environment){
                    window.IP = environment.IP;
                    window.SERVERIP = environment.SERVERIP;
                    window.WEBIP = environment.WEBIP;
                    window.MALLIP = environment.MALLIP;
                }
                console.log('environment--------' + JSON.stringify(dataObj.environment))
                console.log('SERVERIP--------' + SERVERIP)
                resolve(dataObj);
            }
            juneYaoAir.clientControl({
                juneYaoCallback() {
                    if (window.JSBridge) {
                        JSBridge.addEvent("ready", function(data) {
                            saveData(data && data[0] ? data[0] : {});
                        });
                    } else {
                        document.addEventListener('JSBridgeReady', function() {
                            JSBridge.addEvent("ready", function(data) {
                                saveData(data && data[0] ? data[0] : {});
                            });
                        }, false)
                    }
                },
                normalCallback () {
                    const memberInfo = controller.getStorage(lsKey.MEMBER_INFO);
                    const data = controller.getStorage(lsKey.PAGE_DATA) || {};
                    const deviceInfo = require('common/config');
                    controller.clearStorage(lsKey.PAGE_DATA);

                    saveData({ memberInfo, deviceInfo, data});
                }
            })
            // 给body添加ios类名
            if(device.ios){
                document.getElementsByTagName('body')[0].className = 'style-ios';
            }
            // 禁止ios底部反弹
            if(device.os.toLowerCase() == "ios"){
                controller.enableBounce(false);
            }
        })
    },
    //监听头部右侧监听
    navRightTitle(callback){
        if (window.JSBridge) {
            JSBridge.setEvent("navRightTitle", function(data) {
                callback();
            });
        } else {
            document.addEventListener('JSBridgeReady', function() {
                JSBridge.setEvent("navRightTitle", function(data) {
                    callback();
                });
            }, false);
        }
    },
    // 监听页面显示
    onshow(callback) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                if (window.JSBridge) {
                    JSBridge.addEvent("onShow", function () {
                        callback();
                    });
                } else {
                    document.addEventListener('JSBridgeReady', function () {
                        JSBridge.addEvent("onShow", function () {
                            callback();
                        });
                    }, false);
                }
            },
            normalCallback() {
                document.addEventListener("visibilitychange", function() {
                    if(!document.hidden){
                        callback();
                    }
                });
            }
        })
    },
    // 监听页面隐藏
    onHide(callback) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                if (window.JSBridge) {
                    JSBridge.addEvent("onHide", function (data) {
                        callback(data);
                    });
                } else {
                    document.addEventListener('JSBridgeReady', function () {
                        JSBridge.addEvent("onHide", function (data) {
                            callback(data);
                        });
                    }, false);
                }
            },
            normalCallback() {
                document.addEventListener("visibilitychange", function() {
                    if(document.hidden){
                        callback();
                    }
                });
            }
        })
    },
    // 提示框
    toast({str, times = 2000} = {}) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOWindow', 'toast', [str, times]);
            },
            normalCallback() {
                var toastComponet = vueComponent.$createToast({
                    time: times,
                    txt: str
                })
                toastComponet.show()
            }
        })
    },
    /**
    * IOS页面回弹
    * @param {Boolean} flag
    * */
    enableBounce(flag) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOWindow', 'enableBouced', [flag]);
            }
        })
    },
    /*
    * 拦截原生头部返回事件
    * @param {Function} callback
    * */
    clickBack(callback) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOWindow', 'setInterceptBack', [true]);
                if (window.JSBridge) {
                    JSBridge.setEvent("clickBack", function (data) {
                        callback(data);
                    });
                } else {
                    document.addEventListener('JSBridgeReady', function () {
                        JSBridge.setEvent("clickBack", function (data) {
                            callback(data);
                        });
                    }, false);
                }
            }
        })
    },

    /**
     * 提示信息
     * @param {String} title 提示的信息的标题
     * @param {String} message 提示框提示信息
     * @param {Function} callback 提示后回调函数
     * @param {Array} buttons 提示框的按钮
     */
    confirm({title, message, buttons, onConfirm, onCancel}) {
        if (msgComponent === null) {
            msgComponent = ConfirmComponent({title, message, buttons, onConfirm, onCancel})
        } else {
            msgComponent.canConfirm = true;
        }

        // 如果传两个方法则不区分
        msgComponent.$off('clickBtn2');
        msgComponent.$on('clickBtn2',  onConfirm);
        if(onCancel){
            msgComponent.$off('clickBtn1');
            msgComponent.$on('clickBtn1', onCancel);
        }
    },
    /**
     * 提示信息
     * @param {String} title 提示框的按钮
     * @param {String} content 提示框提示内容
     * @param {String} alertBtn 底部按钮文字
     * @param {Boolean } showClose  是否显示关闭按钮默认false不显示
     * @param {Function} onClose 关闭按钮回调函数
     * @param {Function} onConfirm 底部按钮回调函数
     */
    alert({title, content, alertBtn, showClose = false, onClose, onConfirm} = {}) {
        var alertComponet = vueComponent.$createDialog({
            type: 'alert',
            title: title,
            content: content,
            showClose: showClose,
            confirmBtn: {
                text: alertBtn,
                active: true
            },
            onClose: onClose,
            onConfirm: onConfirm
        })
        alertComponet.show()
    },
    /**
     * 弹框列表
     * @param {Array} data 需要展示的数据列表
     * data 子配置项{
     *      content：展示的内容 String   任意 HTML 字符串
     *      align：内容对齐方向 String   left/right
     *      class：自定义class  String
     * }
     * @param {String} cancelTxt 取消文案 String 默认（取消）
     * @param {Boolean} maskClosable 点击蒙层是否隐藏 Boolean 默认(true)
     * @param {Function} onSelect 点击某项回调函数 
     * onSelect{
     *      参数一：点击项 item，即 data[index]， 
     *      参数二：点击项的索引值 index
     * }
     * @param {Function} onCancel 点击取消回调函数 
     */
    showList({data, cancelTxt, maskClosable, onSelect, onCancel}) {
        var showListComponet = vueComponent.$createActionSheet({
            data: data,
            cancelTxt: cancelTxt,
            maskClosable: maskClosable,
            onSelect: onSelect,
            onCancel: onCancel
        })
        showListComponet.show()
    },
    // 设置localStorage
    setStorage(key, val) {
        let LsStr;
        if (val != 0 && (!key || !val)) return;
        if (controller.isPlainObject(val) || controller.isArray(val)) {
            LsStr = JSON.stringify(val);
        }
        LsStr = LsStr || val;
        localStorage.setItem(key, LsStr);
    },
    getStorage(name) {
        let value = localStorage.getItem(name);
        try {
            let oValue = JSON.parse(value);
            if (typeof (oValue) === "object" || typeof (oValue) === "boolean") {
                return oValue;
            } else {
                return value;
            }
        } catch (e) {
            return value;
        }
    },
    clearStorage(key) {
        if (key) {
            localStorage.removeItem(key);
        }
    },
    isPlainObject(object) {
        return "[object Object]" === Object.prototype.toString.call(object) && !(null != object && object == object.window) && Object.getPrototypeOf(object) == Object.prototype;
    },
    isArray(object) {
        return "[object Array]" === Object.prototype.toString.call(object);
    },
    cloneObj(obj) {
        var str, newobj = obj.constructor === Array ? [] : {};
        if (typeof obj !== 'object') {
            return;
        } else if (window.JSON) {
            str = JSON.stringify(obj), //系列化对象
                newobj = JSON.parse(str); //还原
        } else {
            for (var i in obj) {
                newobj[i] = typeof obj[i] === 'object' ?
                    cloneObj(obj[i]) : obj[i];
            }
        }
        return newobj;
    },
    getUrlParams() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    /**
    * 日期选择
    * @param {String} year 打开日期的年
    * @param {String} month 打开日期的月
    * @param {String} day 打开日期的日
    * @param {String} choseDay 日期选择后的回调，function,返回格式{year:yyyy,month:mm,day:dd}
    * @param {String} changeMonth 改变月份的回调，function,返回格式： YY-MM-DD
    * @param {String} isToday 切换月份的时候，如果切到当前月份回调，function,返回格式:YY-MM-DD
    * @param {String} markDate 如果需要某月的几天被标注，传当月的日期数组,格式：['y/m/d','y/m/d']
    * @param {String} markDateMore 多个标记,格式: [{date:'y/m/d',className:"xxx"}, {date:'y/m/d',className:"xxx"}]
    * @param {String} agoDayHide 某个日期以前的不允许点击 时间戳长度是 10 位,string,格式:时间戳的前十位字符串
    * @param {String} futureDayHide 某个日期以后的不允许点击 时间戳长度是 10 位,string,格式:时间戳的前十位字符串
    * */

    openDatePicker({year, month, day, choseDay, changeMonth, isToday, markDate, markDateMore, agoDayHide, futureDayHide}) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOControl', 'openDatePicker', [year, month, day], function (result) {
                    var status = result[0];
                    var data = result[1];
                    if (status == 1) {
                        var date = {
                            year: data[0],
                            month: data[1],
                            day: data[2]
                        };
                        choseDay(date);
                    }
                });
            },
            normalCallback() {
                if(calComponent === null) {
                    calComponent = CalendarComponent({year, month, day, choseDay, changeMonth, isToday, markDate, markDateMore, agoDayHide, futureDayHide});
                } else {
                    calComponent.showComponent();
                }
            }
        })
    },
    /**
    * 打开照相机
    * @param {Function} callback 打开照相机拍完照后回调函数
    * */
    openCamera(callback) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOCamera', 'open', null, function (result) {
                    var status = result[0];
                    var data = result[1];
                    if (status == 1) {
                        callback(data[0]);
                    }
                });
            }
        })
    },
    
    /**
    * 关闭软键盘A
    * @param 
    * */
    hideSoftKeyBoard() {
        JSBridge.invoke('HOWindow', 'hideSoftKeyBoard')
    },
    /**
    * 关闭window
    * @param 
    * */
   closeWindowName({winName,data,callback}) {
        console.log(winName)
        JSBridge.invoke('HOWindow', 'closeWindowName', [winName,data], function (result) {
            var status = result[0];
            var data = result[1];
            if (status == 1) {
                callback(data[0]);
            }
        });
    },
    /**
    * 跳到某个页面并关闭此页面之后的所有页面
    * @param {String} winName 窗口名称
    * @param {Any} data 数据
    * */
    popWindowName({winName, data = null}) {
        JSBridge.invoke('HOWindow', 'popWindowName', [winName,data]);
    },
    /**
    * 监听popWindowName
    * @param {Function} callback 回调
    * */
    onPopWindowName(callback) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                if (window.JSBridge) {
                    JSBridge.addEvent("onPopWindowName", function(data) {
                        callback(data && data[0] ? data[0] : {});
                    });
                } else {
                    document.addEventListener('JSBridgeReady', function() {
                        JSBridge.addEvent("onPopWindowName", function(data) {
                            callback(data && data[0] ? data[0] : {});
                        });
                    }, false)
                }
            }
        })
    },
    /**
    * 截屏
    * @param {Function} callback 截屏完后回调函数
    * */
    screenShot(callback) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOCamera', 'ScreenShot', null, function (result) {
                    var status = result[0];
                    var data = result[1];
                    if (status == 1) {
                        callback(data[0]);
                    }
                });
            }
        })
    },
    /**
    * 打开相册
    * @param {Number} num 剩下需要选择多少张
    * @param {String} str 判断是否转化为base64
    * @param {Function} callback 打开相册选择照片后回调函数
    * */
    openPhoto({ num , str , callback }) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOPhoto', 'open', [num,str], function (result) {
                    // console.log(result)
                    var status = result[0];
                    var data = result[1];
                    if (status == 1) {
                        callback(data);
                    }
                });
            }
        })
    },
    /**
    * 获取打开的通讯录的信息
    * @param {Function} callback 选择联系人后回调函数
    * */
    openContact(callback) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOContact', 'open', null, function (result) {
                    var status = result[0];
                    var data = result[1];
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        console.log('HOContact:' + e);
                    }
                    console.log('HOContact:' + JSON.stringify(data))
                    if (status == 1) {
                        var contact = {};
                        // android返回是一个Object，IOS返回的是Array
                        if (controller.isPlainObject(data)) {
                            contact.name = data.name;
                            contact.phoneNumber = data.num[0];
                        } else if (controller.isArray(data)) {
                            contact.name = data[0];
                            contact.phoneNumber = data[1];
                        }
                        callback(contact);
                    }
                });
            }
        })
    },
    /**
    * 打开电话本
    * @param {Number} telephoneNumber 要拨打的电话号
    * */
    dial(telephoneNumber) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOCall', 'call', [telephoneNumber]);
            }
        })
    },
    /**
     * 隐藏加载Loading
     */
    hideLoadingDialog() {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOWindow', 'hideLoading');
            },
            normalCallback() {
                if (loadComponent !== null) {
                    loadComponent.showLoad = false;
                }
            }
        })
    },
    /**
     * 显示加载Loading
     */
    showLoadingDialog() {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOWindow', 'showLoading');
            },
            normalCallback() {
                if (loadComponent === null) {
                    loadComponent = LoadingComponent();
                } else {
                    loadComponent.showLoad = true;
                }
            }
        })
    },
    /**
    * 发送请求
    * @param {String} method 请求方法
    * @param {String} url 请求地址
    * @param {Object} params 请求参数
    * @param {Function} callback 成功的回调函数
    * @param {Function} errorFn 失败的回调函数
    * @param {Boolean} isloading 是否loading
    * */
    getJSON({ method = 'POST', url = '', params = {}, isloading = true, host = SERVERIP, oldParams }) {
        var that = this;
        params.channelCode = getChannelCode();
        params.platformInfo = device.os.toLowerCase();
        if(window._deviceInfo) {
            params.clientVersion = window._deviceInfo.versionName
        }
        if(window._memberInfo) {
            params.token = window._memberInfo.token
        }
        if (isloading){ 
            that.showLoadingDialog();
        }
        // 老接口请求参数
        if(oldParams) {
            for(let key in oldParams) {
                params[key] = oldParams[key];
            }
        }
        url = host + url;
        console.log('ajax params:' + JSON.stringify(params));
        return new Promise((resolve, reject) => {
            juneYaoAir.clientControl({
                juneYaoCallback() {
                    JSBridge.invoke('HOAjax', 'post', [url, params], function (result) {
                        console.log('ajax result:' + JSON.stringify(result))
                        let status = result[0]
                        let data = result[1]
                        try {
                            data = JSON.parse(data);
                        } catch (e) {
                            console.log('HOAjax: ' + e)
                        }
                        if (isloading) {
                            that.hideLoadingDialog();
                        }
                        if (status == 1) {
                            resolve(data);
                        } else {
                            reject(data);
                        }
                    })
                },
                normalCallback() {
                    axios({
                        method: method,
                        url: url,
                        data: method === 'POST' || method === 'post' ? params : null,
                        params: method === 'GET' || method === 'get' ? params : null,
                        // 表示跨域请求时是否需要使用凭证
                        // withCredentials: false,
                        timeout: 1000 * 60,
                        // baseURl: getApiUrl.MALLIP,
                        headers: {
                            'content-type': 'application/json;charset=UTF-8'
                        }
                    })
                    .then((res) => {
                        if (isloading) {
                            that.hideLoadingDialog();
                        }
                        resolve(res.data);
                    })
                    .catch((err) => {
                        if (isloading) {
                            that.hideLoadingDialog();
                        }
                        reject(err.data);
                    })
                }
            })
        })
    },

    /**
    * 上传多文件
    * @param {String} dst 请求地址
    * @param {String} src 图片路径数组
    * 
    **/
    mfupload({ dst , src , successCallback , link = SERVERIP}){
        dst = link + dst
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOAjax', 'multibleupload', [ dst , src] , function (result) {
                    successCallback(result);
                });
            }
        }) 
    },
    /*
    * 上传文件
    * */
    upload({ src, dst, successCallback, failureCallback, progressCallback }) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOAjax', 'upload', [src, dst], function (result) {
                    var status = result[0];
                    var data = result[1];
                    if (status == 1) {
                        var fileURL = data[0];
                        var oData = data;
                        try {
                            oData = JSON.parse(data)
                        } catch (e) { }
                        successCallback(oData);
                    } else if (status == 2) {
                        var id = data[0];
                        var progress = data[1];
                        progressCallback(id, progress);
                    } else {
                        var errorMessage = data[0];
                        failureCallback(errorMessage);
                    }
                });
            }
        })
    },
    /*
    * 取消上传
    * */
    cancelUpload(id) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOAjax', 'cancelUpload', [id]);
            }
        })
    },
    /*
    * 下载文件
    * */
    download({ src, tempPath, callback }) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOAjax', 'download', [src, tempPath], function (result) {
                    var status = result[0];
                    var data = result[1];
                    console.log('HOAjax==download:status:' + status + ' data:' + data + 'END');
                    //if (status == 1) {
                    callback(status, data);
                    //}
                });
            }
        })
    },
    /*
    * 取消下载
    * */
    cancelDownload(id) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOAjax', 'cancelDownload', [id]);
            }
        })
    },
    /**
    * 微信分享
    * @param {String} url 分享出的链接地址
    * @param {String} title 分享出的标题
    * @param {String} description 分享出的描述
    * @param {String} appIcon 缩略图
    * @param {Number} scene 发送的目标场景 0:会话场景 1:朋友圈场景
    * @param {Number} type 0:链接 1:图片 2:截图 3:音视频
    * @param {Function} successCallback 分享成功回调
    * @param {Function} failureCallback 分享失败回调
    * 
    * */
    wxShare({ url = '', title = '', description = '', appIcon = '', scene = 0, type = 0, successCallback, failureCallback }) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOWeChat', 'setShareData', [url, title, description, appIcon, type]);
                JSBridge.invoke('HOWeChat', 'share', [scene], function (result) {
                    console.log("得到分享结果");
                    console.log(result);
                    var status = result[0];
                    var data = result[1];
                    if (status == 1) {
                        typeof successCallback === 'function' && successCallback(data);
                    } else {
                        typeof failureCallback === 'function' && failureCallback(data);
                    }
                });
            }
        })
    },
    /*
    * 判断是否安装微信
    * */
    isWechatInstalled: function (callback) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOWeChat', 'isWechatInstalled', [], function (result) {
                    console.log(result);
                    var status = result[0];
                    var data = result[1];
                    if (status == 1) {
                        callback(data);
                    }
                });
            }
        })
    },
    /**
    * 打开原生页面，传值到原生页面
    * @param {String} winName 窗口名称
    * @param {String} path 页面url
    * @param {Object} data 传递数据
    * @param {Number} animateType 0由由右往左推入 1由下往上推入(不传默认为0)
    * @param {Boolean} closeLastPage 是否关闭当前窗口
    * @param {Boolean} newPage 新窗口打开(针对浏览器)
    **/
    open({ winName, path, data, animateType, closeLastPage, newPage }) {
        let pageCode = -1;
        controller.openForResult({
            winName, path, pageCode, data, animateType, closeLastPage, newPage
        })
    },
    /**
    * 打开新的页面
    * @param {String} flag 标识
    * @param {String} winName 窗口名称
    * @param {String} path 页面url
    * @param {Object} data 传递数据
    **/
    openNative({flag = 'changeDate', data} = {}) {
        JSBridge.invoke('HOWindow', 'openNative', [flag, data]);
    },
    /**
    * 关闭当前页面，返回到指定页面
    * @param {Number} flag -1 - -5对应app首页5个tab
    * @param {String} pageUrl 要跳转的url(针对浏览器)
    * @param {Boolean} closePage 是否关闭当前页面(针对浏览器)
    * 
    * */
    close({flag = 0, pageUrl, closePage} = {}) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                if (flag == 0) {
                    JSBridge.invoke('HOWindow', 'close');
                } else {
                    JSBridge.invoke('HOWindow', 'close', [flag]);
                }
            },
            normalCallback() {
                if(flag < 0) {
                    window.location.href = 'http://m.juneyaoair.com/';
                } else if(closePage){
                    window.close();
                } else if(pageUrl){
                    window.history.pushState(null,null,pageUrl);
                    document.location.reload();
                } else {
                    window.history.back(-1);
                }
            }
        })
    },
    /*
    * 打开新的页面，传递参数
    * */
    openForResult({ winName, path, pageCode, data, animateType, closeLastPage, newPage}) {
        var dirReg = /^((http|https)?:\/\/|\.|\/)/;
        juneYaoAir.clientControl({
            juneYaoCallback() {
                // hybrid根目录
                if(!dirReg.test(path)){
                    path = '../../' + path;
                }
                JSBridge.invoke('HOWindow', 'openForResult', [winName, path, pageCode, data, animateType]);
                if(closeLastPage != undefined && closeLastPage) {
                    controller.close();
                }
            },
            normalCallback() {
                if (!!data) {
                    controller.setStorage(lsKey.PAGE_DATA, data);
                }
                if (newPage) {
                    //controller.setStorage(lsKey.PAGE_RESULT_CODE, pageCode);
                    if(!dirReg.test(path)){
                        path = '/' + path.replace(/^(\.*\/)*/g, '');
                    }
                    window.open(path);
                } else {
                    if(!dirReg.test(path)){
                        path = '/' + path.replace(/^(\.*\/)*/g, '');
                    }
                    window.location.href = path;
                }
            }
        })
    },
    setResult(data) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOWindow', 'setResult', [data]);
            },
            normalCallback() {
                controller.setStorage(lsKey.PAGE_RESULT_DATA, data);
            }
        })
    },
    onResult(callback) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                if (window.JSBridge) {
                    JSBridge.addEvent("onResult", function (result) {
                        var data = result[0];
                        typeof callback === 'function' && callback(data['pageCode'], data['data']);
                    });
                } else {
                    document.addEventListener('JSBridgeReady', function () {
                        JSBridge.addEvent("onResult", function (result) {
                            var data = result[0];
                            typeof callback === 'function' && callback(data['pageCode'], data['data']);
                        });
                    }, false);
                }
            },
            normalCallback() {
                document.addEventListener('storage', function () {
                    let pageCode = controller.getStorage(lsKey.PAGE_RESULT_CODE);
                    let data = controller.getStorage(lsKey.PAGE_RESULT_DATA);
                    typeof callback === 'function' && callback(pageCode, data);
                })
            }
        })
    },
    /*
    * 获取设备信息
    * */
    getDeviceInfo({ type, callback }) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HODevice', 'getInfo', [type], function (result) {
                    var status = result[0];
                    var data = result[1];
                    if (status == 1) {
                        callback(data);
                    }
                });
            }
        })
    },
    // 是否支付云闪付 0不可以 1苹果支付 2三星支付 3小米支付 4华为支付
    getCppPay(callback) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOCppPay', 'canNativePay', [], function(result){
                    var status = result[0];
                    var data = result[1];
                    if (status == 1) {
                        callback(data);
                    }
                })
            }
        })
    },
    loadUrl({ action, dataType, data }) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOWidget', 'loadUrl', [action, dataType, data]);
            }
        })
    },
    installApp(src) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOWidget', 'installApp', [src]);
            },
            normalCallback() {
                window.location.href = src;
            }
        })
    },
    setTitle(name, obj) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOWindow', 'setTitle', [name]);
            },
            normalCallback() {
                if(typeof(obj) == 'object'){
                    obj.title = name;
                }
            }
        })
    },
    /*
    * 将h5的登录信息提交给客户端
    * */
    setLoginInfo(data) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOStore', 'setLoginInfo', [data]);
            }
        })
    },
    /*
    * h5页面获取客户端的登录信息
    * */
    getLoginInfo: function (callback) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOStore', 'getLoginInfo', [], function (result) {
                    var status = result[0];
                    var data = result[1];
                    if (status == 1) {
                        callback(data);
                    }
                });
            }
        })
    },
    /*
    * 清除客户端的登录信息
    * */
    clearLoginInfo() {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOStore', 'clearLoginInfo');
            }
        })
    },
    logEvent({ category, event, value = null } = {}) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOStatistic', 'logEvent', [category, event, value]);
            }
        })
    },
    // 云闪付
    cpppay({data, successCallback, failureCallback}) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOCppPay', 'pay', [data],  function(result) {
                    console.log("cpppay");
                    console.log(result);
                    var status = result[0];
                    var data = result[1];
                    if (status == 1) {
                        typeof successCallback === 'function' && successCallback(data);
                    } else {
                        typeof failureCallback === 'function' && failureCallback(data);
                    }
                })
            }
        })
    },
    /*
    * 支付宝支付
    * */
    alipay({ data, successCallback, failureCallback }={}) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOAliPay', 'pay', [data], function (result) {
                    var status = result[0];
                    var data = result[1];
                    console.log('HOAliPay >>>>> ' + JSON.stringify(result))
                    if (status == 1) {
                        typeof successCallback === 'function' && successCallback(data);
                    } else {
                        typeof failureCallback === 'function' && failureCallback(data);
                    }
                });
            }
        })
    },
    /*
    * 微信支付
    * */
    wechatpay({ data, successCallback, failureCallback }) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOWeChat', 'pay', [data], function (result) {
                    var status = result[0];
                    var data = result[1];
                    if (status == 1) {
                        typeof successCallback === 'function' && successCallback(data);
                    } else {
                        typeof failureCallback === 'function' && failureCallback(data);
                    }
                });
            }
        })
    },
    /*
    * 微信登录
    * */
    wechatlogin({ data, successCallback, failureCallback }) {
        juneYaoAir.clientControl({
            juneYaoCallback() {
                JSBridge.invoke('HOWeChat', 'login', [data], function (result) {
                    console.log('HOWeChat >>>>> ' + JSON.stringify(result));
                    var status = result[0];
                    var data = result[1];
                    if (status == 1) {
                        typeof successCallback === 'function' && successCallback(data);
                    } else {
                        typeof failureCallback === 'function' && failureCallback(data);
                    }
                });
            }
        })
    },

    /**
     * 隐藏原生头部
     * @param {动画效果0无动画 1有动画} data 
     */
    hiddenBar( data = 0 ) {
        juneYaoAir.clientControl({
            juneYaoCallback(){
                JSBridge.invoke('HOWindow', 'hiddenNaviBar', [data]);
            }
        })
    },

    /**
     * 显示原生头部
     * @param {动画效果0无动画 1有动画} data 
     */
    showBar( data = 0 ) {
        juneYaoAir.clientControl({
            juneYaoCallback(){
                JSBridge.invoke('HOWindow', 'showNaviBar', [data]);
            }
        })
    },
    /**
    * 设置微信分享
    * @param {String} url 分享出的链接地址
    * @param {String} title 分享出的标题
    * @param {String} description 分享出的描述
    * @param {String} appicon 缩略图
    * @param {Number} type 0:链接 1:图片 2:截图 3:音视频
    * 
    * */
    setWechatShareData: function( url = '', title = '', description = '', appicon = '', type = 0 ){
        JSBridge.invoke('HOWeChat', 'setShareData', [url, title, description, appicon, type]);
    },

    /**
    * 微信分享
    * @param {Number} scene 发送的目标场景 0:会话场景 1:朋友圈场景
    * @param {Function} successCallback 分享成功回调
    * @param {Function} failureCallback 分享失败回调
    * 
    * */
    wechatshare: function(scene, successCallback, failureCallback) {
         JSBridge.invoke('HOWeChat', 'share', [scene],  function(result) {
             console.log("得到分享结果");
             console.log(result);
             var status = result[0];
             var data = result[1];
             if (status == 1) {
                 typeof successCallback === 'function' && successCallback(data);
             } else {
                 typeof failureCallback === 'function' && failureCallback(data);
             }
         });
    },
    /**
    * 打开忘记消费密码原生页面
    * 
    * */
   forgetConsumerPwd(){
        JSBridge.invoke('HOControl', 'forgetConsumerPwd');
    },
};

export { controller, native }
export default controller