<template>
  <div class="main" :class="{showNav: isShowNav}">
    <cube-scroll ref="scroll" :data="orderDate" :options="options" :scroll-events="['scroll']" @scroll="onScrollHandle" @pulling-down="onPullingDown"
      @pulling-up="onPullingUp">
      <!-- 自定义下拉刷新 -->
      <template slot="pulldown" slot-scope="props">
        <div v-if="props.pullDownRefresh" class="cube-pulldown-wrapper" :style="pullDownStyle">
          <div class="pulldown-content">
            <span v-if="props.beforePullDown">{{ pullDownTip }}</span>
            <template v-else>
              <span v-if="props.isPullingDown">正在刷新...</span>
              <span v-else>刷新成功</span>
            </template>
          </div>
        </div>
      </template>
      <!-- 内容 -->
      <div class="container" :class="{pdBottom: !pullUpLoad}">
        <div class="way">
          <div class="wayItem" v-for="(item, index) in orderDate" :key="index" @click.stop="goDetail(item.orderSort, item.channelOrderNo, item.orderNo)">
            <!-- 机票订单(升舱订单) -->
            <div class="cont flexbox" v-if="item.orderSort == 'Upgrade'">
                <div class="u-checked">
                    <img src="../img/icon_air.png" />
                </div>
                <div class="flyBox flex-1">
                    <div class="ow-main flex-1" v-for="(key, index) in item.segmentInfoList" :key="index" v-if="key.flightDirection == 'G' && (key.changeSegment == 'upgrade' || !key.changeSegment)">
                        <div class="ow-hd">{{ key.formatCabinClassName }}({{ key.formatCabin }}) 升至 {{ key.cabinClassName }}({{ key.cabin }})</div>
                        <div class="ow-bd">{{ turnTime(key.depDateTime, 'MM-dd hh:mm') }} 至 {{ turnTime(key.arrDateTime, 'MM-dd hh:mm') }}</div>
                        <div class="ow-ft">
                        <span>{{ key.flightNo }}</span>|
                        <span>{{ (key.depCityName?key.depCityName:'') + (key.depAirportName?key.depAirportName:'') + ((key.depTerm
                            == "--" || key.depTerm == null) ? "" : key.depTerm) }}出发</span>
                        </div>
                    </div>
                    <div class="ow-main flex-1" v-for="(key, index) in item.segmentInfoList" :key="index" v-if="key.flightDirection == 'B' && (key.changeSegment == 'upgrade' || !key.changeSegment)">
                        <div class="ow-hd">{{ key.formatCabinClassName }}({{ key.formatCabin }}) 升至 {{ key.cabinClassName }}({{ key.cabin }})</div>
                        <div class="ow-bd">{{ turnTime(key.depDateTime, 'MM-dd hh:mm') }} 至 {{ turnTime(key.arrDateTime, 'MM-dd hh:mm') }}</div>
                        <div class="ow-ft">
                        <span>{{ key.flightNo }}</span>|
                        <span>{{ (key.depCityName?key.depCityName:'') + (key.depAirportName?key.depAirportName:'') + ((key.depTerm
                            == "--" || key.depTerm == null) ? "" : key.depTerm) }}出发</span>
                        </div>
                    </div>
                </div>
                <div class="ow_rt">
                    <p class="p1">{{ currencyType(item.currencyCode) }}
                    <span>{{ item.amount + (item.currencyCode == 'JPY' ? '円' : '') }}</span>
                    </p>
                    <p class="p2">{{ item.orderPayStateName }}</p>
                </div>
            </div>
            <!-- 机票订单(改期订单) -->
            <div class="cont flexbox" v-if="item.orderSort == 'Change'">
                <div class="u-checked">
                    <img src="../img/icon_air.png" />
                </div>
                <div class="flyBox flex-1">
                    <!-- 去程 -->
                    <div class="ow-main flex-1" v-for="(key, index) in item.segmentInfoList" :key="index" v-if="key.flightDirection == 'G' && key.changeSegment == 'change'">
                        <div class="ow-hd">{{ key.depCityName }} - {{ key.arrCityName }}
                            <span>(改期订单)</span>
                        </div>
                        <div class="ow-bd">{{ turnTime(key.depDateTime, 'MM-dd hh:mm') }} 至 {{ turnTime(key.arrDateTime, 'MM-dd hh:mm') }}</div>
                        <div class="ow-ft">
                            <span>{{ key.flightNo }}</span>|
                            <span>{{ (key.depCityName?key.depCityName:'') + (key.depAirportName?key.depAirportName:'') + ((key.depTerm
                            == "--" || key.depTerm == null) ? "" : key.depTerm) }}出发</span>
                        </div>
                    </div>
                    <!-- 返程 -->
                    <div class="ow-main flex-1" v-for="(key, index) in item.segmentInfoList" :key="index" v-if="key.flightDirection == 'B' && key.changeSegment == 'change'">
                        <div class="ow-hd">{{ key.depCityName }} - {{ key.arrCityName }}
                            <span>(改期订单)</span>
                        </div>
                        <div class="ow-bd">{{ turnTime(key.depDateTime, 'MM-dd hh:mm') }} 至 {{ turnTime(key.arrDateTime, 'MM-dd hh:mm') }}</div>
                        <div class="ow-ft">
                            <span>{{ key.flightNo }}</span>|
                            <span>{{ (key.depCityName?key.depCityName:'') + (key.depAirportName?key.depAirportName:'') + ((key.depTerm
                            == "--" || key.depTerm == null) ? "" : key.depTerm) }}出发</span>
                        </div>
                    </div>
                </div>
                <div class="ow_rt">
                    <p class="p1">{{ currencyType(item.currencyCode) }}
                        <span>{{ item.amount + (item.currencyCode == 'JPY' ? '円' : '') }}</span>
                    </p>
                    <p class="p2">{{ item.orderPayStateName }}</p>
                </div>
            </div>
            <!-- 机票订单(原订单) -->
            <div class="cont flexbox" v-if="item.orderSort != 'Change' && item.orderSort != 'Upgrade' && (item.orderSort=='Normal' || item.orderSort=='UnCompanion')">
                <div class="infos" v-if="(item.exchangeFlag && !item.refundFlag) || (item.exchangeFlag && item.refundFlag && (getFormatTime(item.modifyExchangeTime) > getFormatTime(item.modifyRefundTime)))">含已改期航班</div>
                <div class="infos" v-if="(item.refundFlag && !item.exchangeFlag) || (item.refundFlag && item.exchangeFlag && (getFormatTime(item.modifyExchangeTime) < getFormatTime(item.modifyRefundTime)))">含已退票航班</div>
                <div class="u-checked">
                  <img src="../img/icon_air.png" />
                </div>
                <div class="flyBox flex-1">
                    <div class="ow-main" v-for="(key, index) in item.segmentInfoList" :key="index" v-if="key.flightDirection == 'G'">
                        <div class="ow-hd">{{ key.depCityName }} - {{ key.arrCityName }}</div>
                        <div class="ow-bd">{{ turnTime(key.depDateTime, 'MM-dd hh:mm') }} 至 {{ turnTime(key.arrDateTime, 'MM-dd hh:mm') }}</div>
                        <div class="ow-ft">
                            <span>{{ key.flightNo }}</span>|
                            <span>{{ key.depCityName?key.depCityName:'' }}{{ key.depAirportName?key.depAirportName:'' }}{{ (key.depTerm  == "--" || key.depTerm == null) ? "" : key.depTerm }}出发</span>
                        </div>
                    </div>
                    <div class="ow-main" v-for="(key, index) in item.segmentInfoList" :key="index" v-if="key.flightDirection == 'B'">
                        <div class="ow-hd">{{ key.depCityName }} - {{ key.arrCityName }}</div>
                        <div class="ow-bd">{{ turnTime(key.depDateTime, 'MM-dd hh:mm') }} 至 {{ turnTime(key.arrDateTime, 'MM-dd hh:mm') }}</div>
                        <div class="ow-ft">
                            <span>{{ key.flightNo }}</span>|
                            <span>{{ key.depCityName?key.depCityName:'' }}{{ key.depAirportName?key.depAirportName:'' }}{{ (key.depTerm == "--" || key.depTerm == null) ? "" : key.depTerm }}出发</span>
                        </div>
                    </div>
                </div>
                <div class="ow_rt">
                    <p class="p1">{{ currencyType(item.currencyCode) }}
                        <span>{{ item.amount + (item.currencyCode == 'JPY' ? '円' : '') }}</span>
                    </p>
                    <p class="p2">{{ item.orderPayStateName }}</p>
                </div>
            </div>
            <!-- 保险订单 -->
            <div class="cont flexbox" v-if="item.orderSort=='Insurance'">
                <div class="u-checked">
                    <img src="../img/icon_air.png" />
                </div>
                <div class="ow-main flex-1" v-for="(key, index) in item.insuranceInfoList" :key="index">
                    <div class="ow-hd">航空保险</div>
                </div>
                <div class="ow_rt">
                    <p class="p1">{{ currencyType(item.currencyCode) }}
                        <span>{{ item.amount + (item.currencyCode == 'JPY' ? '円' : '') }}</span>
                    </p>
                    <p class="p2">{{ paystatusvalue(item.orderState, item.payState, item.orderSort) }}</p>
                </div>
            </div>
            <!-- 其它订单(Wifi/行程单/休息室) -->
            <div class="cont otherBox flexbox" 
                v-if="item.otherOrderInfoList && (item.orderSort=='WifiType' || item.orderSort=='TicketDeliveryType'|| item.orderSort=='LoungeType' || item.orderSort=='TourType')" 
                v-for="(key, index) in item.otherOrderInfoList" :key="index">
                <div class="u-checked">
                    <img src="../img/icon_air.png" />
                </div>
                <!-- Wifi订单 -->
                <div class="ow-main flex-1" v-if="item.orderSort == key.otherOrderSort && key.otherOrderSort == 'WifiType'">
                    <div class="ow-hd">{{ key.wifiQueryInfo.wifiProductName }}</div>
                    <div class="ow-bd">{{ key.wifiQueryInfo.takeDate }} 至 {{ key.wifiQueryInfo.returnDate }}</div>
                    <div class="ow-ft">
                        <span>{{ key.wifiQueryInfo.wifiFetchAddress }}</span>
                    </div>
                </div>
                <!-- 行程单订单 -->
                <div class="ow-main flex-1" v-if="item.orderSort == key.otherOrderSort && key.otherOrderSort == 'TicketDeliveryType'">
                    <div class="ow-hd">邮寄行程单</div>
                </div>
                <!-- 休息室 订单 -->
                <div class="ow-main flex-1" v-if="item.orderSort == key.otherOrderSort && key.otherOrderSort == 'LoungeType'">
                    <div class="ow-hd">{{ key.loungeQueryInfo.Name }}</div>
                    <div class="ow-bd" :loungeNumber="loungeNumber++">{{ loungeNumber }}份</div>
                </div>
                <div class="ow_rt">
                    <p class="p1">{{ currencyType(item.currencyCode) }}
                        <span>{{ item.amount + (item.currencyCode == 'JPY' ? '円' : '') }}</span>
                    </p>
                    <p class="p2">{{ paystatusvalue(item.orderState, item.payState, item.orderSort) }}</p>
                </div>
            </div>

            <div class="btns flexbox">
              <!-- 暂无变更  orderstatus ==  TickedOut || Finish   &&  航班日期时间小于等于当前日期时间    （可以评论） -->
              <div class="ow_del" v-if="item.orderPayState=='Pay' && dateFormat.formatIOSDate(item.segmentInfoList[0].depDateTime) < new Date()" @click.stop="evalOpen(item)">评价</div>
              <!-- 行程单不能取消 -->
              <div class="ow_del" v-if="item.orderPayState == 'UnPay' && item.orderSort!='TicketDeliveryType'" @click.stop="cancel(item.channelOrderNo, item.orderNo, item.channelCode, item.orderSort)">取消订单</div>
              <!-- 机票订单去支付 -->
              <div class="ow-btn" v-if="item.orderPayState == 'UnPay' && item.currencyCode=='CNY'" @click.stop="goPay(item.orderSort, item.channelOrderNo, item.orderNo, item.payType)">去支付</div>
              <div class="ow_del" v-if="item.orderPayState == 'Cancel'" @click.stop="del(item.channelOrderNo, item.orderNo)">删除订单</div>
              <div class="ow_del" v-if="item.orderPayState == 'Pay' && item.changeFlag && item.orderSort != 'Change' && dateFormat.formatIOSDate(item.segmentInfoList[0].depDateTime) > new Date()" @click.stop="goChangeDate(item.channelOrderNo, item.orderNo)">改期</div>
            </div>
          </div>
        </div>
        <div class="noData" v-if="!orderDate.length">暂无数据！！！</div>
      </div>
    </cube-scroll>
  </div>
</template>
<script>
    import Vue from 'vue'
    import controller from "common/logic/controller";
    import {
        getChannelCode
    } from 'common/logic/utils'
    import requesturl from "common/deploy/requesturl";
    import {
        AllOrderType,
        ResultCode,
        AllOrderPayType,
        Verify,
    } from "common/logic/enum";
    import {
        dateFormat
    } from "common/logic/utils";
    import {
        payParams
    } from "common/logic/logic";
    import Page from "common/deploy/page";
    import {
        Scroll
    } from "cube-ui"
    Vue.use(Scroll)

    export default {
        props: {
            isShowNav: {
                type: Boolean,
                default: false
            },
            memberInfo: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        data() {
            return {
                dateFormat: dateFormat,

                pageNum: 1,
                pageSize: 10,
                totalPage: 0,
                orderDate: [],
                // 判断是否显示上拉加载
                pullUpLoad: false,
                pullDownStyle: '',
                pullDownY: 0,

                orderState: '',
                loungeNumber: 0,

                dateBegin: dateFormat.getToday(0, -6),
                dateEnd: dateFormat.getToday(),
                url: requesturl.MY_ORDER.AIR_TICKET_ALL
            }
        },
        computed: {
            options() {
                return {
                    pullDownRefresh: this.pullDownRefreshObj,
                    pullUpLoad: this.pullUpLoadObj,
                    click: true
                }
            },
            pullDownRefreshObj: function() {
                return {
                    threshold: 60,
                    stop: 40,
                    stopTime: 1000,
                    txt: '刷新成功'
                }
            },
            pullUpLoadObj: function() {
                return this.pullUpLoad ? {
                    threshold: 0,
                    txt: {
                        more: '上拉加载更多',
                        noMore: '没有更多数据'
                    }
                } : false
            },
            pullDownTip() {
                if(this.pullDownY > 0) {
                    if (this.pullDownY < 60) {
                        return '下拉刷新...'
                    } else {
                        return '松开刷新...'
                    }
                }
            },
        },
        created() {
            let that = this;
            that.orderState = controller.getStorage('orderState');
        },
        methods: {
            // 日期时间转时间
            turnTime(date, type) {
                let Y = dateFormat.formatIOSDate(date).getFullYear();
                let M = dateFormat.formatIOSDate(date).getMonth() + 1;
                let D = dateFormat.formatIOSDate(date).getDate();
                let d = dateFormat.formatIOSDate(date).getDay();
                let h = dateFormat.formatIOSDate(date).getHours();
                let m = dateFormat.formatIOSDate(date).getMinutes();
                M = M < 10 ? '0' + M : M
                D = D < 10 ? '0' + D : D
                h = h < 10 ? '0' + h : h
                m = m < 10 ? '0' + m : m
                let week = ['日', '一', '二', '三', '四', '五', '六']
                if (type == 'hh:mm') {
                    return h + ':' + m;
                } else if (type == 'YYYY-MM-DD dd') {
                    return Y + '-' + M + '-' + D + ' 周' + week[d];
                } else if (type == 'MM-dd') {
                    return M + '-' + D
                } else if (type == 'MM-dd hh:mm') {
                    return M + '-' + D + ' ' + h + ':' + m
                }
            },
            getFormatTime(str) {
                return dateFormat.formatIOSDate(str).getTime()
            },
            // 获取订单列表
            createParam(pageNum) {
                let that = this;
                return {
                    request: {
                        customerNo: that.memberInfo.id, //crm 的 ID 号
                        loginKeyInfo: that.memberInfo.loginKeyInfo,
                        state: that.orderState || 'All', //state: All-全部，UnPay-待支付，Finish-完成，Cancle-取消
                        dateBegin: that.dateBegin,
                        dateEnd: that.dateEnd,
                        pageNo: pageNum,
                        pageSize: that.pageSize
                    }
                }
            },
            getOrderList(pageNum) {
                let that = this;
                controller.getJSON({
                        method: 'POST',
                        url: that.url,
                        params: that.createParam(pageNum)
                    })
                    .then(that.sucFun)
            },
            sucFun(res) {
                console.log(res);
                if (res.resultCode == ResultCode.SUCCESS) {
                    this.totalPage = res.pageCount;

                    if (this.pageNum == 1) {
                        this.orderDate = res.orderBriefInfoList;
                    } else {
                        this.orderDate = this.orderDate.concat(res.orderBriefInfoList);
                    }
                    // 如果无数据，禁止上拉加载
                    if (res.pageCount > 1) {
                        this.pullUpLoad = true;
                    }
                } else {
                    this.orderDate = []
                    controller.toast({
                        str: res.errorInfo
                    })
                }
            },
            // 删除订单参数
            createDelParam(channelOrderNo, orderNo) {
                let that = this;
                return {
                    request: {
                        customerNo: that.memberInfo.id,
                        loginKeyInfo: that.memberInfo.loginKeyInfo,
                        channelOrderNo: channelOrderNo,
                        orderNo: orderNo
                    }
                }
            },
            // 删除订单
            del(channelOrderNo, orderNo) {
                let that = this;
                if (!channelOrderNo || !orderNo) return;
                controller.confirm({
                    title: '提示',
                    message: '确认要删除订单吗？',
                    buttons: ['考虑一下', '确认'],
                    onConfirm() {
                        that.delOrder(channelOrderNo, orderNo);
                    }
                });
            },
            delOrder(channelOrderNo, orderNo) {
                let that = this;
                controller.getJSON({
                        method: 'POST',
                        url: requesturl.MY_ORDER.AIR_TICKET_DEL,
                        params: that.createDelParam(channelOrderNo, orderNo)
                    })
                    .then((res) => {
                        console.log(res);
                        if (res.resultCode == ResultCode.SUCCESS) {
                            that.pageNum = 1;
                            that.getOrderList(that.pageNum);
                        } else {
                            controller.toast({
                                str: res.resultInfo
                            });
                        }
                    })
                    .catch(data => {
                        controller.toast({
                            str: Verify.BACK_ERR.toastDetailsFail
                        });
                    });
            },
            // 取消订单
            cancel(channelOrderNo, orderNo, channelCode, orderSort) {
                let that = this;
                if (!channelOrderNo || !orderNo || !channelCode || !orderSort) return;
                controller.confirm({
                    title: '提示',
                    message: '确认要取消订单吗？',
                    buttons: ['考虑一下', '确认'],
                    onConfirm() {
                        that.cancelOrder(channelOrderNo, orderNo, channelCode, orderSort);
                    }
                });
            },
            // 确认取消订单
            cancelOrder(channelOrderNo, orderNo, channelCode, orderSort) {
                let that = this;
                controller.getJSON({
                        method: 'POST',
                        url: requesturl.MY_ORDER.ORDER_CANCEL,
                        params: {
                            bookChannelCode: channelCode,
                            channelOrderNo: channelOrderNo,
                            orderNo: orderNo,
                            customerNo: that.memberInfo.id,
                            loginKeyInfo: that.memberInfo.loginKeyInfo,
                            orderType: orderSort
                        }
                    })
                    .then((res) => {
                        if (res.resultCode == ResultCode.SUCCESS) {
                            that.pageNum = 1;
                            that.getOrderList(that.pageNum);
                        } else {
                            controller.toast({
                                str: res.resultInfo
                            });
                        }
                    })
            },

            // 滑动事件 计算滑动距离
            onScrollHandle(pos) {
                this.pullDownY = pos.y
                if (pos.y > 0) {
                    this.pullDownStyle = `top:${pos.y}px`
                }
            },
            // 触发下拉刷新
            onPullingDown() {
                let that = this;
                that.pageNum = 1;
                that.getOrderList(that.pageNum);
                setTimeout(function() {
                    that.$refs.scroll.forceUpdate();
                }, 1000)
            },
            // 触发上拉加载
            onPullingUp() {
                let that = this;
                if (that.pageNum < that.totalPage) {
                    // 如果有新数据
                    that.pageNum++;
                    that.getOrderList(that.pageNum);
                } else {
                    // 如果没有新数据
                    that.$refs.scroll.forceUpdate();
                }
            },

            // 订单详情
            getDetail(type, channelOrderNo, orderNo, callback) {
                // 机票订单，wifi订单，贵宾休息室，邮寄行程单url地址都不一样
                let detailUrl = '';
                if (type == 'Normal' || type == 'Insurance' || type == 'UnCompanion' || type == 'Upgrade' || type ==
                    'Change') { //机票订单
                    detailUrl = requesturl.MY_ORDER.PLANE_ORDER_DETAIL;
                } else if (type == 'WifiType') { //WIFI
                    detailUrl = requesturl.MY_ORDER.WIFI_DETAIL;
                } else if (type == 'LoungeType') { //贵宾休息室
                    detailUrl = requesturl.MY_ORDER.VIP_DETAIL;
                } else if (type == 'TicketDeliveryType') { //邮寄行程单
                    detailUrl = requesturl.MY_ORDER.DELIVERY_DETAIL;
                } else if (type = 'TourType') {} //其他订单价格  

                let that = this;
                controller.getJSON({
                        method: 'POST',
                        url: detailUrl,
                        params: {
                            channelOrderNo: channelOrderNo,
                            orderNo: orderNo,
                            customerNo: that.memberInfo.id,
                            cardNo: "HO" + that.memberInfo.memberID,
                            loginKeyInfo: that.memberInfo.loginKeyInfo
                        }
                    })
                    .then((res) => {
                        console.log(res);
                        if (res.resultCode == ResultCode.SUCCESS) {
                            controller.setStorage('orderDetail', res);
                            if (callback) {
                                callback(res);
                            }
                        } else {
                            controller.toast({
                                str: "获取订单详情出错！。"
                            });
                        }
                    })
            },
            // 跳转详情页
            goDetail(type, channelOrderNo, orderNo) {
                if (type == 'Normal' || type == 'Change' || type == 'Upgrade') {
                    controller.open({
                        winName: Page.orderDetail.ticketOrderDetail.winName,
                        path: Page.orderDetail.ticketOrderDetail.pageUrl,
                        data: {
                            orderType: AllOrderPayType.PLANE,
                            channelOrderNo: channelOrderNo,
                            orderNo: orderNo
                        }
                    });
                    return;
                }
                this.getDetail(type, channelOrderNo, orderNo, function () {
                    let htmlName = '';
                    switch (type) {
                        // case 'Normal':      //机票订单
                        //     htmlName = Page.myOrder.fltOrderDetail.pageUrl;
                        //     break;
                        // case 'Change':      //机票订单
                        //     htmlName = Page.myOrder.fltOrderDetail.pageUrl;
                        //     break;
                        // case 'Upgrade':      //机票订单
                        //     htmlName = Page.myOrder.fltOrderDetail.pageUrl;
                        //     break;
                        case 'UnCompanion': //无陪儿童
                            htmlName = Page.myOrder.fltOrderDetail.pageUrl;
                            break;
                        case 'Insurance': //保险订单
                            htmlName = Page.myOrder.insureOrderDetail.pageUrl;
                            break;
                        case 'LoungeType': //休息室 订单
                            htmlName = Page.myOrder.loungeOrderDetail.pageUrl;
                            break;
                        case 'WifiType': //Wifi订单
                            htmlName = Page.myOrder.wifiOrderDetail.pageUrl;
                            break;
                        case 'TicketDeliveryType': //行程单订单
                            htmlName = Page.myOrder.postOrderDetail.pageUrl;
                            break;
                        case 'TourType': //其他订单价格
                            htmlName = '';
                            break;
                    }
                    controller.open({
                        winName: 'orderDetail',
                        path: htmlName
                    });
                })
            },
            // 0元支付、跳转支付页（机票。。。）
            goPay(orderType, channelOrderNo, orderNo, payType) {
                let that = this;
                let type = '';
                let payName = 'orderPay';
                let payUrl = Page.myOrder.orderPay.pageUrl;
                if (orderType == 'Normal' || orderType == 'UnCompanion') { //机票订单
                    type = 'flightOrder';
                    payUrl = Page.myOrder.fltOrderPay.pageUrl;
                } else if (orderType == 'Upgrade') {   // 升舱订单
                    type = 'flightOrder';
                    payName = Page.cabinLift.cabinPay.winName;
                    payUrl = Page.cabinLift.cabinPay.pageUrl;
                } else if (orderType == 'Change') {   // 改期订单
                    type = 'flightOrder';
                    payName = Page.changeDate.orderPayment.winName;
                    payUrl = Page.changeDate.orderPayment.pageUrl;
                } else if (orderType == 'LoungeType') { //贵宾休息室
                    type = 'loungeOrder';
                } else if (orderType == 'WifiType') { //WIFI
                    type = 'wifiOrder';
                } else if (orderType == 'TicketDeliveryType') { //行程单
                    type = 'deliveryOrder';
                } else if (orderType == 'Insurance') { //保险
                    type = 'insureOrder';
                } else if (orderType == 'TourType') { //其他订单
                    type = 'postOrder';
                } else if (orderType == 'luggageType') { //行李额、新贵宾休息室
                    controller.open({
                        winName: Page.commonPage.payment.winName,
                        path: Page.commonPage.payment.pageUrl,
                        data: {
                            orderType: AllOrderType.LUGGAGE,
                            channelOrderNo: channelOrderNo,
                            orderNo: orderNo
                        }
                    });
                    return;
                }
                controller.setStorage('orderType', type);

                that.getDetail(orderType, channelOrderNo, orderNo, function (detailData) {
                    // 0元支付
                    if (payType == 'score') {
                        let params = payParams(detailData, type, payType, this.memberInfo);
                        controller.getJSON({
                                method: 'POST',
                                url: requesturl.PAY.NO_MONEY_PAY,
                                params: params
                            })
                            .then((res) => {
                                if (res.resultCode == ResultCode.SUCCESS) {
                                    controller.toast({
                                        str: '支付成功',
                                        times: "2000"
                                    });
                                    // 刷新列表
                                    setTimeout(function () {
                                        that.pageNum = 1;
                                        that.getOrderList(that.pageNum);
                                    }, 2000);
                                } else {
                                    controller.toast({
                                        str: res.errorInfo,
                                        times: "2000"
                                    });
                                }
                            })
                    } else {
                        controller.open({
                            winName: payName,
                            path: payUrl,
                            data: {
                                orderType: orderType,
                                channelOrderNo: channelOrderNo,
                                orderNo: orderNo
                            }
                        });
                    }
                });
            },
            // 评论
            evalOpen(item) {
                controller.setStorage('orderItem', item);
                controller.getJSON({
                        method: 'POST',
                        url: requesturl.MY_ORDER.ORDER_EVAL,
                        params: {
                            orderNo: item.orderNo,
                            pageNo: 1,
                            pageSize: 10
                        }
                    })
                    .then((data) => {
                        if (data.resultCode == ResultCode.SUCCESS) {
                            controller.setStorage('flightEval', data);
                            controller.open({
                                winName: Page.myOrder.evaluate.winName,
                                path: Page.myOrder.evaluate.pageUrl
                            });
                        } else {
                            controller.toast({
                                str: data.errorInfo
                            });
                        }
                    });
            },
            goChangeDate(channelOrderNo, orderNo) {
                controller.open({
                    winName: Page.changeDate.choose.winName,
                    path: Page.changeDate.choose.pageUrl,
                    data: {
                        listStyle: 1,
                        channelOrderNo: channelOrderNo,
                        orderNo: orderNo,
                    }
                })
            },


            // 订单状态
            paystatusvalue(orderstatus, paystatus, type) {
                var valuestate = "";
                if (orderstatus == "Init") {
                    valuestate = "初始化";
                } else if (orderstatus == "Cancel") {
                    valuestate = "已取消";
                } else if (orderstatus == "Booking") {
                    if (paystatus == 'UnPay') {
                        valuestate = "待付款";
                    } else if (paystatus == 'Pay') {
                        valuestate = "已支付";
                        if (type == 'Normal') {
                            valuestate += "，待出票";
                        }
                    } else if (paystatus == 'PayFail') {
                        valuestate = "支付失败";
                    }
                } else if (orderstatus == "TickedOut") {
                    valuestate = "已出票";
                } else if (orderstatus == "Finish") {
                    valuestate = "已完成";
                }
                return valuestate;
            },
            //货币类型
            currencyType(type) {
                var t = ''
                switch (type) {
                    case 'CNY': //人民币
                        t = '¥';
                        break;
                    case 'USD': //美元
                        t = '$';
                        break;
                    case 'JPY': //日元
                        t = '￥';
                        break;
                    case 'THB': //泰铢
                        t = '฿';
                        break;
                }
                return t;
            }
        },
        watch: {
            memberInfo: {
                handler: function (newVal, oldVal) {
                    if (Object.keys(newVal).length) {　　　　　　
                        this.getOrderList(1)
                    }
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>