<template>
    <transition name='rules-page'>
        <div class="main mainNot">
            <div class="luggage-wrap">
                <div class="every-luggage" :class="{'first-luggage': index==0}" v-for="(item,index) in currentPageInfor" :key="'luggage'+index" v-if="item.luggageType != 3 && item.passengerType == 'ADT'">
                    <div class="title">{{item.luggageType==1?'随身携带行李限额':'托运行李额说明'}}</div>
                    <div class="content">
                        <table>
                            <tr>
                                <td class="name">舱位等级</td>
                                <td>{{cabinText(item.cabinGrade)}}</td>
                            </tr>
                            <tr>
                                <td class="name">免费行李额</td>
                                <td>{{item.perWeightLimit}}KG/件</td>
                            </tr>
                            <tr>
                                <td class="name">行李尺寸限制</td>
                                <td>{{item.sizeLimit}}</td>
                            </tr>
                            <tr v-if="item.flightType==flightType.I || item.luggageType==1">
                                <td class="name">数量限制</td>
                                <td>{{item.countLimit}}件</td>
                            </tr>
                            <tr v-if="item.luggageType==2">
                                <td class="name">儿童/占座婴儿</td>
                                <td>等同成人免费行李额</td>
                            </tr>
                            <tr v-if="item.luggageType==2 && item.flightType==flightType.D">
                                <td class="name">婴儿</td>
                                <td>无免费行李额</td>
                            </tr>
                            <tr v-if="item.luggageType==2 && item.flightType==flightType.I">
                                <td class="name">婴儿</td>
                                <td>23KG（三边之和不超过115CM）</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <!-- <div class="every-luggage" v-if="propsLuggage.flightType == flightType.I && propsLuggage.cabinGrade == cabinGrade.grade_3">
                    <div class="title">超额行李</div>
                    <div class="content">
                        <table>
                            <tr>
                                <td class="name">重量上线</td>
                                <td>50KG</td>
                            </tr>
                            <tr class="specialTr">
                                <td class="name">超规类别</td>
                                <td>逾重行李按成人最高经济舱直达票价的 1.5%计算（以人民币元为单位，尾数四 四舍五入）</td>
                            </tr>
                        </table>
                    </div>
                </div> -->
                <div class="every-luggage" v-if="propsLuggage.flightType == flightType.I">
                    <div class="title">超额行李</div>
                    <div class="content">
                        <table class="specialTab">
                            <tr>
                                <td>重量上线</td>
                                <td>超规类别</td>
                                <td>收费标准</td>
                            </tr>
                            <tr>
                                <td rowspan="3">32KG/件</td>
                                <td>超重 24~32KG(含)</td>
                                <td>1000元/件</td>
                            </tr>
                            <tr>
                                <td>超件 1件及以上</td>
                                <td>1000元/件</td>
                            </tr>
                            <tr>
                                <td class="hasPadding">超尺寸(三边之和) 159~203CM(含)</td>
                                <td>1000元/件</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="every-luggage" v-if="propsLuggage.flightType == flightType.D">
                    <div class="title">超额行李</div>
                    <div class="content">
                        <table>
                            <tr>
                                <td class="name">重量上线</td>
                                <td>50KG</td>
                            </tr>
                            <tr class="specialTr">
                                <td class="name">超规类别</td>
                                <td>逾重行李按成人最高经济舱直达票价的 1.5%计算（以人民币元为单位，尾数四 四舍五入）</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="close-btn" @click="closeLuggageLimit"></div>
        </div>
    </transition>
</template>

<script>
    import controller from 'common/logic/controller';
    import requesturl from 'common/deploy/requesturl';
    import {
        ResultCode,
    } from "common/logic/enum.js";
    export default {
        props: {
            propsLuggage: {
                ffpCardNo: "",
                ffpId: "",
                loginKeyInfo: "",
                flightType: "",
                cabinGrade: "",
                destination: "",
                memberLevel: "",
                type: ""
            }
        },
        data() {
            return {
                hasSendAjax: [], //已经发送的请求和数据
                flightType: { //航班性质
                    "D": "D",
                    "I": "I"
                },
                cabinGrade: { //舱位等级
                    grade_1: "F", //头等舱
                    grade_2: "Y", //经济舱
                    grade_3: "C", //商务舱
                },
                currentPageInfor: []
            }
        },
        methods: {
            // 舱位中文
            cabinText(cabin) {
                if(cabin == "F") {
                    return "头等舱"
                }
                if(cabin == "Y") {
                    return "经济舱"
                }
                if(cabin == "C") {
                    return "商务舱"
                }
            },
            // 点击关闭按钮
            closeLuggageLimit() {
                this.$emit('closeLuggageLimit');
            },
            // 是否存在,请求的数据
            existData(obj) {
                for(let i=0; i < this.hasSendAjax.length; i++) {
                    if(this.hasSendAjax[i].type == obj.type) {
                        return i;
                    }
                }
                return false;
            },
            // 请求行李额数据
            luggageAjax() {
                let that = this;
                controller
                .getJSON({
                    method: "POST",
                    url: requesturl.flightLUGGAGE,
                    params: that.luggageParams()
                })
                .then(that.luggageSuccess)
                .catch(that.luggageError);
            },
            luggageParams() {
                return {
                    request: {
                        ffpCardNo: this.propsLuggage.ffpCardNo,
                        ffpId: this.propsLuggage.ffpId,
                        loginKeyInfo: this.propsLuggage.loginKeyInfo,
                        flightType: this.propsLuggage.flightType,
                        memberLevel: this.propsLuggage.memberLevel,
                        cabinGrade: this.propsLuggage.cabinGrade,
                        destination: this.propsLuggage.destination
                    }
                };
            },
            luggageSuccess(result) {//请求成功
                if (result.resultCode == ResultCode.SUCCESS) {
                    console.log(444);
                    console.log(result.objData);
                    this.currentPageInfor = this.orderLuggageData(result.objData);
                    console.log(this.currentPageInfor);
                    this.currentPageInfor.type = this.propsLuggage.type;
                    this.hasSendAjax.push(this.currentPageInfor);
                } else {
                    controller.toast({
                        str: result.resultInfo
                    });
                }
            },
            luggageError() {//请求失败
                controller.toast({
                    str: "查询行李额失败"
                });
            },
            // 请求数据排序
            orderLuggageData(data) {
                data.sort(function(a,b) {
                    return a.luggageType - b.luggageType;
                });
                return data;
            }
        },
        watch: {
            propsLuggage: {
                handler(newVal,oldVal) {
                    let existIndex = this.existData(newVal);
                    console.log(existIndex);
                    if(existIndex!==0 && !existIndex) {
                        this.luggageAjax();
                    } else {
                        this.currentPageInfor = this.hasSendAjax[existIndex];
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
    }
    body.style-ios {
        .main.mainNot,
        .rule-main {
            padding-top: rem(40);
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
    .luggage-wrap {
        position: absolute;
        top: 0;
        bottom: rem(180);
        left: 0;
        right: 0;
        padding: 0 rem(30);
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        padding-top: rem(100);
        padding-bottom: rem(50);
    }
    .first-luggage {
        margin-top: rem(100);
    }
    .every-luggage {
        margin-top: rem(30);
        .title {
            font-size: rem(28);
            color: #3A3D50;
            font-weight: bold;
        }
        .content {
            margin-top: rem(20);
            table {
                width: 100%;
                td {
                    height: rem(60);
                    border: 1px solid #EBECEE;
                    padding-left: rem(30);
                    box-sizing: border-box;
                    -webkit-box-sizing: border-box;
                    color: #848484;
                    font-size: rem(24);
                    &.name {
                        width: rem(210);
                        background-color: #FAFAFA;
                        color: #3A3D50;
                    }
                }
                .specialTr td {
                    height: auto;
                    &:nth-child(1) {
                        padding-top: rem(18);
                        vertical-align: top;
                    }
                    &:nth-child(2) {
                        padding: rem(24) rem(20) rem(24) rem(15);
                        line-height: rem(32);
                    }
                }
            }
            .specialTab {
                td {
                    text-align: center;
                    padding: 0;
                }
                tr:nth-child(1) td {
                    background: #FAFAFA;
                    color: #3A3D50;
                }
                tr td:nth-child(1) {
                    width: rem(156);
                }
                tr td:nth-child(2) {
                    width: rem(267);
                }
                .hasPadding {
                    padding: rem(18) 0;
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
</style>