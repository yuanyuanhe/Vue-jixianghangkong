/*
 * @Author: wangyr 
 * @Date: 2018-07-06 15:50:54 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-12-19 21:20:58
 * @description:  常量
 */
 'use strict';

// junayaoair

export const ChannelCode = {
    APP: 'MOBILE',   // APP
    WEIXIN: 'WEIXIN',   // 微信
    H5: 'MOBILE'  // 浏览器
    //H5: 'MWEB'  // 浏览器
}

export const AllOrderType = {
    FLIGHT : 'flightOrder',
    WIFI : 'wifiOrder',
    LOUNGE : 'loungeOrder',
    INSURE : 'insureOrder',
    DELIVERY : 'deliveryOrder',
    LUGGAGE : 'luggage',
    CABIN_TICKET: 'luggage', //升舱券
    CABIN: 'luggage' //升舱
}

// 预约还是申请常量
export const SuccType = {
    APPLY_SUCC: 0,  //申请
    ORDER_SUCC: 1   //预订
}

export const RegEnum = {
    MOBILE: 1,
    ID_CARD: 2,
    EMAIL: 3,
    PASSWORD: 4,
    CH: 5,
    TICKET_NO: 6,
    FLIGHT_NO: 7,
    DATE_CH: 8,
    NAME_CH: 9,
    BABY_HEIGHT: 10,
    BABY_WEIGHT: 11,
    NAME_ALL: 12,
    EN: 13,
    NOT_ALL_CH: 14,
    NOT_STRICT_NAME: 15,
    PASSPORT: 16,
    EN_NUMBER: 17,
    properties: {
        1: {
            name: '手机号码',
            reg: /^1[3|4|5|6|7|8|9][0-9]{1}[0-9]{8}$/
        },
        2: {
            name: '身份证号',
            reg: /^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X|x)?$/
        },
        3: {
            name: '邮箱',
            reg: /^([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/
        },
        4: {
            name: '密码',
            reg: /^[^\s]{6,16}$/
        },
        5: {
            name: '验证中文',
            reg: /[\u4E00-\u9FA5\uF900-\uFA2D]+/
        },
        6: {
            name: '票号',
            reg: /^(\d{3})-?\d{10}$/
        },
        7: {
            name: '航班号',
            reg:/^(HO)-?\d{3,4}$/i
        },
        8: {
            name: '日期格式 yyyy-MM-dd',
            reg: /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/
        },
        9: {
            name: '验证中文姓名',
            reg: /^[\u4E00-\u9FA5\uF900-\uFA2D][\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z]{1,24}$/
        },
        10: {
            name: '婴儿高度',
            reg: /^([1-9]|[1-6][0-9]|[7][0-5])$/
        },
        11: {
            name: '婴儿体重',
            reg: /^([1-9]|(1[0-1]))$/
        },
        12: {
            name: '验证姓名',
            reg: /^[\u4E00-\u9FA5a-zA-Z\s\/]{1,25}$/
        },
        13: {
            name: '验证英文',
            reg: /^[a-zA-Z]+$/
        },
        14: {
            name: '验证全是中文',
            reg: /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/
        },
        15: {
            name: '非严格验证姓名',
            reg: /^.{1,25}$/
        },
        16: {
            name: '验证护照',
            reg: /^[A-Za-z0-9]{7,11}$/
        },
        17: {
            name: '验证英文与数字',
            reg: /^[a-zA-Z0-9\-]+$/
        }
    }
}

// 正则验证返回数据
export const Verify = {
    BACK_TRUE: true,
    BACK_ERR: {
        result: 'false',
        toastBaby: '出生满14天且不超过2周岁的婴儿才可申请此服务',
        toastBabyHW: '身高低于75cm,且体重低于11KG的婴儿才能使用婴儿摇篮',
        toastPhone: '请输入正确的手机号',
        toastNet: '网络出错了，请重新提交申请',
        toastDetailsFail: '网络出错，稍后重试',
        toastCityListFail: '网络出错，稍后重试',
        toastChild: '年龄为5-12周岁的儿童才可申请此服务',
        toastYouth: '年龄为12-18（不含）周岁的青少年才可申请此服务',
        toastOld: '年龄为65周岁及以上的老年人才可申请此服务',
        toastCard: '请输入正确的证件号',
        toastCardTicket: '请输入正确的证件号或票号',
        toastMail: '请输入正确的邮箱',
        toastSticket: '请输入正确的票号',
        toastNum: '请输入正确的航班号',
        toastData: '日期格式不正确',
        toastSend: '送机人必须为年满18周岁的成人',
        toastPick: '接机人必须为年满18周岁的成人',
        toastNameCH: '中文姓名必须大于等于两个字小于25个字',
        toastName: '请输入中文或英文姓名，英文姓名请用"/"分割，例：Last Name/First Name',
        toastNameLen: '姓名不可多余25个字符',
        toastEn: '请输入字母',
        toastNotAllCh: '名字中含有除中文外别的字符',
        toastNotStrictName: '请输入1-25个字符',
        toastNoInfo: '未查询到任何不正常航班信息',
        toastRepeat:'您好，你已申请过航班',
        toastEject:'没有查询到任何信息,请重新输入',
        toastTree:'你好，你已申请过不能重复申请'
    },
    BACK_NULL: 'null'
}

// 选择框数据
export const SelSex = {
    MAN: {
        text: '男',
        code: 'F'
    },
    WOMAN: {
        text: '女', 
        code: 'M'
    }
}
export const SelCard = {
    ID_CARD: {
        text: '身份证', 
        code: 'NI'
    },
    PASSPORT: {
        text: '护照', 
        code: 'PP'
    },
    // compatriot_CARD:{
    //     text:"台胞证",
    //     code:"MTP"
    // },
    BACK_CARD: {
        text: '回乡证', 
        code: 'ORI'
    },
    /* OFFICER_CARD: {
        text: '军官证', 
        code: 'MIL'
    }, */
    HKMAC_CARD: {
        text: '港澳通行证', 
        code: 'HTPP'
    },
    PPLIVE_CARD: {
        text: '台湾通行证', 
        code: 'TPP'
    },
    ALIEN_CARD: {
        text: '外国人永久居留身份证', 
        code: 'NIPP'
    },
    RESTS_CARD: {
        text: '其他证件', 
        code: 'CC'
    }
}
export const SelNum = {
    AGE: {
        child: '5-11',
        young: '12-17',
        oldman: '65-200',
        age: '1-200',
    },
    gestWeek: '1-35',
    ageWeek: '周岁',
    week: '周'
}
// 选择框类型
export const SelType = {
    child: 'child',
    young: 'young',
    oldman: 'oldman',
    age: 'age',
    gestWeek: 'gestWeek',
    sex: 'sex',
    card: 'card'
}

// 特殊服务代码
export const ServiceCode = {
    BSCT: '1', // 婴儿摇篮
    UMNR: '2', // 无成人陪伴儿童
    YP: '3',     // 无陪青少年
    WCHR: '5', // 地面轮椅
    STCR: '8', // 担架旅客
    DPNA: '19', // 智力残疾或肢体残疾的旅客
    WCHS: '6', // 登机轮椅
    WCHC: '7', // 机上轮椅
    DIST:'21',//残疾人团队
    BLND: '17', // 盲人旅客
    PRGN: '9', // 孕产妇旅客
    LCTN:'12',//哺乳旅客
    USEO:'11',//用氧旅客
    MEDA: '10', // 患病旅客
    OLD:'4',//老人协助
    PETC:'20',//服务犬服务
    DEAF: '18', // 聋哑旅客
    TRAN:'13',//活体器官及血液运输   
    EWC:'24',//电动轮椅
}

//特服列表服务状态码说明
export const ServiceState = {
    APPLY: '1', //预约成功
    SUCCESS: '2', //申请成功
    CHECKING: '3',   //受理中
    FAILED: '4',    //受理失败
    CANCEL: '5',   //已取消
}

//接口返回状态码
export const ResultCode = {
    SUCCESS: '10001'
}

// 轮椅服务类别
export const WchcType = {
    WCHC: '7', // 机上轮椅
    WCHS: '6', // 登机轮椅
    WCHR: '5', // 地面轮椅
    CARR: '1',//是否携带轮椅
}

//残障服务以及残障团队服务类别
export const DisType = {
    INTE:"1", //智力残疾
    LIMB:"2", //肢体残疾
    SPIR:"3",//精神残疾
}

//服务犬服务类别
export const SerDog = {
    CANI:"1",
    GUID:"2"
}
//文件上传服务类型
export const FILETYPE = {
    SPECIALSERVICE:'specialService',//特服图片上传
    ABNORBAG:'abnorbag' //异常行李图片上传
}

//异常行李申诉
export const BagClaim = {
    LOSS:"1",    //遗失行李
    WORN:"2"    //破损行李
}
//异常行李申诉列表状态
export const AppealState = {
    CANCEL: '0',   //已取消
    APPLY: '1', //已申请
    SUCCESS: '2', //已受理
    CHECKING: '3',   //已结案
}

// 支付状态
export const PayRes = {
    PAY_SUC: 0, // 支付成功
    PAY_FAIL: 1, // 支付失败
    PAY_TIMEOUT: 2, // 支付超时
}
// 支付信息
export const PayInfo = {
    PAY_SUC: {
        result: '支付成功！',
        txt: '您已成功预订，尽快使用'
    },
    PAY_FAIL: {
        result: '支付失败！',
        txt: '哎呀失败了，请重新支付'
    },
    PAY_TIMEOUT: {
        result: '支付已超时！',
        txt: '该订单已被取消，请重新下单'
    },
}

// 身份认证类型
export const AuthType = {
    ALIPAY: 'ZhiFuBao',  // 支付宝
    UNIONPAY: 'Unionpay',  // 银联
    PHOTO: 'Photo',  // 身份证照片
}
export const AuthResult = {
    SUC: 1, // 认证成功
    ERR: -1, // 认证拒绝
    CHECK: 0, // 待审核
    UNKNOWN: -2 // 未知
}
// 支付方式
const imgsPath = '../../../common/imgs/';
export const PayStaticInfo = {
    'ALIPAY': { payName: '支付宝支付', payIcon: require('../imgs/alipay.png'), payMethod: 'ALIPAY', payCallback: 0 },
    'WEIXINPAY': { payName: '微信支付', payIcon: require('../imgs/wechatpay.png'), payMethod: 'WEIXINPAY', payCallback: 1 },
    'CARDPAY': { payName: '银联卡支付', payIcon: require('../imgs/unionpay.png'), payMethod: '', payCallback: 2 },
    'SHOUFUPAY': { payName: '信用飞 | 分期支付', payIcon: require('../imgs/xyf.png'), payMethod: 'SHOUFUPAY', payCallback: 3 },
    'HUARUIPAY': { payName: '华瑞支付', payIcon: require('../imgs/huarui.png'), payMethod: 'HUARUIPAY', payCallback: 4 },
    'CMBCHINAPAY': { payName: '一网通银行卡支付', payIcon: require('../imgs/yiwangtong.png'), payMethod: 'CMBCHINAPAY', payCallback: 5 },
    'CHINAPAY': { payName: '云闪付', payIcon: require('../imgs/icon-yunshanfu.png'), payMethod: 'CHINAPAY', payCallback: 6 },
    'XIAOMIPAY': { payName: '小米支付', payIcon: require('../imgs/mipay-logo.png'), payMethod: 'XIAOMIPAY', payCallback: 7 },
    'HUAWEIPAY': { payName: '华为支付', payIcon: require('../imgs/huaweipay-logo.png'), payMethod: 'HUAWEIPAY', payCallback: 8 },
    'APPLEPAY': { payName: 'Apple Pay', payIcon: require('../imgs/hero-logo-large.png'), payMethod: 'APPLEPAY', payCallback: 9 },
    'SAMSUNGPAY': { payName: '三星支付', payIcon: require('../imgs/samsungpay.png'), payMethod: 'SAMSUNGPAY', payCallback: 10 },
    'CASHIER': { payName: '收银台', payIcon: require('../imgs/cpppay-icon.png'), payMethod: 'CASHIER', payCallback: 11 }
}
// 支付回调
export const PayCallback = {
    ALI: 0,
    WECHAT: 1,
    UNION: 2,
    XYF: 3,
    HUA_RUI: 4,
    YI_WANG_TONG: 5,
    CHINAPAY: 6,
    XIAOMIPAY: 7,
    HUAWEIPAY: 8,
    APPLEPAY: 9,
    SAMSUNGPAY: 10,
    CASHIER: 11
}

// 权益券标识
export const couponType = {
    VIPROOM: 'HOLO', // 贵宾休息室
    UPGRADE: 'HOUP', // 升舱券
    LUGGAGE: 'HOBG', // 逾重行李
    CABIN_TICKET: 'HOUP' //升舱券
}

// 常旅客航司
export const StarAirs = [{
    text: '吉祥航空',
    value: 'HO'
}, {
    text: '中国国际航空',
    value: 'CA'
}, {
    text: '深圳航空',
    value: 'ZH'
}, {
    text: '全日空',
    value: 'NH'
}, {
    text: '美国联合航空',
    value: 'UA'
}, {
    text: '新加坡航空',
    value: 'SQ'
}, {
    text: '加拿大航空',
    value: 'AC'
}, {
    text: '台湾长荣航空',
    value: 'BR'
}]

// 值机选座状态
export const CheckInSeatStatus = {
    CHECKIN: 'CHECKIN OPEN',
    SELECT: 'SELECT OPEN',
    CLOSE: 'NONE'
}
// 值机验证类型列表
export const CheckinType = {
    ARTI: 1,            // 人工
    BAR_CODE: 2,        // 一维条形码
    QR_CODE: 3,         // 条形二维码
    E_BOARDING: 4,      // 电子登机
    BOARDING_PASS: 5,   // 电子验讫章
    BOARDING: 6         // A4登机牌
}
// 值机状态
export const CheckInStatus = {
    CANCEL: 'CN',
    CHECKIN: 'AC'
}
// 订单详情页面种类(机票，改期，升舱)
export const AllOrderPayType = {
    CABIN_LEFT: "0", //升舱
    CHANGE_DATE: "1", //改期
    PLANE: "2" // 机票
}

// 乘客类型 ADT － 成人，CHD － 儿童，INF － 婴儿
export const PsgType = {
    ADULT: 'ADT',
    CHILD: 'CHD',
    BABY: 'INF',
    POLICE: 'GMJC'
}