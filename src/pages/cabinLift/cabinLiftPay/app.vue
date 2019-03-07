<template>
    <div id="app">
        <PayType :detailInfor="detailInfor" :orderTotalAmount="detailInfor.actualAmount" :pageData="pageData" :memberInfo="memberInfo" @clickBackBtn="clickBackBtn" @paySuccess="paySuccess" @payError="payError">
            <div class="order-detail">
                <div class="commodity-detail com-border-bottom">
                    <div class="plane flexbox">
                        <div class="place">{{flightInfor.depCityName}}-{{flightInfor.arrCityName}}</div>
                        <div class="plane-num">{{flightInfor.carrierFlightNo}}</div>
                    </div>
                    <div class="cabin">{{flightInfor.formatCabinClassName}}({{flightInfor.formatCabinClass}})-{{flightInfor.cabinClassName}}({{flightInfor.cabinClass}})</div>
                    <div class="date" v-if="flightInfor.depDateTime">{{flightTime(flightInfor.depDateTime,flightInfor.arrDateTime)}}</div>
                </div>
                <transition name="money-infor">
                    <div class="hidden-wrap" v-show="showDetail">
                        <div class="commodity-title flexbox com-border-bottom">
                            <div class="name flex-1">升舱差价</div>
                            <div class="content"><span>&yen;</span>{{totalPrice}}</div>
                        </div>
                        <div class="score flexbox com-border-bottom">
                            <div class="name flex-1">积分抵扣</div>
                            <div class="content"><span>-&yen;</span>{{detailInfor.useScore}}</div>
                        </div>
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
    import {dateFormat} from "common/logic/utils.js";
    import Page from "common/deploy/page";
    import {
        ResultCode,
        Verify,
        AllOrderPayType
    } from "common/logic/enum";
    export default {
        data() {
            return {
                // 页面请求的数据
                detailInfor: {},
                detailSrc: false,
                pageData: {},
                memberInfo: {},
                timeDownInfor: {
                    money: "",
                    timeStamp: "",
                    showDetail: false
                },
                showDetail: false,
                // 航班信息
                flightInfor: {}
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                // that.pageData = {
                //     channelOrderNo: "N2018122020372085827",
                //     orderNo: "ORD18122000014769",
                //     orderType: "flightOrder",
                //     payState: false
                // }
                that.getOrderDetail();
            });
        },
        methods: {
            // 支付成功
            paySuccess() {
                let successPage = Page.myOrder.paySuccess;
                controller.open({
                    winName: successPage.winName,
                    path: successPage.pageUrl,
                    data: {
                        transOrderType: "upCabin",
                        channelOrderNo: this.pageData.channelOrderNo,
                        orderNo: this.pageData.orderNo
                    },
                    closeLastPage: true 
                });
            },
            // 支付失败
            payError() {
                let failPage = Page.myOrder.payError;
                controller.open({
                    winName: failPage.winName,
                    path: failPage.pageUrl,
                    data: {
                        transOrderType: "upCabin",
                        channelOrderNo: this.pageData.channelOrderNo,
                        orderNo: this.pageData.orderNo
                    },
                    closeLastPage: true
                });
            },
            // 支付超时
            payTimeOut() {
                let failPage = Page.myOrder.payLongTime;
                controller.open({
                    winName: failPage.winName,
                    path: failPage.pageUrl,
                    data: {
                        transOrderType: "upCabin",
                        channelOrderNo: this.pageData.channelOrderNo,
                        orderNo: this.pageData.orderNo
                    },
                    closeLastPage: true
                });
            },
            // 点击返回按钮
            clickBackBtn() {
                let orderDetailPage = Page.orderDetail.ticketOrderDetail;
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
            // 航班时间
            flightTime(depTime, arrTime) {
                return depTime.slice(5)+" 至 "+arrTime.slice(5);
            },
            formaIOSDate(date) {
                var sDate, sTime, oDate;
                var y ,M ,d ,h , m ,s ;
                if ((typeof date) != 'string') return false;
                sDate = date.split('-');
                if (date.indexOf(' ') >= 0) {
                    var spt = date.split(' ');
                    sDate = spt[0].split('-');
                    sTime = spt[1].split(':');
                    h = sTime[0] ? sTime[0] : '';
                    m = sTime[1] ? sTime[1] : '';
                    s = sTime[2] ? sTime[2] : '';
                }
                y = sDate[0];
                M = sDate[1] - 1;
                d = sDate[2];
                return new Date(y, M, d, h, m, s);
            },
            // 点击详细信息
            displayDetail(isDetail) {
                this.showDetail = isDetail;
            },
            // 点击更多按钮
            changeMore() {
                if (this.detailSrc) {
                    this.detailSrc = false;
                } else {
                    this.detailSrc = true;
                }
            },
            // 请求升舱订单详情
            getOrderDetail() {
                const that = this;
                controller
                    .getJSON({
                        method: "POST",
                        url: requesturl.MY_ORDER.PLANE_ORDER_DETAIL,
                        oldParams: that.createParams_1()
                    })
                    .then(that.sucCallback_1);
                    // .catch(that.errCallback_1);
            },
            createParams_1() {
                return {
                    "channelOrderNo": this.pageData.channelOrderNo,
                    "orderNo": this.pageData.orderNo,
                    "customerNo": this.memberInfo.id,
                    "cardNo": "HO" + this.memberInfo.memberID,
                    "loginKeyInfo": this.memberInfo.loginKeyInfo
                };
            },
            sucCallback_1(result) {
                if (result.resultCode == ResultCode.SUCCESS) {
                    this.detailInfor = result;
                    this.flightInfor = this.getUpcabinFlight(result.orderPassengerInfoList[0].segmentPriceInfoList);
                    this.timeDownInfor = {
                        money: result.actualAmount,
                        timeStamp: result.orderRemainTime,
                        showDetail: false
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
            },
            // 取升舱的航班
            getUpcabinFlight(flightList) {
                for(let i=0; i< flightList.length; i++) {
                    if(flightList[i].changeFlag) {
                        return flightList[i];
                    }
                }
            }
        },
        components: {
            PayType,
            TimeDown
        },
        computed: {
            // 升舱差价
            totalPrice() {
                if(!this.detailInfor.actualAmount) {
                    return 0;
                }
                return parseFloat(this.detailInfor.actualAmount) + parseFloat(this.detailInfor.useScore);
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "~common/styles/common/function.scss";
    @import "~common/styles/common/common.scss";
    .order-detail {
        background-color: #fff;
        @include border-radius(rem(6));
        box-shadow: 0px rem(6) rem(10) 0px rgba(0, 0, 0, 0.02);
        .commodity-detail {
            position: relative;
            height: rem(178);
            padding: 0 rem(30);
            overflow: hidden;
            .plane {
                margin-top: rem(30);
                &>div {
                    background: linear-gradient(324deg, rgba(225, 185, 113, 1) 0%, rgba(227, 205, 158, 1) 100%);
                    @include border-radius(rem(4));
                    padding: rem(2) rem(8);
                    font-size: rem(24);
                    font-weight: 600;
                    line-height: rem(24);
                    color: #fff;
                }
                .plane-num {
                    margin-left: rem(10);
                }
            }
            .cabin {
                margin-top: rem(20);
                font-size: rem(28);
                font-weight: 600;
                line-height: rem(28);
                color: #3A3D50;
            }
            .date {
                margin-top: rem(14);
                font-size: rem(22);
                line-height: rem(28);
                color: #848484;
            }
        }
        .hidden-wrap {
            height: rem(184);
            overflow: hidden;
            &>div {
                position: relative;
                padding: 0 rem(30);
            }
            .commodity-title {
                height: rem(100);
                line-height: rem(100);
                font-size: rem(26);
                color: #25292F;
                .content {
                    span {
                        font-size: rem(22);
                    }
                }
            }
            .score {
                height: rem(84);
                line-height: rem(84);
                font-size: rem(24);
                color: #848484;
                .content {
                    span {
                        font-size: rem(20);
                    }
                }
            }
        }
        .time-down {
            padding: 0 rem(30);
            height: rem(112);
            overflow: hidden;
            .line-1 {
                margin-top: rem(22);
                font-size: rem(28);
                line-height: rem(28);
                .money {
                    font-weight: 600;
                    .name {
                        color: #3A3D50;
                    }
                    .content {
                        margin-left: rem(16);
                        color: #CB9D6D;
                    }
                }
                .detial-btn {
                    color: #848484;
                    span {
                        display: inline-block;
                    }
                    .name {
                        vertical-align: middle;
                    }
                    .img {
                        margin-left: rem(10);
                        width: rem(20);
                        height: rem(15);
                        vertical-align: middle;
                        @include bg("./img/icon_up.png");
                    }
                }
            }
            .line-2 {
                margin-top: rem(14);
                font-size: rem(22);
                line-height: rem(22);
                color: #848484;
                span {
                    display: inline-block;
                    vertical-align: middle;
                }
                .img {
                    margin: 0 rem(5);
                    width: rem(22);
                    height: rem(22);
                    @include bg("./img/icon_clock.png");
                }
                .time {
                    color: #CB9D6D;
                }
            }
        }
    }
    .com-border-bottom {
        @include bd-bottom(#f4f4f4);
    }
    .style-ios {
        .com-border-bottom {
            @include bd-bottom-ios(#f4f4f4);
        }
    }
    .money-infor-enter-active,.money-infor-leave-active {
        transition: all .3s;
    }
    .money-infor-enter,.money-infor-leave-to {
        height: 0px!important;
    }
</style>
