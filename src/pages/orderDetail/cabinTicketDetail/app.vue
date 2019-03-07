<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' @h5TitleStyle="getTitleStyle" :setTitleStyle="setTitleStyle"></Header>
        <div class="main">
            <div class="main-wrap">
                <!-- UnPay 等待付款  Cancel已取消  Pay  已支付 -->
                <div class="header-wrap">
                    <!-- 订单信息 -->
                    <div class="line-1 flexbox">
                        <div class="text">{{ orderDetailList.orderStateName }}</div>
                        <div class="money flex-1">
                            <div class="num"><span>&yen;</span>{{ orderDetailList.orderTotalAmount }}</div>
                            <div class="tip-btn" @click="showPrice"></div>
                        </div>
                    </div>
                    <!-- 倒计时 -->
                    <div class="line-2 flexbox" v-if="orderDetailList.orderState == 'UnPay'">
                        <div class="text flex-1">
                            <span>请在</span>
                            <span class="icon"></span>
                            <span class="time">{{ timeLimit }}</span>
                            <span>内完成支付</span>
                        </div>
                    </div>
                    <!-- 按钮 -->
                    <div class="btn-wrap flexbox justify-content" v-if="orderDetailList.orderState == 'UnPay'">
                        <div class="cancel-btn btn" @click="cancel(orderDetailList.channelOrderNo, orderDetailList.orderNo)">取消订单</div>
                        <div class="pay-btn btn" @click="gobuy(orderDetailList.channelOrderNo, orderDetailList.orderNo)">去支付</div>
                    </div>
                </div>
                <div class="content-wrap">
                    <!-- 券列表 -->
                    <div class="commodity-wrap come-style">
                        <div class="apply com-border-bottom"
                            v-for="(item, index) in orderDetailList.couponList" :key="index">
                            <div class="left-wrap">
                                <div class="name">{{ item.activityName }}</div>
                                <div class="detail-infor flexbox" v-if="item.couponCode">
                                    <div class="name">券号</div>
                                    <div class="content flex-1">{{ item.couponCode }}</div>
                                </div>
                                <div class="detail-infor flexbox">
                                    <div class="name">有效期</div>
                                    <div class="content flex-1">{{ item.startDate }} 至 {{ item.endDate }}</div>
                                </div>
                            </div>
                            <div class="apply-btn com-border"
                                v-if="item.couponState == 'Not' && 
                                orderDetailList.orderState == 'Pay'"
                                @click="refund(orderDetailList.channelOrderNo, orderDetailList.orderNo, item.couponCode)">申请退款</div>
                            <div class="apply-btn"
                                v-if="item.couponState != 'Not' && 
                                item.couponState != 'Apply' && 
                                orderDetailList.orderState == 'Pay'">{{ item.couponStateName }}</div>
                        </div>
                    </div>
                    <!-- 联系人信息 -->
                    <div class="contact-infor come-style" v-if="orderDetailList.linker || orderDetailList.linkerHandphone">
                        <div class="every-infor flexbox" v-if="orderDetailList.linker">
                            <div class="name">联系人</div>
                            <div class="content">{{ orderDetailList.linker }}</div>
                        </div>
                        <div class="every-infor flexbox" v-if="orderDetailList.linkerHandphone">
                            <div class="name">电话</div>
                            <div class="content">{{ orderDetailList.linkerHandphone }}</div>
                        </div>
                    </div>
                    <!-- 订单信息 -->
                    <div class="order-infor come-style">
                        <div class="order-num flexbox every-order-infor">
                            <div class="name">订单编号</div>
                            <div class="content flex-1">{{ orderDetailList.orderNo }}</div>
                        </div>
                        <div class="order-time flexbox every-order-infor">
                            <div class="name">下单时间</div>
                            <div class="content flex-1">{{ orderDetailList.orderDatetime }}</div>
                        </div>
                    </div>
                </div>
                <!-- 删除按钮 -->
                <div class="delete-btn"  @click="del(orderDetailList.channelOrderNo, orderDetailList.orderNo)"  v-if="orderDetailList.orderState != 'UnPay'">
                    <div class="img"></div>
                    <div class="text">删除订单</div>
                </div>
            </div>
        </div>
        <PriceDetail :orderDetail="orderDetailList" @hidePrice="hidePrice" v-show="isShowPrice" :isShow="isShowPrice"></PriceDetail>
    </div>
</template>

<script>
    import "common/tools/rem";
    import Header from "components/header.vue";
    import PriceDetail from "components/priceDetail.vue";
    import controller from "common/logic/controller";
    import requesturl from "common/deploy/requesturl";
    import { AllOrderType, ResultCode } from 'common/logic/enum'
    import Page from 'common/deploy/page'
    export default {
        data() {
            return {
                isUseHeader: false,
                setTitleStyle: {
                    isUseH5: true,
                    titlestyle: 3,
                    title: '订单详情'
                },
                pageData: {},
                isShowPrice: false,
                orderDetailList: {},
                timeLimit: '00:00'
            };
        },
        components: {
            Header,
            PriceDetail
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo || {};
                that.pageData = data.data;
                that.getOrderDetail();
            });
        },
        methods: {
            clickBackBtn() {
                controller.close();
            },
            // H5头部回调
            getTitleStyle(titleObj, isTtile) {
                console.log('isTitle:' + isTtile);
                this.isUseHeader = isTtile;
            },
            // 显示、隐藏价格明细
            showPrice() {
                this.isShowPrice = true;
            },
            hidePrice() {
                this.isShowPrice = false;
            },
            // 去支付
            gobuy(channelOrderNo, orderNo){
                var objData = {
                    channelOrderNo: channelOrderNo, 
                    orderNo: orderNo, 
                    orderType: AllOrderType.LUGGAGE
                }
                let payment = Page.commonPage.payment;
                controller.open({
                    winName: payment.winName,
                    path: payment.pageUrl,
                    data: objData,
                    closeLastPage: true
                });
            },
            // 权益券详情参数
            createParams() {
                let that = this;
                return {
                    request: {
                        ffpCardNo: that.memberInfo.memberID,
                        ffpId: that.memberInfo.id,
                        loginKeyInfo: that.memberInfo.loginKeyInfo,
                        orderNo: that.pageData.orderNo,
                        channelOrderNo: that.pageData.channelOrderNo
                    }
                }
            },
            //获取权益券订单详情
            getOrderDetail() {
                let that = this
                if(!that.pageData.orderNo && !that.pageData.channelOrderNo) return
                controller.getJSON({
                        method: 'POST',
                        url: requesturl.BUY_ORDER_DETAIL,
                        params: that.createParams()
                    })
                    .then(that.sucFun)
                    .catch((err) => {
                        controller.toast({
                            str: res.resultInfo
                        });
                    })
            },
            sucFun(res) {
                console.log('权益券订单详情' + JSON.stringify(res));
                if(res.resultCode == ResultCode.SUCCESS) {
                    this.orderDetailList = res.objData.orderList[0];
                    this.timeDown(this.orderDetailList.timeLimit);
                }
            },
            // 申请退款参数
            createRefundParam(channelOrderNo, orderNo, couponCode){
                let that = this;
                return {
                    request: {
                        ffpCardNo: that.memberInfo.memberID,
                        ffpId: that.memberInfo.id,
                        loginKeyInfo: that.memberInfo.loginKeyInfo,
                        channelOrderNo: channelOrderNo,
                        orderNo: orderNo,
                        saleCouponList: [couponCode]
                    }
                }
            },
            // 申请退款
            refund(channelOrderNo, orderNo, couponCode){
                let that = this;
                if(!channelOrderNo || !orderNo || !couponCode) return;
                controller.confirm({
                    title: '提示',
                    message: '确认要申请退款吗？',
                    buttons: ['考虑一下', '确认'],
                    onConfirm() {
                        console.log('refund---');
                        that.refundOrder(channelOrderNo, orderNo, couponCode);
                    }
                })
            },
            // 确认申请退款
            refundOrder(channelOrderNo, orderNo, couponCode){
                let that = this
                controller.getJSON({
                    method: 'POST',
                    url: requesturl.BUY_ORDER_REFUND,
                    params: that.createRefundParam(channelOrderNo, orderNo, couponCode)
                })
                .then((res) => {
                    console.log('申请退款---' + JSON.stringify(res));
                    if(res.resultCode == ResultCode.SUCCESS){
                        console.log('refundOrder');
                        that.getOrderDetail();
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
                            that.getOrderDetail();
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
                            controller.close();
                        } else {
                            controller.toast({
                                str: res.resultInfo
                            });
                        }
                    })
            },
            // 开始倒计时
            timeDown(time) {
                if(!time) {
                    return;
                }
                this.timeLimit = this.dealTime(time);
                if(time > 0) {
                    setTimeout(() => {
                        time -= 1000;
                        if(time > 0) {
                            this.timeDown(time);
                        } else if(time <= 0){
                            this.payTimeOut();
                        }
                    }, 1000);
                } else if(time <= 0) {
                    this.payTimeOut();
                }
            },
            // 处理毫秒值
            dealTime(time) {
                let minute = parseInt(time/1000/60);
                let second = parseInt(time/1000-minute*60);
                minute = this.prefixInteger(minute , 2);
                second = this.prefixInteger(second , 2);
                return minute + ':' + second;
            },
            // 处理分，秒位数
            prefixInteger(num, length) {  
                return (Array(length).join('0') + num).slice(-length);
            },  
        }
    };
</script>

<style lang="scss">
    @import "~common/styles/common/common.scss";
    .main-wrap {
        position: relative;
        width: rem(750);
        min-height: 93%;
        margin: 0 auto;
    }

    .header-wrap {
        padding: 0 rem(30);
        padding-bottom: rem(60);
        box-sizing: border-box;
        background: linear-gradient(180deg, rgba(215, 53, 88, 1) 0%, rgba(196, 51, 100, 1) 100%);
        box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        color: #fff;
        .line-1 {
            margin-top: rem(187);
            line-height: rem(42);
            .text {
                font-size: rem(42);
                font-weight: 600;
                color: #fff;
            }
            .money {
                &>div {
                    display: inline-block;
                }
                text-align: right;
                font-size: 0;
                .num {
                    font-size: rem(42);
                    color: #fff;
                    line-height: 0;
                    vertical-align: middle;
                    ;
                    span {
                        font-size: rem(22);
                    }
                }
                .tip-btn {
                    width: rem(24);
                    height: rem(24);
                    margin-left: rem(8);
                    vertical-align: bottom;
                    @include bg("./img/hasPay_tip.png");
                }
            }
        }
        .line-2 {
            margin-top: rem(30);
            &>.text {
                font-size: rem(22);
                line-height: rem(22);
                color: #fff;
                span {
                    display: inline-block;
                }
                .time {
                    font-weight: bold;
                }
                .icon {
                    width: rem(22);
                    height: rem(22);
                    margin: 0 rem(5);
                    @include bg("./img/readyPay_time.png");
                }
            }
            .rules-btn {
                &>div {
                    display: inline-block;
                }
                font-size: 0;
                line-height: rem(24);
                .text {
                    font-size: rem(22);
                    line-height: 0;
                    vertical-align: middle;
                }
                .img {
                    width: rem(24);
                    height: rem(24);
                    @include bg("./img/hasPay_arrow.png");
                    vertical-align: middle;
                }
            }
        }
        .btn-wrap {
            margin-top: rem(30);
            .btn {
                width: rem(335);
                height: rem(68);
                line-height: rem(68);
                text-align: center;
                @include border-radius(rem(6));
                font-size: rem(28);
                background-color: #fff;
            }
            .cancel-btn {
                margin-right: rem(10);
                color: #848484;
            }
            .pay-btn {
                margin-left: rem(10);
                color: #B82970;
            }
        }
    }

    .content-wrap {
        padding: rem(10) rem(30) rem(60) rem(30);
        .come-style {
            margin-top: rem(20);
            box-shadow: 0px rem(6) rem(10) 0px rgba(0, 0, 0, 0.02);
            @include border-radius(rem(6));
            background-color: #fff;
            overflow: hidden;
        }
        .commodity-wrap {
            .apply {
                position: relative;
                padding: rem(30);
                .left-wrap {
                    display: inline-block;
                    width: rem(434);
                    vertical-align: middle;
                    .name {
                        font-size: rem(28);
                        font-weight: 600;
                        color: #3A3D50;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                    }
                }
                .apply-btn {
                    margin-left: rem(52);
                    position: relative;
                    display: inline-block;
                    width: rem(136);
                    height: rem(50);
                    line-height: rem(50);
                    vertical-align: middle;
                    font-size: rem(26);
                    color: #3A3D50;
                    text-align: center;
                }
            }
            .every-commodity {
                position: relative;
                padding: 0 rem(30);
                height: rem(176);
                overflow: hidden;
                .left-wrap {
                    &>.name {
                        margin-top: rem(30);
                        font-size: rem(28);
                        line-height: rem(28);
                        font-weight: 600;
                        color: #3A3D50;
                    }
                }
                .current-state {
                    line-height: rem(176);
                    font-size: rem(24);
                    color: #848484;
                }
            }
            .detail-infor {
                margin-top: rem(20);
                font-size: rem(24);
                line-height: rem(24);
                .name {
                    width: rem(112);
                    color: #3A3D50;
                }
                .content {
                    color: #848484;
                }
            }
        }
        .contact-infor {
            overflow: hidden;
            padding: rem(30);
            padding-top: 0;
            .every-infor {
                margin-top: rem(30);
                font-size: rem(28);
                line-height: rem(28);
                .name {
                    width: rem(152);
                    font-weight: 600;
                    color: #3A3D50;
                }
                .content {
                    color: #3A3D50;
                }
            }
        }
        .order-infor {
            padding: rem(30);
            .every-order-infor {
                font-size: rem(28);
                line-height: rem(28);
                color: #3A3D50;
                .name {
                    font-weight: 600;
                    width: rem(152);
                }
            }
            .order-time {
                margin-top: rem(30);
            }
        }
    }

    .delete-btn {
        position: absolute;
        bottom: rem(-24);
        left: 0;
        width: rem(750);
        text-align: center;
        font-size: 0;
        &>div {
            display: inline-block;
        }
        .img {
            width: rem(24);
            height: rem(24);
            @include bg("./img/hasPay_delete.png");
            vertical-align: middle;
        }
        .text {
            margin-left: rem(10);
            font-size: rem(24);
            color: #848484;
            vertical-align: middle;
            line-height: 0;
        }
    }

    .com-border-bottom {
        @include bd-bottom(#f4f4f4);
    }

    .com-border {
        @include border(#CCCCCC, rem(6));
    }

    .style-ios {
        .com-border-bottom {
            @include bd-bottom-ios(#f4f4f4);
        }
        .com-border {
            @include border-ios(#CCCCCC, rem(6));
        }
    }
</style>
