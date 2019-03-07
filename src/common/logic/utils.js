'use strict';
// junayaoair
import { RegEnum, Verify, ChannelCode, SelNum, SelSex, SelCard, ResultCode, AllOrderType } from './enum';
import device from './device';
import controller from "./controller";
import lKey from '../deploy/localstorage';
import requesturl from '../deploy/requesturl';

/**
 * 正则验证方法
 * @param {要使用正则验证的内容} String content
 * @param {验证什么 eg: 姓名} String msg
 * @return {返回对应result}
 */
export function vilidation(content, msg) {
    content = content || '';
    let Reg = RegEnum.properties[msg].reg,
        toast = Verify.BACK_TRUE;
    if(!Reg.test(content.trim())){
        switch (msg) {
            case RegEnum.MOBILE:
                toast = Verify.BACK_ERR.toastPhone
            break;
            case RegEnum.ID_CARD:
                toast = Verify.BACK_ERR.toastCard
            break;
            case RegEnum.EMAIL:
                toast = Verify.BACK_ERR.toastMail
            break;
            case RegEnum.PASSWORD:
                toast = Verify.BACK_ERR.result
            break;
            case RegEnum.NAME_CH:
                toast = Verify.BACK_ERR.toastNameCH
            break;
            case RegEnum.TICKET_NO:
                toast = Verify.BACK_ERR.toastSticket
            break;
            case RegEnum.FLIGHT_NO:
                toast = Verify.BACK_ERR.toastNum
            break;
            case RegEnum.DATE_CH:
                toast = Verify.BACK_ERR.toastData
            break;
            case RegEnum.BABY_HEIGHT:
                toast = Verify.BACK_ERR.toastBabyHW
            break;
            case RegEnum.BABY_WEIGHT:
                toast = Verify.BACK_ERR.toastBabyHW
            break;
            case RegEnum.NAME_ALL:
                toast = Verify.BACK_ERR.toastName
            break;
            case RegEnum.CH:
                toast = Verify.BACK_ERR.result
            break;
            case RegEnum.EN:
                toast = Verify.BACK_ERR.toastEn
            break;
            case RegEnum.NOT_ALL_CH:
                toast = Verify.BACK_ERR.toastNotAllCh
            break;
            case RegEnum.NOT_STRICT_NAME:
                toast = Verify.BACK_ERR.toastNotStrictName
            break;
            case RegEnum.PASSPORT:
                toast = Verify.BACK_ERR.toastCard
            break;
        }
    }
    return toast;
}

// 生成渠道订单编号
export function ChannelOrderNo(newData) {
    return "N" + (newData).Format("yyyyMMddhhmmssS") + Math.floor(Math.random() * 90 + 10)
}


var dateFormat = {}

/** 
 *转换日期对象为日期字符串 
 * @param l long值 
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss 
 * @return 符合要求的日期字符串 
 */
dateFormat.getFormatDate = function (date, pattern) {
    if (date == undefined) {
        date = new Date();
    } else {
        date = new Date(date);
    }
    if (pattern == undefined) {
        pattern = "yyyy-MM-dd hh:mm:ss";
    }
    return date.Format(pattern);
}

/** 日期格式处理  **/
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// 机票订单 获取当天日期
dateFormat.getToday = function (day, month, year) {
    let myDate = new Date();
    if (day) myDate.setDate(myDate.getDate() + day);
    if (month) myDate.setMonth(myDate.getMonth() + month);
    if (year) myDate.setFullYear(myDate.getFullYear() + year);
    let y = myDate.getFullYear();
    let m = myDate.getMonth() + 1;
    let d = myDate.getDate();
    let dts = y + "-";
    if (m < 10)
        dts += "0";
        dts += m + "-";
    if (d < 10)
        dts += "0";
        dts += d;
    return dts;
}

// IOS兼容日期
// return: Date
dateFormat.formatIOSDate = function(date) {
    let sDate, sTime, oDate, y, M, d, h, m, s;
    y=M=d=h=m=s='';
    if(typeof(date)!='string') return false;
    sDate = date.split('-');
    if(date.indexOf(' ')>=0){
        var spt = date.split(' ');
        sDate = spt[0].split('-');
        sTime = spt[1].split(':');
        h = sTime[0]?sTime[0]:'';
        m = sTime[1]?sTime[1]:'';
        s = sTime[2]?sTime[2]:'';
    }
    y = sDate[0];
    M = sDate[1]-1;
    d = sDate[2];
    return new Date(y, M, d, h, m, s);
}

// 获取 MM-dd h:m:s
/**
 * 获取年月日时分秒星期
 * @param {时间} date 
 * @param {类型} type 
 * 1: yyyy-mm-dd h:m:s day 
 * 2: yyyy-mm-dd h:m:s 
 * 3: yyyy-mm-dd h:m 
 * 4: mm-dd h:m:s 
 * 5: mm-dd h:m
 */
/* dateFormat.getToday1 = function (date, type) {
    let date = new Date(date);
    let year = date.getFullYear();
    let MM = date.getMonth() + 1;
    let DD = date.getDate();
    let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    let day = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[date.getDay()];
    if(type == 1){
        return year + "-" + MM + "-" + DD + " " + h + ":" + m + ":" + s + " " + day;
    } else if(type == 2) {
        return year + "-" + MM + "-" + DD + " " + h + ":" + m + ":" + s;
    } else if(type == 3) {
        return year + "-" + MM + "-" + DD + " " + h + ":" + m;
    } else if(type == 4) {
        return MM + "-" + DD + " " + h + ":" + m + ":" + s;
    } else if(type == 5) {
        return MM + "-" + DD + " " + h + ":" + m;
    }
} */



var juneyaoair = {
    tripType: ""
};
//验证国际旅客姓名 
juneyaoair.validateEngName = function (c) {

    if (!/^[^\/]+\/[^\/]+$/.test(c)) {
        //e.alert("填写英文姓名，请用“/”分隔姓和名，例：Last Name/First Name.",b);
        alert("填写英文姓名，请用“/”分隔姓和名，例：Last Name/First Name.");
        return false;
    }
    if (/[^a-zA-Z. \/'-]/.test(c)) {
        alert("英文姓名中包含非法字符");
        return false;
    }
    var a = c.split("/");
    if (/[^a-zA-Z] /.test(a[0])) {
        alert("英文的姓中只能包含字母");
        return false;
    }
    if (!/^[a-zA-Z]/.test(a[1])) {
        alert("英文的名必须以字母开头");
        return false;
    }
    return true;
};
juneyaoair.introvalidateEngName = function (c) {
    if (/[^a-zA-Z] /.test(c)) {
        alert("拼音只能包含字母");
        return false;
    }
    return true;
};


//计算中英文字符长度
juneyaoair.countCharacters = function (str) {
    return str.replace(/[^\x00-\xff]/g, "aa").length;
};
//验证中文姓名 d=value;a=pertype
juneyaoair.validateChsName = function (d, a) {
    var nameLen = juneyaoair.getNameLen(a);
    var nameLength = juneyaoair.countCharacters(d);
    if (nameLength < 2) {
        alert(" 姓名输入错误");
        return false;
    }
    if (!/^[\u4e00-\u9fa5a-zA-Z-]+$/.test(d)) {
        alert("中文姓名只能包含汉字、字母和连字符");
        return false;
    }
    if (/CHD/.test(d) || /chd/.test(d)) {
        alert("姓名中不能含有CHD");
        return false;
    }
    if (nameLength > nameLen) {
        alert("姓名长度已超过限制(" + nameLen + "个字符),请酌情删减!");
        return false;
    }
    return true;
};

/**
 * @param { 输入内容 } a
 * @param { 输入内容类型(eg: 成人、儿童、婴儿代码) } e
 * @description 验证姓名长度
 */
juneyaoair.validateName = function (a, e) {

    var c = "";
    ///根据乘客类型限制不同的字符长度婴儿：18 成人：26 儿童：22
    var nameLen = juneyaoair.getNameLen(e);
    if (a == "" || a == c) {
        alert("姓名不能为空");
        return false;
    } else {
        if (a.length > nameLen) {
            alert("姓名长度已超过限制,请酌情删减!");
            return false;
        }
        if (juneyaoair.hasChsChar(a)) { //判断是否有中文
            if (!juneyaoair.validateChsName(a, e)) {
                return false;
            }
        } else {
            if (!juneyaoair.validateEngName(a)) {
                return false;
            }
        }
        /*var endname = a.replace(/[^\u4e00-\u9fa5]/gi, "");
        var arr = endname.split("");
        for (i = 0; i < arr.length ; i++) {
            if (!gb2312info.chkInput(arr[i])) {
                alert("姓名中'"+arr[i]+"'为生辟字,请用拼音输入！(格式：英文姓名 姓last name/名first name)");
                return false;
            }

        }*/
    }
    return true;
};
//国际验证姓名 
juneyaoair.intervalidateName = function (a, e) {

    ///根据乘客类型限制不同的字符长度婴儿：18 成人：26 儿童：22
    var nameLen = juneyaoair.getNameLen(e);
    var c = "";
    if (a == "" || a == c) {
        alert("姓名不能为空");
        return false;
    } else {
        if (a.length > nameLen) {
            alert("姓名长度已超过限制,请酌情删减!");
            return false;
        }
        if (this.hasChsChar(a)) {
            alert("姓或名只能填写拼音");
            return false;
        } else {
            if (!this.introvalidateEngName(a)) {
                return false;
            }
        }
    }
    return true;
};
//根据乘客类型限制不同的字符长度 婴儿：18 成人：26 儿童：22
juneyaoair.getNameLen = function (paessType) {
    var nameLen = 26;
    if (paessType.indexOf("CHD") >= 0)
        nameLen = 22;
    if (paessType.indexOf("INF") >= 0)
        nameLen = 17;
    return nameLen;
};
juneyaoair.hasChsChar = function (str) {
    re = /[\u4E00-\u9FA5]/g; //测试中文字符的正则
    if (re.test(str)) //使用正则判断是否存在中文
    {
        return true;
    } else {
        return false;
    }
};

/*
判断是否是儿童婴儿
birthday 出生年月日
curday   要比较的日期
minage   最小年龄限制
maxage   最大年龄限制
*/
juneyaoair.AgeDiff = function (birthday, curday, minage, maxage) {
    if (birthday.indexOf('-') == -1 && birthday.length == 8) {
        var start = [];
        start[0] = birthday.substring(0, 4);
        start[1] = birthday.substring(4, 6);
        start[2] = birthday.substring(6, 8);
    } else {
        var start = birthday.split('-');
    }

    var end = curday.substr(0, 10).split('-');
    var sdate = new Date(start[0], start[1], start[2]);
    var edate = new Date(end[0], end[1], end[2]);
    //var age = edate.getFullYear() - sdate.getFullYear();

    var age = edate.getFullYear() - sdate.getFullYear() - ((edate.getMonth() < sdate.getMonth() || edate.getMonth() == sdate.getMonth() && edate.getDate() < sdate.getDate()) ? 1 : 0);
    if (minage == 0) { //婴儿
        if (age < maxage && age >= minage) {
            return true;
        } else {
            return false;
        }
    } else {
        if (age >= minage && age < maxage) {
            return true;
        } else {
            return false;
        }
    }

};
//保留几位小数
juneyaoair.NumbertoCeil = function (number, num) {
    return Math.ceil(number * Math.pow(10, num)) / Math.pow(10, num);
};
juneyaoair.ToDecimal2 = function (x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
};

/***证件类型类型的转换**/
juneyaoair.CardType = function (id) {
    var Str="";
    switch(id){
        case "NI":
            Str="身份证";
            break;
        case "PP":
            Str="护照";
            break;
        case 'MTP':
            Str="台胞证 ";
            break;
        case "ORI":
            Str="回乡证";
            break;
        case "MIL":
            Str="军官证";
            break;
        case "CC":
            Str="其他";
            break;
        case "HTPP":
            Str="港澳通行证";
            break;
        case "TPP":
            Str="台湾通行证";
            break;
        case "NIPP":
            // Str="外国人永久居留身份证";
            Str="外国人永久...";
            break;
        default:
            Str = '其他';
            break;
    }
    return Str;
}

juneyaoair.SexType = function (id) {
    var Str="";
    switch(id){
        case "F":
            Str="男";
            break;
        case "M":
            Str="女";
            break;
        case null:
            Str="没有输入性别";
            break;
    }
    return Str;
}
juneyaoair.AgeType = function (id) {
    return id ? id + '周岁' : id
}
juneyaoair.GestWeekType = function (id) {
    return id ? id + '周' : id
}
/**
 * @param {年龄范围} String range(eg: 5-12)
 * @return {选择年龄数组} Array 
 */
// 生成选择年龄及孕周下拉框
juneyaoair.selCount = function (range){
    let rangeArr, Arr = [], str = ''
    let keys = Object.keys(SelNum.AGE)
    if(keys.indexOf(range) !== -1){
        range = SelNum.AGE[range]
        str = SelNum.ageWeek
    } else {
        range = SelNum[range]
        str = SelNum.week
    }
    // 排序
    rangeArr = range.split('-').sort((a, b) => {
        return a-b
    })
    // 生成需要的数组结构
    for(let i = 0; i < (rangeArr[1] - rangeArr[0] + 1); i++){
        let obj = {}
        obj['text'] = (rangeArr[0] - 0 + i) + str
        obj['value'] = (rangeArr[0] - 0 + i)
        Arr.push(obj)
    }
    return Arr
}

// 生成选择性别、证件类型下拉框
juneyaoair.selStr = function (str){
    let ArrStr = [], obj
    if(str === 'sex'){
        obj = SelSex
    }
    if(str === 'card'){
        obj = SelCard
        
        // 身份证、护照、台胞证、回乡证、港澳通行证、外国人永久居留身份证、其他证件
        // 青少年和老人可选：身份证、护照、军人身份证、港澳台居民往来内地身份证、其他证件
        // 青少年和老人可选：身份证、护照、军人身份证、港澳台居民往来内地身份证、其他证件
    }
    // 生成需要的数组结构
    for(let key in obj){
        ArrStr.push(Object.assign({}, {
            text: obj[key].text,
            value: obj[key].code
        }))
    }
    return ArrStr
}

/**
 * 验证中英文姓名
 * @param {String} text 需要验证内容
 * @param {String} toast 验证的文本
 * @return {Boolean}
**/
juneyaoair.validateNameAll = function(text = '', toast = Verify.BACK_ERR.toastName){
    if(!RegEnum.properties[RegEnum.NAME_ALL].reg.test(text)){
        controller.toast({str: toast});
        return false;
    } else {
        /* if(RegEnum.properties[RegEnum.EN].reg.test(text)){
            if (!/^[^\/]+\/[^\/]+$/.test(text)){
                controller.toast({str: '英文姓名请用"/ "分割，例：Last Name / First Name'});
                return false;
            }
        } */
        return true;
    }
}
/**
 * 验证卡号票号
 * @param {String} text 需要验证内容
 * @param {String} toast 验证的文本
 * @return {Boolean}
**/
juneyaoair.validateCertTicket = function(text = '', toast = Verify.BACK_ERR.toastCardTicket){
    if(!RegEnum.properties[RegEnum.EN_NUMBER].reg.test(text)){
        controller.toast({str: toast});
        return false;
    } else {
        return true;
    }
}
/**
 * 验证手机号
 * @param {String} text 需要验证内容
 * @param {String} toast 验证的文本
 * @return {Boolean}
**/
juneyaoair.validateTel = function(text = '', toast = Verify.BACK_ERR.toastPhone){
    if(!RegEnum.properties[RegEnum.MOBILE].reg.test(text)){
        controller.toast({str: toast});
        return false;
    } else {
        return true;
    }
}

export { juneyaoair, dateFormat }




/**
 * 判断是否为空对象
 * @param {判断的对象} obj
 */
export function isEmptyObject(obj) {
    let name;
    for (name in obj) {
        return false;
    }
    return true;
}
/**
 * 判断是否为空
 * @param {判断的对象} obj
 */
export function isNullOrEmpty(obj) {
    return undefined === obj || null == obj || '' === obj;
}

/**
 * 检测是否匹配字符
 * @param {匹配的字符串} str
 * @param {匹配规则字符串或者规则数组} reg
 * @param {是否匹配} map
 */
export function regMatch(str, reg, map = true) {
    if (!str || !reg) return false;

    if (reg.constructor === Array) {
        for (let item of reg) {
            let _reg = new RegExp(item, 'gi');
            if (str.match(_reg)) return map;
        }
    } else {
        let _reg = new RegExp(reg, 'gi'),
            res = str.match(_reg);
        return !!map ? res : !res;
    }
    return !map;
}

/**
 * 转换单个数字大小写
 */
export function transferNumber(number) {
    let Arr = [
        { lower: 0, upper: '零', money: '零' },
        { lower: 1, upper: '一', money: '壹' },
        { lower: 2, upper: '二', money: '贰' },
        { lower: 3, upper: '三', money: '叁' },
        { lower: 4, upper: '四', money: '肆' },
        { lower: 5, upper: '五', money: '伍' },
        { lower: 6, upper: '六', money: '陆' },
        { lower: 7, upper: '七', money: '柒' },
        { lower: 8, upper: '八', money: '捌' },
        { lower: 9, upper: '九', money: '玖' }
    ]
    let index = 0;
    try {
        index = parseInt(number);
        if (index < 0 || index > 9) throw Error('Arrary lenth Error.')
    } catch (e) {
        index = 0;
    }

    return Arr[index].upper;
}

/**
 * 获取URL参数
 * @param {参数名} label
 */
export function urlParam(label) {
    let url = {},
        lbl = label && label.toLowerCase();

    window.location.search.toLowerCase().slice(1).split('&').forEach(function (element, index) {
        let temp = element.split('=');
        url[temp[0]] = temp[1];
    });
    return url[lbl];
}

/**
 * 获取渠道信息
 */
export function getChannelCode() {
    if(device.isApp){
        return ChannelCode.APP;
    }
    if(device.browser){
        return ChannelCode.H5;
    }
    if(device.isWeixin){
        return ChannelCode.WEIXIN;
    }
}

// 加
export function floatAdd(arg1,arg2){    
    var r1,r2,m;    
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}    
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}    
    m=Math.pow(10,Math.max(r1,r2));    
    return (arg1*m+arg2*m)/m;    
}
//减
export function floatSub(arg1,arg2){    
    var r1,r2,m,n;    
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}    
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}    
    m=Math.pow(10,Math.max(r1,r2));    
    //动态控制精度长度    
    n=(r1>=r2)?r1:r2;    
    return ((arg1*m-arg2*m)/m).toFixed(n);    
}   
//乘
export function mul2(arg1,arg2){  
    var r1,r2, m, n,q;  
    var ag1 = arg1 + '';
    var ag2 = arg2 + '';
    if(parseInt(arg1) == arg1){  
        r1 = 0;  
    }else{  
        r1 = ag1.split(".")[1].length;  
    }  
    if(parseInt(arg2) == arg2){  
        r2 = 0;  
    }else{  
        r2 = ag2.split(".")[1].length;  
    }  
    m = Math.pow(10,r1);  
    n = Math.pow(10,r2);  
    q = m*n;  
    var sum = (((arg1*m) * (arg2*n))/q);  
    return sum;  
}

// 格式化字符串时间
export function formatIOSDate(date){
    var sDate, sTime, oDate;
    var y=M=d=h=m=s='';
    if(typeof(date)!='string') return false;
    sDate = date.split('-');
    if(date.indexOf(' ')>=0){
        var spt = date.split(' ');
        sDate = spt[0].split('-');
        sTime = spt[1].split(':');
        h = sTime[0]?sTime[0]:'';
        m = sTime[1]?sTime[1]:'';
        s = sTime[2]?sTime[2]:'';
    }
    y = sDate[0];
    M = sDate[1]-1;
    d = sDate[2];
    return new Date(y, M, d, h, m, s);
}