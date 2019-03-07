const Page = {
    login: {
        login: {
            winName: 'login',
            pageUrl: 'http://homobile.juneyaoair.com:86/login'
        },
        find_pwd: {
            winName: 'find_pwd',
            pageUrl: '/login/pwd_find.html'
        }
    },
    passengers: {
        care: {
            winName: 'careChannel',
            pageUrl: 'passengers/careChannel/index.html?titlestyle=4&title=关怀通道&navRightItem=2&navRightTitle=我的'
        },    // 关怀通道
        applyList: {
            winName: 'applyList', 
            pageUrl: 'passengers/applyList/index.html?titlestyle=4&title=我的服务'
        },    // 申请列表
        bassinet: {
            winName: 'bassinet',
            pageUrl: 'passengers/bassinet/index.html?titlestyle=4&title=婴儿摇篮服务'
        },    // 婴儿摇篮服务申请
        oldman: {
            winName: 'oldman',
            pageUrl: 'passengers/oldman/index.html?titlestyle=4&title=老人协助服务'
        },    // 老人协助服务申请
        wchc: {
            winName: 'wchc',
            pageUrl: 'passengers/wchc/index.html?titlestyle=4&title=轮椅旅客服务'
        },    // 轮椅旅客服务申请
        prgnPeople: {
            winName: 'prgnPeople',
            pageUrl: 'passengers/prgnPeople/index.html?titlestyle=4&title=孕妇旅客服务'
        },    // 孕妇旅客服务申请
        young: {
            winName: 'young',
            pageUrl: 'passengers/young/index.html?titlestyle=4&title=无陪青少年服务'
        },    // 无陪青少年服务申请
        blindPeople: {
            winName: 'blindPeople',
            pageUrl: 'passengers/blindPeople/index.html?titlestyle=4&title=盲人旅客服务'
        },    // 盲人旅客服务申请
        child: {
            winName: 'child',
            pageUrl: 'passengers/child/index.html?titlestyle=4&title=无陪儿童服务'
        },    // 无陪儿童服务申请
        deafPeople: {
            winName: 'deafPeople',
            pageUrl: 'passengers/deafPeople/index.html?titlestyle=4&title=聋哑旅客服务'
        },    // 聋哑旅客服务申请
        stretcher: {
            winName: 'stretcher',
            pageUrl: 'passengers/stretcher/index.html?titlestyle=4&title=担架旅客服务'
        },    // 担架旅客服务申请
        lctnPeople: {
            winName: 'lctnPeople',
            pageUrl: 'passengers/lctnPeople/index.html?titlestyle=4&title=哺乳旅客服务'
        },    // 哺乳旅客服务申请
        useoxyPeople: {
            winName: 'useoxyPeople',
            pageUrl: 'passengers/useoxyPeople/index.html?titlestyle=4&title=用氧旅客服务'
        },    // 用氧旅客服务
        sickenPeople: {
            winName: 'sickenPeople',
            pageUrl: 'passengers/sickenPeople/index.html?titlestyle=4&title=患病旅客服务'
        },    // 患病旅客服务
        EWConPeople: {
            winName: 'EWConPeople',
            pageUrl: 'passengers/EWConPeople/index.html?titlestyle=4&title=电动轮椅托运旅客'
        },    // 电动轮椅托运旅客
        disTeamPeople: {
            winName: 'disTeamPeople',
            pageUrl: 'passengers/disTeamPeople/index.html?titlestyle=4&title=残疾人团队旅客服务'
        },    // 残疾人团队旅客服务
        disPeople: {
            winName: 'disPeople',
            pageUrl: 'passengers/disPeople/index.html?titlestyle=4&title=残障旅客服务'
        },    // 残障旅客服务
        serDogPeople: {
            winName: 'serDogPeople',
            pageUrl: 'passengers/serDogPeople/index.html?titlestyle=4&title=服务犬旅客'
        },    // 服务犬旅客
        organTra: {
            winName: 'organTra',
            pageUrl: 'passengers/organTra/index.html?titlestyle=4&title=活体器官及血液制品运输'
        },    // 活体器官及血液制品运输
        sucApply: {
            winName: 'sucApply',
            pageUrl: 'passengers/sucApply/index.html'
        },    // 申请成功/预约成功
        imgDisplay: {
            winName: 'imgDisplay',
            pageUrl: 'passengers/imgDisplay/index.html'
        }
    },
    //异常行李
    abnormalBaggage:{
        abnorBag: {
            winName: 'abnorBag',
            pageUrl: 'abnormalBaggage/abnorBag/index.html?titlestyle=4&title=异常行李申诉&navRightItem=2&navRightTitle=我的'
        },  //异常行李申诉
        appeal: {
            winName: 'appeal',
            pageUrl: 'abnormalBaggage/appeal/index.html?titlestyle=4&title=我的申诉'
        },  //申诉列表
        detailabnor:{
            winName:'detailabnor',
            pageUrl:'abnormalBaggage/detailabnor/index.html?titlestyle=4&title=详情'
        }
    },
    events: {
        mallPush: { // 商城推送活动
            winName: 'maillPushActivity',
            pageUrl: 'events/mallPush/index.html?titlestyle=1&title='
        }
    },
    lounge: {  // 贵宾休息室
        homePage: {
            winName: 'homePage',
            pageUrl: 'lounge/homePage/index.html?titlestyle=1&title=贵宾休息室'
        },
        orderWrite: {
            winName: 'orderWrite',
            pageUrl: 'lounge/orderWrite/index.html?titlestyle=1&title=贵宾休息室'
        }
    },
    luggage: {
        home: {
            winName: 'luggageHome',
            pageUrl: 'luggage/home/index.html'
        },
        buyRules: {
            winName: 'buyRules',
            pageUrl: 'luggage/buyRules/index.html?titlestyle=1&title=购买须知'
        }
    },
    commonPage: {
        payment: {
            winName: 'payment',
            pageUrl: 'commonPage/payment/index.html?titlestyle=1&title=订单支付'
        },
        payResult: {
            winName: 'payResult',
            pageUrl: 'commonPage/payResult/index.html'
        },
        // 添加常旅客
        addStarPsg: {
            winName: 'addStarPsg',
            pageUrl: 'commonPage/addStarPsg/index.html'
        }
    },
    my: {
        auth: { // 实名认证页
            winName: 'auth',
            pageUrl: 'http://homobile.juneyaoair.com:86/authentication'
        },
        jiDou: {
            winName: 'jiDou',
            pageUrl: '/my/jidou.html?titlestyle=1&title=签到领吉豆'
        },
        myScore: {
            winName: 'myScore',
            pageUrl: '/my/my_score.html?titlestyle=1&title=我的积分'
        },
        myCoupons: {
            winName: 'myCoupons',
            pageUrl: '/my/my_coupons.html'
        },
        myOrder: { // 我的订单
            winName: 'myOrder',
            pageUrl: '/my/my_order.html'
        },
        applyMember: {
            winName: 'applyMember',
            pageUrl: 'applyMember/home/index.html?titlestyle=1&title=填写会员资料'
        },
        interestOrderDetail: { //权益券详情
            winName: 'interestOrderDetail',
            pageUrl: '/my/orders_detail_interests.html'
        },
        my_callCenter: {   // 客服中心
            winName: 'my_callCenter',
            pageUrl: 'http://homobile.juneyaoair.com:86/my_callCenter'
        },
        my_setting: {      // 设置
            winName: 'my_setting',
            pageUrl: 'http://homobile.juneyaoair.com:86/my_setting'
        },
    },
    interests: {  // 权益券
        myTicket: { // 我的权益券列表
            winName: 'myTicket',
            pageUrl: 'interestTicket/myTicket/index.html?titlestyle=1&title=权益券&navRightItem=2&navRightTitle=失效券'
        },
        invalidTicket: {  // 失效权益券
            winName: 'invalidTicket',
            pageUrl: 'interestTicket/invalidTicket/index.html?titlestyle=1&title=失效权益券'
        },
    },
    pay: {
        cardPay: {
            winName: 'payCreditCard',
            pageUrl: '/orders/pay_creditCard.html?titlestyle=1&title=银联支付'
        },
        shoufuPay: {
            winName: 'xinyongfeipay',
            pageUrl: '/orders/orders_xinyongfeipay.html?titlestyle=1&title=信用飞|分期支付'
        },
        shrbpay: {
            winName: 'shrbpay',
            pageUrl: '/orders/orders_shrbpay.html?titlestyle=1&title=华瑞支付'
        },
        cmbchinapay: {
            winName: 'cmbchinapay',
            pageUrl: '/external/h5pay.html?titlestyle=1&title=一网通银行卡支付'
        }
    },
    clause: {
        service_clause: {
            winName: 'service_clause',
            pageUrl: '/clause/service_clause.html?titlestyle=1&title=服务条款'
        }
    },
    mPage: {
        myCard: {
            winName: 'myCard',
            pageUrl: '/common/my_card.html?titlestyle=1&title=吉祥联名卡'
        },
        terms: {
            winName: 'terms',
            pageUrl: '/clause/VIP.html?titlestyle=1&title=吉祥航空会员条款'
        }
    },
    // 值机
    checkIn: {
        // 填写信息页
        index: {
            winName: 'checkIn',
            pageUrl: 'checkIn/index/index.html?barStyle=0'
        },
        // 选座页面
        seat: {
            winName: 'checkSeat',
            pageUrl: 'checkIn/seat/index.html?titlestyle=4&title=值机选座'
        },
        // 值机选座列表
        logged: {
            winName: 'checkLogged',
            pageUrl: 'checkIn/logged/index.html?titlestyle=4&title=值机选座&navRightItem=2&navRightTitle=办理其他航班'
        },
        // 值机结果
        result: {
            winName: 'result',
            pageUrl: 'checkIn/result/index.html'
        },
        // 添加乘机人
        addPsg: {
            winName: 'addPsg',
            pageUrl: 'checkIn/addPsg/index.html?titlestyle=4&title=添加同行人'
        },
        // 添加常旅客
        addStarPsg: {
            winName: 'addStarPsg',
            pageUrl: 'checkIn/addStarPsg/index.html?titlestyle=4&title=添加常旅客卡'
        },
        // 网上值机服务协议
        clause: {
            winName: 'clause',
            pageUrl: '/clause/checkin.html?titlestyle=4&title=网上值机服务协议'
        }
    },
    // 升舱
    cabinLift: {
        // 升舱，查询页
        cabinLift: {
            winName: 'bacinLift',
            pageUrl: 'cabinLift/cabinLift/index.html'
        },
        // 选择升舱
        selectCabinLift: {
            winName: 'selectCabinLift',
            pageUrl: 'cabinLift/selectCabinLift/index.html?titlestyle=4&title=选择需要升舱的航班'
        },
        // 确认升舱
        confirmCabinLift: {
            winName: 'confirmCabinLift',
            pageUrl: 'cabinLift/confirmCabinLift/index.html?titlestyle=4&title=确认升舱信息'
        },
        // 升舱券购买
        buyCabinTicket: {
            winName: 'buyCabinTicket',
            pageUrl: 'cabinLift/cabinLiftTicket/index.html'
        },
        // 升舱券购买须知
        buyRules: {
            winName: 'buyRules',
            pageUrl: 'cabinLift/buyRules/index.html?titlestyle=1&title=购买须知'
        },
        // 升舱订单支付
        cabinPay: {
            winName: 'cabinPay',
            pageUrl: 'cabinLift/cabinLiftPay/index.html?titlestyle=4&title=订单支付'
        },
        // 升舱券订单支付
        cabinTicketPay: {
            winName: 'payment',
            pageUrl: 'commonPage/payment/index.html?titlestyle=4&title=订单支付'
        },
    },
    // 改期
    changeDate: {
        index: {   // 未登录/改期其它航班
            winName: 'index',
            pageUrl: 'changeDate/index/index.html?barStyle=0&loginStyle=1'
        },
        logged: {  // 已登录(有数据)
            winName: 'logged',
            pageUrl: 'changeDate/logged/index.html?barStyle=0'
        },
        choose: {  // 选择航段和乘机人
            winName: 'choose',
            pageUrl: 'changeDate/choose/index.html?titlestyle=4&title=选择航段和乘机人'
        },
        ackDate: { // 确认改期信息
            winName: 'ackDate',
            pageUrl: 'changeDate/ackDate/index.html?titlestyle=4&title=确认改期信息'
        },
        orderPayment: {
            // 订单详情
            winName: 'orderPayment',
            pageUrl: 'changeDate/orderPayment/index.html?titlestyle=4&title=订单支付'
        }
    },
    // 预留登机牌
    boardPass: {
        index: {   // 未登录/改期其它航班
            winName: 'index',
            pageUrl: 'boardPass/index/index.html'
        },
        moreFlt: {   // 查看更多航班
            winName: 'moreFlt',
            pageUrl: 'boardPass/moreFlt/index.html'
        },
        orderDetail: {   // 订单详情
            winName: 'orderDetail',
            pageUrl: 'boardPass/orderDetail/index.html'
        },
        orderPayment: {  // 订单支付
            winName: 'orderPayment',
            pageUrl: 'boardPass/orderPayment/index.html'
        },
        buyNotes: { // 购买须知
            winName: 'buyNotes',
            pageUrl: 'boardPass/buyNotes/index.html?titlestyle=4&title=购买须知'
        }
    },
  
    // 订单详情
    orderDetail: {
        cabinTicketDetail:{  // 权益券订单详情
            winName: 'cabinTicketDetail',
            pageUrl: 'orderDetail/cabinTicketDetail/index.html'
        },
        ticketOrderDetail:{  // 机票，升舱，改期订单详情
            winName: 'ticketOrderDetail',
            pageUrl: 'orderDetail/ticketOrderDetail/index.html'
        },
    },
    // 我的订单
    myOrder: {
        myOrderList: {  // 我的订单列表
            winName: 'myOrder',
            pageUrl: 'myOrder/myOrderList/index.html?titlestyle=4&&title=我的订单'
        },
        // 机票、无陪儿童
        fltOrderDetail: {  // 机票订单详情页
            winName: 'orderDetail',
            pageUrl: '/my/orders_detail_flt.html'
        },
        // 保险订单
        insureOrderDetail: {  // 保险订单详情页
            winName: 'orderDetail',
            pageUrl: '/my/orders_detail_insure.html'
        },
        // 休息室订单
        loungeOrderDetail: {  // 休息室订单详情页
            winName: 'orderDetail',
            pageUrl: '/my/orders_detail_lounge.html'
        },
        // wifi订单
        wifiOrderDetail: {  // wifi订单详情页
            winName: 'orderDetail',
            pageUrl: '/my/orders_detail_wifi.html'
        },
        // 行程单订单
        postOrderDetail: {  // 行程单订单详情页
            winName: 'orderDetail',
            pageUrl: '/my/orders_detail_post.html'
        },

        // 旅游
        /* taolxOrderPay: {    // 旅游订单支付页
            winName: '',
            pageUrl: ''
        }, */
        taolxOrderDetail: {  // 旅游订单详情页
            winName: 'orderDetail',
            pageUrl: '/packages/views/order/detail.html'
        },
        // 如意购
        mallOrderPay: {   // 如意购支付页
            winName: 'pay',
            pageUrl: '/mall/views/pay.html?barStyle=0'
        },
        mallOrderDetail: {   // 如意购详情页
            winName: 'orderDetailMall',
            pageUrl: '/my/orders_detail_mall.html?titlestyle=1&title=订单详情'
        },
        // 贵宾休息室/WIFI/行程单/保险/其他订单
        orderPay: {
            winName: 'orderPay',
            pageUrl: '/orders/orders_pay.html'
        },
        fltOrderPay: {
            winName: 'orderPay',
            pageUrl: '/ui18/views/orderPayment.html?titlestyle=1&title=订单支付'
        },
        paySuccess: {  // 支付成功
            winName: 'paySuccess',
            pageUrl: '/ui18/views/paymentSuccess.html'
        },
        payError: {  // 支付失败
            winName: 'payError',
            pageUrl: '/ui18/views/paymentFail.html'
        },
        payLongTime: {  // 支付超时
            winName: 'payLongTime',
            pageUrl: '/ui18/views/paymentLongTime.html'
        },
        // 点评
        evaluate: {
            winName: 'evaluate',
            pageUrl: '/my/evaluate.html?titlestyle=1&title=添加点评'
        },
    },
    // 航变查询  变更电子证明申请
    flightChange: {
        index:{  //航变查询
            winName: 'index',
            pageUrl: 'flightChange/index/index.html?titlestyle=4&title=航变电子证明申请'
        },
        changeMsg:{ //航变信息
            winName: 'changeMsg',
            pageUrl: 'flightChange/changeMsg/index.html?titlestyle=4&title=航变电子证明申请'
        },
    },
     /* 候补查询 */
     alternate:{
        alternateApply:{
            winName: 'alternateApply',
            pageUrl: 'alternate/alternateApply/index.html?titlestyle=4&title=乘机人信息'
        },
        alternateQuery:{
            winName: 'alternateQuery',
            pageUrl: 'alternate/alternateQuery/index.html?barStyle=0'
        },
        newPassenger:{
            winName: 'newPassenger',
            pageUrl: 'alternate/newPassenger/index.html?titlestyle=4&title=候补申请'
        }
    },
    /* 不正常航班 */
    abnormalFlight:{
        compensateApply:{
            winName: 'compensateApply',
            pageUrl: 'abnormalFlight/compensateApply/index.html?titlestyle=4&title=不正常航班补偿申请'
        },
        compensationInformation:{
            winName: ' compensationInformation',
            pageUrl: 'abnormalFlight/compensationInformation/index.html?titlestyle=4&title=不正常航班补偿申请'
        },
        feedbackInformation:{
            winName: 'feedbackInformation',
            pageUrl: 'abnormalFlight/feedbackInformation/index.html?titlestyle=4&title=申请反馈'
        }
    },
    //个性化餐食
    meals:{
        applySuccess:{
            winName: 'applySuccess',
            pageUrl: 'meals/applySuccess/index.html?barStyle=0'
        },
        buyRules:{
            winName: 'buyRules',
            pageUrl: 'meals/buyRules/index.html?barStyle=0'
        },
        changeMeals:{
            winName: 'changeMeals',
            pageUrl: 'meals/changeMeals/index.html?titlestyle=4&title=更改餐食'
        },
        choiceFlight:{
            winName: 'choiceFlight',
            pageUrl: 'meals/choiceFlight/index.html?titlestyle=4&title=选择航班'
        },
        choiceMeals:{
            winName: 'choiceMeals',
            pageUrl: 'meals/choiceMeals/index.html?titlestyle=4&title=选择餐食'
        },
        myApply:{
            winName: 'myApply',
            pageUrl: 'meals/myApply/index.html?titlestyle=4&title=我的申请'
        },
        personalized:{
            winName: 'personalized',
            pageUrl: 'meals/personalized/index.html'
        },
        changeSuccess:{
            winName: 'changeSuccess',
            pageUrl: 'meals/changeSuccess/index.html?barStyle=0'
        },

    },
    // 航班动态
    flightDynamic: {
        //航班动态查询
        search: {
            winName: 'search',
            pageUrl: 'flightSearch/search/index.html?barStyle=0'
        },
        // 航班动态查询结果
        searchResult: {
            winName: 'searchResult',
            pageUrl: 'flightSearch/searchResult/index.html?barStyle=0'
        },
        // 航班动态
        flightDynamic: {
            winName: 'flightDynamic',
            pageUrl: 'flightSearch/flightDynamic/index.html?barStyle=0'
        }
    },
    // 增值服务
    addService: {
        //wifi
        wifi: {
            winName: 'serviceWifi',
            pageUrl: '/service/service_wifi.html?title=境外WIFI&titlestyle=1'
        },
    },
    // 退款
    refund: {
        refundInsurance: {
            winName: 'activity',
            pageUrl: '/refund/refund_insure.jsp'
        },
        applyRefund: {
            winName: 'activity_content',
            pageUrl: '/refund/refund1.jsp'
        }
    }
}
export default Page
