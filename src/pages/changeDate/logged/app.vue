<style lang="scss" scope>
    @import '~common/styles/common/common.scss';
    @import '~common/styles/changeDate.scss';
</style>
<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' @clickSkip='clickSkip' :setTitleStyle="setTitleStyle"></Header>
        <div class="main safe-top-pt">
            <div class="container">
                <!-- 可改期航班 -->
                <div class="m-title" v-show="hasChange">可改期航班</div>
                <div class="way" v-show="hasChange">
                    <div class="wayItem" v-for="(item, index) in objData" :key="index" v-if="item.ableChange">
                        <div class="mainBox" v-for="(key, index) in item.changeFlightInfoList" :key="index">
                            <!-- 去程 -->
                            <div class="ow-main">
                                <div class="ow-hd">{{ key.depCityName }} - {{ key.arrCityName }}</div>
                                <div class="ow-bd">{{ key.depDate }} {{ key.depDateTime }} 至 {{ key.arrDate }} {{ key.arrDateTime }}</div>
                                <div class="ow-ft">
                                    <span>{{ key.flightNo }}</span>|
                                    <span>{{ key.depCityName ? key.depCityName : '' }}{{ key.depAirportName ? key.depAirportName : '' }}{{ key.depTerm == '--' || key.depTerm == null ? '' : key.depTerm }}出发</span>
                                </div>
                            </div>
                        </div>
                        <div class="ow-btn" @click="setDate(item.channelOrderNo, (item.orderNo ||''), index)">改期</div>
                    </div>
                </div>
                <!-- 以下航班已改期 -->
                <div class="m-title" v-show="notChange">以下航班已改期，暂不支持线上再次改期，若有疑问联系客服</div>
                <div class="way" v-show="notChange">
                    <div class="wayItem" v-for="(item, index) in objData" :key="index" v-if="!item.ableChange">
                        <div class="mainBox" v-for="(key, index) in item.changeFlightInfoList" :key="index">
                            <!-- 去程 -->
                            <div class="ow-main">
                                <div class="ow-hd">{{ key.depCityName }} - {{ key.arrCityName }}</div>
                                <div class="ow-bd">{{ key.depDate }} {{ key.depDateTime }} 至 {{ key.arrDate }} {{ key.arrDateTime }}</div>
                                <div class="ow-ft">
                                    <span>{{ key.flightNo }}</span>|
                                    <span>{{ key.depCityName ? key.depCityName : '' }}{{ key.depAirportName ? key.depAirportName : '' }}{{ key.depTerm == '--' || key.depTerm == null ? '' : key.depTerm }}出发</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "common/tools/rem"
    import Header from "components/header.vue"
    import { controller } from "common/logic/controller"
    import { saveLoginInfo } from 'common/logic/logic'
    import { ResultCode } from 'common/logic/enum';
    import Page from 'common/deploy/page'
    import requesturl from 'common/deploy/requesturl'
    import service from 'common/service/data'

    export default {
        data() {
            return {
                // 头部信息
                setTitleStyle: {
                    isUseH5: true,
                    title: '机票改期',
                    titlestyle: 4,
                    navRightItem: 2,
                    navRightTitle: '改期其他航班',
                },
                // 页面传的数据
                pageData: {},
                // 列表信息
                objData: [],
                // 查询带过来的证件号和乘客姓名
                params: {},
                notChange: 0,
                hasChange: 0
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                console.log(that.pageData.listStyle);
                // 默认：1：订单列表页   0: 票号查询
                if(that.pageData.listStyle == 0) {
                    that.setTitleStyle.navRightItem = 0;
                    that.params = that.pageData.params;
                    that.getChangeList(that.params);
                } else if(that.pageData.listStyle == 1){
                    that.getOrderList();
                }

                controller.onshow(function () {
                    saveLoginInfo().then(memberInfo => {
                        that.memberInfo = memberInfo
                    })
                })
                controller.clickBack(function() {
                    that.clickBackBtn();
                })
            })
        },
        methods: {
            // 点击返回按钮
            clickBackBtn() {
                if(this.pageData.listStyle == 1) {
                    controller.close({
                        flag: -1
                    });
                } else {
                    controller.close();
                }
            },
            // 点击右侧icon/文字 跳转
            clickSkip() {
                // 点击改期其它航班
                controller.open({
                    winName: Page.changeDate.index.winName,
                    path: Page.changeDate.index.pageUrl,
                    data: {
                        loginStyle: 1
                    },
                    animateType: 1
                })
            },
            // 查询待改期客票信息（未登录查询、已登录无可改期订单查询）
            getChangeList(params) {
                let that = this;
                service.getChangeList(params)
                .then((res) => {
                    that.sucFun(res);
                })
            },
            // 查询待改期客票信息（已登录有可改期订单查询）
            getOrderList() {
                let that = this;
                service.getOrderList()
                .then((res) => {
                    that.sucFun(res);
                })
            },
            sucFun(res) {
                console.log(res);
                if(res.resultCode == ResultCode.SUCCESS) {
                    this.objData = res.objData;
                } else {
                    controller.toast({
                        str: res.resultInfo
                    })
                }
            },
            // 选择航段和乘机人
            setDate(channelOrderNo, orderNo, index) {
                let that = this
                controller.open({
                    winName: Page.changeDate.choose.winName,
                    path: Page.changeDate.choose.pageUrl,
                    data: {
                        index: index,
                        listStyle: that.pageData.listStyle,
                        channelOrderNo: channelOrderNo,
                        orderNo: orderNo,
                        params: that.pageData.params || ''
                    }
                })
            }
        },
        components: {
            Header
        },
        watch: {
            objData: {
                handler: function(newVal, oldval) {
                    console.log(newVal, oldval);
                    for(let k in newVal) {
                        if(!newVal[k].ableChange) {
                            this.notChange++;
                        } else {
                            this.hasChange++;
                        }
                    }
                }
            }
        }
    };
</script>
