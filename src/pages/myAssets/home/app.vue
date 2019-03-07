<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
        <div class="main">
            <div class="main-wrap">
                <div class="every-line flexbox ji-dou">
                    <div class="flex-1">
                        <div class="icon"></div>
                        <div class="name ">吉豆</div>
                        <div class="count" v-text="beanAmount"></div>
                    </div>
                    <!-- <div class="btn"></div> -->
                </div>
                <div class="every-line flexbox score" @click='jumpPage(1)'>
                    <div class="flex-1">
                        <div class="icon"></div>
                        <div class="name ">积分</div>
                        <div class="count" v-text="pageData.myScore"></div>
                    </div>
                    <div class="btn"></div>
                </div>
                <div class="every-line flexbox ticket-1" @click='jumpPage(2)'>
                    <div class="flex-1">
                        <div class="icon"></div>
                        <div class="name ">优惠券</div>
                        <div class="count"></div>
                    </div>
                    <div class="btn"></div>
                </div>
                <div class="every-line flexbox card" @click='jumpPage(3)'>
                    <div class="flex-1">
                        <div class="icon"></div>
                        <div class="name ">联名卡</div>
                        <div class="count"></div>
                    </div>
                    <div class="btn"></div>
                </div>
                <div class="every-line flexbox ticket-2" @click='jumpPage(4)'>
                    <div class="flex-1">
                        <div class="icon"></div>
                        <div class="name ">权益券</div>
                        <div class="count"></div>
                    </div>
                    <div class="btn"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "common/tools/rem";
    import Header from "components/header.vue";
    import controller from "common/logic/controller";
    import Page from "common/deploy/page";
    import {
        ResultCode,
        ChannelCode,
    } from "common/logic/enum";
    import requesturl from "common/deploy/requesturl";

    export default {
        data() {
            return {
                // 头部信息
                isUseHeader: false,
                setTitleStyle: {
                    title: '我的资产',
                    titlestyle: 1
                },
                pageData: {},
                beanAmount: 0
            }
        },
        created() {
            let that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                that.getJidou();
            });
        },
        components: {
            Header
        },
        methods: {
            clickBackBtn() {
                controller.close(-1);
            },
            getJidou() {
                let that = this;
                let params = {
                    "channelCode": ChannelCode,
                    "ffpCardNo": that.memberInfo.memberID,
                    "ffpId": that.memberInfo.id,
                    "loginKeyInfo": that.memberInfo.loginKeyInfo,
                    "activityType": "Q"
                };
                controller.getJSON({
                        method: "POST",
                        url: requesturl.JIDOU,
                        params: params
                    })
                    .then(data => {
                        if (data.resultCode == ResultCode.SUCCESS) {
                            that.beanAmount = data.beanAmount;
                        }
                    });
            },
            // 跳转到点击的页面
            jumpPage(index) {
                let jumpPage = null;
                switch (index) {
                    case 0:
                        jumpPage = Page.my.jiDou;
                        break;
                    case 1:
                        jumpPage = Page.my.myScore;
                        break;
                    case 2:
                        jumpPage = Page.my.myCoupons;
                        break;
                    case 3:
                        Page.mPage.myCard.pageUrl = WEBIP + Page.mPage.myCard.pageUrl;
                        jumpPage = Page.mPage.myCard;
                        break;
                    case 4:
                        jumpPage = Page.interests.myTicket;
                        break;
                }
                if (jumpPage) {
                    controller.open({
                        winName: jumpPage.winName,
                        path: jumpPage.pageUrl
                    });
                }
            }
        }
    };
</script>

<style lang="scss" scope>
    @import '~common/styles/common/_mixin.scss';
    @import '~common/styles/common/function.scss';
    .main-wrap {
        padding: rem(1) rem(30) 0 rem(30);
        .every-line {
            margin-top: rem(30);
            padding: 0 rem(30);
            height: rem(112);
            line-height: rem(112);
            font-size: 0;
            box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.02);
            background: #fff;
            @include border-radius(rem(6));
            .icon {
                display: inline-block;
                vertical-align: middle;
                width: rem(48);
                height: rem(48);
            }
            .name {
                margin-left: rem(20);
                width: rem(104);
                font-weight: bold;
                color: #3A3D50;
                display: inline-block;
                vertical-align: middle;
                font-size: rem(28);
            }
            .count {
                color: #CB9D6D;
                display: inline-block;
                vertical-align: middle;
                font-size: rem(28);
            }
            .btn {
                width: rem(24);
                @include bg2('./img/right_arrow.png');
            }
        }
        .ji-dou {
            .icon {
                @include bg('./img/icon_1.png');
            }
        }
        .score {
            .icon {
                @include bg('./img/icon_2.png');
            }
        }
        .ticket-1 {
            .icon {
                @include bg('./img/icon_3.png');
            }
        }
        .card {
            .icon {
                @include bg('./img/icon_4.png');
            }
        }
        .ticket-2 {
            .icon {
                @include bg('./img/icon_5.png');
            }
        }
    }
</style>
