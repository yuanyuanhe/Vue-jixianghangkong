<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn'></Header>
        <div class="main mainNotTop mainNotBottom">
            <div class="header-wrap">
                <div class="line-1 flexbox">
                    <div class="text">已支付</div>
                    <div class="money flex-1">
                        <div class="num">
                            <span>&yen;</span>2999.00</div>
                        <div class="tip-btn"></div>
                    </div>
                </div>
                <div class="line-2 flexbox">
                    <div class="text flex-1">
                        <div class="text-1">申请退款请查看退款规则</div>
                    </div>
                    <div class="rules-btn" @click="clickRuleBtn">
                        <div class="text">退款规则</div>
                        <div class="img"></div>
                    </div>
                </div>
                <div class="line-2 flexbox">
                    <div class="text flex-1"></div>
                    <div class="rules-btn" @click="clickRuleBtn">
                        <div class="text">退款规则</div>
                        <div class="img"></div>
                    </div>
                </div>
                <div class="line-2 flexbox">
                    <div class="text flex-1">
                        <span>请在</span>
                        <span class="icon"></span>
                        <span class="time">5:00</span>
                        <span>内完成支付</span>
                    </div>
                    <div class="rules-btn">
                        <div class="text">退款规则</div>
                        <div class="img"></div>
                    </div>
                </div>
                <div class="btn-wrap flexbox justify-content">
                    <div class="cancel-btn btn">取消订单</div>
                    <div class="pay-btn btn">去支付</div>
                </div>
            </div>
            <div class="container">
                <!-- 提示 -->
                <div class="hintTip flexbox">
                    <div class="hintTipTxt">提示</div>
                    <div class="hintTipInfo flex-1">无托运行李请至少于航班起飞前40分钟(有托运行李 请至少提前45分钟)</div>
                </div>
                <!-- 预留登机牌信息 -->
                <div class="boardBox">
                    <div class="boardBox-bd">
                        <div class="boardBox-title">预留登机牌</div>
                        <div class="boardBox-main">
                            <p>03-11 12:00 至 18:00</p>
                            <p>上海浦东T2 <img src="../../../common/imgs/board-arrow.png" /> 黄花机场T1</p>
                            <p>
                                <span>HO1234</span>
                                <span>空客A320</span>
                            </p>
                            <p>03-11 12:00 至 18:00</p>
                        </div>
                    </div>
                    <div class="boardBox-ft">请前往C4柜台领取登机牌，如有问题请致电18123943443</div>
                </div>
                <!-- 乘机人信息 -->
                <div class="m-title">乘机人信息</div>
                <div class="psgBox">
                    <div class="psgItem">
                        <div class="psg-main flexbox">
                            <div class="psg-title">易洋千玺</div>
                            <div class="psg-info flex-1">
                                <div class="idCard">
                                    <span>身份证</span>
                                    <span>412301**********11</span>
                                </div>
                                <div class="idCard">
                                    <span>票号</span>
                                    <span>1048487293</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="psgItem">
                        <div class="psg-main flexbox">
                            <div class="psg-title">易洋千玺</div>
                            <div class="psg-info flex-1">
                                <div class="idCard">
                                    <span>身份证</span>
                                    <span>412301**********11</span>
                                </div>
                                <div class="idCard">
                                    <span>票号</span>
                                    <span>1048487293</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 乘机人信息 -->
                <div class="m-title">联系人信息</div>
                <div class="psgBox">
                    <div class="psgItem">
                        <div class="psg-main flexbox">
                            <div class="psg-title">余优优</div>
                            <div class="psg-info flex-1">
                                <div class="idCard">15944024088</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 订单编号、时间 -->
                <div class="order-infor come-style">
                    <div class="order-num flexbox every-order-infor">
                        <div class="name">订单编号</div>
                        <div class="content flex-1">9872348723442234</div>
                    </div>
                    <div class="order-time flexbox every-order-infor">
                        <div class="name">下单时间</div>
                        <div class="content flex-1">2018-05-23 18:30</div>
                    </div>
                </div>
                <!-- 删除 -->
                <div class="delete-btn">
                    <div class="img"></div>
                    <div class="text">删除订单</div>
                </div>
            </div>
        </div>
        <!-- 退款规则 -->
        <RuleSlot :rulesTitle='rulesTitle' @clickCloseBtn='closeRulesPage' v-show='canShowRules' :isShow='canShowRules'>
            <div class="rulesInfo" slot="ruleInfo">
                预留登机牌所对应的客票发生非自愿变更、退票或签转时可拨打国内热线95520，联系客服提交退款申请，其他情况不可退款。
            </div>
        </RuleSlot>
    </div>
</template>

<script>
    import "common/tools/rem";
    import Header from "components/header.vue";
    import RuleSlot from "components/ruleSlot.vue";
    import controller from "common/logic/controller";
    export default {
        data() {
            return {
                pageData: {},
                // 显示规则
                canShowRules: false,
                isShowLeg: false,
                rulesTitle: '退款规则'
            };
        },
        components: {
            Header,
            RuleSlot
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo || {};
                that.pageData = data.data;
            });
        },
        methods: {
            clickBackBtn() {
                controller.close();
            },
            // 关闭规则页面
            closeRulesPage() {
                this.canShowRules = false;
            },
            // 打开规则页面
            clickRuleBtn() {
                this.canShowRules = true;
            },
            showLeg() {
                this.isShowLeg = true;
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "~common/styles/common/common.scss";
    @import '~common/styles/boardPass.scss';
</style>
