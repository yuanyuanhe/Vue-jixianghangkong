<style lang="scss" scope>
    @import '~common/styles/common/common.scss';
    @import '~common/styles/changeDate.scss';
</style>
<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header>
        <div class="main safe-top-pt">
            <div class="m-wp">
                <div class="banner" v-show="!pageData.loginStyle"></div>
                <div class="m-box" :class="[pageData.loginStyle ? 'mt20' : 'mt109']">
                    <div class="m-form">
                        <div class="inputAnime flexbox">
                            <label>{{ labelInfo.ticketNo }}</label>
                            <input class="flex-1" v-model="ticketNo" type="text" @focus="focus(labelInfo.ticketNo, $event)" @blur="blur('ticketNo', $event)">
                            <div class="del" @click="del('ticketNo', $event)" v-show="ticketNo != ''"></div>
                        </div>
                        <div class="inputAnime flexbox">
                            <label>{{ labelInfo.passName }}</label>
                            <input class="flex-1" v-model="passName" type="text" @focus="focus('乘机人姓名', $event)" @blur="blur('passName', $event)">
                            <div class="del" @click="del('passName', $event)" v-show="passName != ''"></div>
                        </div>
                        <div class="form-btn">
                            <button class="cu-btn" :class="{'cu-btn-disabled': !submitBtnCls}" @click="checkFlight">查询航班</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "common/tools/rem"
    import Header from "components/header.vue"
    
    import { controller, native } from "common/logic/controller"
    import { saveLoginInfo, getIsLogin } from 'common/logic/logic'
    import Page from 'common/deploy/page'
    import requesturl from 'common/deploy/requesturl'
    import { juneyaoair } from 'common/logic/utils'
    import { ResultCode } from 'common/logic/enum'
    import service from 'common/service/data'
    
    export default {
        data() {
            return {
                // 头部信息
                titleStyle: {
                    isUseH5: true,
                    title: '机票改期',
                    titlestyle: 3
                },
                pageData: {},
                // 票号
                ticketNo: '',
                // 乘机人姓名
                passName: '',
                // label 内容
                labelInfo: {
                    ticketNo: '乘机所持证件号/票号',
                    passName: '乘机人姓名，如吉祥，或JI/XIANG'
                },
                isSubmit: false,
                pageNum: 1,
                pageSize: 10
            }
        },
        computed: {
            submitBtnCls() {
                if(this.ticketNo && this.passName) {
                    return this.isSubmit = true;
                } else {
                    return this.isSubmit = false;
                }
            }
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                // 默认：未登录 或 已登录 账户中无航班信息
                // 1：改期其他航班

                if(that.pageData.loginStyle == 1){
                    that.titleStyle.titlestyle = 4;
                    that.titleStyle.title = '改期其他航班';
                    that.titleStyle.closetype = 1;
                }

                // 已登录有数据
                that.getOrderDate();

                controller.onshow(function() {
                    saveLoginInfo().then(memberInfo => {
                        that.memberInfo = memberInfo
                    })
                })
            })
        },
        components: {
            Header
        },
        methods: {
            // 已登录获取订单改期信息
            getOrderDate(){
                const that = this;
                // 已登录
                if(getIsLogin()){
                    service.getOrderList()
                    .then(res => {
                        console.log(res);
                        if(res.resultCode == ResultCode.SUCCESS) {
                            that.objData = res.objData;
                            // 有数据跳列表页
                            if(res.objData.length && that.pageData.loginStyle != 1) {
                                controller.open({
                                    winName: Page.changeDate.logged.winName,
                                    path: Page.changeDate.logged.pageUrl,
                                    data: {
                                        listStyle: 1,
                                        channelOrderNo: that.objData.channelOrderNo,
                                        orderNo: that.objData.orderNo
                                    }
                                })
                            }
                        } else {
                            controller.toast({
                                str: res.resultInfo
                            })
                        }
                    })
                }
            },
            // 点击、客票查询改期信息（未登录查询、已登录无订单改期信息查询）
            checkFlight() {
                let that = this;
                if(that.validate()) {
                    that.passName = that.passName.toUpperCase();
                    // 验证OK跳页
                    // 未登录跳转登录页面登录后查询有数据直接跳到下一个页面 无数据弹弹框
                    if(!getIsLogin()) {
                        getIsLogin(true);
                    }
                    let params = {
                        ticketNo: that.ticketNo,
                        passName: that.passName
                    }
                    that.getChangeList(params)
                }
            },
            getChangeList(params) {
                service.getChangeList(params)
                .then((res) => {
                    console.log(res);
                    if(res.resultCode == ResultCode.SUCCESS) {
                        this.objData = res.objData;
                        // 有一条数据且不可改期的国际机票则弹弹框
                        // 有数据跳列表页
                        let nextPage = {
                            winName: Page.changeDate.logged.winName,
                            path: Page.changeDate.logged.pageUrl,
                            data: {
                                listStyle: 0,
                                params: {
                                    ticketNo: this.ticketNo,
                                    passName: this.passName
                                }
                            }
                        }
                        if(res.objData.length == 1) {
                            // interFlag (国内：D，国际：I)
                            if(!res.objData[0].ableChange && res.objData[0].interFlag == 'I') {
                                controller.alert({
                                    title: '提示',
                                    content: '该航班暂不支持线上改期，请联系客服',
                                    showClose: false,
                                    alertBtn: '知道了'
                                })
                            } else {
                                controller.open(nextPage);
                            }
                        } else if(res.objData.length > 1) {
                            controller.open(nextPage);
                        } else if(!res.objData.lenth) {
                            controller.alert({
                                title: '提示',
                                content: '未查询到可办理线上机票改期的航班，<br/>如有疑问可联系客服',
                                showClose: false,
                                alertBtn: '知道了',
                                onConfirm: () => {
                                    console.log('底部按钮回调，不需要则不用传');
                                }
                            })
                        }
                    } else if(res.resultCode == '10002'){
                        controller.alert({
                            title: '提示',
                            content: '未查询到可办理线上机票改期的航班，<br/>如有疑问可联系客服',
                            showClose: false,
                            alertBtn: '知道了',
                            onConfirm: () => {
                                console.log('底部按钮回调，不需要则不用传');
                            }
                        })
                    } else {
                        controller.toast({
                            str: res.resultInfo
                        })
                    }
                })
            },
            // 验证
            validate() {
                let that = this;
                if(!that.ticketNo || !that.passName){
                    return false;
                }
                if(that.ticketNo == ''){
                    controller.toast({str: '请输入证件号或票号'});
                    return false;
                }
                if(!juneyaoair.validateCertTicket(that.ticketNo)){
                    return false;
                }
                if(that.passName == ''){
                    controller.toast({str: '请输入乘机人姓名'});
                    return false;
                }
                if(!juneyaoair.validateNameAll(that.passName)){
                    return false;
                }
                return true;
            },
            // 点击返回按钮
            clickBackBtn() {
                controller.hideSoftKeyBoard();
                if(this.pageData.loginStyle != 1) {
                    controller.close({
                        flag: -1
                    });
                } else {
                    controller.close();
                }
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
        }
    };
</script>
