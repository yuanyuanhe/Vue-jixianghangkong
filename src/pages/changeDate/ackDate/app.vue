<style lang="scss" scoped>
    @import '~common/styles/common/common.scss';
    @import '~common/styles/changeDate.scss';
    .container {
        padding-top: rem(30);
    }

    .psgItem {
        .psg-main {
            .psg-info {
                padding-right: 0;
            }
        }
    }
    .formBox .inputBox .inputTxt {
        width: rem(166);
    }

    footer.g-footer .buyBox>.money .count {
        letter-spacing: rem(-4);
    } // 费用明细弹框
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
        z-index: 99;
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


        li {
            border: none;
        }
        .discount ul {
            padding: rem(10) rem(30);
            /*border-top: rem(1) solid rgba(244, 244, 244, 1);*/
        }

        .discount ul li {
            margin: rem(20) 0;
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
        margin: 0 rem(30);
        @include bd-top(#EBECEE);
        .style-ios & {
            @include bd-top-ios(#EBECEE);
        }
        &:first-child {
            @include bd-top(#fff);
            .style-ios & {
                @include bd-top-ios(#fff);
            }
        }
    }

    .every-detail-order .title {
        height: rem(40);
        font-size: rem(26);
        color: rgba(37, 41, 47, 1);
        line-height: rem(40);
        padding: rem(40) 0;
    }

    .every-detail-order ul {
        padding: rem(10) 0;
        @include bd-top(#EBECEE);
        .style-ios & {
            @include bd-top-ios(#EBECEE);
        }
    }

    .every-detail-order ul li {
        margin: rem(20) 0;
        &::before {
            border: 0;
        }
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

    .every-detail-order .unit_price {
        float: right;
    }
</style>
<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
        <div class="main mainHasBottom">
            <div class="hint">每张机票只能在线改期一次</div>
            <div class="container">
                <!-- 改期航班 -->
                <div class="legChangeBox">
                    <div class="legItem" v-for="(item, index) in pageData.flightInfoList" :key="index">
                        <div class="ow-head">改期航班</div>
                        <div class="ow-main">
                            <div class="ow-hd">
                                <div class="hdBox flexbox">
                                    <div class="hd-info flex-1">
                                        <span v-if="pageData.routeType == 'OW'">单程</span>
                                        <span v-if="item.flightDirection == 'G' && pageData.routeType == 'RT'">去程</span>
                                        <span v-if="item.flightDirection == 'B'">返程</span>
                                        <span>{{ turnTime(item.depDateTime, 'YYYY-MM-DD dd') }}</span>
                                    </div>
                                </div>
                                <div class="hdBox">
                                    <span v-if="item.flightNo">{{ item.flightNo }}</span>
                                    <span v-if="item.cabinName">{{ item.cabinName }}({{ item.cabin }})</span>
                                    <span v-if="item.mealCode">{{ mealCodeStatus(item.mealCode) }}</span>
                                    <span v-if="item.aircraftModel">{{ item.aircraftModel }}</span>
                                </div>
                            </div>
                            <div class="ow-bd">
                                <div class="bdDay">{{ item.days ? item.days + '天' : '' }}</div>
                                <div class="bdBox flexbox">
                                    <div class="bdBoxItem bdBoxItem1 flex-1">
                                        <div class="bdBox-date">{{ turnTime(item.depDateTime, 'hh:mm') }}</div>
                                        <div class="bdBox-txt">{{ item.depCityName ? item.depCityName : '' }}{{ item.depAirportName ? item.depAirportName
                                            : '' }}{{ item.depTerm == '--' || item.depTerm == null ? '' : item.depTerm }}</div>
                                    </div>
                                    <div class="bdBoxItem flex-1">
                                        <div class="bdBox-time">{{ dealFlyTime(item.duration) }}</div>
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
                </div>
                <!-- 乘机人信息 -->
                <div class="m-title">乘机人信息</div>
                <div class="psgBox">
                    <div class="psgItem" v-for="(item, index) in pageData.passengerInfoList" :key="index">
                        <div class="psg-main flexbox">
                            <div class="psg-title">{{ item.passengerName }}</div>
                            <div class="psg-info flex-1">
                                <div class="idCard">
                                    <span>{{ item.certTypeName }}</span>
                                    <span>{{ (item.certNo).replace(/([\da-zA-Z]{3})[\da-zA-Z]{0,}([\da-zA-Z]{3})/, "$1*****$2") }}</span>
                                </div>
                                <div class="idCard">
                                    <span>票号</span>
                                    <span>{{ item.eticketNo }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 填写联系人 -->
                <div class="formBox">
                    <div class="inputBox flexbox">
                        <div class="inputTxt">联系人</div>
                        <input class="flex-1" type="text" placeholder="请填写姓名" v-model="linker">
                        <div class="inputCheck icon-phone" @click.stop="openContact"></div>
                    </div>
                    <div class="inputBox flexbox">
                        <div class="inputTxt">手机号</div>
                        <input class="flex-1" type="text" placeholder="用于接收航班信息" v-model="linkerHandphone">
                    </div>
                </div>
                <div class="serviceRules">
                    <div class="ruleTxt">
                        点击去支付，即已阅读且同意
                        <a href="javascript:;"  @click.stop='openVipRule'>吉祥航空各项服务条款</a>
                    </div>
                </div>
            </div>
        </div>
        <Footer>
            <div class="buyBox flexbox" slot="sureBtn">
                <div class="money flex-1" @click="showModel">
                    <span>总计：</span>
                    <span class="symbol">&yen;</span>
                    <span class="count">{{ totalPrice }}</span>
                    <div class="tip"></div>
                    <span>明细</span>
                </div>
                <div class="buyBtn" @click.stop="nextStep">确认改期，去支付</div>
            </div>
        </Footer>

        <!-- 费用明细弹框 -->
        <!-- ADT－成人　CHD-儿童   INF-婴儿  GMJC-军残警残 -->
        <transition name="detailAnimate">
            <div class="every-detail-order-wrapper" v-show="isShowModel" :isShowModel="isShowModel" @click="hideModel">
                <div class="every-detail-order-content">
                    <div class="goods-list borderRadius">
                        <div class="every-detail-order" v-for="(item, index) in people" :key="index" v-if="item.count">
                            <p class="title" v-show="item.totalDiffPrice">
                                <span>{{ item.title }}票</span>
                                <span class="unit_price">&yen;{{ item.totalDiffPrice }} x {{ item.count }}人</span>
                            </p>
                            <ul>
                                <li v-show="item.faceValueDiffPrice">
                                    <p>
                                        <span class="name">票价差额</span>
                                        <span class="unit_price">&yen;{{ item.faceValueDiffPrice }}</span>
                                    </p>
                                </li>
                                <li v-show="item.chargeDiffPrice">
                                    <p>
                                        <span class="name">手续费</span>
                                        <span class="unit_price">&yen;{{ item.chargeDiffPrice }}</span>
                                    </p>
                                </li>
                                <li v-show="pageData.tripType == 'D' && item.fuelDiffPrice">
                                    <p>
                                        <span class="name">机建差额</span>
                                        <span class="unit_price">&yen;{{ item.fuelDiffPrice }}</span>
                                    </p>
                                </li>
                                <li v-show="pageData.tripType == 'D' && item.airraxDiffPrice">
                                    <p>
                                        <span class="name">燃油差额</span>
                                        <span class="unit_price">&yen;{{ item.airraxDiffPrice }}</span>
                                    </p>
                                </li>
                                <li v-show="pageData.tripType == 'I' && item.taxDiffPrice">
                                    <p>
                                        <span class="name">税费差额</span>
                                        <span class="unit_price">&yen;{{ item.taxDiffPrice }}</span>
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
    import "common/tools/rem"
    import Header from "components/header.vue"
    import Footer from "components/footer.vue"
    import {
        controller
    } from "common/logic/controller"
    import Page from 'common/deploy/page'
    import requesturl from 'common/deploy/requesturl'
    import {
        juneyaoair,
        ChannelOrderNo,
        dateFormat,
        mul2
    } from "common/logic/utils";
    import { AllOrderType } from "common/logic/enum";

    export default {
        data() {
            return {
                // 头部信息
                setTitleStyle: {
                    title: '确认改期信息',
                    titlestyle: 4
                },
                pageData: {},
                isShowModel: false,
                isChecked: false,
                LoungeData: {},
                linker: '',
                linkerHandphone: '',
                Num: '',
                rulesTitle: '改期规则',
                canShowRules: false,
                // 成人数量
                adultNum: 0,
                // 儿童数量
                childNum: 0,
                // 婴儿数量
                babyNum: 0,
                // 军残警残数量
                policeNum: 0,
                people: [],
                totalPrice: 0
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                if(that.pageData.listStyle == 1) {
                    this.linker = that.pageData.linker;
                    this.linkerHandphone = that.pageData.linkerHandphone;
                }
                that.countDetail();
            })
        },
        components: {
            Header,
            Footer
        },
        methods: {
            // 计算明细数据
            countDetail() {
                // ADT－成人　CHD-儿童   INF-婴儿  GMJC-军残警残
                // 计算人数
                let psgList = this.pageData.passengerInfoList;
                // 成人舱位运价列表
                let adultPriceList = this.pageData.flightInfoList.cabinFareList
                for (let k = 0; k < psgList.length; k++) {
                    if (psgList[k].passengerType == 'ADT') {
                        this.adultNum++;
                    } else if (psgList[k].passengerType == 'CHD') {
                        this.childNum++;
                    } else if (psgList[k].passengerType == 'INF') {
                        this.babyNum++;
                    } else if (psgList[k].passengerType == 'GMJC') {
                        this.policeNum++;
                    }
                }
                console.log('成人/儿童/婴儿/军残警残----' + this.adultNum, this.childNum, this.babyNum, this.policeNum)
                // 计算差价、总价
                if (this.pageData.flightInfoList.length == 1) {
                    // 成人、儿童婴儿、军残警残舱位运价列表
                    let adultPriceList = this.pageData.flightInfoList[0].cabinFareList[0]
                    let childBabyPriceList = this.pageData.flightInfoList[0].cabinCHDINFFareList
                    let policePriceList = this.pageData.flightInfoList[0].cabinGMJCFareList[0]
                    // 成人总差价 票面差价 票面差价 燃油差价 机建差价 改期升舱税费差价
                    if(adultPriceList) {
                        this.adult = {
                            totalDiffPrice: adultPriceList.totalDiff,
                            faceValueDiffPrice: adultPriceList.ticketPriceDiff,
                            chargeDiffPrice: adultPriceList.changeServiceCharge,
                            fuelDiffPrice: adultPriceList.yqTaxDiff,
                            airraxDiffPrice: adultPriceList.cnTaxDiff,
                            taxDiffPrice: adultPriceList.taxDiff
                        }
                    }
                    // 军残警残
                    if(policePriceList) {
                        this.police = {
                            totalDiffPrice: policePriceList.totalDiff,
                            faceValueDiffPrice: policePriceList.ticketPriceDiff,
                            chargeDiffPrice: policePriceList.changeServiceCharge,
                            fuelDiffPrice: policePriceList.yqTaxDiff,
                            airraxDiffPrice: policePriceList.cnTaxDiff,
                            taxDiffPrice: policePriceList.taxDiff
                        }
                    }
                    // 婴儿儿童
                    if(childBabyPriceList) {
                        for (let i = 0; i < childBabyPriceList.length; i++) {
                            // 儿童、婴儿
                            if (childBabyPriceList[i].passengerType == 'CHD') {
                                // 儿童总差价 票面差价 票面差价 燃油差价 机建差价 改期升舱税费差价
                                this.child = {
                                    totalDiffPrice: childBabyPriceList[i].totalDiff,
                                    faceValueDiffPrice: childBabyPriceList[i].ticketPriceDiff,
                                    chargeDiffPrice: childBabyPriceList[i].changeServiceCharge,
                                    fuelDiffPrice: childBabyPriceList[i].yqTaxDiff,
                                    airraxDiffPrice: childBabyPriceList[i].cnTaxDiff,
                                    taxDiffPrice: childBabyPriceList[i].taxDiff
                                }
                            } else if (childBabyPriceList[i].passengerType == 'INF') {
                                // 婴儿总差价 票面差价 票面差价 燃油差价 机建差价 改期升舱税费差价
                                this.baby = {
                                    totalDiffPrice: childBabyPriceList[i].totalDiff,
                                    faceValueDiffPrice: childBabyPriceList[i].ticketPriceDiff,
                                    chargeDiffPrice: childBabyPriceList[i].changeServiceCharge,
                                    fuelDiffPrice: childBabyPriceList[i].yqTaxDiff,
                                    airraxDiffPrice: childBabyPriceList[i].cnTaxDiff,
                                    taxDiffPrice: childBabyPriceList[i].taxDiff
                                }
                            }
                        }
                    }
                } else if (this.pageData.flightInfoList.length == 2) {
                    // 成人、儿童婴儿、军残警残舱位运价列表
                    let adultPriceList1 = this.pageData.flightInfoList[0].cabinFareList[0]
                    let adultPriceList2 = this.pageData.flightInfoList[1].cabinFareList[0]
                    // 成人总差价 票面差价 票面差价 燃油差价 机建差价 改期升舱税费差价
                    if(adultPriceList1 && adultPriceList2){
                        this.adult = {
                            totalDiffPrice: adultPriceList1.totalDiff + adultPriceList2.totalDiff,
                            faceValueDiffPrice: adultPriceList1.ticketPriceDiff + adultPriceList2.ticketPriceDiff,
                            chargeDiffPrice: adultPriceList1.changeServiceCharge + adultPriceList2.changeServiceCharge,
                            fuelDiffPrice: adultPriceList1.yqTaxDiff + adultPriceList2.yqTaxDiff,
                            airraxDiffPrice: adultPriceList1.cnTaxDiff + adultPriceList2.cnTaxDiff,
                            taxDiffPrice: adultPriceList1.taxDiff + adultPriceList2.taxDiff
                        }
                    }
                    let policePriceList1 = this.pageData.flightInfoList[0].cabinGMJCFareList[0]
                    let policePriceList2 = this.pageData.flightInfoList[1].cabinGMJCFareList[0]
                    // 军残警残
                    if(policePriceList1 && policePriceList2) {
                        this.police = {
                            totalDiffPrice: policePriceList1.totalDiff + policePriceList2.totalDiff,
                            faceValueDiffPrice: policePriceList1.ticketPriceDiff + policePriceList2.ticketPriceDiff,
                            chargeDiffPrice: policePriceList1.changeServiceCharge + policePriceList2.changeServiceCharge,
                            fuelDiffPrice: policePriceList1.yqTaxDiff + policePriceList2.yqTaxDiff,
                            airraxDiffPrice: policePriceList1.cnTaxDiff + policePriceList2.cnTaxDiff,
                            taxDiffPrice: policePriceList1.taxDiff + policePriceList2.taxDiff
                        }
                    }
                    let childBabyPriceList1 = this.pageData.flightInfoList[0].cabinCHDINFFareList
                    let childBabyPriceList2 = this.pageData.flightInfoList[1].cabinCHDINFFareList
                    // 婴儿儿童
                    let childPriceList1 = {}
                    let babyPriceList1 = {}
                    if(childBabyPriceList1) {
                        for (let i = 0; i < childBabyPriceList1.length; i++) {
                            // 儿童、婴儿
                            if (childBabyPriceList1[i].passengerType == 'CHD') {
                                // 儿童总差价 票面差价 票面差价 燃油差价 机建差价 改期升舱税费差价
                                childPriceList1 = {
                                    totalDiffPrice: childBabyPriceList1[i].totalDiff,
                                    faceValueDiffPrice: childBabyPriceList1[i].ticketPriceDiff,
                                    chargeDiffPrice: childBabyPriceList1[i].changeServiceCharge,
                                    fuelDiffPrice: childBabyPriceList1[i].yqTaxDiff,
                                    airraxDiffPrice: childBabyPriceList1[i].cnTaxDiff,
                                    taxDiffPrice: childBabyPriceList1[i].taxDiff
                                }
                            } else if (childBabyPriceList1[i].passengerType == 'INF') {
                                // 婴儿总差价 票面差价 票面差价 燃油差价 机建差价 改期升舱税费差价
                                babyPriceList1 = {
                                    totalDiffPrice: childBabyPriceList1[i].totalDiff,
                                    faceValueDiffPrice: childBabyPriceList1[i].ticketPriceDiff,
                                    chargeDiffPrice: childBabyPriceList1[i].changeServiceCharge,
                                    fuelDiffPrice: childBabyPriceList1[i].yqTaxDiff,
                                    airraxDiffPrice: childBabyPriceList1[i].cnTaxDiff,
                                    taxDiffPrice: childBabyPriceList1[i].taxDiff
                                }
                            }
                        }
                    }
                    if(childBabyPriceList2){
                        for (let i = 0; i < childBabyPriceList2.length; i++) {
                            // 儿童、婴儿
                            if (childBabyPriceList2[i].passengerType == 'CHD') {
                                // 儿童总差价 票面差价 票面差价 燃油差价 机建差价 改期升舱税费差价
                                this.child = {
                                    totalDiffPrice: childBabyPriceList2[i].totalDiff + childPriceList1.totalDiffPrice,
                                    faceValueDiffPrice: childBabyPriceList2[i].ticketPriceDiff + childPriceList1.faceValueDiffPrice,
                                    chargeDiffPrice: childBabyPriceList2[i].changeServiceCharge + childPriceList1.chargeDiffPrice,
                                    fuelDiffPrice: childBabyPriceList2[i].yqTaxDiff + childPriceList1.fuelDiffPrice,
                                    airraxDiffPrice: childBabyPriceList2[i].cnTaxDiff + childPriceList1.airraxDiffPrice,
                                    taxDiffPrice: childBabyPriceList2[i].taxDiff + childPriceList1.taxDiffPrice
                                }
                            } else if (childBabyPriceList2[i].passengerType == 'INF') {
                                // 婴儿总差价 票面差价 票面差价 燃油差价 机建差价 改期升舱税费差价
                                this.baby = {
                                    totalDiffPrice: childBabyPriceList2[i].totalDiff + babyPriceList1.totalDiffPrice,
                                    faceValueDiffPrice: childBabyPriceList2[i].ticketPriceDiff + babyPriceList1.faceValueDiffPrice,
                                    chargeDiffPrice: childBabyPriceList2[i].changeServiceCharge + babyPriceList1.chargeDiffPrice,
                                    fuelDiffPrice: childBabyPriceList2[i].yqTaxDiff + babyPriceList1.fuelDiffPrice,
                                    airraxDiffPrice: childBabyPriceList2[i].cnTaxDiff + babyPriceList1.airraxDiffPrice,
                                    taxDiffPrice: childBabyPriceList2[i].taxDiff + babyPriceList1.taxDiffPrice
                                }
                            }
                        }
                    }
                }
                if(this.adult) {
                    Object.assign(this.adult, {title: '成人', count: this.adultNum})
                    this.people.push(this.adult);
                    let adultTotalPrice = this.adult.totalDiffPrice * this.adultNum
                    this.totalPrice += adultTotalPrice
                }
                if(this.child){
                    Object.assign(this.child, {title: '儿童', count: this.childNum})
                    this.people.push(this.child);
                    let childTotalPrice = this.child.totalDiffPrice * this.childNum
                    this.totalPrice += childTotalPrice
                }
                if(this.baby) {
                    Object.assign(this.baby, {title: '婴儿', count: this.babyNum})
                    this.people.push(this.baby);
                    let babyTotalPrice = this.baby.totalDiffPrice * this.babyNum
                    this.totalPrice += babyTotalPrice
                }
                if(this.police) {
                    Object.assign(this.police, {title: '军残警残', count: this.policeNum})
                    this.people.push(this.police);
                    let policeTotalPrice = this.police.totalDiffPrice * this.policeNum
                    this.totalPrice += policeTotalPrice
                }
                console.log(this.people);
                console.log('totalPrice---' + this.totalPrice);
            },
            // 关闭规则页面
            closeRulesPage() {
                this.canShowRules = false;
            },
            // 点击规则按钮
            clickRulesBtn() {
                this.canShowRules = true;
            },
            // 点击返回按钮
            clickBackBtn() {
                controller.close({
                    flag: -1
                });
            },
            // 显示明细弹框
            showModel() {
                if(this.totalPrice) {
                    this.isShowModel = !this.isShowModel;
                }
            },
            hideModel() {
                this.isShowModel = false;
            },
            // 机票订单确认改期
            createOrderParams() {
                return {
                    request: {
                        ffpCardNo: this.memberInfo.memberID,
                        ffpId: this.memberInfo.id,
                        loginKeyInfo: this.memberInfo.loginKeyInfo,

                        channelOrderNo: ChannelOrderNo(new Date()),
                        routeType: this.pageData.routeType,
                        interFlag: this.pageData.tripType,
                        linker: this.linker,
                        linkerHandphone: this.linkerHandphone,
                        passengerInfoList: this.pageData.passengerInfoList,
                        flightInfoList: this.pageData.flightInfoList,
                        fareTaxInfoList: this.pageData.fareTaxInfoList,
                        oldFareTaxInfoList: this.pageData.oldFareTaxInfoList,
                        channelPrivateInfo: '',
                        originOrderNo: this.pageData.originOrderNo,
                        originChannelOrderNo: this.pageData.originChannelOrderNo,
                        originChannelCode: this.pageData.originChannelCode,
                    }
                }
            },
            orderChange() {
                const that = this;
                controller
                    .getJSON({
                        method: "POST",
                        url: requesturl.CHANGEDATE.OrderChangeOrder,
                        oldParams: that.createOrderParams()
                    })
                    .then(that.sucFun);
            },
            // 票号确认改期
            createTicketParams() {
                return {
                    request: {
                        ffpCardNo: this.memberInfo.memberID,
                        ffpId: this.memberInfo.id,
                        loginKeyInfo: this.memberInfo.loginKeyInfo,

                        ticketNo: this.pageData.ticketNo,
                        pnrNo: this.pageData.pnrNo,

                        channelOrderNo: ChannelOrderNo(new Date()),
                        routeType: this.pageData.routeType,
                        interFlag: this.pageData.tripType,
                        linker: this.linker,
                        linkerHandphone: this.linkerHandphone,
                        passengerInfoList: this.pageData.passengerInfoList,
                        flightInfoList: this.pageData.flightInfoList,
                        fareTaxInfoList: this.pageData.fareTaxInfoList,
                        oldFareTaxInfoList: this.pageData.oldFareTaxInfoList,
                        channelPrivateInfo: '',
                        oldFlightInfoList: this.pageData.oldFlightInfoList
                    }
                }
            },
            ticketChange() {
                const that = this;
                controller
                    .getJSON({
                        method: "POST",
                        url: requesturl.CHANGEDATE.TicketChangeOrder,
                        oldParams: that.createTicketParams()
                    })
                    .then(that.sucFun);
            },
            sucFun(res) {
                console.log(res);
                console.log(AllOrderType.FLIGHT)
                if(res.resultCode == '10001') {
                    if(res.objData.payState) {
                        let successPage = Page.myOrder.paySuccess;
                        controller.open({
                            winName: successPage.winName,
                            path: successPage.pageUrl,
                            data: {
                                transOrderType: "changeDate",
                                channelOrderNo: res.objData.channelOrderNo,
                                orderNo: res.objData.orderNo
                            },
                            closeLastPage: true 
                        });
                    } else {
                        controller.open({
                            winName: Page.changeDate.orderPayment.winName,
                            path: Page.changeDate.orderPayment.pageUrl,
                            data: {
                                orderType: AllOrderType.FLIGHT,
                                orderNo: res.objData.orderNo,
                                channelOrderNo: res.objData.channelOrderNo
                            }
                        })
                    }
                } else {
                    controller.toast({
                        str: res.resultInfo,
                        times: 2000
                    })
                }
            },
            
            validate() {
                let that = this;
                if(that.linker == ''){
                    controller.toast({str: '请输入联系人姓名'});
                    return;
                }
                if(!juneyaoair.validateNameAll(that.linker)){
                    return;
                }
                if(that.linkerHandphone == ''){
                    controller.toast({str: '请输入手机号'});
                    return;
                }
                if(!juneyaoair.validateTel(that.linkerHandphone)){
                    return;
                }
                return true;
            },
            // 票号订单确认改期
            // 提交申请
            nextStep() {
                // listStyle默认：1：订单列表页   0: 票号查询
                const that = this;
                
                if(that.validate()) {
                    if(this.pageData.listStyle == 1) {
                        this.orderChange();
                    } else if(this.pageData.listStyle == 0) {
                        this.ticketChange()
                    }
                }
            },
            // 选择联系人
            openContact() {
                controller.openContact(function(res){
                    console.log(res);
                    this.linker = res.name;
                    this.linkerHandphone = res.phoneNumber
                })
            },
            // 判断是否含餐食 
            mealCodeStatus(type) {
                let status = '';
                switch (type) {
                    case 'B': // 含早餐
                        status = '含餐食'
                        break;
                    case 'L': // 含午餐
                        status = '含餐食'
                        break;
                    case 'D': // 含晚餐
                        status = '含餐食'
                        break;
                    case 'S': // 含点心
                        status = '含点心'
                        break;
                }
                return status;
            },
            // 时间戳差转时间 h:m
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
            },
            // 打开服务条款
            openVipRule() {
                let service_Page = Page.clause.service_clause;
                controller.open({
                    winName: service_Page.winName,
                    path: WEBIP + service_Page.pageUrl
                });
            },
        }
    };
</script>
