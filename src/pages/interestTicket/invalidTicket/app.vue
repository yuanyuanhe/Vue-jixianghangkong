<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
        <div class="main">
            <div class="main-wrap active" v-if="objData.length != 0">
                <div class="com-ticket-style"  v-for="(item, index) in objData" :key="item.couponNo"
                :class="{'vip-room-ticket': item.couponSource == couponType.VIPROOM, 
                 'upgrade-ticket': item.couponSource == couponType.UPGRADE, 
                 'luggage-ticket': item.couponSource == couponType.LUGGAGE}">
                    <div class="infor-wrap flexbox">
                        <div class="left-wrap flex-1">
                            <div class="btn">{{ item.couponStateName }}</div>
                            <div class="name">{{ item.couponName }}</div>
                            <div class="date">{{ item.usedStEndDt }}</div>
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
                    <div class="txt">暂无失效权益券</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "common/tools/rem";
    import Header from "components/header.vue";
    import controller from "common/logic/controller";
    import requesturl from 'common/deploy/requesturl'
    import Page from 'common/deploy/page'
    import { ResultCode, Verify, couponType } from 'common/logic/enum'

    export default {
        data() {
            return {
                // 头部信息
                isUseHeader: false,
                setTitleStyle: {},
                memberInfo: null,
                pageData: {},
                current: null,
                objData: [],
                couponType: couponType
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data
                console.log(that.pageData)
                that.getInterest()
            });
        },
        components: {
            Header
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
            // 获取我的权益券
            getInterest() {
                let that = this;
                controller.getJSON({
                    method: 'POST',
                    url: requesturl.INTERESTS.MY_INVALID_COUPONS,
                    params: that.createParams()
                })
                .then(res => {
                    console.log(res);
                    if( res.resultCode === ResultCode.SUCCESS ){
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
                        "loginKeyInfo": this.memberInfo.loginKeyInfo
                    }
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "~common/styles/common/common.scss";
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
                background: linear-gradient(-135deg, #ccc, #ddd);
                .left-wrap {
                    color: #fff;
                    .name {
                        font-size: rem(32);
                        line-height: rem(40);
                        margin-top: rem(20);
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
                        margin-top: rem(40);
                        width: rem(90);
                        // height: rem(28);
                        // line-height: rem(28);
                        line-height: 100%;
                        padding: rem(5) 0;
                        text-align: center;
                        font-size: rem(24);
                        @include border-radius(rem(4));
                        font-weight: bold;
                        background: #848484;
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
                        transform: rotate(180deg);
                        transform: rotate(0);
                        &.active {
                            transform: rotate(0);
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

                .right-wrap {
                    @include bg2('./img/icon-2.png');
                }
            }
        }
        .upgrade-ticket {
            .infor-wrap {

                .right-wrap {
                    @include bg2('./img/icon-1.png');
                }
            }
        }
        .luggage-ticket {
            .infor-wrap {

                .right-wrap {
                    @include bg2('./img/icon-3.png');
                }
            }
        }
    }

    .no-ticket-wrap {
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
