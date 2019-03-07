<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn'>
            <div class="u-txt" slot="title">填写会员资料</div>
        </Header>
        <div class="main mainHasBottom">
            <div class="content-wrap">
                <div class="infor-write-wrap">
                    <div class="every-line flexbox" @click='selectCardType'>
                        <div class="name">证件类型</div>
                        <div class="text-content flex-1">{{cardName}}</div>
                        <div class="btn"></div>
                    </div>
                    <div class="every-line flexbox">
                        <div class="name">证件号码</div>
                        <div class="input-content flex-1">
                            <input type="text" placeholder="请输入证件号" v-model.trim="cardNumber">
                        </div>
                    </div>
                    <div class="every-line flexbox">
                        <div class="name">{{currentSelectCard.chFirstName.name}}</div>
                        <div class="input-content flex-1">
                            <input type="text" :placeholder="currentSelectCard.chFirstName.placeholder" v-model.trim="chFirstName">
                        </div>
                    </div>
                    <div class="every-line flexbox">
                        <div class="name">{{currentSelectCard.chLastName.name}}</div>
                        <div class="input-content flex-1">
                            <input type="text" :placeholder="currentSelectCard.chLastName.placeholder" v-model.trim="chLastName">
                        </div>
                    </div>
                    <div class="every-line flexbox">
                        <div class="name">{{currentSelectCard.enFirstName.name}}</div>
                        <div class="input-content flex-1">
                            <input type="text" :placeholder="currentSelectCard.enFirstName.placeholder" v-model.trim="enFirstName">
                        </div>
                    </div>
                    <div class="every-line flexbox">
                        <div class="name">{{currentSelectCard.enLastName.name}}</div>
                        <div class="input-content flex-1">
                            <input type="text" :placeholder="currentSelectCard.enLastName.placeholder" v-model.trim="enLastName">
                        </div>
                    </div>
                    <div class="every-line flexbox">
                        <div class="name">手机号码</div>
                        <div class="text-content flex-1">{{ telNumber.replace(/(\d{3})\d{5}(\d{3})/, "$1*****$2") }}</div>
                    </div>
                </div>
                <div class="member-rules-txt">
                    点击提交即表示您已同意 <span class="btn" @click='openVipRule'>吉祥航空会员条款</span>
                </div>
            </div>
        </div>
        <Footer>
            <button :class="submitBtnCls" slot="sureBtn" @click='submitApply'>提交</button>
        </Footer>
    </div>
</template>

<script>
    import "common/tools/rem"
    import Header from "components/header.vue"
    import Footer from "components/footer.vue"
    import { controller, native } from "common/logic/controller"
    import { saveLoginInfo } from 'common/logic/logic'
    import Page from 'common/deploy/page'
    import requesturl from 'common/deploy/requesturl'
    import {
        vilidation,
        urlParam
    } from 'common/logic/utils'
    import {
        RegEnum,
        Verify,
        ResultCode
    } from 'common/logic/enum';
    const CardTypeObj = [{
            chFirstName: {
                name: '中文姓',
                placeholder: '例如：吉'
            },
            chLastName: {
                name: '中文名',
                placeholder: '例如：祥'
            },
            enFirstName: {
                name: '拼音姓',
                placeholder: '例如：JI（选填）'
            },
            enLastName: {
                name: '拼音名',
                placeholder: '例如：XIANG（选填）'
            }
        },
        {
            chFirstName: {
                name: '中文姓',
                placeholder: '例如：吉（选填）'
            },
            chLastName: {
                name: '中文名',
                placeholder: '例如：祥（选填）'
            },
            enFirstName: {
                name: '英文姓',
                placeholder: '例如：JI'
            },
            enLastName: {
                name: '英文名',
                placeholder: '例如：XIANG'
            }
        }
    ];
    const SelectIndex = {
        ID_CARD: 0,
        PASSPORT: 1
    };
    const CertificateType = ['ID_CARD', 'PASSPORT'];
    export default {
        data() {
            return {
                pageData: {},
                cardName: "身份证",
                telNumber: '',
                cardNumber: '',
                chFirstName: '',
                chLastName: '',
                enFirstName: '',
                enLastName: '',
                currentSelectCard: CardTypeObj[0],
                selectIndex: SelectIndex.ID_CARD
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                that.telNumber = that.memberInfo.memberTel || '';
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
            clickBackBtn() {
                controller.close(-1);
            },
            // 打开服务条款
            openVipRule() {
                let service_Page = Page.mPage.terms;
                controller.open({
                    winName: service_Page.winName,
                    path: WEBIP + service_Page.pageUrl
                });
            },
            selectCardType() {
                if (!this.cardPicker) {
                    this.cardPicker = this.$createPicker({
                        title: "选择证件类型",
                        data: [
                            [{
                                    text: "身份证",
                                    value: SelectIndex.ID_CARD
                                },
                                {
                                    text: "护照",
                                    value: SelectIndex.PASSPORT
                                }
                            ]
                        ],
                        onSelect: (selectedVal, selectedIndex, selectedText) => {
                            this.cardName = selectedText[0];
                            this.currentSelectCard = CardTypeObj[selectedVal[0]];
                            this.selectIndex = selectedVal[0];
                        }
                    });
                }
                this.cardPicker.show();
            },
            // 提交申请
            submitApply() {
                if (this.canSubmit && this.verificatWriteInfo()) {
                    const that = this;
                    controller.getJSON({
                            method: 'POST',
                            url: requesturl.APPLY_MEMBER,
                            params: that.createParams()
                        })
                        .then(that.sucCallback)
                        .catch(that.errCallback)
                }
            },
            createParams() {
                return {
                    request: {
                        "certificateType": CertificateType[this.selectIndex],
                        "ffpCardNo": this.memberInfo.memberID,
                        "ffpId": this.memberInfo.id,
                        "loginKeyInfo": this.memberInfo.loginKeyInfo,
                        "certificateNumber": this.cardNumber,
                        "cLastName": this.chFirstName,
                        "cFirstName": this.chLastName,
                        "eLastName": this.enFirstName,
                        "eFirstName": this.enLastName,
                        "token": this.memberInfo.token
                    }
                }
            },
            sucCallback(result) {
                if (result.resultCode === ResultCode.SUCCESS) {
                    // 通知原生
                    if(urlParam('callBack')){
                        native.nativeCallBack();
                    }
                    if (result.loginFlag) {
                        let loginPage = Page.login.login;
                        controller.open({
                            winName: loginPage.winName,
                            path: loginPage.pageUrl
                        });
                        return;
                    } else {
                        controller.close({
                            pageUrl: '/' + Page.my.applyMember.pageUrl
                        });
                    }
                } else {
                    controller.toast({
                        str: result.resultInfo
                    })
                }
            },
            errCallback() {
                controller.toast({
                    str: '网络出错'
                })
            },
            verificatWriteInfo() {
                if (this.selectIndex === SelectIndex.ID_CARD) {
                    console.log(this.vertificate(this.cardNumber, RegEnum.ID_CARD, 2000));
                    if (!this.vertificate(this.cardNumber, RegEnum.ID_CARD, 2000)) {
                        return false;
                    }
                } else if(this.selectIndex === SelectIndex.PASSPORT) {
                    if (!this.vertificate(this.cardNumber, RegEnum.PASSPORT, 2000)) {
                        return false;
                    }
                }
                return true;
            },
            // 通用的验证方法
            vertificate(content, reg, time) {
                let verificateResult = vilidation(content, reg);
                if (typeof verificateResult === 'string') {
                    if (verificateResult == Verify.BACK_ERR.result) {
                        controller.toast({
                            str: '请输入正确的中文姓名',
                            times: time
                        });
                    } else {
                        controller.toast({
                            str: verificateResult,
                            times: time
                        });
                    }
                    return false;
                }
                return true;
            }
        },
        computed: {
            submitBtnCls() {
                if (this.cardNumber) {
                    if (this.selectIndex === SelectIndex.ID_CARD && this.chFirstName && this.chLastName) {
                        this.canSubmit = true;
                        return 'g-btn'
                    } else if (this.selectIndex === SelectIndex.PASSPORT && this.enFirstName && this.enLastName) {
                        this.canSubmit = true;
                        return 'g-btn'
                    }
                }
                this.canSubmit = false;
                return 'g-btn g-disabled';
            }
        },
        watch: {
            enFirstName(newVal, oldVal) {
                this.enFirstName = newVal.toUpperCase();
            },
            enLastName(newVal) {
                this.enLastName = newVal.toUpperCase();
            }
        }
    };
</script>

<style lang="scss" scope>
    @import "~common/styles/common/_mixin.scss";
    @import "~common/styles/common/function.scss";
    .content-wrap {
        width: rem(690);
        margin: 0 auto;
        margin-top: rem(30);
        .infor-write-wrap {
            background-color: #fff;
            @include border-radius(rem(6));
            box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.02);
            .every-line {
                height: rem(112);
                padding: 0 rem(30);
                font-size: rem(28);
                box-shadow: 0px -1px 0px 0px rgba(244, 244, 244, 1);
                .name {
                    line-height: rem(112);
                    width: rem(166);
                    color: #3a3d50;
                    font-weight: bold;
                }
                .text-content {
                    line-height: rem(112);
                    color: #3a3d50;
                }
                .btn {
                    width: rem(24);
                    @include bg2("./img/right_arrow.png");
                }
                .input-content {
                    position: relative;
                    line-height: rem(112);
                    input {
                        width: 100%;
                        height: rem(40);
                        @include inputPlaceholder(#ccc);
                    }
                }
            }
        }
        .member-rules-txt {
            margin-top: rem(60);
            color: #848484;
            font-size: rem(24);
            line-height: rem(28);
            text-align: center;
            .btn {
                text-decoration: underline;
            }
        }
    }
    .submit-btn {
        width: rem(690);
        height: rem(88);
        color: #fff;
        font-size: rem(32);
        font-weight: bold;
    }
</style>
