<template>
    <div class="share-friend" v-show="isShowShare">
        <div class="page-content-wrap">
            <div class="header">
                <div class="btn"  @click="hideShare"></div>
                <div class="txt">转赠给好友</div>
            </div>
            <div class="content flexbox">
                <div class="flex-1" @click.stop="openContact(contactMsg)">
                    <div class="icon icon-1"></div>
                    <div class="txt">通讯录好友</div>
                </div>
                <div class="flex-1" @click.stop="doShare('0')">
                    <div class="icon icon-2"></div>
                    <div class="txt">微信</div>
                </div>
                <div class="flex-1" @click.stop="doShare('1')">
                    <div class="icon icon-3"></div>
                    <div class="txt">朋友圈</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { controller, native } from "common/logic/controller";
    import requesturl from 'common/deploy/requesturl'
    import Page from 'common/deploy/page'
    import {
        ResultCode,
        Verify,
        couponType
    } from 'common/logic/enum'

    export default {
        props: {
            couponSource: {
                type: String,
                default: ''
            },
            couponNo: {
                type: String,
                default: ''
            },
            isShowShare: {
                type: Boolean,
                default: false
            },
            contactMsg: {
                type: String,
                default: '权益券'
            }
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
            })
        },
        methods: {
            hideShare() {
                this.$emit("hideShare");
            },
            // 打开通讯录
            openContact(contactMsg) {
                this.hideShare()
                let that = this;
                controller.openContact(function (data) {
                    let tel = data.phoneNumber;
                    let nTel = tel.replace(/[^0-9]+/g, '');
                    let sTel = nTel.slice(-11);
                    native.confirm({
                        title: "提示信息",
                        message: "确认要赠送" + contactMsg + "给" + data.name + "?",
                        buttons: ["赠送", "取消"],
                        callback(res) {
                            if (res == 0) {
                                that.getGiveCoupon({
                                    scene: 2,
                                    callback: function(res){
                                        that.sendSmsCoupon(sTel, res);
                                    }
                                })
                            }
                        }
                    });
                });
            },
            // 请求赠送优惠券
            getGiveCoupon({scene, callback}) {
                controller.getJSON({
                    method: 'POST',
                    url: requesturl.GIVE_FRIEND,
                    params: this.createParams(scene)
                })
                .then((res) => {
                    if (res.resultCode == ResultCode.SUCCESS) {
                        if (callback) callback(res);
                    } else {
                        controller.toast({
                            str: res.errorInfo
                        });
                    }
                })
                .catch(this.errFun)
            },
            createParams(scene) {
                return {
                    "ffpId": this.memberInfo.id,
                    "ffpCardNo": this.memberInfo.memberID,
                    "loginKeyInfo": this.memberInfo.loginKeyInfo,
                    "couponNo": this.couponNo,
                    "couponSource": this.couponSource,
                    "giveMemberName": this.memberInfo.name ? this.memberInfo.name : undefined,
                    "descTemplate": 'rightcoupon',
                    "giveMethod": scene
                }
            },
            // 发送赠送优惠券短信
            sendSmssendSmsCoupon(mob, result) {
                controller.getJSON({
                        method: 'POST',
                        url: requesturl.SENDSMS,
                        params: this.createSendSmsParams(mob, result)
                    })
                    .then(this.sucSendSmsFun)
                    .catch(this.errFun)
            },
            createSendSmsParams(mob, result) {
                return {
                    "ffpId": this.memberInfo.id,
                    "ffpCardNo": this.memberInfo.memberID,
                    "loginKeyInfo": this.memberInfo.loginKeyInfo,
                    "mobileNum": mob,
                    "shortUrl": result.errorInfo,
                    "sourceType": "giveCoupon",
                    "memberName": this.memberInfo.name,
                    "couponSource": result.couponSource,
                    "smsTemplate": 'rightcoupon'
                }
            },
            sucSendSmsFun(res) {
                if (res.resultCode == ResultCode.SUCCESS) {
                    // 短信转赠后重刷列表
                    this.$emit('refresh');
                    controller.toast({
                        str: "赠送成功"
                    });
                } else {
                    controller.toast({
                        str: res.errorInfo
                    });
                }
            },
            //  执行具体的分享方法 
            doShare(scene) {
                this.hideShare()
                let that = this;
                this.getGiveCoupon({
                    scene: scene,
                    callback: function(data){
                        that.weixinShare(scene, data);
                    }
                })
            },
            //微信分享
            weixinShare(scene, shareItem) {
                let that = this;
                let iconUrl = 'https://packages.juneyaoair.com/m/imgs/jxlogo.png';
                let couponSourceName = '';
                if(this.couponSource == couponType.VIPROOM){
                    couponSourceName = '贵宾休息室券';
                }else if (this.couponSource == couponType.UPGRADE) {
                    couponSourceName = '升舱兑换券';
                }else if(this.couponSource == couponType.LUGGAGE) {
                    couponSourceName = '行李额度兑换券';
                }
                let shareDesc = '赠送您一张吉祥航空' + couponSourceName + '，快来领取吧 ~';
                let title = shareDesc;
                that.shareLink({
                    "iconUrl": iconUrl, //分享ICON,
                    "url": shareItem.errorInfo,
                    "scene": scene,
                    "title": title,
                    "desc": shareItem.shareDesc || shareDesc,
                    "cbSuccess": function () {
                        controller.toast({
                            str: "赠送成功"
                        });
                    },
                    "cbFail": function () {
                        that.cancelCoupon({
                            scene: scene,
                            callback: function(){
                                that.$emit('refresh')
                            }
                        })
                        this.isShowShare = false
                        controller.toast({
                            str: "取消赠送"
                        });
                    }
                });
            },
            /**
             *分享链接 
             */
            shareLink(param) {
                var linkData = {
                    thumbImg: param.iconUrl || '', //(必选)缩略图地址Url(大小必须小于32k)
                    wedpageUrl: param.url || '', //(必选)链接的地址
                    scene: param.scene || 1, //(必选)发送的目标场景 0-会话场景 1-朋友圈场景
                    title: param.title || '', //(必选)链接的标题
                    description: param.desc || '' //(必选)描述
                };
                console.log("开始分享");
                console.log(JSON.stringify(linkData));
                controller.setWechatShareData(linkData.wedpageUrl, linkData.title, linkData.description, linkData.thumbImg);
                controller.wechatshare(linkData.scene, function () {
                    param.cbSuccess();
                }, function () {
                    param.cbFail();
                });
            },
            // 取消分享接口
            cancelCoupon({scene, callback}){
                let params = {
                    "ffpId": this.memberInfo.id,
                    "ffpCardNo": this.memberInfo.memberID,
                    "loginKeyInfo": this.memberInfo.loginKeyInfo,
                    "couponNo": this.couponNo,
                    "couponSource": this.couponSource,
                    "giveMemberName": this.memberInfo.name ? this.memberInfo.name : undefined,
                    "giveMethod": scene
                }
                controller.getJSON({
                    method: 'POST',
                    url: requesturl.CANCEL_SHARE,
                    params: params
                })
                .then((res) => {
                    if (res.resultCode == ResultCode.SUCCESS) {
                        if (callback) callback(res);
                    }
                })
                .catch(this.errFun)
            }
        }
    }
</script>

<style lang="scss" scope>
    @import '~common/styles/common/_mixin.scss';
    @import '~common/styles/common/function.scss';

    .share-friend {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .3);
        z-index: 100;
        .page-content-wrap {
            position: absolute;
            bottom: 0;
            width: 100%;
            background: #fff;
            .header {
                position: relative;
                height: rem(98);
                box-shadow: 0px 1px 0px 0px rgba(235, 236, 238, 1);
                .btn {
                    position: absolute;
                    width: rem(30);
                    height: rem(30);
                    top: rem(34);
                    left: rem(30);
                    @include bg('./imgs/icon_closed.png');
                }
                .txt {
                    height: rem(98);
                    line-height: rem(98);
                    text-align: center;
                    font-size: rem(32);
                    color: #3A3D50;
                }
            }
            .content {
                padding: rem(70) 0 rem(80) 0;
                .icon {
                    height: rem(100);
                    &.icon-1 {
                        @include bg1('~components/imgs/share_1.png');
                    }
                    &.icon-2 {
                        @include bg1('~components/imgs/share_2.png');
                    }
                    &.icon-3 {
                        @include bg1('~components/imgs/share_3.png');
                    }
                }
                .txt {
                    margin-top: rem(10);
                    font-size: rem(26);
                    color: #3A3D50;
                    text-align: center;
                }
            }
        }
    }
</style>
