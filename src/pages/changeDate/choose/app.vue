<style lang="scss" scope>
    @import '~common/styles/common/common.scss';
    @import '~common/styles/changeDate.scss';

    .legItem {
        .ow-main {
            padding-right: rem(100);
        }
    }

    .psgBox .psgItem .psg-main .psg-info {
        padding-right: rem(70);
    }

    // 规则
    .every-rules {
        .title {
            font-size: rem(28);
            color: #3A3D50;
        }
        .content {
            margin-top: rem(30);
            margin-bottom: rem(60);
            font-size: rem(24);
            & > div {
                margin-top: rem(20);
                span {
                    width: rem(128);
                    color: #848484;
                    &:first-child {
                        color: #ADADAD;
                    }
                }
            }
        }
        table {
            border: 1px solid #ECECEC;
            text-align: center;
            font-size: rem(24);
            th,td {
                padding: rem(14) 0;
            }
            th {
                background: #FBFBFB;
                color: #3A3D50;
                width: rem(230);
            }
            td {
                &:first-child {
                    color: #3A3D50;
                    background: #FBFBFB;
                }
                color: #848484;
            }
        }
        .txt {
            font-size: rem(24);
            color: #ADADAD;
            line-height: rem(34);
            margin-top: rem(30);
        }
    }
</style>
<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
        <div class="main">
            <div class="container">
                <!-- 可改期航班 -->
                <div class="m-title">选择航段</div>
                <div class="legChangeBox">
                    <!-- <div class="legItem" v-for="(item, index) in objData.changeFlightInfoList" v-if="item.ableChange" :key="index"> -->
                    <div class="legItem" v-for="(item, index) in objData.changeFlightInfoList" :key="index">
                        <div class="ow-main">
                            <div class="ow-hd">
                                <div class="hdBox flexbox">
                                    <div class="hd-info flex-1">
                                        <span v-if="objData.routeType == 'OW'">单程</span>
                                        <span v-if="item.flightDirection == 'G' && objData.routeType == 'RT'">去程</span>
                                        <span v-if="item.flightDirection == 'B'">返程</span>
                                        <span>{{ turnTime(item.depFlightDate, 'YYYY-MM-DD dd') }}</span>
                                    </div>
                                    <div class="hd-rules" @click.stop="clickRuleBtn(index)">
                                        <div class="tip"></div>
                                        <span>改期规则</span>
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
                                <div class="bdDay">{{ item.days ? '+' + item.days + '天' : '' }}</div>
                                <div class="bdBox flexbox">
                                    <!--出发 -->
                                    <div class="bdBoxItem bdBoxItem1 flex-1">
                                        <div class="bdBox-date">{{ item.depDateTime }}</div>
                                        <div class="bdBox-txt">{{ item.depCityName ? item.depCityName : '' }}{{ item.depAirportName ? item.depAirportName : '' }}{{ item.depTerm == '--' || item.depTerm == null ? '' : item.depTerm }}</div>
                                    </div>
                                    <div class="bdBoxItem flex-1">
                                        <div class="bdBox-time">{{ dealFlyTime(item.duration) ? dealFlyTime(item.duration) : '' }}</div>
                                        <div class="bdBox-img"></div>
                                        <div class="bdBox-stop"></div>
                                    </div>
                                    <!-- 到达 -->
                                    <div class="bdBoxItem bdBoxItem2 flex-1">
                                        <div class="bdBox-date">{{ item.arrDateTime }}</div>
                                        <div class="bdBox-txt">{{ item.arrCityName ? item.arrCityName : '' }}{{ item.arrAirportName ? item.arrAirportName
                                            : '' }}{{ item.arrTerm == '--' || item.arrTerm == null ? '' : item.arrTerm }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <label class="scBox flexbox">
                            <input type="checkbox" name="chooseLeg" class="lcCheck" :checked="legCheckedMore[index]" @click.stop="chooseLeg(item, index)"
                                ref="legChecked">
                            <span class="lcBtn"></span>
                        </label>
                    </div>
                </div>
                <!-- 选择乘机人 -->
                <div class="m-title" v-show="!(!(objData.passengerInfoList.length == 1) && !(objData.changeFlightInfoList.length == 1)) || isChooseLeg">选择乘机人</div>
                <div class="psgBox" v-show="!(!(objData.passengerInfoList.length == 1) && !(objData.changeFlightInfoList.length == 1)) || isChooseLeg">
                    <div class="psgItem" v-for="(item, index) in objData.passengerInfoList" :key="index">
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
                            <label class="scBox flexbox">
                                <input type="checkbox" name="choosePsg" class="lcCheck" :checked="psgCheckedMore[index]" @click.stop="choosePsg(item, index)"
                                    ref="psgChecked">
                                <span class="lcBtn"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer>
            <button slot="sureBtn" class="g-btn" :class="{'g-disabled': !isChoose}" @click='nextStep'>下一步</button>
        </Footer>
        <!-- 改期规则 -->
        <RuleSlot :rulesTitle='rulesTitle' :isShowBar="true" @clickCloseBtn='closeRulesPage' v-show='canShowRules' :isShow='canShowRules'>
            <div class="rulesInfo" slot="ruleInfo">
                <div class="every-rules">
                    <div class="title">改期规则</div>
                    <div class="content">
                        <div class="flexbox">
                            <span>舱位</span>
                            <span class="flex-1">{{ rulesInfo.cabinName }}({{ rulesInfo.cabin }})</span>
                        </div>
                        <div class="flexbox">
                            <span>票面价</span>
                            <span class="flex-1">&yen;{{ rulesInfo.ticketPrice }}</span>
                        </div>
                    </div>
                    <table border="1" cellspacing="0" v-if="rulesInfo.changeRuleList">
                        <thead>
                            <tr>
                                <th></th>
                                <th>{{ rulesInfo.changeRuleList[0].desc }}</th>
                                <th>{{ rulesInfo.changeRuleList[1].desc }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>产品更改费</td>
                                <td>&yen;{{ rulesInfo.changeRuleList[0].changeFee }}/人</td>
                                <td>&yen;{{ rulesInfo.changeRuleList[1].changeFee }}/人</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="txt">
                        以上为成人机票退改说明和里程说明标准，仅供参考，请以实际情况为准。
                    </div>
                </div>
            </div>
        </RuleSlot>
    </div>
</template>

<script>
    import "common/tools/rem"
    import Header from "components/header.vue"
    import Footer from "components/footer.vue"
    import RuleSlot from "components/ruleSlot.vue";
    import {
        controller
    } from "common/logic/controller"
    import {
        ResultCode
    } from 'common/logic/enum';
    import Page from 'common/deploy/page'
    import requesturl from 'common/deploy/requesturl'
    import service from 'common/service/data'
    import { dateFormat } from 'common/logic/utils'

    export default {
        data() {
            return {
                pageData: {},
                setTitleStyle: {
                    title: '选择航段和乘机人',
                    titlestyle: 4
                },
                dateFormat: dateFormat,
                objData: {
                    changeFlightInfoList: [],
                    passengerInfoList: []
                },
                // 改期规则
                rulesTitle: '改期规则',
                rulesInfo: {},
                // 显示规则
                canShowRules: false,
                // 航段是否选中/乘机人是否选中
                isChoose: false,
                isChooseLeg: false,
                // 航段选中某个
                legCheckedMore: [],
                // 乘机人选中某个
                psgCheckedMore: [],
                psgType: [],
                // 选中的乘机人
                psgInfoData: {},
                // 传给原生的数据
                nativeData: {
                    // 多段选中状态 G: 去程 B：返程 GB：两段
                    chooseFlight: '',
                    // 去程出发日期
                    departureDate: '',
                    // 出发城市三字码
                    sendCode: '',
                    // 到达城市三字码
                    arrCode: '',

                    // 返程出发日期
                    returnDate: '',
                    // OW：单程  RT：返程
                    routeType: '',
                    // D：国内   I：国际
                    tripType: '',
                    // 改期航段
                    changeFlightInfoList: [],
                    // 改期乘客
                    passengerInfoList: []
                }
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                console.log(this.pageData.listStyle);
                that.changeDetail();
            })
        },
        components: {
            Header,
            Footer,
            RuleSlot
        },
        methods: {
            // 选择航段
            chooseLeg(item, index) {
                if (this.$refs.legChecked[index].checked) {
                    this.legCheckedMore[index] = true;
                    // 选中赋值
                    this.nativeData.changeFlightInfoList = this.objData.changeFlightInfoList
                    this.nativeData.tripType = this.objData.interFlag
                    this.nativeData.routeType = this.objData.routeType
                    if (this.objData.routeType == 'RT') {
                        this.nativeData.returnDate = this.objData.changeFlightInfoList[1].depFlightDate
                    } else if (this.objData.routeType == 'OW') {
                        this.nativeData.returnDate = ''
                    }

                    this.nativeData.sendCode = this.nativeData.changeFlightInfoList[0].depCityCode
                    this.nativeData.arrCode = this.nativeData.changeFlightInfoList[0].arrCityCode
                    this.nativeData.departureDate = this.nativeData.changeFlightInfoList[0].depFlightDate
                    this.nativeData.changeFlightInfoList[index].selectedFlag = true
                    // G去程0，B返程1
                    if (index == 0) {
                        if (this.$refs.legChecked[1] && this.$refs.legChecked[1].checked) {
                            this.nativeData.chooseFlight = 'GB'
                        } else {
                            this.nativeData.chooseFlight = 'G'
                        }
                    } else if (index == 1) {
                        if (this.$refs.legChecked[0] && this.$refs.legChecked[0].checked) {
                            this.nativeData.chooseFlight = 'GB'
                        } else {
                            this.nativeData.chooseFlight = 'B'
                        }
                    }
                } else {
                    this.legCheckedMore[index] = false;
                    this.nativeData.changeFlightInfoList[index].selectedFlag = false

                    if (index == 0) {
                        if (this.$refs.legChecked[1] && this.$refs.legChecked[1].checked) {
                            this.nativeData.chooseFlight = 'B'
                        } else {
                            this.nativeData.chooseFlight = ''
                            this.nativeData.changeFlightInfoList = []
                        }
                    } else if (index == 1) {
                        if (this.$refs.legChecked[0].checked) {
                            this.nativeData.chooseFlight = 'G'
                        } else {
                            this.nativeData.chooseFlight = ''
                            this.nativeData.changeFlightInfoList = []
                        }
                    }
                }
            },
            // 选择改期乘客
            choosePsg(item, index) {
                if (this.$refs.psgChecked[index].checked) {
                    this.psgCheckedMore[index] = true;
                    this.psgInfoData[index] = this.objData.passengerInfoList[index]
                } else {
                    this.psgCheckedMore[index] = false;
                    this.psgInfoData[index] = null;
                }

                // 赋值乘机人 
                this.nativeData.passengerInfoList = [];
                this.psgType = [];
                for (var k in this.psgInfoData) {
                    if (this.psgInfoData[k]) {
                        this.psgType.push(this.psgInfoData[k].passengerType)
                        console.log(this.psgInfoData[k].passengerType);
                        this.nativeData.passengerInfoList.push(this.psgInfoData[k]);
                    }
                }
            },
            // 点击返回按钮
            clickBackBtn() {
                controller.close({
                    flag: -1
                });
            },
            // 渲染可选改期航班
            changeDetail() {
                let that = this;
                // 订单改期（已登录有数据）
                // 客票改期（票号查询改期）
                if (that.pageData.listStyle == 1) {
                    controller.getJSON({
                            method: 'POST',
                            url: requesturl.CHANGEDATE.CHANGE_DETAIL,
                            params: {
                                request: {
                                    ffpCardNo: that.memberInfo.memberID,
                                    ffpId: that.memberInfo.id,
                                    loginKeyInfo: that.memberInfo.loginKeyInfo,
                                    channelOrderNo: that.pageData.channelOrderNo,
                                    orderNo: that.pageData.orderNo,
                                }
                            }
                        })
                        .then((res) => {
                            that.sucFun(res);
                        })
                } else if (that.pageData.listStyle == 0) {
                    service.getChangeList(that.pageData.params)
                        .then((res) => {
                            that.sucFun(res);
                        })
                }
            },
            sucFun(res) {
                if (res.resultCode == ResultCode.SUCCESS) {
                    console.log(res);
                    if(this.pageData.listStyle == 0) {
                        this.objData = res.objData[this.pageData.index]
                    } else if(this.pageData.listStyle == 1) {
                        this.objData = res.objData;
                    }

                    // 默认：1：订单列表页   0: 票号查询  (用于确认改期页面区分订单)
                    this.nativeData.listStyle = this.pageData.listStyle;
                    // 传入确认改期页面所需参数
                    if (this.pageData.listStyle == 0) {
                        this.nativeData.oldFlightInfoList = this.objData.oldFlightInfoList;
                        this.nativeData.pnrNo = this.objData.pnrNo
                        this.nativeData.ticketNo = this.objData.ticketNo
                    } else if (this.pageData.listStyle == 1) {
                        this.nativeData.linker = this.objData.linker;
                        this.nativeData.linkerHandphone = this.objData.linkerHandphone;
                        this.nativeData.originOrderNo = this.objData.orderNo;
                        this.nativeData.originChannelOrderNo = this.objData.channelOrderNo;
                        this.nativeData.originChannelCode = this.objData.originChannelCode;
                    }
                    // 税费列表
                    this.nativeData.oldFareTaxInfoList = this.objData.oldFareTaxInfoList

                    // 航段、乘机人为1时默认选中
                    if (this.objData.changeFlightInfoList.length == 1) {
                        this.legCheckedMore[0] = true;
                    }
                    if (this.objData.passengerInfoList.length == 1) {
                        this.psgCheckedMore[0] = true;
                    }

                    // 航段、乘机人为1时默认选中赋值
                    if (this.objData.changeFlightInfoList.length == 1) {
                        this.nativeData.changeFlightInfoList = this.objData.changeFlightInfoList
                        this.nativeData.tripType = this.objData.interFlag
                        this.nativeData.routeType = 'OW'
                        this.nativeData.sendCode = this.nativeData.changeFlightInfoList[0].depCityCode
                        this.nativeData.arrCode = this.nativeData.changeFlightInfoList[0].arrCityCode
                        this.nativeData.departureDate = this.nativeData.changeFlightInfoList[0].depFlightDate
                        this.nativeData.changeFlightInfoList[0].selectedFlag = true
                    }
                    if (this.objData.passengerInfoList.length == 1) {
                        this.nativeData.passengerInfoList = this.objData.passengerInfoList
                    }
                } else {
                    controller.toast({
                        str: res.resultInfo
                    })
                }
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
            // 提交申请
            nextStep() {
                const that = this;
                console.log(this.nativeData)
                console.log(this.psgType);
                // ADT－成人　CHD-儿童   INF-婴儿  GMJC-军残警残
                let childType, babyType, adultType;
                for(let k in this.psgType) {
                    if(this.psgType[k] == 'CHD') {
                        childType = true;
                    } else if(this.psgType[k] == 'INF') {
                        babyType = true;
                    } else if(this.psgType[k] == 'ADT') {
                        adultType = true;
                    }
                }
                console.log(childType, babyType, adultType);
                if (this.isChoose) {
                    if((childType || babyType) && !adultType) {
                        controller.toast({
                            str: '婴儿/儿童不能单独改期',
                            times: 2000
                        })
                    } else {
                        controller.openNative({
                            flag: 'changeDate',
                            data: this.nativeData
                        })
                    }
                }
            },


            // 关闭规则页面
            closeRulesPage() {
                this.canShowRules = false;
            },
            // 打开规则页面
            clickRuleBtn(index) {
                this.rulesInfo = this.objData.changeFlightInfoList[index]
                this.canShowRules = true;
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
                } else if(type == 'MM-dd'){
                    return M + '-' + D
                } else if(type == 'MM-dd hh:mm') {
                    return M + '-' + D + ' ' + h + ':' + m
                }
            }
        },
        watch: {
            nativeData: {
                handler: function (newVal, oldVal) {
                    // 判断按钮可不可点击
                    if (newVal.changeFlightInfoList.length && newVal.passengerInfoList.length) {
                        this.isChoose = true;
                    } else {
                        this.isChoose = false;
                    }
                    if (newVal.changeFlightInfoList.length) {
                        this.isChooseLeg = true;
                    } else {
                        this.isChooseLeg = false;
                    }
                },
                immediate: true,
                deep: true
            }
        }
    };
</script>
