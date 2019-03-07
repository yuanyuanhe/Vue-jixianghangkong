<template>
    <div class="main showNav">
        <cube-scroll ref="scroll" 
            :data="orderDate.list" 
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
            <div class="container" :class="{pdBottom: !pullUpLoad}">
                <div class="way">
                    <div class="wayItem" v-for="(item, index) in orderDate.list" :key="index"
                        @click.stop="goDetail(item.orderCode)">
                        <div class="cont flexbox">
                            <div class="u-check">
                                <img :src="item.orderItems[0].productImg"/>
                            </div>
                            <div class="ow-main flex-1">
                                <div class="ow-hd">{{item.orderItems[0].productName}}</div>
                                <div class="ow-bd">x{{item.orderItems[0].count}}</div>
                            </div>
                            <div class="ow_rt">
                                <p class="p1">￥<span>{{ item.orderTotal }}</span></p>
                                <p class="p2">{{ orderStatus(item.orderStatus) }}</p>
                            </div>
                        </div>
                        <div class="btns flexbox" v-if="item.orderStatus == 1 || item.orderStatus == 19">
                             <div class="ow_del" v-if="item.orderStatus == 1" @click.stop="cancelOrder(item.id)">取消订单</div>
                            <div class="ow-btn" v-if="item.orderStatus == 1" @click.stop="goPay(item.orderCode)">去支付</div>
                            <!-- <div class="ow_del" v-if="item.orderStatus == 19">删除订单</div> -->
                        </div>
                    </div>
                </div>
                <div class="noData" v-if="!orderDate.list.length">暂无数据！！！</div>
            </div>
        </cube-scroll>            
    </div>
</template>
<script>
    import Vue from 'vue'
    import controller from "common/logic/controller";
    import requesturl from "common/deploy/requesturl";
    import Page from "common/deploy/page";
    import { ResultCode } from "common/logic/enum";
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
                orderDate: {
                    list: []
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
                if (that.pageNum < that.orderDate.totalPage) {
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
                    "memberId": that.memberInfo.memberID,
                    "loginKeyInfo": that.memberInfo.loginKeyInfo,
                    "userId": that.memberInfo.id,
                    "type": 'all',
                    "pageNo": pageNum,
                    "pageSize": that.pageSize,
                    "orderCode": '',
                    "productNm": ''
                }
            },
            // 获取订单列表
            getOrderList(pageNum) {
                let that = this;
                controller.getJSON({
                        method: 'POST',
                        url: requesturl.MY_ORDER.MALL_LIST,
                        params: that.createParam(pageNum),
                        host: MALLIP
                    })
                    .then(that.sucFun)
            },
            sucFun(res) {
                console.log(res);
                if(res.resultCode == ResultCode.SUCCESS){
                    if(res.orderPag.pageNo == 1){
                        this.orderDate = res.orderPag
                    } else {                    
                        this.orderDate.list = this.orderDate.list.concat(res.orderPag.list);
                    }

                    if(res.orderPag.totalPage > 1) {
                        this.pullUpLoad = true;
                    }
                } else {
                    this.orderDate.list = []
                    controller.toast({
                        str: '提取数据失败'
                    })
                }
            },
            //订单状态
            orderStatus(type){
                let text = '';
                switch(type){
                    case '1':
                        text = '待支付';
                        break;
                    case '2':
                        text = '待发货';
                        break;
                    case '3':
                        text = '包装完成';
                        break;
                    case '4':
                        text = '已发货';
                        break;
                    case '5':
                        text = '已收货';
                        break;
                    case '6':
                        text = '部分退货';
                        break;
                    case '7':
                        text = '已退货';
                        break;
                    case '11':
                        text = '申请取消中';
                        break;
                    case '19':
                        text = '已取消';
                        break;
                }
                return text;
            },
            // 取消订单
            cancelOrder(orderId) {
                let that = this;
                controller.getJSON({
                        method: 'POST',
                        url: requesturl.MY_ORDER.MALL_CANCEL,
                        params: {
                            "orderId": orderId,
                            "memberId": that.memberInfo.memberID,
                            "loginKeyInfo": that.memberInfo.loginKeyInfo,
                            "userId": that.memberInfo.id
                        },
                        host: MALLIP
                    })
                    .then((res) => {
                        console.log(res);
                        if(res.resultCode == 1){
                            controller.toast({str: '订单取消成功'});
                            that.pageNum = 1;
                            that.getOrderList(that.pageNum);
                        } else {
                            controller.toast({str: res.result.message});
                        }
                    })
            },
            // 获取订单详情
            getOrderDetail(orderCode, cb) {
                let that = this;
                controller.getJSON({
                        method: 'POST',
                        url: requesturl.MY_ORDER.MALL_DETAIL,
                        params: {
                            "orderCode": orderCode,
                            "memberId": that.memberInfo.memberID,
                            "loginKeyInfo": that.memberInfo.loginKeyInfo,
                            "userId": that.memberInfo.id
                        },
                        host: MALLIP
                    })
                    .then((res) => {
                        if(res.resultCode == 1){
                            controller.setStorage('mall_orderDetail', res);
                            if(cb) cb()
                        } else {
                            controller.toast({str: res.result.message});
                        }
                    })
            },
            // 去支付
            goPay(orderCode) {
                let that = this;
                that.getOrderDetail(orderCode, () => {
                    controller.open({
                        winName: Page.myOrder.mallOrderPay.winName,
                        path: Page.myOrder.mallOrderPay.pageUrl
                    })
                });
            },
            // 详情页
            goDetail(orderCode) {
                let that = this;
                that.getOrderDetail(orderCode, () => {
                    controller.open({
                        winName: Page.myOrder.mallOrderDetail.winName,
                        path: Page.myOrder.mallOrderDetail.pageUrl
                    })
                });
            }
        },
    }
</script>
