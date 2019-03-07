<template>
    <div class="pay-type">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
        <div class="main mainHasBottom" >
            <div class="container">
                <div class="every-detail-order">
                    <slot></slot>
                    <div class="payment_method">
                        <p class="title">支付方式</p>
                        <ul class="payment-content">
                            <li class="can-select-li" v-for='(item, index) in bankList' :key="index" 
                            v-if="isPay(item) && PayStaticInfo[item.bank]">
                                <div class="label-content">
                                    <img :src="PayStaticInfo[item.bank].payIcon" alt="" />
                                    <span>{{PayStaticInfo[item.bank].payName}}</span>
                                    <span class="discount" v-show="PayStaticInfo[item.bank].payName === PayStaticInfo.SHOUFUPAY.payName">最高减88元</span>
                                </div>
                                <label class="select-checkbox clearfix" @click='selectPayWay(PayStaticInfo[item.bank])'>
                                    <input type="radio" name="payType" class="label-checkbox">
                                    <span class="select-btn"></span>
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <Footer>
            <button class="g-btn" slot="sureBtn" @click="payNow">立即支付 ￥{{orderTotalAmount ? orderTotalAmount : 0}}</button>
        </Footer>
    </div>
</template>

<script>
    import "common/tools/rem";
    import Header from "components/header.vue";
    import Footer from "components/footer.vue";
    import controller from "common/logic/controller";
    import requesturl from "common/deploy/requesturl";
    import {
        PayRes,
        PayInfo,
        ResultCode,
        PayStaticInfo,
        PayCallback,
        ChannelCode,
        Verify
    } from "common/logic/enum";
    import { payParams } from "common/logic/logic";
    import Page from "common/deploy/page";
    export default {
        props: {
            detailInfor: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            pageData: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            memberInfo: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            orderTotalAmount: 0
        },
        data() {
            return {
                setTitleStyle: {
                    title: '订单支付',
                    titlestyle: 4
                },
                title: "订单支付",
                isShowModel: false,
                imgDown: require("./imgs/icon_down.png"),
                imgUp: require("./imgs/icon_up.png"),
                detailSrc: false,
                bankList: [],
                PayStaticInfo: PayStaticInfo,
                PayWayImg: {
                    alipay: require('./imgs/alipay.png'),
                    wechatpay: require('./imgs/wechatpay.png'),
                    unionpay: require('./imgs/unionpay.png'),
                    xyf: require('./imgs/xyf.png'),
                    huarui: require('./imgs/huarui.png'),
                    yiwangtong: require('./imgs/yiwangtong.png')
                },
                isUseHeader: false,
                // 0不支持 1苹果支付 2三星支付 3小米支付 4华为支付
                cpppayType: 0,
                selectPay: {}
            };
        },
        created() {
            var that = this;
            controller.getCppPay(function(data){
                that.cpppayType = data;
            });
            controller.clickBack(() => {
                that.clickBackBtn();
            });
        },
        watch: {
            detailInfor(newVal,oldVal) {
                this.loadPayInfo();
            }
        },
        methods: {
            // 是否展示这个支付方式
            isPay(item){
                if(
                    (item.bank == 'XIAOMIPAY' && this.cpppayType != '3') || 
                    (item.bank == 'HUAWEIPAY' && this.cpppayType != '4') || 
                    (item.bank == 'SAMSUNGPAY' && this.cpppayType != '2') || 
                    (item.bank == 'APPLEPAY' && this.cpppayType != '1')
                ){
                    return false;
                }
                return true;
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
            // 选择支付方式
            selectPayWay(item) {
                for (let key in PayCallback) {
                    if (PayCallback[key] === item.payCallback) {
                        this.selectPay = item;
                        console.log('支付方式：' + JSON.stringify(item))
                    }
                }
            },
            // 点击返回按钮
            clickBackBtn() {
                this.$emit("clickBackBtn");
            },
            changeMore() {
                if (this.detailSrc) {
                    this.detailSrc = false;
                } else {
                    this.detailSrc = true;
                }
            },
            // 立即支付
            payNow() {
                let payId = this.selectPay.payCallback;
                let payMethod = this.selectPay.payMethod;
                if (payId === PayCallback.ALI) {
                    this.payAlipay();
                } else if (payId === PayCallback.WECHAT) {
                    console.log("微信");
                    this.payWeixin();
                } else if (payId === PayCallback.UNION) {
                    this.payCreditCard();
                } else if (payId === PayCallback.XYF) {
                    this.payxinyongfei();
                } else if (payId === PayCallback.HUA_RUI) {
                    this.payHuaRui();
                } else if (payId === PayCallback.YI_WANG_TONG) {
                    this.paycmb();
                } else if (payId === PayCallback.CHINAPAY) {
                    this.cppPay(payMethod);
                } else if (payId === PayCallback.XIAOMIPAY) {
                    this.cppPay(payMethod);
                } else if (payId === PayCallback.HUAWEIPAY) {
                    this.cppPay(payMethod);
                } else if (payId === PayCallback.APPLEPAY) {
                    this.cppPay(payMethod);
                } else if (payId === PayCallback.SAMSUNGPAY) {
                    this.cppPay(payMethod);
                } else if (payId === PayCallback.CASHIER) {
                    this.cppPay(payMethod);
                } else {
                    controller.toast({str: '请选择支付方式', times: 2000});
                    return;
                }
            },
            //支付宝支付
            payAlipay() {
                // if (isTimeOut) {
                //   $toast("支付超时！", "3000");
                //   return;
                // }
                let that = this;
                let params = that.createParams_2();
                params.payMethod = "ALIPAY";
                controller.logEvent({
                    category: "Purchasing",
                    event: "FlightPay_Alipay",
                    value: null
                });
                controller.getJSON({
                        method: "POST",
                        url: requesturl.PAY.ALI_PAY,
                        params: params
                    })
                    .then(that.sucCallback_3)
                    .catch(that.errCallback_3);
            },
            sucCallback_3(data) {
                if (data) {
                    if (data.resultCode == ResultCode.SUCCESS) {
                        try {
                            controller.alipay({
                                data: data.paymentInfo,
                                successCallback: this.paySuccess,
                                failureCallback: this.payFailed
                            });
                        } catch (e) {
                            controller.toast({
                                str: "调用支付宝支付出现异常",
                                times: 3000
                            });
                            return;
                        }
                    } else {
                        controller.toast({
                            str: data.errorInfo,
                            times: 3000
                        });
                        return;
                    }
                } else {
                    controller.toast({
                        str: "支付申请提交失败，请检查网络是否通畅",
                        times: 3000
                    });
                }
            },
            errCallback_3() {
                controller.toast({
                    str: "失败",
                    times: 3000
                });
            },
            // 微信支付
            payWeixin() {
                // if (isTimeOut) {
                //     $toast("支付超时！", "3000");
                //     return;
                // }
                let that = this;
                let params = that.createParams_2();
                params.payMethod = "WEIXINPAY";
                controller.logEvent({
                    category: "Purchasing",
                    event: "FlightPay_Wx",
                    value: null
                });
                controller.getJSON({
                        method: "POST",
                        url: requesturl.PAY.WEIXI_NPAY,
                        params: params
                    })
                    .then(that.sucCallback_4)
                    .catch(that.errCallback_4);
            },
            sucCallback_4(data) {
                if (data) {
                    if (data.resultCode == ResultCode.SUCCESS) {
                        try {
                            //$toast("预支付成功","3000");
                            var param1 = {
                                "appid": data.appId,
                                "partnerid": data.partnerId,
                                "prepayid": data.prepayId,
                                "package": "Sign=WXPay",
                                "noncestr": data.nonceStr,
                                "timestamp": data.timeStamp,
                                "sign": data.paySign
                            };
                            controller.setStorage('wxpayinfo', param1);
                            controller.wechatpay({
                                data: param1,
                                successCallback: this.paySuccess,
                                failureCallback: this.payFailed
                            });
                        } catch (e) {
                            controller.toast({
                                str: "调用支付出现异常",
                                times: 3000
                            });
                            return;
                        }
                    } else {
                        controller.toast({
                            str: "支付申请提交失败",
                            times: 3000
                        });
                        return;
                    }
                } else {
                    controller.toast({
                        str: "支付申请提交失败，请检查网络是否通畅",
                        times: 3000
                    });
                }
            },
            errCallback_4() {
                controller.toast({
                    str: "失败",
                    times: 3000
                });
            },
            // 信用卡支付
            payCreditCard() {
                // if (isTimeOut) {
                //     $toast("支付超时！", "3000");
                //     return;
                // }
                controller.logEvent({
                    category: "Purchasing",
                    event: "FlightPay_UnionPay",
                    value: null
                });
                let cardPayPage = Page.pay.cardPay;
                controller.open({
                    winName: cardPayPage.winName,
                    path: cardPayPage.pageUrl,
                });
            },
            // 信用飞首付游
            payxinyongfei() {
                // if (isTimeOut) {
                //     $toast("支付超时！", "3000");
                //     return;
                // }
                let that = this;
                let params = that.createParams_2();
                params.payMethod = "SHOUFUPAY";
                controller.logEvent({
                    category: "Purchasing",
                    event: "FlightPay_Xyf",
                    value: null
                });
                controller.getJSON({
                        method: "POST",
                        url: requesturl.PAY.SHOUFU_PAY,
                        params: params
                    })
                    .then(that.sucCallback_5)
                    .catch(that.errCallback_5);
            },
            sucCallback_5(data) {
                if (data.resultCode == ResultCode.SUCCESS) {
                    var payInfo = data.paymentInfo
                    var tourl = '/m/xinYongFei/toPaySuccess.html?channelCode=' + ChannelCode.H5 + '&channelOrderNo=' +
                        this.detailInfor
                        .channelOrderNo + '&orderNo=' + this.detailInfor.orderNO + '&customerNo=' + this.detailInfor.customerNo +
                        '&loginKeyInfo=' + this.detailInfor.loginKeyInfo + '&payInfo=' + payInfo +
                        '&payMethod= SHOUFUPAY';
                    controller.setStorage('paymentInfo', tourl);
                    let xinyongfeiPage = Page.pay.shoufuPay;
                    controller.open({
                        winName: xinyongfeiPage.winName,
                        path: xinyongfeiPage.pageUrl,
                    });
                } else {
                    controller.toast({
                        str: "支付申请提交失败:" + data.errorInfo,
                        times: 3000
                    });
                }
            },
            errCallback_5() {
                controller.toast({
                    str: "失败",
                    times: 3000
                });
            },
            //华瑞银行支付
            payHuaRui() {
                // if (isTimeOut) {
                //     $toast("支付超时！", "3000");
                //     return;
                // }
                let that = this;
                let params = that.createParams_2();
                controller.logEvent({
                    category: "Purchasing",
                    event: "FlightPay_Shrb",
                    value: null
                });
                controller.getJSON({
                        method: "POST",
                        url: requesturl.PAY.HUARUI_PAY,
                        params: params
                    })
                    .then(that.sucCallback_6)
                    .catch(that.errCallback_6);
            },
            sucCallback_6(data) {
                if (data.resultCode == ResultCode.SUCCESS) {
                    let params = this.createParams_2();
                    params.payMethod = "HUARUIPAY";
                    params.hrid = data.sucInfo;
                    controller.setStorage("hrbkparam", params);
                    let shrbpayPage = Page.pay.shrbpay;
                    controller.open({
                        winName: shrbpayPage.winName,
                        path: shrbpayPage.pageUrl,
                    });
                } else {
                    controller.toast({
                        str: data.errorInfo,
                        times: 3000
                    });
                }
            },
            errCallback_6() {
                controller.toast({
                    str: "失败",
                    times: 3000
                });
            },
            //招商支付
            paycmb() {
                // if (isTimeOut) {
                //     $toast("支付超时！", "3000");
                //     return;
                // }
                let that = this;
                let params = that.createParams_2();
                params.payMethod = "CMBCHINAPAY";
                controller.logEvent({
                    category: "Purchasing",
                    event: "FlightPay_Ywt",
                    value: null
                });
                controller.getJSON({
                        method: "POST",
                        url: requesturl.PAY.CMBCHINA_PAY,
                        params: params
                    })
                    .then(that.sucCallback_7)
                    .catch(that.errCallback_7);
            }, 
            sucCallback_7(data) {
                if (data.resultCode == ResultCode.SUCCESS) {
                    controller.setStorage('payurl', data.errorInfo);
                    let cmbchinapayPage = Page.pay.cmbchinapay;
                    controller.open({
                        winName: cmbchinapayPage.winName,
                        path: cmbchinapayPage.pageUrl,
                    });
                } else {
                    controller.toast({
                        str: data.errorInfo,
                        times: 3000
                    });
                }
            },
            errCallback_7() {
                controller.toast({
                    str: "失败",
                    times: 3000
                });
            },
            // 云闪付等
            cppPay(payMethod){
                let that = this;
                let params = that.createParams_2();
                params.payMethod = payMethod;
                controller.logEvent({
                    category: "Purchasing",
                    event: "FlightPay_Ysf",
                    value: null
                });
                controller.getJSON({
                        method: "POST",
                        url: requesturl.PAY.CHINA_PAY,
                        params: params
                    })
                    .then(that.sucCallback_chinaPay)
                    .catch(that.errCallback_4);
            },
            sucCallback_chinaPay(data){
                if (data) {
                    if (data.resultCode == ResultCode.SUCCESS) {
                        try {
                            controller.cpppay({
                                data: data.objData,
                                successCallback: this.paySuccess,
                                failureCallback: this.payFailed
                            })
                        } catch (e) {
                            $toast("调用支付出现异常", "3000");
                            return;
                        }
                    } else {
                        $toast(data.errorInfo, "3000");
                        return;
                    }

                } else {
                    $toast("支付申请提交失败，请检查网络是否通畅", "3000");
                }
            },
            // 支付成功,失败,超时之后跳转
            paySuccess(data) {
                this.$emit("paySuccess");
            },
            payFailed(data) {
                this.$emit("payError");
            },
            /**获取支付支持的方式**/
            loadPayInfo() {
                const that = this;
                controller.getJSON({
                        method: "POST",
                        url: requesturl.PAY.PAY_WAY + "?t=" + new Date().getTime(),
                        params: that.createParams_2()
                    })
                    .then(that.sucCallback_2)
                    .catch(that.errCallback_2);
            },
            createParams_2() {
                console.log(222);
                console.log(this.detailInfor);
                console.log(this.pageData);
                console.log(this.pageData.orderType);
                console.log(this.memberInfo);
                let param = payParams({
                    detailData: this.detailInfor,
                    orderType: this.pageData.orderType,
                    MemberInfo: this.memberInfo
                });
                console.log(param);
                return param;
            },
            sucCallback_2(data) {
                if (data.status == "1001") {
                    let bankInfo = data.bankInfo;
                    for (let i = 0; i < bankInfo.length; i++) {
                        let item = bankInfo[i];
                        //机票订单分为国内和国际 orderType: D || I
                        // if (
                        //   ((orderType == "flightOrder" || orderType == "insureOrder") &&
                        //     item.orderType == detailData.interFlag) ||
                        //   (orderType != "flightOrder" &&
                        //     orderType != "insureOrder" &&
                        //     item.orderType == "Q")
                        // ) {
                        //   initPay(item.bankList);
                        //   return;
                        // }
                        this.bankList = item.bankList;
                    }
                } else {
                    controller.toast({str: data.resultInfo});
                    return;
                }
            },
            errCallback_2() {}
        },
        components: {
            Header,
            Footer
        }
    };
</script>

<style lang="scss" scoped>
    @import "~common/styles/common/function.scss";
    @import "~common/styles/common/common.scss";
    .select-checkbox {
        height: auto;
        width: auto;
        @include ct(auto, rem(30));
    }


    /*订单支付*/

    .every-detail-order {
        font-size: rem(24);
    }

    .every-detail-order .payment_method{
        @include border-radius(rem(6));
    }
    .every-detail-order .payment_method .title {
        color: #adadad;
        padding-left: rem(30);
        margin-bottom: rem(13);
    }

    .every-detail-order .payment_method ul {
        background-color: #fff;
        @include border-radius(rem(6));
        overflow: hidden;
    }

    .every-detail-order .payment_method ul li {
        height: rem(50);
        line-height: rem(50);
        padding: rem(30);
        position: relative;
    }

    .every-detail-order .payment_method ul li img {
        width: rem(50);
        float: left;
        margin-right: rem(20);
    }

    .every-detail-order .payment_method ul li span {
        font-size: rem(28);
        font-weight: bold;
    }
</style>
