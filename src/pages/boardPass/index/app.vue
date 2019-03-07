<style lang="scss" scoped>
    @import '~common/styles/common/common.scss';
    @import '~common/styles/boardPass.scss';
    .seatModel {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 101;
        background: rgba($color: #000, $alpha: .3);
        .seatBox {
            width: 100%;
            height: rem(392);
            background: #fff;
            position: absolute;
            bottom: 0;
            left: 0;
            .seat-hd {
                padding: rem(35) rem(30);
                font-size: rem(28);
                line-height: rem(28);
                color: #ADADAD;
                position: relative;
                li {
                    float: left;
                    margin-right: rem(60);
                    &.active {
                        color: #CB9D6D;
                    }
                }
                .seat-line {
                    width: rem(56);
                    height: rem(6);
                    background: #CB9D6D;
                    position: absolute;
                    top: rem(92);
                    left: rem(30);
                    transition: all .2s ease;
                    &.active {
                        left: rem(146);
                    }
                }
                .seat-close {
                    width: rem(34);
                    height: rem(34);
                    @include bg1('~common/imgs/icon_closed.png');
                    position: absolute;
                    top: rem(32);
                    right: rem(34);
                }
            }
            .seat-bd {
                .seat-item {
                    padding: rem(35) rem(30);
                    font-size: rem(28);
                    line-height: rem(28);
                    color: #3A3D50;
                    @include bd-top(#f4f4f4);
                    .style-ios & {
                        @include bd-top-ios(#f4f4f4);
                    }
                }
            }
        }
    }

    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    
    .slideAnimate-enter-active,
	.slideAnimate-leave-active {
        transition: all 300ms;
		.seatBox {
			transition: all 300ms;
		}
	}
	.slideAnimate-enter,
	.slideAnimate-leave-to {
		transform: translate3d(0, 0, 100%);
		.seatBox {
			transform: translate3d(0, 100%, 0);
		}
    }
</style>
<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header>
        <div class="main " :class="{mainNotTop: !pageData.loginStyle}">
            <div class="m-wp">
                <div class="banner" v-show="!pageData.loginStyle"></div>
                <div class="m-box mt109">
                    <!-- 查询航班 -->
                    <div class="m-form">
                        <div class="inputAnime flexbox">
                            <label>{{ labelInfo.ticketNo }}</label>
                            <input class="flex-1" v-model="ticketNo" type="text" @focus="focus(labelInfo.ticketNo, $event)" @blur="blur('ticketNo', $event)">
                            <div class="del" @click="del('ticketNo', $event)" v-show="ticketNo != ''"></div>
                        </div>
                        <div class="inputAnime flexbox">
                            <label>{{ labelInfo.passengerName }}</label>
                            <input class="flex-1" v-model="passengerName" type="text" @focus="focus('乘机人姓名', $event)" @blur="blur('passengerName', $event)">
                            <div class="del" @click="del('passengerName', $event)" v-show="passengerName != ''"></div>
                        </div>
                        <div class="form-btn">
                            <button class="cu-btn cu-btn-disabled">查询航班</button>
                        </div>
                    </div>
                    <!-- 查询结果 -->
                    <div class="legBox">
                        <div class="legItem">
                            <div class="ow-main">
                                <div class="ow-hd">
                                    <div class="hdBox">
                                        <span>2018-08-22 周四</span>|
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
                                            <div class="bdBox-stop"></div>
                                        </div>
                                        <div class="bdBoxItem bdBoxItem2 flex-1">
                                            <div class="bdBox-date">02:05</div>
                                            <div class="bdBox-txt">浦东T2</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <label class="scBox flexbox">
                                <input type="checkbox" name="chooseLeg" class="lcCheck">
                                <span class="lcBtn"></span>
                            </label>
                        </div>
                        <div class="legInfo">
                            <div class="infoItem flexbox">
                                <span>乘机人</span>
                                <span class="flex-1">崔晨旋</span>
                            </div>
                            <div class="infoItem flexbox">
                                <span>证件号</span>
                                <span class="flex-1">41230185738482911</span>
                            </div>
                            <div class="infoItem flexbox">
                                <span>座位号</span>
                                <span class="flex-1">33B</span>
                            </div>
                            <div class="infoItem flexbox">
                                <span>票号</span>
                                <span class="flex-1">1048487293</span>
                            </div>
                        </div>
                        <div class="legFt" @click="goMoreFlt">查看更多航班</div>
                    </div>
                    <!-- 座位偏好 -->
                    <div class="buyNotes" @click="showSeatModel">
                        <div class="inputBox flexbox">
                            <div class="inputTxt">座位偏好</div>
                            <input class="flex-1" type="text" readonly>
                            <div class="inputCheck"></div>
                        </div>
                    </div>
                    <!-- 联系人信息 -->
                    <div class="psgBox">
                        <div class="inputBox flexbox">
                            <div class="inputTxt">联系人</div>
                            <input class="flex-1" type="text" placeholder="张三">
                            <div class="inputCheck icon-del"></div>
                        </div>
                        <div class="inputBox flexbox">
                            <div class="inputTxt">手机号</div>
                            <input class="flex-1" type="text" placeholder="13817373727">
                            <div class="inputCheck icon-del"></div>
                        </div>
                    </div>
                    <!-- 积分使用 -->
                    <div class="scoreBox">
                        <div class="inputBox flexbox">
                            <div class="inputTxt">
                                积分
                                <div class="tip"></div>
                            </div>
                            <div class="scoreTxt flex-1">
                                <span>共 120000积分</span> 
                                <span>可用 899积分</span>
                            </div>
                            <label class="scBox flexbox">
                                <input type="checkbox" name="chooseLeg" class="lcCheck">
                                <span class="lcBtn"></span>
                            </label>
                        </div>
                        <div class="inputBox flexbox">
                            <div class="inputTxt">使用额度</div>
                            <input class="flex-1" type="text" placeholder="请输入使用积分额">
                        </div>
                        <div class="inputBox flexbox">
                            <div class="inputTxt">消费密码</div>
                            <input class="flex-1" type="text" placeholder="请输入消费密码">
                            <div class="inputBtn forgetPwd">忘记密码</div>
                        </div>
                    </div>
                    <!-- 购买须知 -->
                    <div class="buyNotes" @click="goBuyNotes">
                        <div class="inputBox flexbox">
                            <div class="inputTxt">购买须知</div>
                            <input class="flex-1" type="text" readonly>
                            <div class="inputCheck"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer>
            <div class="buyBox flexbox" slot="sureBtn">
                <div class="money flex-1" @click="showModel">
                    <span class="symbol">￥</span>
                    <span class="count">100</span>/张
                    <s>¥120</s>
                    <div class="tip"></div>
                    <span>明细</span>
                </div>
                <div class="buyBtn" @click="goPayment">支付</div>
            </div>
        </Footer>

        <!-- 座位偏好 -->
        <transition name="slideAnimate">
            <div class="seatModel" v-if="isSeatModel">
                <div class="seatBox">
                    <div class="seat-hd">
                        <ul class="clearfix">
                            <li v-for="(item, index) in modelNavs" :key="index" :class="{active: index == tabIndex}" @click="navChange(index)">{{ item }}</li>
                        </ul>
                        <div class="seat-line" :class="{active: tabIndex == 1}"></div>
                        <div class="seat-close" @click="hideSeatModel"></div>
                    </div>
                    <div class="seat-bd">
                        <div class="seatRow">
                            <div class="seat-item" v-for="(item, index) in modelRow" :key="index" v-if="tabIndex == 0">{{ item }}</div>
                        </div>
                        <div class="seatSite">
                            <div class="seat-item" v-for="(item, index) in modelSite" :key="index" v-if="tabIndex == 1">{{ item }}</div>
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
    import Footer from "components/footer.vue";
    import { controller, native } from "common/logic/controller"
    import { saveLoginInfo } from 'common/logic/logic'
    import Page from 'common/deploy/page'
    import requesturl from 'common/deploy/requesturl'
    import { vilidation, urlParam } from 'common/logic/utils'
    import { RegEnum, Verify, ResultCode } from 'common/logic/enum';
    
    export default {
        data() {
            return {
                modelNavs:['排数', '位置'],
                modelRow: ['靠前', '中间', '靠后'],
                modelSite: ['过道', '中间', '靠窗'],
                tabIndex: 0,
                isSeatModel: false,
                // 头部信息
                titleStyle: {
                    title: '预留登机牌',
                    titlestyle: 3
                },
                pageData: {},
                // 票号
                ticketNo: '',
                // 乘机人姓名
                passengerName: '',
                // label 内容
                labelInfo: {
                    ticketNo: '乘机所持证件号/票号',
                    passengerName: '乘机人姓名，如吉祥，或JI/XIANG'
                }
            }
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;

                controller.onshow(function() {
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
            navChange(index) {
                this.tabIndex = index;
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
            // 点击返回按钮
            clickBackBtn() {
                controller.close({
                    flag: -1
                });
            },
            
            // input框动画
            focus(txt, event) {
                let target = event.target;
                target.previousElementSibling.innerHTML = txt;
                target.previousElementSibling.classList.add('offset');
            },
            blur(vModel, event) {
                let target = event.target;
                if(this[vModel] == ''){
                    target.previousElementSibling.innerHTML = this.labelInfo[vModel];
                    target.previousElementSibling.classList.remove('offset');
                }
            },
            del(vModel, event) {
                let target = event.target;
                this[vModel] = '';
                target.previousElementSibling.focus();
            },
            showSeatModel() {
                this.isSeatModel = true;
            },
            hideSeatModel() {
                this.isSeatModel = false;
            },
            // 购买须知
            goBuyNotes() {
                let buyNotesPage = Page.boardPass.buyNotes;
                controller.open({
                    winName: buyNotesPage.winName,
                    path: buyNotesPage.pageUrl
                });
            },
            // 查看更多航班
            goMoreFlt() {
                controller.open({
                    winName: Page.boardPass.moreFlt.winName,
                    path: Page.boardPass.moreFlt.pageUrl
                })
            },
            // 去支付
            goPayment() {
                controller.open({
                    winName: Page.boardPass.orderPayment.winName,
                    path: Page.boardPass.orderPayment.pageUrl
                })
            }
        }
    };
</script>
