'use strict';
import { AllOrderType } from './enum';
/**
 * @ 业务逻辑
 */

import lsKey from 'common/deploy/localstorage'
import controller from "./controller"
import { RegEnum, ResultCode } from './enum'
import page from 'common/deploy/page'
import requesturl from "common/deploy/requesturl"
import device from './device'

/**
 * 保存登录信息
 */
 export function saveLoginInfo(){
    return new Promise((resolve, reject) => {
        controller.getLoginInfo(function(data) {
            const memberInfo = data.memberInfo;
            if (memberInfo) {
                controller.setStorage(lsKey.MEMBER_INFO, memberInfo);
                window._memberInfo = memberInfo;
                resolve(memberInfo);
            } else {
                controller.clearStorage(lsKey.MEMBER_INFO);
                window._memberInfo = undefined;
                reject(data);
            }
        })
    })
 }

 /**
  * 获取判断是否登录
  * @param {是否跳转登录} isGotoLogin 
  * @param {登录成功之后回跳页面} nextPage 
  */
export function getIsLogin(isGotoLogin = false, nextPage = {}){
    const memberInfo = controller.getStorage(lsKey.MEMBER_INFO) || window._memberInfo;
    if(!!memberInfo && controller.isPlainObject(memberInfo) && memberInfo.memberID){
        return true;
    } else {
        if(isGotoLogin === true){
            const loginObj = page.login.login;
            let url = loginObj.pageUrl;
            let nextUrl = nextPage.path;
            if(nextUrl){
                // 路径处理
                var dirReg = /^((http|https)?:\/\/|\.|\/)/;
                try{
                    if(device.isApp){
                        if(!dirReg.test(nextUrl)){
                            nextUrl = '/hybrid/' + nextUrl;
                        }
                    } else {
                        if(!dirReg.test(nextUrl)){
                            nextUrl = '/' + nextUrl.replace(/^(\.*\/)*/g, '');
                        }
                    }
                } catch(e){
                    console.error(e);
                }
                 /**
                 * 跳转页面的参数
                 * @param {页面地址} jumpWebUrl 
                 * @param {页面名称} controllerName 
                 */
                let temp = [];
                temp.push('jumpWebUrl=' + encodeURIComponent(nextUrl));
                temp.push('controllerName=' + nextPage.winName);
                url += ('?' + temp.join('&'));
                console.log('nextUrl: ' + nextUrl);
            }
            controller.open({
                winName: loginObj.winName, 
                path: url
            })
        }
        return false;
    }
}

/**
 * 序列化航线数据
 * @param {航线信息} data 
 */
export function dealPlaneLineData(data) {
    addPinYin(data);
    orderData(data);
    let startAirport = [];
    let relativeAirpoet = [];
    let endAirport = {};
    for(let i=0; i < data.length; i++) {
        comDealPlaneLine(data[i], startAirport);
        endAirport[data[i].airPortEName] = data[i].airLineArrAirPortDtoList;
    }
    for(let key in endAirport) {
        for(let i=0; i< endAirport[key].length; i++) {
            comDealPlaneLine(endAirport[key][i], relativeAirpoet);
        }
        endAirport[key] = relativeAirpoet;
        relativeAirpoet = [];
    }
    return {
        startAirport: startAirport,
        endAirport: endAirport
    }

    // 请求数据排序
    function orderData(data) {
        data.sort(function(a, b) {
            return  a['pinYinAbb'].charCodeAt(0) - b['pinYinAbb'].charCodeAt(0);
        });
        data.forEach(function(value, index, arr) {
            value.airLineArrAirPortDtoList.sort(function(a, b) {
                return  a['pinYinAbb'].charCodeAt(0) - b['pinYinAbb'].charCodeAt(0);
            });
        });
    }
    // 添加没有pinYin的字段
    function addPinYin(data) {
        for(let i = 0; i < data.length; i++) {
            if(!data[i].pinYinAbb) {
                data[i].pinYinAbb = '#';
            }
            for(let j = 0; j < data[i].airLineArrAirPortDtoList.length; j++) {
                if(!data[i].airLineArrAirPortDtoList[j].pinYinAbb) {
                    data[i].airLineArrAirPortDtoList[j].pinYinAbb = '#';
                }
            }
        }
    }
    function comDealPlaneLine(currentData, airPort) {
            
        let firstPinYin = currentData.pinYinAbb.substr(0,1);
        
        let currentIndex = isIncludeName(airPort, firstPinYin);
        
        if(currentIndex > -1) {
            airPort[currentIndex].items.push({
                name: currentData.airPortName,
                value: currentData.airPortCode,
                pinYinAbb: currentData.pinYinAbb,
                cityName: currentData.cityName,
                cityPinYin: currentData.cityPinYin,
                airPortEName: currentData.airPortEName
            })
        } else {
            airPort.push({
                name: firstPinYin,
                items: [{
                    name: currentData.airPortName,
                    value: currentData.airPortCode,
                    pinYinAbb: currentData.pinYinAbb,
                    cityName: currentData.cityName,
                    cityPinYin: currentData.cityPinYin,
                    airPortEName: currentData.airPortEName
                }]
            })
        }
    }

    // 判断对象是否包含name
    function isIncludeName(searchObj, name) {
    
        for(let i=0;i < searchObj.length; i++) {
            if(searchObj[i].name === name) {
            return i;
            }
        }
        return -1;
    }
}

/**
 * 处理订单参数
 * @param {订单详情} detailData
 * @param {订单类型} orderType
 * @param {使用积分} payTypeScore
 * @param {登录信息} MemberInfo
 */
export function payParams({detailData, orderType, payTypeScore, MemberInfo} = {}){
    if(!detailData || !orderType){
        return;
    }
    let cityFlag = 'O';
    let payType = 'Q';
    let createOrdertime = '';
    let orderNO = '';
    let actualAmount = '';
    let channelOrderNo = detailData.channelOrderNo;
    if(orderType == AllOrderType.FLIGHT){   //机票
        createOrdertime=detailData.bookingDatetime;
        cityFlag = detailData.interFlag;
        payType=detailData.interFlag;
        orderNO=detailData.orderNO;
        actualAmount=detailData.actualAmount;
        
    }else if(orderType == AllOrderType.WIFI){   //wifi
        createOrdertime=detailData.orderDatetime;
        orderNO=detailData.orderNo;
        actualAmount=detailData.payAmount;
        
    }else if(orderType == AllOrderType.LOUNGE){ //休息室
        createOrdertime=detailData.orderDatetime;
        orderNO=detailData.orderNo;
        actualAmount=detailData.loungeOrderAmountTotal;
        
    }else if(orderType == AllOrderType.INSURE){ //保险
        createOrdertime=detailData.bookingDatetime;
        cityFlag = detailData.interFlag;
        payType=detailData.interFlag;
        orderNO=detailData.orderNO;
        actualAmount=detailData.actualAmount;
        
    }else if(orderType == AllOrderType.DELIVERY){   //行程单
        createOrdertime=detailData.orderDatetime;
        orderNO=detailData.orderNo;
        actualAmount=detailData.deliveryFee;
    }else if(orderType == AllOrderType.LUGGAGE) { //行李券购买
        createOrdertime = detailData.orderDatetime;
        orderNO = detailData.orderNo;
        actualAmount=detailData.orderTotalAmount;
    }
    
    var len=createOrdertime.length;
    var yyddmm=createOrdertime.substring(0,10);
    yyddmm=yyddmm.split("-");
    var buyDatetime=createOrdertime.substring(11,len);
    buyDatetime=buyDatetime.split(":");
    var ChannelBuyDatetime=yyddmm[0]+yyddmm[1]+yyddmm[2]+buyDatetime[0]+buyDatetime[1]+buyDatetime[2];
    actualAmount = formatAmount(actualAmount);
    var params = {
        "channelOrderNo": channelOrderNo,
        "orderNo": orderNO,
        "orderType": cityFlag,
        "payType":payType,
        "channelBuyDatetime": ChannelBuyDatetime,
        "amount": actualAmount,
        "channelPriInfo": "",
        "ffpId": MemberInfo.id,
        "ffpCardNo": MemberInfo.memberID,
        "loginKeyInfo": MemberInfo.loginKeyInfo,
        "useScore": detailData.useScore || ''
    };
    return params;

    // 格式化订单金额
    function formatAmount(x) {
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
    }
}

/**
 * 0元支付
 * @param {详情url} detailUrl
 * @param {参数} params
 * @param {订单类型} orderType
 * @param {成功回调} succBack
 * @param {失败回调} failBack
 */
export function noMoneyPay({detailUrl, params, orderType, succBack, failBack, memberInfo} = {}) {
    controller.getJSON({
        method: "POST",
        url: detailUrl,
        params: params
    })
    .then((result) => {
        if (result.resultCode == ResultCode.SUCCESS) {
            let objData = result.objData;
            let detailInfor = objData.orderList[0];

            let params = payParams({
                detailData: detailInfor,
                orderType: orderType,
                MemberInfo: memberInfo
            });
            controller.getJSON({
                method: "POST",
                url: requesturl.PAY.NO_MONEY_PAY,
                params: params
            })
            .then(succBack)
            .catch(failBack);
        } else {
            controller.toast({
                str: result.resultInfo
            })
        }
    })
    .catch(() => {
        controller.toast({ str: '网络出错' });
    });
}

/**
 * 验证姓名
 * @param {姓名} name
 * @returns {Boole} 
 */
export function matchName(name){
    if(typeof(name) !== 'string'){
        return false
    }
    // 中文
    let regCH = RegEnum.properties[RegEnum.CH].reg;

    if(regCH.test(name)){
        if(/^[\u4E00-\u9FA5\uF900-\uFA2D]{2,25}$/.test(name)){
            return true;
        } else {
            controller.toast({str: '请输入2—25个字符'});
            return false;
        }
    } else if(/^[a-zA-Z\s\/]+$/.test(name)){
        if(!name.match(/[\/]/g) || name.match(/[\/]/g).length > 1) {
            controller.toast({str: '英文姓名请用"/"分割，例:Last Name/First Name'});
            return false;
        }
        if(/^[a-zA-Z\s\/]{1,25}$/.test(name)){
            return true;
        } else{
            controller.toast({str: '请输入1—25个字符'});
            return false;
        }
    } else {
        controller.toast({str: '姓名只能输入中文或英文字母'});
        return false;
    }
}

/**
 *  验证证件号
 * @param {证件号} cardNum
 * @returns {Boolean}
 * */
export function matchCardNum(cardNum) {

}

/**
 *  验证票号
 * @param {票号} ticketNum
 * @returns {Boolean}
 * */
export function matchTicketNum(ticketNum) {
    if(/^(018)-?\d{10}$/.test(ticketNum)) {
        return true;
    } else {
        controller.toast({str: '请输入正确的票号'});
        return false;
    }
}

/**
 *  验证航班号
 * @param {航班号} flightNum
 * @returns {Boolean}
 * */
export function matchFlightNum(flightNum) {
    if(/^(HO)?\d{3,4}$/ig.test(flightNum)) {
        return true;
    } else {
        controller.toast({str: '请输入正确的航班号'});
        return false;
    }
}

/**
 * 积分输入规则
 * @param {输入积分} score
 * @return {useScore}
 */
export function ruleScore(score) {
    let reg = /[^\d]/g;
    let useScore = 0;
    score = score || 0;
    if(reg.test(score)){
        useScore = score.replace(reg, '');
        return useScore;
    }
    let val = parseInt(score);
    if(score.length > 1 && score.charAt(0) == '0'){
        useScore = val;
        return useScore;
    }
}