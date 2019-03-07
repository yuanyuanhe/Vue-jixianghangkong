<template>
    <div id="app">
        <PayType :detailInfor="detailInfor">
            <div name="pay-content" class="slotBox">
                <div class="legItem">
                    <div class="ow-main">
                        <div class="ow-hd">
                            <div class="hdBox flexbox">
                                <div class="hd-info flex-1">
                                    <span>去程</span>
                                    <span>2018-04-11 周四</span>
                                </div>
                            </div>
                        </div>
                        <div class="ow-bd">
                            <div class="bdDay"></div>
                            <div class="bdBox flexbox">
                                <div class="bdBoxItem bdBoxItem1 flex-1">
                                    <div class="bdBox-date">23:35</div>
                                    <div class="bdBox-txt">浦东国际机场T2</div>
                                </div>
                                <div class="bdBoxItem flex-1">
                                    <div class="bdBox-time"></div>
                                    <div class="bdBox-img"></div>
                                    <div class="bdBox-stop"></div>
                                </div>
                                <div class="bdBoxItem bdBoxItem2 flex-1">
                                    <div class="bdBox-date">02:05</div>
                                    <div class="bdBox-txt">浦东T2</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="moneyBox">
                    <div class="moneyInfo" v-if="isArrowDetail">
                        <div class="mnItem">
                            <div class="mnItem-hd flexbox">
                                <span class="mnItemTitle flex-1">商品标题</span>
                                <span class="mnItemMoney">930 x 1</span>
                            </div>
                            <div class="mnItem-cd flexbox">
                                <span class="mnItemTitle flex-1">商品标题</span>
                                <span class="mnItemMoney">880 x 1</span>
                            </div>
                            <div class="mnItem-bd">
                                <p class="flexbox">
                                    <span class="flex-1">优惠券优惠</span>
                                    <span>-￥50</span>
                                </p>
                                <p class="flexbox">
                                    <span class="flex-1">积分抵扣</span>
                                    <span>-￥50</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="money">
                        <div class="money-hd flexbox">
                            <div class="hdTxt">订单金额</div>
                            <div class="hdMoney flex-1">￥1522</div>
                            <div class="hdDetail" @click.stop="arrowDetail">
                                <span>明细</span>
                                <span class="hdArrow" :class="isArrowDetail ? 'active' : ''"></span>
                            </div>
                        </div>
                        <div class="money-bd">
                            请在<span class="bdTime"></span><span>5:00</span>内完成支付，以免耽误出行
                        </div>
                    </div>
                </div>
            </div>
            <Footer>
                <div class="buyBox flexbox" slot="sureBtn">
                    <div class="money flex-1" @click="showModel">
                        <span>预计：</span>
                        <span class="symbol">￥</span>
                        <span class="count">1522</span>
                        <div class="tip"></div>
                        <span>明细</span>
                    </div>
                    <div class="buyBtn">支付</div>
                </div>
            </Footer>
        </PayType>
         <!-- 费用明细弹框 -->
        <transition name="detailAnimate">
            <div class="every-detail-order-wrapper" v-show="isShowModel" :isShowModel="isShowModel" @click="hideModel">
                <div class="every-detail-order-content">
                    <div class="goods-list borderRadius">
                        <div class="every-detail-order">
                            <p class="title">
                                <span>{{ LoungeData.activityName }}</span>
                                <span class="unit_price">
                                    <span>&yen;</span>{{ LoungeData.price }} x {{ Num }}</span>
                            </p>
                        </div>
                        <div class="discount" v-if="isChecked">
                            <ul>
                                <li>
                                    <p>
                                        <span class="name">积分抵扣</span>
                                        <span class="unit_price">
                                            -&yen;
                                            <font>{{ linker.useIntegral || 0 }}</font>
                                        </span>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import "common/tools/rem";
    import controller from "common/logic/controller";
    import requesturl from "common/deploy/requesturl";
    import PayType from "components/payType.vue";
    import Footer from "components/footer.vue";
    import {
        ResultCode,
        Verify
    } from "common/logic/enum";
    export default {
        data() {
            return {
                detailInfor: {},
                isArrowDetail: false,
                isShowModel: false,
                isChecked: false,
                LoungeData: {},
                linker: {},
                Num: 4
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                console.log(that.pageData);
                controller.clickBack(() => {
                    that.clickBackBtn();
                });
            });
        },
        methods: {
            // 明细
            arrowDetail() {
                this.isArrowDetail = !this.isArrowDetail;
            },
            // 显示费用明细弹框
            showModel() {
                if (this.isShowModel) {
                    this.isShowModel = false;
                    return;
                }
                this.isShowModel = true;
            },
            hideModel() {
                this.isShowModel = false;
            },
        },
        components: {
            Footer,
            PayType
        }
    };
</script>

<style lang="scss">
    @import "~common/styles/common/common.scss";
    @import '~common/styles/boardPass.scss';
    .moneyBox {
        margin-bottom: rem(20);
        background: #fff;
        @include border-radius(rem(6));
        .money {
            padding: rem(20) rem(30);
            .money-hd {
                font-size: rem(28);
                font-weight: 600;
                line-height: rem(28);
                margin-bottom: rem(14);
                .hdTxt {
                    color: #3A3D50;
                }
                .hdMoney {
                    color: #CB9D6D;
                    margin-left: rem(16);
                }
                .hdDetail {
                    color: #848484;
                    font-weight: 400;
                    .hdArrow {
                        display: inline-block;
                        width: rem(20);
                        height: rem(15);
                        margin-bottom: rem(2);
                        @include bg1('~common/imgs/op-down.png');
                        &.active {
                            @include bg1('~common/imgs/op-up.png');
                        }
                    }
                }
            }
            .money-bd {
                font-size: rem(22);
                line-height: rem(28);
                color: #848484;
                span {
                    color: #CB9D6D;
                    font-weight:600;
                    margin-right: rem(5);
                }
                .bdTime {
                    display: inline-block;
                    width: rem(22);
                    height: rem(22);
                    margin: 0 rem(5) rem(-3);
                    @include bg2('~common/imgs/icon_clock.png');
                }
            }
        }
        .moneyInfo {
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
                .mnItem-cd {
                    font-size: rem(24);
                    color: #848484; 
                    padding: rem(20) rem(30);
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

    
    // 费用明细弹框
    .detailAnimate-enter-active,
	.detailAnimate-leave-active {
        transition: all 300ms;
		.every-detail-order-content {
			transition: all 300ms;
		}
	}
	.detailAnimate-enter,
	.detailAnimate-leave-to {
		transform: translate3d(0, 0, 100%);
		.every-detail-order-content {
			transform: translate3d(0, 100%, 0);
		}
    }
    
    .every-detail-order-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: rem(120);
        background: rgba(0, 0, 0, .3);
        z-index: 100;
        .every-detail-order-content {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            max-height: 74.46%;
            background: rgba(255, 255, 255, 1);
            overflow: auto;
        }
        .every-detail-order-content .goods-list {
            background-color: #fff;
        }
        .discount .unit_price {
            color: rgba(203, 157, 109, 1);
        }
        .discount .unit_price {
            float: right;
        }

        .discount ul {
            padding: 0 rem(30);
            @include bd-top(#EBECEE);
            .style-ios & {
                @include bd-top-ios(#EBECEE);
            }
        }

        .discount ul li {
            padding: rem(40) 0;
            &::before {
                border-top: none;
            }
        }
        .discount ul li p {
            font-size: rem(24);
            color: rgba(132, 132, 132, 1);
            line-height: rem(24);
        }
        .discount ul li p span {
            display: inline-block;
        }

        .discount ul .name {
            max-width: rem(500);
        }

        .discount ul .unit_price {
            float: right;
        }
    }

    @supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
        .every-detail-order-wrapper {
            bottom: calc(1.2rem + constant(safe-area-inset-bottom));
            bottom: calc(1.2rem + env(safe-area-inset-bottom));
        }
    }

    .every-detail-order ul {
        border-top: rem(1) solid rgba(244, 244, 244, 1);
        border-bottom: rem(1) solid rgba(244, 244, 244, 1);
    }

    .every-detail-order .title {
        height: rem(40);
        font-size: rem(26);
        color: rgba(37, 41, 47, 1);
        line-height: rem(40);
        padding: rem(40) 0;
    }

    .every-detail-order .unit_price {
        float: right;
    }

    .every-detail-order ul {
        padding: rem(10) rem(30);
    }

    .every-detail-order ul li {
        margin: rem(20) 0;
    }

    .every-detail-order ul li p {
        font-size: rem(24);
        color: rgba(132, 132, 132, 1);
        line-height: rem(24);
    }

    .every-detail-order ul li p span {
        display: inline-block;
    }

    .every-detail-order ul .name {
        max-width: rem(500);
    }

    .every-detail-order ul .unit_price {
        float: right;
    }
</style>
