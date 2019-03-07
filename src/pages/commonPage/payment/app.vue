<template>
    <div id="app">
        <PayType :detailInfor="detailInfor" :orderTotalAmount="orderTotalAmount" :pageData="pageData" :memberInfo="memberInfo" @clickBackBtn="clickBackBtn" @paySuccess="paySuccess" @payError="payError">
            <div class="goods-list borderRadius">
                <div class="commodity-name com-border-bottom">
                    <div class="name">{{detailInfor.orderName}}</div>
                    <div class="date">有效期&nbsp;&nbsp;{{detailInfor.startDate}}至{{detailInfor.endDate}}</div>
                </div>
                <transition name="money-infor">
                    <div class="money-infor" v-show="showDetail">
                        <p class="title com-border-bottom">
                            <span>{{detailInfor.orderName}}</span>
                            <span class="unit_price">￥{{detailInfor.price}} x {{detailInfor.saleCouponCount}}</span>
                        </p>
                        <ul class="com-border-bottom">
                            <li>
                                <p>
                                    <span class="name">积分抵扣</span>
                                    <span class="unit_price">
                                                        -&yen;
                                                        <font>{{detailInfor.ffpUseTotalScore}}</font>
                                                    </span>
                                </p>
                            </li>
                        </ul>
                    </div>
                </transition>
                <time-down :timeDownInfor="timeDownInfor" @timeOut="payTimeOut" @displayDetail="displayDetail"></time-down>
            </div>
        </PayType>
    </div>
</template>

<script>
    import "common/tools/rem";
    import controller from "common/logic/controller";
    import requesturl from "common/deploy/requesturl";
    import PayType from "components/payType.vue";
    import TimeDown from "components/timeDown.vue";
    import Page from "common/deploy/page";
    import {
        PayRes,
        PayInfo,
        ResultCode,
        Verify
    } from "common/logic/enum";
    export default {
        data() {
            return {
                detailInfor: {},
                // 总价
                orderTotalAmount: 0,
                timeDownInfor: {
                    money: "",
                    timeStamp: "",
                    showDetail: false
                },
                showDetail: false,
                pageData: {},
                memberInfo: {}
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                console.log(that.pageData);
                that.getOrderDetail();
            });
        },
        methods: {
            // 支付成功
            paySuccess() {
                let successPage = Page.commonPage.payResult;
                controller.open({
                    winName: successPage.winName,
                    path: successPage.pageUrl,
                    data: {
                        type: PayRes.PAY_SUC,
                        resultData: PayInfo.PAY_SUC,
                        channelOrderNo: this.pageData.channelOrderNo,
                        orderNo: this.pageData.orderNo
                    },
                    closeLastPage: true
                });
            },
            // 支付失败
            payError() {
                let failPage = Page.commonPage.payResult;
                controller.open({
                    winName: failPage.winName,
                    path: failPage.pageUrl,
                    data: {
                        type: PayRes.PAY_FAIL,
                        resultData: PayInfo.PAY_FAIL,
                        channelOrderNo: this.pageData.channelOrderNo,
                        orderNo: this.pageData.orderNo
                    },
                    closeLastPage: true
                });
            },
            // 支付超时
            payTimeOut() {
                let failPage = Page.commonPage.payResult;
                controller.open({
                    winName: failPage.winName,
                    path: failPage.pageUrl,
                    data: {
                        type: PayRes.PAY_TIMEOUT,
                        resultData: PayInfo.PAY_TIMEOUT,
                        channelOrderNo: this.pageData.channelOrderNo,
                        orderNo: this.pageData.orderNo
                    },
                    closeLastPage: true
                });
            },
            // 点击返回按钮
            clickBackBtn() {
                let orderDetailPage = Page.orderDetail.cabinTicketDetail;
                let data = {
                    channelOrderNo: this.pageData.channelOrderNo,
                    orderNo: this.pageData.orderNo
                }
                controller.open({
                    winName: orderDetailPage.winName,
                    path: orderDetailPage.pageUrl,
                    data: data,
                    closeLastPage: true
                });
            },
            // 点击详细信息
            displayDetail(isDetail) {
                this.showDetail = isDetail;
            },
            // 请求行李额订单详情
            getOrderDetail() {
                const that = this;
                controller
                    .getJSON({
                        method: "POST",
                        url: requesturl.BUY_ORDER_DETAIL,
                        params: that.createParams_1()
                    })
                    .then(that.sucCallback_1)
                    .catch(that.errCallback_1);
            },
            createParams_1() {
                return {
                    request: {
                        channelOrderNo: this.pageData.channelOrderNo,
                        ffpCardNo: this.memberInfo.memberID,
                        ffpId: this.memberInfo.id,
                        loginKeyInfo: this.memberInfo.loginKeyInfo,
                        orderNo: this.pageData.orderNo
                    }
                };
            },
            sucCallback_1(result) {
                if (result.resultCode == ResultCode.SUCCESS) {
                    let objData = result.objData;
                    this.detailInfor = objData.orderList[0];
                    this.orderTotalAmount = this.detailInfor.orderTotalAmount;
                    this.timeDownInfor = {
                        money: this.detailInfor.orderTotalAmount,
                        timeStamp: this.detailInfor.timeLimit,
                        showDetail: this.showDetail
                    };
                } else {
                    controller.toast({
                        str: result.resultInfo
                    });
                }
            },
            errCallback_1() {
                controller.toast({
                    str: Verify.BACK_ERR.toastDetailsFail
                });
            }
        },
        components: {
            PayType,
            TimeDown
        }
    };
</script>

<style lang="scss" scoped>
    @import "~common/styles/common/function.scss";
    @import "~common/styles/common/common.scss";
    @import "~common/styles/common/mixin/layout.tlx";
    .money-infor {
        overflow: hidden;
        height: rem(184);
    }
    .commodity-name {
        position: relative;
        height: rem(112);
        padding: 0 rem(30);
        overflow: hidden;
        .name {
            margin-top: rem(22);
            font-size: rem(22);
            line-height: rem(22);
            font-weight: 600;
            color: #3A3D50;
        }
        .date {
            margin-top: rem(14);
            font-size: rem(22);
            line-height: rem(28);
            color: #848484;
        }
    }
    p.title {
        position: relative;
    }
    ul {
        position: relative;
    }
    .goods-list {
        margin: rem(20) 0 rem(33);
        background-color: #fff;
        @include border-radius(rem(6));
    }
    .goods-list .title {
        height: rem(40);
        font-size: rem(26);
        color: rgba(37, 41, 47, 1);
        line-height: rem(40);
        padding: rem(30);
    }
    .goods-list .unit_price {
        float: right;
    }
    .goods-list ul {
        padding: rem(10) rem(30);
    }
    .goods-list ul li {
        margin: rem(20) 0;
        border-bottom: 0;
    }
    .goods-list ul li p {
        font-size: rem(24);
        color: rgba(132, 132, 132, 1);
        line-height: rem(24);
    }
    .goods-list ul li p span {
        display: inline-block;
    }
    .goods-list ul .name {
        max-width: rem(500);
    }
    .goods-list ul .unit_price {
        float: right;
    }
    .com-border-bottom {
        @include bd-bottom(#f4f4f4);
    }
    .style-ios {
        .com-border-bottom {
            @include bd-bottom-ios(#f4f4f4);
        }
    }
    .money-infor-enter-active,
    .money-infor-leave-active {
        transition: height .3s
    }
    .money-infor-enter,
    .money-infor-leave-to {
        height: 0px;
    }
</style>
