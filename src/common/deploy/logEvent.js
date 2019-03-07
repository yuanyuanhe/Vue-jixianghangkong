/*
 * @Author: hbb 
 * @Date: 2018-12-19 17:50:54 
 * @description:  app埋点事件
 */

const LogEvent = {
    // 值机选座
    Checkin: {
         //事件类别
        Type: 'Checkin',
        Events: {
            0: 'Checkin_Search',        // 点击查询航班
            1: 'Checkin_Login',         // 点击登录
            2: 'Checkin_History',       // 点击历史记录按钮
            3: 'Checkin_Edit',          // 点击选座/改座
            4: 'Checkin_Other',         // 点击办理其他航班
            5: 'Checkin_Add',           // 点击新增同行人
            6: 'Checkin_Yes',           // 点击确认添加同行人
            7: 'Checkin_Submit',        // 点击提交选座
            8: 'Checkin_Cancel',        // 值机结果页取消值机
            9: 'Checkin_Share',         // 点击分享
            10: 'Checkin_Save',         // 点击保存
            11: 'Checkin_AddCard',      // 点击添加常旅客卡
            12: 'Checkin_YesCard',      // 点击确定添加常旅客卡
            13: 'Checkin_EditCard'      // 点击修改常旅客卡
        }
    },
    // 航班动态
    FlightDynamic: {
        Type: 'FlightInfo',
        Events: {
            0: 'FlightInfo_Number', //点击按航班号
            1: 'FlightInfo_City', //点击按城市名
            2: 'FlightInfo_Date', //点击日期
            3: 'FlightInfo_Search', //点击查询
            4: 'FlightInfo_Chose' //选择某一航班 
        }
    },
    // 升舱
    UpCabin: {
        Type: 'Upclass',
        Events: {
            0: 'Upclass_Search', //点击查询航班
            1: 'Upclass_Choose', //点击升舱
            2: 'Upclass_Cabin', //选择舱位
            3:'Upclass_Ticket', //选择升舱券
            4: 'Upclass_ToPay', //点击去支付
        }
    },
    // 逾重行李
    ExceedLuggage: {
        Type: 'Baggage',
        Events: {
            0:'Baggage_', // 选择权益券*kg
            1:'Baggage_Notes', // 点击购买须知
            2:'BaggageCustomer_ToPay', // 点击去支付
        }
    },
    // 升舱券
    UpCabinTicket: {
        Type: 'UpclassTic',
        Events: {
            0:'UpclassTic_', //选择行距
            1:'UpclassTic_All', //选择所有行距
            2:'UpclassTic_Read', //点击查看适应航线
            3:'UpclassTic_Notes', //点击购买须知
            4:'UpclassTic_ToPay', //点击去支付
        }
    }
}

export default LogEvent;


