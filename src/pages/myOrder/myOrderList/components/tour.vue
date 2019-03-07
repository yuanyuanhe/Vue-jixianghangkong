<template>
    <div class="main showNav">
        <cube-scroll ref="scroll" 
            :data="orderDate" 
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
                    <div class="wayItem" v-for="(item, index) in orderDate" :key="index"
                        @click="goDetail(item.orderNo)">
                        <div class="cont flexbox">
                            <div class="u-checked">
                                <img src="../img/icon_trip.png" />
                            </div>
                            <div class="ow-main flex-1">
                                <div class="ow-hd">{{item.product.name}}</div>
                                <div class="ow-bd">{{ turnTime(item.product.depDate, 'MM-dd') }} 至 {{ turnTime(item.product.bakDate, 'MM-dd') }}</div>
                            </div>
                            <div class="ow_rt">
                                <p class="p1">￥<span>{{ item.paymentPrice }}</span></p>
                                <p class="p2">{{ payStatus(item.payStatus) }}</p>
                            </div>
                        </div>
                        <!-- <div class="btns flexbox" v-if="item.payStatus == 1"> -->
                            <!-- <div class="ow_del">取消订单</div> -->
                            <!-- <div class="ow-btn">去支付</div> -->
                        <!-- </div> -->
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
    import requesturl from "common/deploy/requesturl";
    import {
        dateFormat
    } from "common/logic/utils";
    import Page from "common/deploy/page";
    import { Scroll } from "cube-ui"
    import { ResultCode } from "common/logic/enum"
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
                dateFormat: dateFormat,
                pageNum: 1,
                pageSize: 10,
                totalPage: 0,
                orderDate: [],      
                
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
                if (that.pageNum < that.totalPage) {
                    // 如果有新数据
                    that.pageNum++;
                    that.getOrderList(that.pageNum);
                } else {
                    // 如果没有新数据
                    that.$refs.scroll.forceUpdate();
                }
            },
            createParam(pageNum) {
                let that = this;
                return {
                    "ffpCardNo": that.memberInfo.memberID,
                    "ffpId": that.memberInfo.id,
                    "loginKeyInfo": that.memberInfo.loginKeyInfo,
                    "pageNum": pageNum,
                    "pageSize": that.pageSize
                }
            },
            // 获取订单列表
            getOrderList(pageNum) {
                let that = this;
                controller.getJSON({
                        method: 'POST',
                        url: requesturl.MY_ORDER.TAOLX_LIST,
                        params: that.createParam(pageNum)
                    })
                    .then(that.sucFun)
            },
            sucFun(res) {
                console.log(res);
                if(res.resultCode == ResultCode.SUCCESS) {
                    this.totalPage = Math.ceil(res.data.total/this.pageSize)

                    if(this.pageNum == 1){
                        this.orderDate = res.data.data;
                    } else {                    
                        this.orderDate = this.orderDate.concat(res.data.data);
                    }

                    if(res.data.total > 1) {
                        this.pullUpLoad = true;
                    }
                } else {
                    this.orderDate = []
                    controller.toast({
                        str: '提取数据失败'
                    })
                }
            },
            // 跳转详情页
            goDetail(orderNo) {
                controller.setStorage('packages_$pageParam$', orderNo);
                controller.open({
                    winName: Page.myOrder.taolxOrderDetail.winName,
                    path: Page.myOrder.taolxOrderDetail.pageUrl
                })
            },
            // 支付状态
            payStatus(payStatus) {
                let text = '';
                switch(payStatus){
                    case 1:
                        text = '待付款';
                        break;
                    case 2:
                        text = '已支付';
                        break;
                    case 3:
                        text = '无需支付';
                        break;
                }
                return text;
            }
        }
    }
</script>