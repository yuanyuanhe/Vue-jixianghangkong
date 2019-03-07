const RequestUrl = {
    FLIGHTLINE: '/flight/getFlightLineAirPort',            // 航线选择
    INTEGRAL:  '/crmService/myScore',                     // 获取可用积分
    MYSCORE:  '/crmService/memberAccountQuery',           // 获取总积分
    TOTLASCORE: "/crmService/queryMemberRemainScore",
        //获取总积分新
    AUTH:  '/member/realName',                      // 获取实名认证信息
    VILIDATE_PASSWORD: '/crmService/verifyConsumePwd',         //验证消费密码
    // 权益券相关
    // BUY_ORDER_DETAIL: '/interest/baggageprolist',        //我的权益券列表与详情
    BUY_ORDER_DETAIL: '/upgrade/upgradeList',        //我的权益券订单列表与详情
    BUY_ORDER_REFUND: '/interest/refundbaggagepro',        //权益券申请退款
    BUY_ORDER_CANCEL: '/interest/cancelaggagepro',        //权益券取消订单
    BUY_ORDER_DEL: '/interest/deleteRightOrder',        //权益券删除订单

    GIVE_FRIEND: '/couponService/changeCoupon',        //赠送权益券
    CANCEL_SHARE: '/couponService/cancelShareCoupon',        //取消分享
    SENDSMS: '/sendSms/giveCouponSms',        //发送赠送权益券短信
    APPLY_MEMBER: '/member/applyMember',      //福卡会员申请
    JIDOU: '/feedback/queryBean',      //获取吉豆

    PASSENGERS: {
        BASSINET:'/specialService/applyBabyCradle',                      // 申请婴儿摇篮
        NOCOMPANY: '/specialService/applyNoCompany',                    // 无陪类：无成人陪伴儿童、无成人陪伴青少年、老人协助
        WHEELCHAIR: '/specialService/applyWheelchair',                 // 轮椅服务申请
        STRETCHER:'/specialService/applyStretcher',                   //担架旅客
        // APPLYHELP: '/specialpassenger/applyhelp',                 // 残障、孕产妇：盲人、聋哑、担架、孕妇、哺乳
        POH:'/specialService/applyOtherService',                    //孕妇、用氧、患病、活体器官及血液制品运输服务服务申请
        APPLYHELP: '/specialService/applyAnOtherService',          //盲人、聋哑、哺乳旅客服务
        DISTEAM:'/specialService/applyDisabilityGroup',           //残疾人团队服务
        DISP:'/specialService/applyDisabledPassenger',           //残障旅客
        SERDOG:'/specialService/applyServiceDogs',              //服务犬旅客
        EWCP:'/specialService/applyDdWheelchair',              //电动轮椅
        MYAPPLYLIST: '/specialServiceList/queryAllApply',     // 查询我的特殊申请列表
        APPLYDETAIL: '/specialServiceList/queryOneApply',    // 查询我的特殊申请详情
        CANCELAPPLY: '/specialServiceList/cancelApply',     // 取消我的特服申请
        SERPRO:'/specialServiceList/queryApply',           //服务进度查询
        ADDIMG:'/specialServiceList/addOnePic'            //详情页添加图片
    },
    UPLOAD:'/anwreqsys/file/filesUpload?type=',         //多文件上传
    //异常行李
    ABNORMALBAG:{
        ABNORFILL:'/abnormal/addAbnormalLuggageInfo',       //申请页面
        ABNORDETAIL:'/abnormal/queryOwnerStatementDetail', //详情页面
        APPLYLIST:'/abnormal/queryOwnerStatementList',    //列表页面
        APPLYCANCEL:'/abnormal/cancelStatement'          //列表取消
    },

    EVENTS: {
        MALL_PUSH: '/data/pronew.json',                      // 商城推送活动
    },
    LOUNGE: {
        FLIGHTLOUNGE: '/interest/queryloungepro',                // 售贵宾休息室产品查询
    },
    LUGGAGE: {
        LUGGAGE_INFOR: '/interest/querybaggagepro',           //逾重行李产品查询
        BUY_LUGGAGE: '/interest/buybaggagepro'                  //购买休息室、行李额券
    },
    INTERESTS: {
        MY_RIGHT_COUPONS: '/couponService/queryMyRightCoupons',     // 我的权益券
        MY_INVALID_COUPONS: '/couponService/queryMyInvalidRightCoupons',     // 失效权益券
    },
    // 支付接口
    PAY: {
        PAY_WAY: '/nemPaymentService/initPayMethod',
        ALI_PAY: '/nemPaymentService/orderPayByAlipay',
        WEIXI_NPAY: '/nemPaymentService/orderPayByWX',
        SHOUFU_PAY: '/nemPaymentService/orderByXinYongFei',
        HUARUI_PAY: '/hrService/putData',
        CMBCHINA_PAY: '/nemPaymentService/cmbChinaPay',
        NO_MONEY_PAY: '/nemPaymentService/payment0?t=' + new Date().getTime()
    },
    // 值机选座
    CHECKIN: {
        // 获取所有航班行程信息
        FLIGHT_TOURS: '/checkInSeatService/queryAllFlightTours',
        // 获取座位图
        GET_SEAT: '/checkInSeatService/getFlightSeatCharts',
        // 值机选座操作
        DO_SEAT: '/checkInSeatService/doCheckInSelectSeat',
        // 取消选座
        CANCEL_SEAT: '/checkInSeatService/cancelSeat',
        // 取消值机
        CANCEL_CHECKIN: '/checkInSeatService/cancelCheckIn',
        // 添加同行人
        ADD_PEER: '/checkInSeatService/addPeer',
        // 查询旅客值机次数
        CHECKIN_COUNT: '/checkInSeatService/queryCheckInCount',
        // 查询值机数据（查看登机牌）
        QUERY_MYCHECKIN: '/checkInSeatService/queryMyCheckInInfo',
        // 添加常旅客
        ADD_PSGCARD: '/checkInSeatService/saveFrequestPsgCardInfo',
        // 获取航信通登机牌
        GET_BOARDPASS: '/checkInSeatService/getBoardingPass',
        // 航信通电子验讫章
        GET_BOARDPASS_STATUS: '/checkInSeatService/getBoardingPassStatus'
    },
    // 升舱接口 （包括升舱券）
    CABIN_LIFT: {
        SEARCH_PLANE: '/v2/up/getTkInfo', //查询航班
        SEARCH_PRICE: "/v2/up/queryUpPrice", //升舱费用查询
        CABIN_PAY: "/v2/up/bookUpClassOrder", //升舱支付接口
        CABIN_TICKET_LIFT: '/upgrade/queryUpgradeCoupon',
        BUY_CABIN_TICKET: '/upgrade/buyUpgradeCoupon', //购买升舱券
        SEARCH_CABIN_TICKET: '/v2/coupon/queryAvailUpCoupon', //查询升舱券
        BUY_CABIN_TICKET: '/upgrade/buyUpgradeCoupon'
    },
    // 我的订单
    MY_ORDER: {
        // 如意购（MALLIP）
        MALL_LIST: '/order/queryOrderList/app',     // 获取如意购订单列表
        MALL_CANCEL: '/order/cancel/app',     // 取消如意购订单
        MALL_DETAIL: '/order/queryOrderDetail/app',     // 取消如意购订单详情
        // 旅游
        TAOLX_LIST: '/taolxService/queryOrderList',  // 淘旅行订单列表
        // 机票
        // AIR_TICKET_ALL: '/orderService/queryOrderBrief?t=' + new Date().getTime(),  // 所有机票
        AIR_TICKET_ALL: '/newOrderService/queryOrderBrief',  // 所有机票订单列表
        AIR_TICKET_DEL: '/newOrderService/deleteCancelOrder', // 机票订单删除
        // AIR_TICKET_TRIP: '/orderService/QueryOrderTrvel?t='+new Date().getTime(),  // 待出行
        AIR_TRAVEL: '/newOrderService/queryOrderTrvel',  // 待出行
        // AIR_TICKET_APPRAISE: '/orderService/QueryQueryOrderNoComments?t='+new Date().getTime(),  // 待评价
        AIR_REMAIN: '/newOrderService/queryQueryOrderNoComments',  // 待评价
        // 订单详情（机票。。。）
        WIFI_DETAIL: '/orderService/queryWifiDetail',   // WIFI订单详情
        VIP_DETAIL: '/orderService/queryLoungeDetail',   // 贵宾休息室详情
        DELIVERY_DETAIL: '/orderService/queryDeliveryDetail',   // 邮寄行程单详情
        // 取消订单
        ORDER_CANCEL: '/orderService/cancelOrder',        // 取消机票订单
        // 评价
        ORDER_EVAL: '/evalService/queryFlightEval',        // 评价
        // 机票订单详情
        PLANE_ORDER_DETAIL: '/orderService/queryOrderDetail'
    },
     // 不正常航班接口
     ABNORMALFLIGHT: {
        COMPENSATEAPPLY:'/compensate/queryAbnormalflight',
        FEEDBACKINFORMATION:'/compensate/addCompensation'
    },
    // 候补查询接口
    ALTERNATE:{
        ALTERNATEQUERY:'/waitingPassenger/queryFlightInfo',
        NEWPASSENGER:'/waitingPassenger/applyWaitingPassenger'
    },
    // 订单详情行李额
    flightLUGGAGE: '/baggageStandard/queryBaggageStandard',
    // 航变信息（航变电子证明申请）
    FLIGHTCHANGE:{
        CHECKFLIGHT:'/electrionicproof/applyFlightChangeProof',  //查询航班接口
        SENDMAIL:'/electrionicproof/sendFlightChangeProof'       //发送邮件接口
    },
     // 个性化餐食
    MEALS:{
        QUERYFLIGHT:'/individualization/queryFlightInfo',
        CHOICEMEALS:'/individualization/querySetMeal',
        APPLYMEALS:'/individualization/submitApply',
        MYAPPLY:'/individualization/queryIndividualization',
        CANCEL:'/individualization/cancelApply',
        CHANGE:'/individualization/updateApply'
    },
    // 机票改期
    CHANGEDATE: {
        ORDER_TICKET_INFO: '/v2/change/getOrderTicketInfo',     // 订单查询改期信息（已登录有数据）
        CHANGE_TICKET_INFO: '/v2/change/getChangeTicketInfo',   // 查询待改期客票信息(未登录点击查询、已登录改期其它航班查询)
        CHANGE_DETAIL: '/v2/change/queryChangeOrderDetail',    // 订单号查询待改期信息
        OrderChangeOrder: '/v2/change/bookOrderChangeOrder',    // 机票订单确认改期
        TicketChangeOrder: '/v2/change/bookTicketChangeOrder',    // 票号订单确认改期
    },
    // 航班动态
    FLIGHT_DYNAMIC: {
        SEARCH: '/flightDynamic/queryNewFlightDynamic', //航班动态查询
        CITY_LIST: '/flight/flightLine'
    }
}
export { RequestUrl }
export default RequestUrl