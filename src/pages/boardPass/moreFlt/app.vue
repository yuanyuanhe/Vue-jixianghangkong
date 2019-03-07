<style lang="scss" scoped>
    @import '~common/styles/common/common.scss';
    @import '~common/styles/boardPass.scss';
</style>
<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
        <div class="main mainNotBottom">
            <div class="container">
                <!-- 可改期航班 -->
                <div class="m-title">现在至起飞前50分钟可购买预订</div>
                <div class="legBox legBox1">
                    <div class="legItem">
                        <div class="ow-psg flexbox">
                            <span>乘机人</span>
                            <span class="flex-1">Elda Rutherford</span>
                        </div>
                        <div class="ow-main">
                            <div class="ow-hd">
                                <div class="hdBox">
                                    <span>2018-08-16 周四</span>|
                                    <span>HO1234</span>|
                                    <span>空客A320(中)</span>
                                </div>
                            </div>
                            <div class="ow-bd">
                                <div class="bdDay"></div>
                                <div class="bdBox flexbox">
                                    <div class="bdBoxItem bdBoxItem1 flex-1">
                                        <div class="bdBox-date">23:35</div>
                                        <div class="bdBox-txt">浦东T2</div>
                                    </div>
                                    <div class="bdBoxItem flex-1">
                                        <div class="bdBox-time">5h30m</div>
                                        <div class="bdBox-img"></div>
                                        <div class="bdBox-stop">经停南京</div>
                                    </div>
                                    <div class="bdBoxItem bdBoxItem2 flex-1">
                                        <div class="bdBox-date">02:05</div>
                                        <div class="bdBox-txt">浦东T2</div>
                                    </div>
                                </div>
                            </div>
                            <div class="ow-ft">
                                <div class="ftBtn">选择该航班</div>
                            </div>
                        </div>
                    </div>
                    <div class="legItem">
                        <div class="ow-psg flexbox">
                            <span>乘机人</span>
                            <span class="flex-1">Elda Rutherford</span>
                        </div>
                        <div class="ow-main">
                            <div class="ow-hd">
                                <div class="hdBox">
                                    <span>2018-08-16 周四</span>|
                                    <span>HO1234</span>|
                                    <span>空客A320(中)</span>
                                </div>
                            </div>
                            <div class="ow-bd">
                                <div class="bdDay"></div>
                                <div class="bdBox flexbox">
                                    <div class="bdBoxItem bdBoxItem1 flex-1">
                                        <div class="bdBox-date">23:35</div>
                                        <div class="bdBox-txt">浦东T2</div>
                                    </div>
                                    <div class="bdBoxItem flex-1">
                                        <div class="bdBox-time">5h30m</div>
                                        <div class="bdBox-img"></div>
                                        <div class="bdBox-stop">经停南京</div>
                                    </div>
                                    <div class="bdBoxItem bdBoxItem2 flex-1">
                                        <div class="bdBox-date">02:05</div>
                                        <div class="bdBox-txt">浦东T2</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ow-foot">
                            距航班起飞时间已少于50分钟，不能购买预留登机牌
                        </div>
                    </div>
                    <div class="legItem">
                        <div class="ow-psg flexbox">
                            <span>乘机人</span>
                            <span class="flex-1">Elda Rutherford</span>
                        </div>
                        <div class="ow-main">
                            <div class="ow-hd">
                                <div class="hdBox">
                                    <span>2018-08-16 周四</span>|
                                    <span>HO1234</span>|
                                    <span>空客A320(中)</span>
                                </div>
                            </div>
                            <div class="ow-bd">
                                <div class="bdDay"></div>
                                <div class="bdBox flexbox">
                                    <div class="bdBoxItem bdBoxItem1 flex-1">
                                        <div class="bdBox-date">23:35</div>
                                        <div class="bdBox-txt">浦东T2</div>
                                    </div>
                                    <div class="bdBoxItem flex-1">
                                        <div class="bdBox-time">5h30m</div>
                                        <div class="bdBox-img"></div>
                                        <div class="bdBox-stop">经停南京</div>
                                    </div>
                                    <div class="bdBoxItem bdBoxItem2 flex-1">
                                        <div class="bdBox-date">02:05</div>
                                        <div class="bdBox-txt">浦东T2</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ow-foot">
                            可购买名额已满，不能购买预留登机牌
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
    import Footer from "components/footer.vue"
    import { saveLoginInfo } from 'common/logic/logic'
    import {
        controller
    } from "common/logic/controller"
    import Page from 'common/deploy/page'
    import requesturl from 'common/deploy/requesturl'

    export default {
        data() {
            return {
                pageData: {},
                setTitleStyle: {
                    title: '更多航班',
                    titlestyle: 4
                }
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                controller.onshow(function () {
                    saveLoginInfo().then(memberInfo => {
                        that.memberInfo = memberInfo
                    })
                })
            })
        },
        components: {
            Header,
            Footer
        },
        methods: {
            // 点击返回按钮
            clickBackBtn() {
                controller.close({
                    flag: -1
                });
            },
            // 提交申请
            nextStep() {
                const that = this;
                controller.open({
                    winName: Page.changeDate.ackDate.winName,
                    path: Page.changeDate.ackDate.pageUrl
                })
                // if(that.canClickBtn &&that.startVerification()) {
                //     controller.getJSON({
                //         method : 'POST',
                //         url: requesturl.PASSENGERS.BASSINET,
                //         params: that.createParams_1()
                //     })
                //     .then(that.sucCallback_1)
                //     .catch(that.errCallback)
                // }
            },
        },
        computed: {
            submitBtnCls() {
                // if(this.checkInput && this.psgInfo.passengerName && this.psgInfo.birthdate && this.psgInfo.height && this.psgInfo.weight && this.psgInfo.depAirportName && this.psgInfo.arrAirportName && this.psgInfo.keeper && this.psgInfo.keeperHandphone && this.psgInfo.keeperEmail && this.psgInfo.flightDate) {
                //     this.canClickBtn = true;
                //     return 'g-btn'
                // } else {
                //     this.canClickBtn = false;
                //     return 'g-btn g-disabled'
                // }
            }
        },
    };
</script>
