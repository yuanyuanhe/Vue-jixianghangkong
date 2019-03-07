<template>
    <div id="app">
        <PayType :detailInfor="detailInfor" :orderTotalAmount="orderTotalAmount" :pageData="pageData" :memberInfo="memberInfo"  @paySuccess="paySuccess" @payError="payError">
            <div class="slotBox">
                <div class="legItem" v-for="(item, index) in changeInfor" :key="index">
                    <div class="ow-main">
                        <div class="ow-hd">
                            <div class="hdBox flexbox">
                                <div class="hd-info flex-1">
                                    <span>改期</span>
                                    <span>{{ turnTime(item.depDateTime, 'YYYY-MM-DD dd') }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="ow-bd">
                            <div class="bdDay"></div>
                            <div class="bdBox flexbox">
                                <div class="bdBoxItem bdBoxItem1 flex-1">
                                    <div class="bdBox-date">{{ turnTime(item.depDateTime, 'hh:mm') }}</div>
                                    <div class="bdBox-txt">{{ item.depCityName ? item.depCityName : '' }}{{ item.depAirportName ? item.depAirportName
                                            : '' }}{{ item.depTerm == '--' || item.depTerm == null ? '' : item.depTerm }}</div>
                                </div>
                                <div class="bdBoxItem flex-1">
                                    <div class="bdBox-time">{{ dealFlyTime(item.flightTime) }}</div>
                                    <div class="bdBox-img"></div>
                                    <div class="bdBox-stop"></div>
                                </div>
                                <div class="bdBoxItem bdBoxItem2 flex-1">
                                    <div class="bdBox-date">{{ turnTime(item.arrDateTime, 'hh:mm') }}</div>
                                    <div class="bdBox-txt">{{ item.arrCityName ? item.arrCityName : '' }}{{ item.arrAirportName ? item.arrAirportName
                                            : '' }}{{ item.arrTerm == '--' || item.arrTerm == null ? '' : item.arrTerm }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="moneyBox">
                    <transition name="money-infor">
                        <div class="moneyInfo" v-if="isArrowDetail">
                            <div class="mnItem" v-for="(item, index) in people" :key="index">
                                <div class="mnItem-hd flexbox" v-show="item.total">
                                    <span class="mnItemTitle flex-1">{{ item.title }}</span>
                                    <span class="mnItemMoney">&yen;{{ item.total }} x {{ item.count }}人</span>
                                </div>
                                <div class="mnItem-bd" v-show="item.ticket || item.upgradeFee || item.yqtax || item.cntax || item.otherTax">
                                    <p class="flexbox" v-show="item.ticket">
                                        <span class="flex-1">票价差额</span>
                                        <span>&yen;{{ item.ticket }}</span>
                                    </p>
                                    <p class="flexbox" v-show="item.upgradeFee">
                                        <span class="flex-1">手续费</span>
                                        <span>&yen;{{ item.upgradeFee }}</span>
                                    </p>
                                    <p class="flexbox" v-if="detailInfor.interFlag == 'D' && item.yqtax">
                                        <span class="flex-1">燃油</span>
                                        <span>&yen;{{ item.yqtax }}</span>
                                    </p>
                                    <p class="flexbox" v-if="detailInfor.interFlag == 'D' && item.cntax">
                                        <span class="flex-1">机建</span>
                                        <span>&yen;{{ item.cntax }}</span>
                                    </p>
                                    <p class="flexbox" v-if="detailInfor.interFlag == 'I' && item.otherTax">
                                        <span class="flex-1">税费</span>
                                        <span>&yen;{{ item.otherTax }}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <time-down :timeDownInfor="timeDownInfor" @timeOut="payTimeOut" @displayDetail="displayDetail"></time-down>                
                </div>
            </div>
        </PayType>
    </div>
</template>

<script>
    import "common/tools/rem";
    import PayType from "components/payType.vue";
    import TimeDown from "components/timeDown.vue";
    import controller from "common/logic/controller";
    import requesturl from "common/deploy/requesturl";
    import Page from "common/deploy/page";
    import {
        dateFormat
    } from "common/logic/utils";
    import {
        ResultCode,
        Verify,
        AllOrderPayType,
        PayRes,
        PayInfo,
        PsgType
    } from "common/logic/enum";
    export default {
        data() {
            return {
                dateFormat: dateFormat,
                // 页面请求的数据
                detailInfor: {},
                // 改期所需数据
                changeInfor: [],
                // 明细
                priceDetail: [],
                isArrowDetail: false,
                // 倒计时信息
                timeDownInfor: {
                    money: "",
                    timeStamp: "",
                    showDetail: false
                },
                // 总价
                orderTotalAmount: 0,
                people: [],
                // 成人数量
                actualNum: 0,
                childNum: 0,
                babyNum: 0,
                policeNum: 0
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                console.log(that.pageData);
                that.getOrderDetail();
                controller.clickBack(() => {
                    that.clickBackBtn();
                });
            });
        },
        methods: {
            // 点击返回按钮
            clickBackBtn() {
                let orderDetailPage = Page.orderDetail.ticketOrderDetail;
                let data = {
                    channelOrderNo: this.pageData.channelOrderNo,
                    orderNo: this.pageData.orderNo,
                    orderType: AllOrderPayType.PLANE
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
                if(this.orderTotalAmount) {
                    this.isArrowDetail = isDetail;
                }
            },
            
            // 请求改期订单详情
            getOrderDetail() {
                const that = this;
                controller
                    .getJSON({
                        method: "POST",
                        url: requesturl.MY_ORDER.PLANE_ORDER_DETAIL,
                        oldParams: that.createParams()
                    })
                    .then(that.sucFun);
            },
            createParams() {
                return {
                    channelOrderNo: this.pageData.channelOrderNo,
                    orderNo: this.pageData.orderNo,
                    customerNo: this.memberInfo.id,
                    cardNo: "HO" + this.memberInfo.memberID,
                    loginKeyInfo: this.memberInfo.loginKeyInfo
                };
            },
            sucFun(res) {
                let that = this;
                console.log(res);
                if (res.resultCode == ResultCode.SUCCESS) {
                    this.detailInfor = res;
                    this.orderTotalAmount = res.actualAmount
                    this.changeInfor = res.orderPassengerInfoList[0].segmentPriceInfoList;
                    let priceDetail = res.orderPassengerInfoList
                    // ADT － 成人，CHD － 儿童，INF － 婴儿
                    for(let i = 0; i < priceDetail.length; i++) {
                        if(priceDetail[i].passengerType == PsgType.ADULT) {
                            that.actualNum++
                            this.people[0] = {
                                title: '成人票',
                                count: that.actualNum,
                                total: priceDetail[i].pricePaid + priceDetail[i].yqtax + priceDetail[i].cntax + priceDetail[i].otherTax + priceDetail[i].qfee,
                                ticket: priceDetail[i].pricePaid - priceDetail[i].upgradeFee,
                                upgradeFee: priceDetail[i].upgradeFee,
                                yqtax: priceDetail[i].yqtax,
                                cntax: priceDetail[i].cntax,
                                otherTax: priceDetail[i].otherTax
                            }
                        } else if(priceDetail[i].passengerType == PsgType.CHILD) {
                            that.childNum++
                            this.people[1] = {
                                title: '儿童票',
                                count: that.childNum,
                                total: priceDetail[i].pricePaid + priceDetail[i].yqtax + priceDetail[i].cntax + priceDetail[i].otherTax + priceDetail[i].qfee,
                                ticket: priceDetail[i].pricePaid - priceDetail[i].upgradeFee,
                                upgradeFee: priceDetail[i].upgradeFee,
                                yqtax: priceDetail[i].yqtax,
                                cntax: priceDetail[i].cntax,
                                otherTax: priceDetail[i].otherTax
                            }
                        } else if(priceDetail[i].passengerType == PsgType.BABY) {
                            that.babyNum++
                            this.people[2] = {
                                title: '婴儿票',
                                count: that.babyNum,
                                total: priceDetail[i].pricePaid + priceDetail[i].yqtax + priceDetail[i].cntax + priceDetail[i].otherTax + priceDetail[i].qfee,
                                ticket: priceDetail[i].pricePaid - priceDetail[i].upgradeFee,
                                upgradeFee: priceDetail[i].upgradeFee,
                                yqtax: priceDetail[i].yqtax,
                                cntax: priceDetail[i].cntax,
                                otherTax: priceDetail[i].otherTax
                            }
                        } else if(priceDetail[i].passengerType == PsgType.POLICE) {
                            that.policeNum++
                            this.people[3] = {
                                title: '军残警残票',
                                count: that.policeNum,
                                total: priceDetail[i].pricePaid + priceDetail[i].yqtax + priceDetail[i].cntax + priceDetail[i].otherTax + priceDetail[i].qfee,
                                ticket: priceDetail[i].pricePaid - priceDetail[i].upgradeFee,
                                upgradeFee: priceDetail[i].upgradeFee,
                                yqtax: priceDetail[i].yqtax,
                                cntax: priceDetail[i].cntax,
                                otherTax: priceDetail[i].otherTax
                            }
                        }
                        // 总价/票价差额/手续费/燃油/机建/税费
                    }
                    console.log(this.people);
                    this.timeDownInfor = {
                        money: res.actualAmount,
                        timeStamp: res.orderRemainTime,
                        showDetail: false
                    };
                } else {
                    controller.toast({
                        str: res.resultInfo
                    });
                }
            },
            errCallback_1() {
                controller.toast({
                    str: Verify.BACK_ERR.toastDetailsFail
                });
            },
            // 支付成功
            paySuccess() {
                let successPage = Page.myOrder.paySuccess;
                controller.open({
                    winName: successPage.winName,
                    path: successPage.pageUrl,
                    data: {
                        transOrderType: "changeDate",
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
                        transOrderType: "changeDate",
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
                        transOrderType: "changeDate",
                        channelOrderNo: this.pageData.channelOrderNo,
                        orderNo: this.pageData.orderNo
                    },
                    closeLastPage: true
                });
            },
            
            // 时间戳差转时间 12h12m
            dealFlyTime(time) {
                let hour = parseInt(time / 1000 / 60 / 60);
                let minute = parseInt((time - hour * 60 * 60 * 1000) / 1000 / 60);
                return hour + 'h' + minute + 'm';
            },
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
                }
            }
        },
        components: {
            PayType,
            TimeDown
        }
    };
</script>

<style lang="scss">
    @import "~common/styles/common/common.scss";
    @import '~common/styles/changeDate.scss';
    .moneyBox {
        margin-bottom: rem(20);
        background: #fff;
        @include border-radius(rem(6));
        .moneyInfo {
            background: #fff;
            overflow: hidden;
            .mnItem {
                @include bd-bottom(#F4F4F4);
                .style-ios & {
                    @include bd-bottom-ios(#F4F4F4);
                }
                .mnItem-hd {
                    font-size: rem(26);
                    color: #25292F;
                    line-height: rem(40);
                    padding: rem(30);
                    @include bd-bottom(#F4F4F4);
                    .style-ios & {
                        @include bd-bottom-ios(#F4F4F4);
                    }
                }
                .mnItem-bd {
                    font-size: rem(24);
                    color: #848484;
                    padding: 0 rem(30) rem(20);
                    p {
                        line-height: rem(24);
                        margin-top: rem(20);
                    }
                }
            }
        }
    }
    
    .money-infor-enter-active,.money-infor-leave-active {
        transition: all .3s;
    }
    .money-infor-enter,.money-infor-leave-to {
        height: 0px!important;
    }
</style>
