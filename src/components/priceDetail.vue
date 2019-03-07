<template>
    <transition name='rules-page'>
        <div class="main mainNot">
            <div class="page-content">
                <div class="header">价格明细</div>
                <div class="content">
                    <div class="commodity-price com-border-bottom flexbox" v-if="!orderDetail.flightTicket && !orderDetail.changeDate && !orderDetail.upCabin">
                        <div class="name flex-1">{{ orderDetail.orderName }}</div>
                        <div class="price">&yen;{{ orderDetail.price }}x {{ orderDetail.saleCouponCount }}</div>
                    </div>
                    <!-- 升舱 -->
                    <div class="commodity-price com-border-bottom flexbox" v-if="orderDetail.upCabin">
                        <div class="name flex-1">{{ orderDetail.orderName }}</div>
                        <div class="price">{{ orderDetail.orderContent }}</div>
                    </div>
                    <!-- 改期 -->
                    <div v-if="orderDetail.changeDate">
                        <div class="flight-plane" :class="{'first-flight-plane': index==0}" v-for="(item,index) in orderDetail.changeDate" :key="'change'+index">
                            <div class="commodity-price com-border-bottom flexbox">
                                <div class="name flex-1">{{ item.chName }}</div>
                                <div class="price">&yen;{{ item.totalPrice }}x {{ item.count }}</div>
                            </div>
                            <div class="plane-detail com-border-bottom">
                                <div class="every-detail flexbox">
                                    <div class="name flex-1">票价差额</div>
                                    <div class="price ">&yen;{{item.ticketPrice}} x {{ item.count }}</div>
                                </div>
                                <div class="every-detail flexbox">
                                    <div class="name flex-1">手续费</div>
                                    <div class="price ">&yen;{{item.poundage}} x {{ item.count }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 机票 -->
                    <div v-if="orderDetail.flightTicket">
                        <div class="flight-plane" :class="{'first-flight-plane': index==0}" v-for="(item,index) in orderDetail.flightTicket" :key="'flight'+index">
                            <div class="commodity-price com-border-bottom flexbox">
                                <div class="name flex-1">{{ item.chName }}</div>
                                <div class="price">&yen;{{ item.totalPrice}}x {{ item.count }}</div>
                            </div>
                            <div class="plane-detail com-border-bottom">
                                <div class="every-detail flexbox">
                                    <div class="name flex-1">机票</div>
                                    <div class="price ">&yen;{{item.pricePaid}} x {{ item.count }}</div>
                                </div>
                                <div class="every-detail flexbox">
                                    <div class="name flex-1">税费</div>
                                    <div class="price ">&yen;{{item.taxPrice}} x {{ item.count }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="add-service">
                        <div class="insurance" v-if="orderDetail.insuranceList">
                            <div class="every-service flexbox com-border-bottom" v-for="(item,index) in orderDetail.insuranceList" :key="'insurance'+index">
                                <div class="name flex-1">{{item.insuranceName}}</div>
                                <div class="price ">&yen;{{item.insuranceAmount}} x {{item.insuranceNumber}}</div>
                            </div>
                        </div>
                        <div class="luggage" v-if="orderDetail.baggageBuyList">
                            <div class="every-service flexbox com-border-bottom" v-for="(item,index) in orderDetail.baggageBuyList" :key="'luggage'+index">
                                <div class="name flex-1">逾重行李-{{parseInt(item.weightNum) || 0}}{{item.weightUnite}}</div>
                                <div class="price">&yen;{{parseInt(item.weightOrderAmount) || 0}} x 1</div>
                            </div>
                        </div>
                        <div class="lounge" v-if="orderDetail.loungeBuyList">
                            <div class="every-service flexbox com-border-bottom" v-for="(item,index) in orderDetail.loungeBuyList" :key="'lounge'+index">
                                <div class="name flex-1">贵宾休息室-15KG</div>
                                <div class="price">&yen;{{item.loungeAmount}} x 1</div>
                            </div>
                        </div>
                        <div class="wifi" v-if="orderDetail.wifiBuyList">
                            <div class="every-service flexbox com-border-bottom" v-for="(item,index) in orderDetail.wifiBuyList" :key="'luggage'+index">
                                <div class="name flex-1">境外wifi</div>
                                <div class="price">&yen;{{item.orderAmount }} x {{item.purchaseQuantity}}</div>
                            </div>
                        </div>
                        <div class="voucher" v-if="orderDetail.tripCertSendInfo">
                            <div class="every-service flexbox com-border-bottom">
                                <div class="name flex-1">报销凭证</div>
                                <div class="price">&yen;{{orderDetail.tripCertSendInfo.deliveryFee}} x 1</div>
                            </div>
                        </div>
                    </div>
                    <div class="coupon flexbox" v-if="orderDetail.couponAmount">
                        <div class="name flex-1">优惠券优惠</div>
                        <div class="price">-&yen;{{orderDetail.couponAmount}}</div>
                    </div>
                    <div class="score flexbox" v-if="orderDetail.ffpUseTotalScore">
                        <div class="name flex-1">积分抵扣</div>
                        <div class="num">-&yen;{{ orderDetail.ffpUseTotalScore }}</div>
                    </div>
                </div>
                <div class="footer ">
                    <div class="total-price flexbox">
                        <div class="name flex-1">总计费用：</div>
                        <div class="price">&yen;<span class="count">{{ orderDetail.orderTotalAmount }}</span></div>
                    </div>
                </div>
            </div>
            <div class="close-btn" @click="closePage"></div>
        </div>
    </transition>
</template>

<script>
    import controller from 'common/logic/controller'
    export default {
        props: {
            orderDetail: {
                type: Object,
                default: {}
            },
            isShow: {
                type: Boolean,
                default: false
            },
            // 是否显示头部
            isShowBar: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            closePage() {
                this.$emit('hidePrice');
                if (this.isShowBar) {
                    controller.showBar(1);
                }
            },
            // 处理机票数据
            dealFlightTicket(flightTicket) {
                let flightTickObj = {};
                let flightTickArr = [];
                for (let i = 0; i < flightTicket.length; i++) {
                    let key = flightTicket[i].passengerType;
                    if (flightTickObj[key]) {
                        flightTickObj[key].count = ++flightTickObj[key].count;
                    } else {
                        flightTickObj[key] = flightTicket[i];
                        flightTickObj[key].count = 1;
                        flightTickObj[key].chName = this.judgeUsrType(flightTicket[i].passengerType)
                    }
                }
                for (var key in flightTickObj) {
                    flightTickArr.push(flightTickObj[key]);
                }
                console.log(flightTickArr);
                this.newFlightTicke = flightTickArr;
            },
            /**乘客类型**/
            judgeUsrType(u) {
                var passengerName = "";
                switch (u) {
                    case 'ADT':
                        passengerName = "成人";
                        break;
                    case 'CHD':
                        passengerName = "儿童";
                        break;
                    case 'INF':
                        passengerName = "婴儿";
                        break;
                    default:
                        passengerName = "无";
                        break;
                }
                return passengerName;
            }
        },
        watch: {
            isShow(newVal, oldVal) {
                console.log('newVal:' + newVal + ' oldVal:' + oldVal);
                if (newVal && this.isShowBar) {
                    controller.hiddenBar(1);
                }
            },
            orderDetail: {
                handler(newVal, oldVal) {
                    if (newVal.flightTicket) {
                    }
                },
                deep: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../common/styles/common/_mixin.scss';
    @import '../common/styles/common/function.scss';
    .main {
        background: #fff;
        z-index: 100;
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
    }
    body.style-ios {
        .main.mainNot,
        .rule-main {
            padding-top: rem(40);
        }
        .page-content {
            top: rem(40);
        }
    }
    @supports (top: constant(safe-area-inset-top)) or (top: env(safe-area-inset-top)) {
        body.style-ios .main.mainNot,
        body.style-ios .rule-main {
            padding-top: calc(0.2rem + constant(safe-area-inset-top)) !important;
            padding-top: calc(0.2rem + env(safe-area-inset-top)) !important;
        }
    }
    .rules-page-enter-active,
    .rules-page-leave-active {
        transition: all 0.5s
    }
    .rules-page-enter,
    .rules-page-leave-to {
        transform: translate3d(0, 100%, 0)
    }
    .page-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: rem(200);
        padding: 0 rem(30);
        .header {
            margin-top: rem(81);
            font-size: rem(32);
            line-height: rem(32);
            color: #25292F;
            text-align: center;
        }
        .content {
            position: absolute;
            top: rem(194);
            bottom: rem(100);
            left: 0;
            right: 0;
            padding: 0 rem(30);
            overflow: scroll;
            -webkit-overflow-scrolling: touch;
            .flight-plane {
                margin-top: rem(36);
                &.first-flight-plane {
                    margin-top: 0;
                }
            }
            .commodity-price {
                position: relative;
                padding-bottom: rem(36);
                font-size: rem(26);
                line-height: rem(26);
                color: #25292F;
            }
            .plane-detail {
                position: relative;
                padding-bottom: rem(60);
                .every-detail {
                    margin-top: rem(40);
                    font-size: rem(24);
                    line-height: rem(24);
                    color: #848484;
                }
            }
            .add-service {
                .every-service {
                    position: relative;
                    height: rem(116);
                    line-height: rem(116);
                    font-size: rem(26);
                    color: #25292F;
                }
            }
            .coupon {
                margin-top: rem(40);
                font-size: rem(24);
                line-height: rem(24);
                .name {
                    color: #848484;
                }
                .price {
                    color: #CB9D6D;
                }
            }
            .score {
                margin-top: rem(40);
                font-size: rem(24);
                line-height: rem(24);
                color: #878E99;
            }
        }
        .footer {
            position: absolute;
            left: rem(30);
            bottom: 0;
            width: rem(690);
            .total-price {
                line-height: rem(50);
                .name {
                    font-size: rem(26);
                    color: #25292F;
                }
                .price {
                    font-size: rem(24);
                    color: #CB9D6D;
                    .count {
                        font-size: rem(50);
                    }
                }
            }
        }
    }
    .close-btn {
        position: absolute;
        bottom: rem(50);
        left: rem(335);
        width: rem(80);
        height: rem(80);
        @include bg("./imgs/close.png");
    }
    .com-border-bottom {
        @include bd-bottom(#EBECEE);
    }
    .style-ios {
        .com-border-bottom {
            @include bd-bottom-ios(#EBECEE);
        }
    }
</style>