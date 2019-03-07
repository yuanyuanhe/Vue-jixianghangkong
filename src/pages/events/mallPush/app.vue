<style lang="scss">
    @import "../../../common/styles/common/function";
    $textColor: #3A3D50;
    body{
        background: #fff;
    }
    .container{
        padding-bottom: 0;
    }
    .g-header{
        h2{
            margin-top: rem(10);
            color: #000;
            font-size: rem(42);
            line-height: rem(60);
        }
        .info{
            margin-top: rem(10);
            font-size: rem(26);
            .sub-title{
                margin-right: rem(50);
                color: #CB9D6D;
                line-height: rem(36);
            }
            .date{
                color: #ADADAD;
            }
        }
    }
    .g-body{
        .pro-content{
            padding-top: rem(75);
            .head{
                position: relative;
                height: rem(70);
                margin-bottom: rem(40);
                .hd-wp{
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
                h3{
                    color: $textColor;
                    font-size: rem(36);
                    line-height: rem(50);
                }
                .line-wp{
                    width: 88%;
                    margin: 0 auto;
                    margin-top: rem(10);
                    border-top: border(1) solid $textColor;
                    .line{
                        width: 20%;
                        margin: 0 auto;
                        margin-top: rem(5);
                        border-top: border(2) solid $textColor ;
                    }
                }
            }
            .pro-item{
                margin-bottom: rem(40);
                background-color: #fff;
                box-shadow: 0 rem(6) rem(10) 0 rgba(0,0,0,.06);
                .pro-img{
                    width: 100%;
                    height: rem(380);
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    //background-size: rem(380) auto;
                }
                .pro-info{
                    padding: rem(24) rem(30);
                    .pro-title{
                        color: $textColor;
                        font-size: rem(32);
                        line-height: rem(45);
                    }
                    .pro-describe{
                        color: #ADADAD;
                        font-size: rem(20);
                        line-height: rem(30);
                    }
                    .pro-foot{
                        margin-top: rem(20);
                        .pro-price{
                            color: #F04741;
                            font-size: rem(22);
                            span.price{
                                font-size: rem(42);
                            }
                        }
                        .buy-btn{
                            a{
                                display: block;
                                width: rem(205);
                                height: rem(65);
                                line-height: rem(65);
                                border-radius: rem(32.5);
                                background-color: $textColor;
                                color: #fff;
                                font-size: rem(28);
                                text-align: center;
                            }
                        }
                    }
                }
            }
        }
    }
    .g-footer{
        margin: rem(80) 0;
        text-align: center;
        .more{
            color: #979797;
            font-size: rem(24);
            a{
                color: #CB9D6D;
                text-decoration: none;
            }
        }
    }
</style>
<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' v-show='pageData.isUseHeader'>
            <div class="u-txt" slot="title">{{ Datas.title }}</div>
        </Header>
        <div class="main mainNotBottom" :class='{mainNotTop: !pageData.isUseHeader}'>
            <div class="container">
                <div class="g-header">
                    <h2>{{ Datas.title }}</h2>
                    <div class="info flexbox">
                        <div class="sub-title">{{Datas.subTitle}}</div>
                        <div class="date">发布时间：{{Datas.publishDate}}</div>
                    </div>
                </div>
                <div class="g-body">
                    <section class="pro-content" v-for="item in Datas.modules">
                        <div class="head">
                            <div class="hd-wp">
                                <h3>{{item.moduleName}}</h3>
                                <div class="line-wp">
                                    <div class="line"></div>
                                </div>
                            </div>
                        </div>
                        <div class="pro-item" v-for="subitem in item.proList">
                            <div class="pro-img" :style="'background-image:url('+ subitem.proUrl +')'"></div>
                            <div class="pro-info">
                                <div class="pro-title">{{subitem.subitem}}</div>
                                <div class="pro-describe">{{subitem.proDesc}}</div>
                                <div class="pro-foot flexbox">
                                    <div class="pro-price flex-1">¥<span class="price">{{subitem.price}}</span>起</div>
                                    <div class="buy-btn">
                                        <a href="javascript:;" @click="openWin(subitem.buyUrl)">立即购买</a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>
                </div>
                <div class="g-footer">
                    <div class="more">更多惊喜请戳 <a href="javascript:;" @click="openWin(Datas.moreUrl)">{{Datas.moreName}}</a> </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import 'common/tools/rem'
    import 'common/styles/common/common.scss'
    import 'common/styles/slice_sass/content.scss'
    import Header from 'components/header.vue'
    import controller from 'common/logic/controller'
    import requesturl from 'common/deploy/requesturl'
    import Page from 'common/deploy/page'
    export default {
        data() {
            return {
                Datas: {},
                memberInfo: null,
                pageData: {}
            }
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                that.initPage();
                controller.clickBack(() => {
                    that.clickBackBtn()
                })
            });
        },
        methods: {
            // 点击返回按钮
            clickBackBtn() {
                controller.close();
            },
            // 请求详情数据
            getinfo() {
                const that = this;
                controller.getJSON({
                        method : 'POST',
                        url: requesturl.EVENTS.MALL_PUSH,
                        params: {}
                })
                .then((data) => {
                    that.Datas = data
                    controller.setTitle(data.title)
                })
                .catch(() => {
                    controller.toast({str: '网络连接失败，请重新请求！'})
                })
            },
            // 初始化页面
            initPage() {
                this.getinfo()
            },
            openWin(url) {
                controller.open({
                    winName: 'mallPush',
                    path: url
                })
            }
        },
        components: {
            Header
        }
    }
</script>
