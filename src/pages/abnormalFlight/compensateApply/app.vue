<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header>
        <div class="main">
            <div class="g-tpPrompt" v-if="records.length>0">
                {{passName}},你好！ 你可进行补偿申请的航班信息如下：
            </div>
            <div class="container">
                <div class="post-wrapper careWrap" v-for="(item,index) in records" :key="index">
                    <div class="writeInformation-title" v-if="item.datas.length > 0">{{item.compensateCause}}</div>
                    <div class="list">
                        <div class="m-list can-select-li" v-for="(item,index) in item.datas" :key="index">
                            <div class="u-checked"><img :src="payImgUrl[item.compensateCause]" /></div>
                            <div class="u-idCard">
                                <div class="s-userDetail">
                                    <span class="s-userName">{{item.depCityName}}</span>
                                    <span class="arrow"><img src="./img/Arrow.png"/></span>
                                    <span class="s-userName">{{item.arrCityName}}</span>
                                </div>
                                <div class="s-cardDetail">
                                    <span>{{item.flightNo}}</span> |
                                    <span class="s-userCard">{{item.flightDate}}</span>
                                </div>
                                <div class="s-cardDetail">
                                    <span>售票号：</span>
                                    <span class="s-userCard">{{item.ticketNo}}</span>
                                </div>
                            </div>
                            <div class="btn" @click="apply(item)">
                                <span>申请补偿</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="canShowImg" class="Imgs">
                    <img src="./img/err.png" />
                    <p>没有查询到任何不正常航班信息</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import "common/tools/rem"
    import Header from "components/header.vue"
    import Page from "common/deploy/page";
    import controller from "common/logic/controller";
    import {
        RegEnum,
        Verify,
        ResultCode
    } from 'common/logic/enum'
    import requesturl from 'common/deploy/requesturl'
    import {
        urlParam
    } from 'common/logic/utils'
    import {
        saveLoginInfo,
        getIsLogin
    } from 'common/logic/logic'
    import service from "common/service/data"
    const payImg = {
        1: require('./img/delay.png'),
        2: require('./img/Spare.png'),
        3: require('./img/Cancel.png')
    }
    const AuthStatus = {
        AUTH_SUCC: 1,
        AUTH_FAIL: -1,
        NOT_AUTH: 0
    };
    export default {
        data() {
            return {
                isUseHeader: false,
                titleStyle: {
                    title: '不正常航班补偿申请',
                    titlestyle: 4,
                },
                records: [],
                memberInfo: null,
                passName: '',
                pageData: {},
                payImgUrl: payImg,
                canShowImg: false,
                // 是否请求实名认证接口
                isGetAuthJson: false,
                // 认证状态
                authStatus: -2,
                isBackIndex: false
            }
        },
        //请求数据通用
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                console.log(that.memberInfo)
                if (!that.memberInfo) {
                    console.log('eeeee')
                }
                that.pageData = data.data;
                that.getDetailInfor()
                controller.onshow(function() {
                    saveLoginInfo().then(memberInfo => {
                        that.memberInfo = memberInfo
                        //判断是为空
                        console.log('show meminfo:' + JSON.stringify(memberInfo));
                        if (!that.memberInfo || !that.memberInfo.memberID) {
                            controller.close({
                                flag: -1
                            })
                        }
                        //判断是否实名认证
                        that.getAuthResult(true);
                    })
                    .catch(err => {
                        controller.close({
                            flag: -1
                        })
                        console.log(err);
                    })
                })
                controller.clickBack(() => {
                    that.clickBackBtn()
                })
            })
        },
        methods: {
            // 处理后台返回的数据
            formatBackDatas(data) {
                let newData = [{
                        compensateCause: '航班延误',
                        datas: []
                    },
                    {
                        compensateCause: '航班取消',
                        datas: []
                    },
                    {
                        compensateCause: '航班备降',
                        datas: []
                    }
                ];
                for (let [index, item] of data.entries()) {
                    console.log([index, item])
                    console.log(data)
                    switch (item.compensateCause - 0) {
                        case 1:
                            newData[0].datas.push(item)
                            break;
                        case 2:
                            newData[1].datas.push(item)
                            break;
                        case 8:
                            newData[2].datas.push(item)
                            break;
                    }
                }
                return newData
            },
            // 打开实名认证页面
            openAuthPage() {
                this.isBackIndex = true;
                let authPage = Page.my.auth;
                controller.open({
                    winName: authPage.winName,
                    path: authPage.pageUrl
                });
            },
            // 获取实名认证信息
            getAuthResult() {
                let that = this;
                service.getAuthResult()
                .then((data) => {
                    if (data.resultCode == ResultCode.SUCCESS) {
                        that.isGetAuthJson = true;
                        let resultData = data.objData;
                        if (resultData.verifyStatus == AuthStatus.AUTH_SUCC) {
                            that.authStatus = AuthStatus.AUTH_SUCC;
                            that.getDetailInfo();
                        } else {
                            if(that.isBackIndex){
                                controller.close({
                                    flag: -1
                                })
                            } else {
                                that.openAuthPage();
                            }
                        }
                    } else {
                        controller.toast({
                            str: data.resultInfo
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            },
            // 请求详情数据逻辑判断
            getDetailInfor() {
                const that = this
                //判断是否登录
                if (!getIsLogin(true)) {
                   return;
                }
                this.getAuthResult();
            },
            // 请求数据
            getDetailInfo(){
                const that = this;
                controller.getJSON({
                    method: 'POST',
                    url: requesturl.ABNORMALFLIGHT.COMPENSATEAPPLY,
                    params: that.createParams(),
                })
                .then(that.sucCallback)
                .catch(that.errCallback)
            },
            //请求成功回调
            sucCallback(res) {
                //处理后台数据   
                console.log("请求到数据")
                console.log(res)
                if (res.resultCode == ResultCode.SUCCESS) {
                    this.canShowImg = false
                    this.records = this.formatBackDatas(res.objData.records)
                    this.passName = this.records[0].datas[0].passName
                } else {
                    this.canShowImg = true
                    this.records = []
                }
                console.log(this.records)
            },
            //请求回调失败
            errCallback(data) {
                controller.toast({
                    str: Verify.BACK_ERR.toastNet,
                    times: 2000
                });
            },
            //请求发送字段名
            createParams() {
                return {
                    "request": {
                        "ffpCardNo": this.memberInfo.memberID,
                        "ffpId": this.memberInfo.id,
                        "loginKeyInfo": this.memberInfo.loginKeyInfo,
                        "pass_Idcard_Type": urlParam("certtype"), //证件类型
                        "pass_Idcard":urlParam("certno").toUpperCase() //证件号
                    }
                }
            },
            // 点击返回按钮
            clickBackBtn() {
                controller.close({
                    flag: -1
                });
            },
            //页面跳转 请求数据
            apply(item) {
                let appayUrl = Page.abnormalFlight.compensationInformation;
                controller.open({
                    winName: appayUrl.winName,
                    path: appayUrl.pageUrl,
                    data: {
                        item: item
                    },
                });
            },
        },
        components: {
            Header
        },
    }
</script>
<style lang="scss" scope>
    @import "~common/styles/common/_mixin.scss";
    @import "~common/styles/common/function.scss";
    .main {
        .g-tpPrompt {
            background: #FBEFD8;
            color: #CB9D6D;
            font-size: rem(24);
            height: rem(80);
            line-height: rem(80);
            text-align: center;
        }
        .container {
            padding: rem(10) rem(30) 0;
            .careWrap {
                margin-bottom: 0;
                .writeInformation-title {
                    font-size: rem(24);
                    font-family: PingFangSC-Regular;
                    font-weight: bold;
                    color: rgba(173, 173, 173, 1);
                }
                .list {
                    .m-list {
                        margin-bottom: rem(20);
                        overflow: hidden;
                        background: #fff;
                        @include box-shadow('0px -1px 0px 0px rgba(244,244,244,1)');
                        @include border-radius(rem(6));
                        .u-checked {
                            width: rem(48);
                            height: rem(48);
                            margin: rem(30) rem(30) 0 rem(20);
                            float: left;
                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .u-idCard {
                            padding: rem(21) 0;
                            float: left;
                            @include box-sizing(border-box);
                            .s-userDetail {
                                font-size: rem(32);
                                color: #3A3D50;
                                font-weight: 600;
                                .arrow {
                                    padding: 0 rem(20);
                                    img {
                                        vertical-align: middle;
                                        width: rem(32);
                                        height: rem(8);
                                    }
                                }
                            }
                            .s-cardDetail {
                                font-size: rem(22);
                                color: #ADADAD;
                                margin-top: rem(10);
                            }
                        }
                        .btn {
                            float: right;
                            color: #fff;
                            padding-right: rem(30);
                            padding-top: rem(65);
                            span {
                                font-size: rem(24);
                                padding: rem(12) rem(7);
                                @include linear-gradient($lg);
                                @include border-radius(rem(6));
                            }
                        }
                    }
                }
            }
        }
    }
    footer.g-footer {
        z-index: 0;
    }
    .Imgs {
        width: 100%;
        text-align: center;
        margin-top: rem(333);
        img {
            display: block;
            width: 43%;
            height: 43%;
            margin: 0 auto;
        }
        p {
            margin-top: rem(20);
            font-size: rem(24);
            font-weight: bold;
            color: rgba(132, 132, 132, 1);
            line-height: rem(22);
            text-align: center;
        }
    }
</style>