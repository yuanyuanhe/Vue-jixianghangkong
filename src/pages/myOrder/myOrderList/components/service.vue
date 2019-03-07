<template>
    <div class="main showNav">
        <cube-scroll ref="scroll" 
            :data="objData.orderList" 
            :options="options" 
            :scroll-events="['scroll']" 
            @scroll="onScrollHandle" 
            @pulling-down="onPullingDown" 
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
                    <div class="wayItem" v-for="(item, index) in objData.orderList" :key="index" @click.stop="openDetail(item.channelOrderNo, item.orderNo)">
                        <div class="cont flexbox">
                            <div class="u-checked">
                                <img src="../img/icon_quanyi.png" />
                            </div>
                            <div class="ow-main flex-1">
                                <div class="ow-hd">{{ item.orderName }}</div>
                                <div class="ow-bd">{{ turnTime(item.startDate, 'MM-dd') }} 至 {{ turnTime(item.endDate, 'MM-dd') }} {{ item.saleCouponCount }}张</div>
                                <div class="ow-ft" v-if="item.couponList[0].couponSource == 'YLDJP'">
                                    <span>{{item.pisohao}}</span>|
                                    <span>{{item.a1}}</span>
                                    <span class="image">
                                        <!-- <img src="../img/icon_jiantou_24.png" /> -->
                                    </span>
                                    <span>{{item.a2}}</span>
                                </div>
                            </div>
                            <div class="ow_rt">
                                <p class="p1">￥<span>{{ item.orderTotalAmount }}</span></p>
                                <p class="p2">{{ item.orderStateName }}</p>
                            </div>
                        </div>
                        <!-- <div class="btns flexbox" v-if="item.orderState == 'UnPay'">
                            <div class="ow_del" v-if="item.orderState == 'UnPay'" @click="cancel(item.channelOrderNo, item.orderNo)">取消订单</div>
                            <div class="ow-btn" v-if="item.orderState == 'UnPay'">去支付</div>
                            <div class="ow_del" v-if="item.orderState == 'Cancel'">删除订单</div>
                        </div> -->
                        <div class="btns flexbox" v-if="item.orderState == 'UnPay' || item.orderState == 'Cancel'">
                            <div class="ow_del" v-if="item.orderState == 'UnPay'" 
                            @click.stop="cancel(item.channelOrderNo, item.orderNo)">取消订单</div>
                            
                            <div class="ow-btn" v-if="item.orderState == 'UnPay'"
                            @click.stop="goPay(item.channelOrderNo, item.orderNo)">去支付</div>
                            <div class="ow_del" v-if="item.orderState == 'Cancel'" @click.stop="del(item.channelOrderNo, item.orderNo)">删除订单</div>
                        </div>
                    </div>
                </div>
                <div class="noData" v-if="!objData.orderList.length">暂无数据！！！</div>
            </div>
        </cube-scroll>            
    </div>
</template>
<script>
    import Vue from 'vue'
    import controller from "common/logic/controller";
    import requesturl from "common/deploy/requesturl";
    import {
        AllOrderType,
        ResultCode
    } from "common/logic/enum";
    import {
        dateFormat
    } from "common/logic/utils";
    import Page from "common/deploy/page";
    import { Scroll } from "cube-ui"
    Vue.use(Scroll)
    export default {
        props: {
            memberInfo: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                pageNum: 1,
                pageSize: 10,                  
                // 用来渲染列表的数组
                objData: {
                    orderList: []
                },           
                
                // 判断是否显示上拉加载
                pullUpLoad: false,
                pullDownStyle: '',
                pullDownY: 0
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
            console.log(this.memberInfo);
            this.getOrderList(1);
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
                let week = ['日','一','二','三','四','五','六']
                if (type == 'hh:mm') {
                    return h + ':' + m;
                } else if (type == 'YYYY-MM-DD dd') {
                    return Y + '-' + M + '-' + D + ' 周' + week[d];
                } else if(type == 'MM-dd'){
                    return M + '-' + D
                } else if(type == 'MM-dd hh:mm') {
                    return M + '-' + D + ' ' + h + ':' + m
                }
            },
            // 滑动事件 计算滑动距离
            onScrollHandle(pos) {
                this.pullDownY = pos.y
                if (pos.y > 0) {
                    this.pullDownStyle = `top:${pos.y}px`
                }
            },
            // 触发下拉刷新
            onPullingDown(){
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
                if (that.pageNum < that.objData.pageCount) {
                    // 如果有新数据
                    that.pageNum++;
                    that.getOrderList(that.pageNum);
                } else {
                    // 如果没有新数据
                    that.$refs.scroll.forceUpdate();
                }
            },
            // 创建参数
            createParam(pageNum) {
                let that = this;
                return {
                    request: {
                        ffpCardNo: that.memberInfo.memberID,
                        ffpId: that.memberInfo.id,
                        loginKeyInfo: that.memberInfo.loginKeyInfo,
                        pageNo: pageNum,
                        pageSize: that.pageSize,
                        orderNo: '',
                        channelOrderNo: '',
                    }
                }
            },
            //获取权益券订单列表
            getOrderList(pageNum) {
                console.log(this);
                let that = this
                controller.getJSON({
                        method: 'POST',
                        url: requesturl.BUY_ORDER_DETAIL,
                        params: that.createParam(pageNum)
                    })
                    .then(that.sucFun)
                    .catch((err) => {
                        controller.toast({
                            str: '不好意思，出错了！'
                        });
                    })
            },
            // 请求成功
            sucFun(res) {
                console.log(res);
                if (res.resultCode == ResultCode.SUCCESS) {
                    if(this.pageNum == 1){
                        this.objData = res.objData;
                    } else {                    
                        this.objData.orderList = this.objData.orderList.concat(res.objData.orderList);
                    }

                    if(res.objData.pageCount > 1) {
                        this.pullUpLoad = true;
                    }
                } else {
                    this.objData.orderList = []
                    controller.toast({
                        str: '提取数据失败!'
                    })
                }
            },
            // 取消订单、删除订单参数
            createCancelParam(channelOrderNo, orderNo){
                let that = this;
                return {
                    request: {
                        ffpCardNo: that.memberInfo.memberID,
                        ffpId: that.memberInfo.id,
                        loginKeyInfo: that.memberInfo.loginKeyInfo,
                        channelOrderNo: channelOrderNo,
                        orderNo: orderNo
                    }
                }
            },
            // 取消权益券订单
            cancel(channelOrderNo, orderNo) {
                let that = this;
                if(!channelOrderNo||!orderNo) return;
                controller.confirm({
                    title: '提示',
                    message: '确认要取消订单吗？',
                    buttons: ['考虑一下', '确认'],
                    onConfirm() {
                        that.cancelOrder(channelOrderNo, orderNo);
                    }
                });
            },
            // 确认取消权益券订单
            cancelOrder(channelOrderNo, orderNo) {
                let that = this;
                controller.getJSON({
                        method: 'POST',
                        url: requesturl.BUY_ORDER_CANCEL,
                        params: that.createCancelParam(channelOrderNo, orderNo)
                    })
                    .then((res) => {
                        if(res.resultCode == ResultCode.SUCCESS){
                            that.pageNum = 1;
                            that.getOrderList(that.pageNum);
                        } else {
                            controller.toast({
                                str: res.resultInfo
                            });
                        }
                    })
            },
            // 删除订单
            del(channelOrderNo, orderNo) {
                let that = this;
                if(!channelOrderNo || !orderNo) return;
                controller.confirm({
                    title: '提示',
                    message: '确认要删除订单吗？',
                    buttons: ['考虑一下', '确认'],
                    onConfirm() {
                        that.delOrder(channelOrderNo, orderNo);
                    }
                });
            },
            delOrder(channelOrderNo, orderNo){
                let that = this;
                controller.getJSON({
                        method: 'POST',
                        url: requesturl.BUY_ORDER_DEL,
                        params: that.createCancelParam(channelOrderNo, orderNo)
                    })
                    .then((res) => {
                        if(res.resultCode == ResultCode.SUCCESS){
                            that.pageNum = 1;
                            that.getOrderList(that.pageNum);
                        } else {
                            controller.toast({
                                str: res.resultInfo
                            });
                        }
                    })
                    .catch((res) => {
                        controller.toast({
                            str: res.resultInfo
                        });
                    })
            },
            // 跳转详情
            openDetail(channelOrderNo, orderNo){
                controller.open({
                    winName: Page.orderDetail.cabinTicketDetail.winName,
                    path: Page.orderDetail.cabinTicketDetail.pageUrl,
                    data: {
                        channelOrderNo: channelOrderNo, 
                        orderNo: orderNo
                    }
                })
            },
            // 0元支付、跳转支付页（机票。。。）
            goPay(channelOrderNo, orderNo){
                let that = this;
                controller.open({
                    winName: Page.commonPage.payment.winName, 
                    path: Page.commonPage.payment.pageUrl, 
                    data: {
                        orderType: AllOrderType.LUGGAGE,
                        channelOrderNo: channelOrderNo,
                        orderNo: orderNo
                    }
                });
            },
        }
    }
</script>
