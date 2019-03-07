<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
        <div class="main mainHasBottom">
            <div class="banner">
                <img src="./img/banner.png" alt="banner">
            </div>
            <!-- 轮播图 -->
            <Banner :listImg="listImg"></Banner>
            <!-- 购买须知 -->
            <div class="rule">
                <div class="rule-head">购买须知</div>
                <div class="rule-main">
                    <div class="rule-info title">
                        <div class="rule-title">
                            适用休息室
                        </div>
                        <div class="rule-txt">
                            浦东机场T2航站楼国内出发86号，吉祥航空贵宾休息室（营业时间｜05:30am至当日出港航班结束） <br>
                            非吉祥航空承运旅客不提供登机提醒服务
                        </div>
                    </div>
                    <div class="rule-info">
                        <div class="rule-title">
                            1.购买规则
                        </div>
                        <div class="rule-txt">
                            每位旅客的账户中未使用的权益券的数量不得超过5张；<br>
                            成人可免费携带1名婴儿（14天-2周岁）旅客进入，2周岁以上儿童进入休息室须单独购买；
                        </div>
                    </div>
                    <div class="rule-info">
                        <div class="rule-title">
                            2.使用规则
                        </div>
                        <div class="rule-txt">
                            凭贵宾休息室券的券码至休息室验证使用； <br>
                            兑换券自购买之日起即可兑换使用，有效期为60天； <br>
                            “赠送中”的权益券若受赠人24小时未领取，则退回至原会员账户中。
                        </div>
                    </div>
                    <div class="rule-info">
                        <div class="rule-title">
                            3.退款规则
                        </div>
                        <div class="rule-txt">
                            贵宾休息室券在有效期内且未使用时可提交退款申请。
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer>
            <div class="buyBox flexbox" slot="sureBtn" v-cloak>
                <div class="money flex-1">
                    <span class="symbol">￥</span>
                    <span class="count">{{ loungeData.price || 0 }}</span>
                    /张
                    <s>￥{{ loungeData.couponPrice || 0 }}</s>
                </div>
                <div class="buyBtn" @click="openWritePage(Pages.lounge.orderWrite.winName)">购买</div>
            </div>
        </Footer>
    </div>
</template>

<script>
    import 'common/tools/rem'
    import Header from 'components/header.vue'
    import Footer from 'components/footer.vue'
    import Banner from 'components/banner'

    import page from 'common/deploy/page.js'
    import controller from 'common/logic/controller'
    import { saveLoginInfo, getIsLogin } from 'common/logic/logic'
    import requesturl from 'common/deploy/requesturl'
    import { juneyaoair, dateFormat, ChannelOrderNo } from 'common/logic/utils'
    import { ResultCode, SuccType, Verify } from 'common/logic/enum'
    import lsKey from 'common/deploy/localstorage'

    const slideImg = {
        space: require('./img/s_space.png'),
        cate: require('./img/s_cate.png'),
        journal: require('./img/s_journal.png'),
        guest: require('./img/s_guest.png')
    }

    export default {
        data() {
            return {
                // 头部信息
                isUseHeader: false, 
                setTitleStyle: {},
                memberInfo: null,
                pageData: {},
                Pages: page,
                juneyaoair: juneyaoair,
                loungeData: {},
                listImg: [
                    {url: slideImg.space},
                    {url: slideImg.cate},
                    {url: slideImg.journal},
                    {url: slideImg.guest}
                ]
            }
        },
        components: {
            Header,
            Footer,
            Banner
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo || {};
                that.pageData = data.data;
                that.getLounge();

                controller.onshow(function() {
                    saveLoginInfo().then(memberInfo => {
                        console.log('onshow:' + JSON.stringify(memberInfo))
                        that.memberInfo = memberInfo
                    })
                });
            });
        },
        methods: {
            // H5头部回调
            getTitleStyle(titleObj, isTtile) {
                console.log('titleObj:'+ JSON.stringify(titleObj));
                console.log('isTitle:'+ isTtile);
                this.isUseHeader = isTtile;
            },
            // 点击返回按钮
            clickBackBtn() {
                controller.close({
                    flag: -1
                });
            },
            // 打开信息填写页
            openWritePage(pageName) {
                let that = this;
                let pageInfo = page.lounge[pageName]; //要跳转到具体填写页的地址
                let nextPage = {
                    path: pageInfo.pageUrl,
                    winName: pageInfo.winName
                }
                if(!getIsLogin(true, nextPage)){
                    return;
                }
                if(Object.keys(that.loungeData).length) {
                    controller.open(nextPage)
                } else {
                    controller.toast({
                        str: that.isVendibility
                    });
                }
            },
            // 获取可售贵宾休息室
            getLounge() {
                let that = this
                controller.getJSON({
                    method : 'POST',
                    url: requesturl.LOUNGE.FLIGHTLOUNGE
                })
                .then(that.sucFun)
                .catch((err) => {
                    controller.toast({str: Verify.BACK_ERR.toastDetailsFail});
                })
            },
            sucFun(res) {
                console.log(res);
                if( res.resultCode === ResultCode.SUCCESS ){
                    this.loungeData = res.objData.saleCouponList[0];
                } else {
                    this.isVendibility = res.resultInfo;
                }
            }
        }
    }
    
</script>

<style lang="scss">
    @import '~common/styles/common/common.scss';
    @import '~common/styles/slice_sass/content.scss';
    body {
        background: #fff;
    }
    .banner {
        img{
            width: 100%;
            height: rem(330);
        }
    }
    // 规则
    .rule-head {
        font-size: rem(36);
        font-weight: bold;
        color: #25292F;
        width: rem(185);
        height: rem(130);
        line-height: rem(130);
        text-align: center;
        margin: rem(40) auto 0;
        position: relative;
        &::before, &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: rem(-40);
            width: rem(40);
            height: rem(2);
            background: #3A3D50;
        }
        &::after {
            left: auto;
            right: rem(-40);
        }
    }
    .rule-main {
        padding: 0 rem(30) rem(20);
        .rule-info {
            margin-bottom: rem(40);
            .rule-title {
                font-size: rem(28);
            } 
            .rule-txt {
                font-size: rem(24);
                color: #848484;
                line-height: rem(34);
                margin-top: rem(10);
                p {
                    margin-bottom: 0.1rem;
                }
            }
        }
        .title {
            color: #CB9D6D;
            .rule-title {
                font-weight: bold;
            }
            .rule-txt {
                font-size: rem(28);
                line-height: rem(38);
                color: #CB9D6D;
            }
        }
    }
</style>
