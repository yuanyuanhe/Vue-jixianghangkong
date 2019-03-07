<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
        <div class="main">
            <div class="main-wrap active" v-if="objData.length != 0">
                <div class="com-ticket-style" v-for="(item, index) in objData" :key="item.couponNo"
                 :class="{'vip-room-ticket': item.couponSource == couponType.VIPROOM, 
                 'upgrade-ticket': item.couponSource == couponType.UPGRADE, 
                 'luggage-ticket': item.couponSource == couponType.LUGGAGE}">
                    <div class="infor-wrap flexbox">
                        <div class="left-wrap flex-1">
                            <div class="name">{{ item.couponName }}</div>
                            <div class="date">{{ item.usedStEndDt }}</div>
                            <div class="btn" @click.stop="giveFriend(item.couponNo, item.couponSource.toUpperCase(), item.couponName)">送给好友</div>
                        </div>
                        <div class="right-wrap"></div>
                    </div>
                    <div class="rules-wrap">
                        <div class="header flexbox" @click="clickRulesBtn(index)">
                            <div class="txt flex-1">使用规则</div>
                            <div class="btn" :class="{active: current == index}"></div>
                        </div>
                        <div class="content" v-if="index == current">
                            <p>券号：{{ item.couponNo }}</p>
                            <p v-html="item.remark"></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="no-ticket-wrap" v-if="objData.length == 0">
                <div class="content-wrap">
                    <div class="img-wrap"></div>
                    <div class="txt">暂无权益券</div>
                </div>
            </div>
        </div>
        <share-friend :couponSource="couponSource" :contactMsg="contactMsg" :couponNo="couponNo" v-show='isShowShare' @refresh="getInterest" @hideShare="hideShare"></share-friend>
    </div>
</template>

<script>
    import "common/tools/rem";
    import Header from "components/header.vue";
    import ShareFriend from 'components/shareFriend.vue';
    import controller from "common/logic/controller";
    import requesturl from 'common/deploy/requesturl'
    import Page from 'common/deploy/page'
    import { ResultCode, Verify, couponType } from 'common/logic/enum'

    export default {
        data() {
            return {
                isUseHeader: false,
                setTitleStyle: {
                    title: '权益券',
                    titlestyle: 1,
                    navRightItem:2,
                    navRightTitle:'失效券'
                },
                memberInfo: null,
                pageData: {},
                isShowShare: false,
                isShowRules: false,
                current: null,
                objData: [],
                couponType: couponType,
                couponSource: '',
                couponNo: '',
                contactMsg: ''
            }
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data
                that.getInterest()
                // 微信转赠后重刷列表
                controller.onshow(function(){
                    that.getInterest();
                })
                
                controller.navRightTitle(()=>{
                    that.openInvalidTicket()
                })
            });
        },
        components: {
            Header,
            ShareFriend
        },
        methods: {
            // H5头部回调
            getTitleStyle(titleObj, isTtile) {
                console.log('isTitle:'+ isTtile);
                this.isUseHeader = isTtile;
            },
            clickBackBtn() {
                controller.close();
            },
            // 点击规则按钮
            clickRulesBtn(index) {
                if(this.current === index) {
                    this.current = null;
                } else {
                    this.current = index;
                }
            },
            // 跳转到失效券
            openInvalidTicket() {
                controller.open({
                    winName: Page.interests.invalidTicket.winName, 
                    path: Page.interests.invalidTicket.pageUrl,
                    data: {
                        isUseHeader: false
                    }
                })
            },
            // 获取我的权益券
            getInterest() {
                let that = this;
                controller.getJSON({
                    method: 'POST',
                    url: requesturl.INTERESTS.MY_RIGHT_COUPONS,
                    params: that.createParams()
                })
                .then(res => {
                    console.log(res);
                    if( res.resultCode == ResultCode.SUCCESS ){
                        this.objData = res.objData
                    }
                })
                .catch(err => {
                    controller.toast({str: Verify.BACK_ERR.toastDetailsFail});
                })
            },
            createParams() {
                return {
                    "request": {
                        "ffpId": this.memberInfo.id,
                        "ffpCardNo": this.memberInfo.memberID,
                        "loginKeyInfo": this.memberInfo.loginKeyInfo,
                        "couponState": "R"
                    }
                }
            },
            // 赠送好友
            giveFriend(couponNo, couponSource, couponName) {
                this.contactMsg = '权益券'
                this.couponNo = couponNo
                this.couponSource = couponSource
                this.couponName = couponName
                this.isShowShare = true;
            },
            hideShare() {
                this.isShowShare = false;
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "~common/styles/common/common.scss";
    header.g-header .skip {
        width: rem(144) !important;
        margin-left: rem(-144) !important;
    }

    .main-wrap {
        display: none;
        width: rem(750);
        margin: 0 auto;
        padding-top: rem(11);
        padding-bottom: rem(43);
        &.active {
            display: block;
        }
        .com-ticket-style {
            width: rem(690);
            margin: 0 auto;
            margin-top: rem(20);
            box-shadow: 0px -1px 0px 0px rgba(244, 244, 244, 1);
            @include border-radius(rem(6));
            overflow: hidden;
            .infor-wrap {
                height: rem(262);
                padding: 0 rem(20) 0 rem(30);
                .left-wrap {
                    color: #fff;
                    .name {
                        font-size: rem(32);
                        line-height: rem(45);
                        margin-top: rem(30);
                        font-weight: bold;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        display:-webkit-box;
                        -webkit-box-orient:vertical;
                        -webkit-line-clamp:2;
                    }
                    .date {
                        margin-top: rem(10);
                        font-size: rem(24);
                    }
                    .btn {
                        margin-top: rem(15);
                        width: rem(120);
                        height: rem(50);
                        line-height: rem(50);
                        text-align: center;
                        font-size: rem(24);
                        @include border(#fff, rem(4));
                        .style-ios & {
                            @include border-ios(#fff, rem(4));
                        }
                    }
                }
                .right-wrap {
                    width: rem(290);
                    height: rem(262);
                }
            }
            .rules-wrap {
                background: #fff;
                .header {
                    box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.02);
                    height: rem(60);
                    padding: 0 rem(30) 0 rem(30);
                    .txt {
                        font-size: rem(20);
                        line-height: rem(60);
                        color: #ADADAD;
                    }
                    .btn {
                        width: rem(24);
                        @include bg2('./img/btn.png');
                        transform: rotate(0);
                        &.active {
                        transform: rotate(180deg);
                        }
                    }
                }
                .content {
                    padding: rem(30) rem(20);
                    font-size: rem(20);
                    line-height: rem(28);
                    color: #848484;
                    &.active {
                        display: block;
                    }
                }
            }
        }
        .vip-room-ticket {
            .infor-wrap {
                background: linear-gradient(127.9deg, #7283C8, #445599);
                .right-wrap {
                    @include bg2('./img/icon_2.png');
                }
            }
        }
        .upgrade-ticket {
            .infor-wrap {
                background: linear-gradient(127.9deg, #BB9193, #EFCBCB);
                .right-wrap {
                    @include bg2('./img/icon_1.png');
                }
            }
        }
        .luggage-ticket {
            .infor-wrap {
                background: linear-gradient(127.9deg, #68CED5, #4CBFC8);
                .right-wrap {
                    @include bg2('./img/icon_3.png');
                }
            }
        }
    }

    .no-ticket-wrap {
        // display: none;
        position: relative;
        width: 100%;
        height: 100%;
        &.active {
            display: block;
        }
        .content-wrap {
            width: rem(300);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
            .img-wrap {
                width: rem(300);
                height: rem(300);
                @include bg('./img/fail.png');
            }
            .txt {
                margin-top: rem(20);
                font-size: rem(24);
                line-height: rem(33);
                color: #848484;
                text-align: center;
            }
        }
    }
</style>
