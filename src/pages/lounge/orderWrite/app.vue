<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
        <div class="main mainHasBottom" >
            <div class="container">
                <!-- 购买信息 -->
                <div class="post-wrapper">
                    <ul>
                        <li class="every-insurance clearfix">
                            <div class="label-content flexbox">
                                <div class="insurance-information flex-1">
                                    <div>
                                        <span class="name">{{ LoungeData.activityName }}</span>
                                    </div>
                                    <div class="introduce">有效期
                                        <span>{{ LoungeData.startDate }}至{{ LoungeData.endDate }}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>购买数量</span>
                                </div>
                                <div class="other flex-1">
                                    <span class="reduce" :class='{"not-click" : Num == 1}' @click="reduceNum"></span>
                                    <span class="count">{{ Num }}</span>
                                    <span class="add" :class='{"not-click" : Num == 5}' @click="addNum"></span>
                                </div>
                            </label>
                        </li>
                    </ul>
                </div>
                <!-- 联系人信息 -->
                <div class="post-wrapper">
                    <ul>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>联系人</span>
                                </div>
                                <input type="text" v-model="LoungeData.linkName" placeholder="请输入姓名" class="all-input-style flex-1">
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>手机号</span>
                                </div>
                                <input type="tel" pattern="[0-9]*" v-model="LoungeData.linkPhone" placeholder="请输入手机号" class="all-input-style flex-1">
                            </label>
                        </li>
                    </ul>
                </div>
                <!-- 积分、额度。。。 -->
                <div class="post-wrapper">
                    <ul>
                        <li>
                            <div class="flexbox">
                                <div class="all-inputBox">
                                    <span>积分</span>
                                    <div class="tip" @click="showExplain"></div>
                                </div>
                                <div class="all-con flex-1" v-cloak>
                                    <span v-if="isGetAuthJson">共{{ LoungeData.availableScore || 0 }}积分&nbsp;</span>
                                    <span v-if="isShowUseScore && isGetAuthJson">可用{{ userScore }}积分</span>
                                </div>
                                <label class="select-checkbox clearfix">
                                    <input type="checkbox" class="label-checkbox" v-model="isChecked" @click="switchOpt" :disabled="isDisabled">
                                    <span class="select-btn"></span>
                                </label>
                            </div>
                        </li>
                        <li v-if="isChecked && isGetAuthJson">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>使用额度</span>
                                </div>
                                <input type="tel" pattern="[0-9]*" v-model="linker.useIntegral" placeholder="请输入使用积分额" class="all-input-style flex-1">
                            </label>
                        </li>
                        <li v-if="isChecked && isGetAuthJson">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>消费密码</span>
                                </div>
                                <input type="password" pattern="[0-9]*" v-model="linker.linkerPwd" placeholder="请输入消费密码" class="all-input-style flex-1">
                                <div class="forgetBtn" @click.stop="forgetPwd">忘记密码</div>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <Footer>
            <div class="buyBox flexbox" slot="sureBtn">
                <div class="money flex-1" @click="showModel">
                    <span>总计：</span>
                    <span class="symbol">￥</span>
                    <span class="count">{{ totalPrice || 0 }}</span>
                    <div class="tip"></div>
                    <span>明细</span>
                </div>
                <div class="buyBtn" @click="goBuy()">去支付</div>
            </div>
        </Footer>
        <!-- 积分说明 -->
        <ScoreExplain :isShow="isShowExplain" @clickCloseBtn="clickCloseBtn" v-show='isShowExplain'></ScoreExplain>
        <!-- 费用明细弹框 -->
        <transition name="detailAnimate">
            <div class="every-detail-order-wrapper" v-show="isShowModel" @click="hideModel">
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

<style lang="scss">
    @import '~common/styles/common/common.scss';
    @import '~common/styles/slice_sass/content.scss';
    @import '~common/styles/common/function.scss';
    @import '~common/styles/common/_mixin.scss';

    .forgetBtn {
        color: #848484;
        margin-left: rem(30);
    }
    .post-wrapper {
        li {
            input {
                height: rem(32);
                line-height: rem(32);
                margin-top: rem(36);
            }
        }
    }

    .post-wrapper .every-insurance{
        height: rem(132);
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

    .every-detail-order {
        padding: 0 rem(30);
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
</style>

<script>
    import 'common/tools/rem'
    import Header from 'components/header.vue'
    import Footer from 'components/footer.vue'
    import ScoreExplain from 'components/scoreExplain.vue'
    import controller from 'common/logic/controller'
    import requesturl from 'common/deploy/requesturl'
    import {
        ResultCode,
        AuthResult,
        Verify,
        RegEnum,
        AllOrderType,
        PayRes,
        PayInfo,
        couponType
    } from 'common/logic/enum'
    import {
        dateFormat,
        ChannelOrderNo,
        vilidation,
        mul2
    } from 'common/logic/utils'
    import {
        ruleScore
    } from 'common/logic/logic'
    import page from 'common/deploy/page'
    import lsKey from 'common/deploy/localstorage'
    import service from 'common/service/data'

    export default {
        data() {
            return {
                // 头部信息
                isUseHeader: false, 
                setTitleStyle: {},
                memberInfo: {
                    realVerifyStatus: ''
                },
                pageData: {},
                Pages: page,
                AuthResult: AuthResult,
                isShowModel: false,
                isShowExplain: false,
                isChecked: false,
                isGetAuthJson: false,
                isShowUseScore: false,
                userScore: 0,
                balanceOfMileage: 0,
                Num: 1,
                isDisabled: false,
                LoungeData: {
                    price: 0
                },
                linker: {}
            }
        },
        computed: {
            totalPrice() {
                // 积分规则
                let myUseScore = ruleScore(this.linker.useIntegral);
                if(myUseScore == 'undefined') {
                    return;
                } else if(myUseScore == 0 || myUseScore) {
                    this.linker.useIntegral = myUseScore;
                }
                let totalPrice = mul2(this.LoungeData.price, this.Num)
                if (this.linker.useIntegral) {
                    if (this.linker.useIntegral > totalPrice) {
                        this.linker.useIntegral = totalPrice;
                        controller.toast({
                            str: '使用积分额不能大于购买产品的价格'
                        });
                        return 0;
                    }
                    if (this.linker.useIntegral > Number(this.userScore)) {
                        this.linker.useIntegral = Number(this.userScore);
                        controller.toast({
                            str: '使用积分额不能大于可使用积分'
                        });
                        return totalPrice - Number(this.userScore)
                    }
                    if (this.linker.useIntegral <= 0) {
                        this.linker.useIntegral = 0;
                        controller.toast({
                            str: '使用积分额必须大于0'
                        });
                        return totalPrice
                    }
                    return totalPrice - this.linker.useIntegral
                }
                return totalPrice
            }
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                console.log(data);
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                that.getLounge();
                that.getAuthResult();
                controller.onshow(function() {
                    that.getAuthResult();
                })
            });
        },
        methods: {
            // H5头部回调
            getTitleStyle(titleObj, isTtile) {
                console.log('isTitle:'+ isTtile);
                this.isUseHeader = isTtile;
            },
            // 积分说明
            clickCloseBtn() {
                this.isShowExplain = false;
            },
            showExplain() {
                this.isShowExplain = true;
            },
            // 点击返回按钮
            clickBackBtn() {
                controller.close();
            },
            // 购买份数加减
            reduceNum() {
                if (this.Num == 1) {
                    return;
                }
                this.Num--;
            },
            addNum() {
                if (this.Num == 5) {
                    controller.toast({
                        str: '您最多可购买5张，请使用后再继续购买'
                    })
                    return;
                }
                this.Num++;
            },
            // 显示明细弹框
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
            // 获取可售贵宾休息室
            getLounge() {
                let that = this
                controller.getJSON({
                        method: 'POST',
                        url: requesturl.LOUNGE.FLIGHTLOUNGE,
                        params: that.createParams()
                    })
                    .then(that.sucFun)
                    .catch((err) => {
                        controller.toast({
                            str: Verify.BACK_ERR.toastDetailsFail
                        });
                    })
            },
            createParams() {
                return {
                    request: {
                        ffpId: this.memberInfo.id,
                        ffpCardNo: this.memberInfo.memberID,
                        loginKeyInfo: this.memberInfo.loginKeyInfo
                    }
                }
            },
            sucFun(res) {
                if (res.resultCode === ResultCode.SUCCESS) {
                    this.LoungeData = res.objData.saleCouponList[0];
                    this.LoungeData.availableScore = res.objData.availableScore;
                    this.LoungeData.linkName = res.objData.linkName;
                    this.LoungeData.linkPhone = res.objData.linkPhone;
                } else {
                    controller.toast({
                        str: res.resultInfo
                    });
                }
            },
            // 获取可用积分
            getIntegral() {
                service.getUseIntegral()
                    .then(res => {
                        if (res.resultCode === ResultCode.SUCCESS) {
                            this.userScore = res.userScore
                        }
                    })
                    .catch(this.errFun)
            },
            // 获取实名认证信息
            getAuthResult() {
                if (!this.memberInfo) {
                    return;
                }
                service.getAuthResult()
                    .then(res => {
                        if (res.resultCode == ResultCode.SUCCESS) {
                            if (res.objData.verifyStatus == 1) {
                                this.isGetAuthJson = true;
                                this.getIntegral();
                            }
                        } else {
                            controller.toast({
                                str: res.resultInfo
                            });
                        }
                    })
                    .catch(this.errFun)
            },
            // 请求详情失败回调
            errFun() {
                controller.toast({
                    str: Verify.BACK_ERR.toastDetailsFail
                });
            },
            // 选择使用积分
            switchOpt() {
                let that = this

                // 未实名认证
                if (!that.isGetAuthJson) {
                    controller.confirm({
                        title: '提示',
                        message: '使用积分需实名认证，是否去实名认证？',
                        buttons: ['考虑一下', '去认证'],
                        onConfirm() {
                            that.isChecked = false;
                            let authPage = page.my.auth;
                            controller.open({
                                winName: authPage.winName,
                                path: authPage.pageUrl
                            });
                        },
                        onCancel() {
                            that.isChecked = false;
                            that.userScore = 0;
                        }
                    })
                }

                // 已实名认证 可用积分为0
                if(that.isGetAuthJson && that.userScore == 0) {
                    controller.toast({
                        str: '暂无可用积分'
                    });
                    this.isDisabled = true;
                } else {
                    this.isDisabled = false;
                }
            },
            // 忘记密码
            forgetPwd() {
                if (this.memberInfo.realVerifyStatus == AuthResult.CHECK) {
                    controller.open({
                        winName: page.my.auth.winName,
                        path: page.my.auth.pageUrl
                    });
                } else {
                    controller.open({
                        winName: page.my.auth.winName,
                        path: page.my.auth.pageUrl
                    });
                }
            },
            // 验证信息
            valify() {
                if (!this.LoungeData.linkName) {
                    controller.toast({
                        str: '请输入联系人姓名'
                    });
                    return false;
                }
                if (!this.vertificate(this.LoungeData.linkName, RegEnum.NOT_STRICT_NAME, 2000)) {
                    return false;
                }

                if (!this.LoungeData.linkPhone) {
                    controller.toast({
                        str: '请输入联系人手机号'
                    });
                    return false;
                }
                if (!this.vertificate(this.LoungeData.linkPhone, RegEnum.MOBILE, 2000)) {
                    return false;
                }

                if (this.isChecked) {
                    if (!this.linker.useIntegral) {
                        controller.toast({
                            str: '请输入使用积分额'
                        });
                        return false;
                    }
                    if (!this.linker.linkerPwd) {
                        controller.toast({
                            str: '请输入消费密码'
                        });
                        return false;
                    }
                }
                return true;
            },
            // 通用的验证方法
            vertificate(content, reg, time) {
                let verificateResult = vilidation(content, reg);
                if (typeof verificateResult === 'string') {
                    controller.toast({
                        str: verificateResult,
                        times: time
                    });
                    return false;
                }
                return true;
            },
            // 去支付
            goBuy() {
                if (this.valify()) {
                    controller.getJSON({
                            method: 'POST',
                            url: requesturl.LUGGAGE.BUY_LUGGAGE,
                            params: this.createGoBuyParams()
                        })
                        .then(this.sucGoBuy)
                        .catch(this.errFun)
                }
            },
            createGoBuyParams() {
                return {
                    request: {
                        ffpCardNo: this.memberInfo.memberID,
                        ffpId: this.memberInfo.id,
                        loginKeyInfo: this.memberInfo.loginKeyInfo,
                        channelOrderNo: ChannelOrderNo(new Date()),
                        payAmount: this.totalPrice,
                        useScore: this.linker.useIntegral,
                        linker: this.LoungeData.linkName,
                        linkerHandphone: this.LoungeData.linkPhone,
                        salePwd: this.linker.linkerPwd,
                        saleCouponList: [{
                            activityNo: this.LoungeData.activityNo,
                            count: this.Num
                        }],
                        couponSource: couponType.VIPROOM
                    }
                }
            },
            sucGoBuy(res) {
                if (res.resultCode == ResultCode.SUCCESS) {
                    controller.toast({
                        str: "生成订单成功"
                    });
                    let objData = res.objData;
                    objData.orderType = AllOrderType.LUGGAGE;
                    let payment = page.commonPage.payment;
                    controller.open({
                        winName: payment.winName,
                        path: payment.pageUrl,
                        data: objData,
                        closeLastPage: true
                    });
                } else if(res.resultCode == 'P10001') {
                    let objData = res.objData;
                    let successPage = page.commonPage.payResult;
                    controller.open({
                        winName: successPage.winName,
                        path: successPage.pageUrl,
                        data: {
                            type: PayRes.PAY_SUC,
                            resultData: PayInfo.PAY_SUC,
                            channelOrderNo: objData.channelOrderNo,
                            orderNo: objData.orderNo
                        },
                        closeLastPage: true
                    });
                } else {
                    controller.toast({
                        str: res.resultInfo
                    });
                }
            },
            createParams_2(objData) {
                return {
                    request: {
                        channelOrderNo: objData.channelOrderNo,
                        ffpCardNo: this.memberInfo.memberID,
                        ffpId: this.memberInfo.id,
                        loginKeyInfo: this.memberInfo.loginKeyInfo,
                        orderNo: objData.orderNo
                    }
                };
            }
        },
        watch: {
            isChecked: function(newVal, oldVal) {
                if(oldVal){
                    this.linker.useIntegral = ''
                    this.linker.linkerPwd = ''
                }
                this.isShowUseScore = true;
                if(!this.userScore) {
                    this.isChecked = false;
                }
            },
            deep: true
        },
        components: {
            Header,
            Footer,
            ScoreExplain
        }
    }
</script>
