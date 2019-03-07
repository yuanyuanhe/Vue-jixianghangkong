<style lang="scss" scope>
    @import '~common/styles/checkIn.scss';
</style>
<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header>
        <div class="main" :class="{mainNotTop: !loginStyle}">
            <div class="m-wp">
                <div class="banner" v-show="!loginStyle"></div>
                <div class="m-remind" v-show="loginStyle == 1">您账户中暂无待值机航班，可通过查询航班办理</div>
                <div class="m-box" :class="[loginStyle ? 'mt30' : 'mt127']">
                    <div class="m-form">
                        <div class="form-group">
                            <input type="text" class="form-control"
                            v-model.trim="ticketNo" 
                            @focus="focus" 
                            @blur="blur" 
                            ref="ticketNo" 
                            >
                            <div class="show-title normal" default-text="乘机所持证件号/票号" hover-text="乘机所持证件号/票号">乘机所持证件号/票号</div>
                            <div class="icons flexbox">
                                <div class="flex-1"></div>
                                <div class="close" v-show="ticketNo != ''" @click="clearInput('ticketNo')">
                                    <div class="icon"></div>
                                </div>
                                <div class="history" v-show="history.ticketNos.length != 0" @click="selectHistory('ticketNos', 'ticketNo')">
                                    <div class="icon"></div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control"
                            v-model.trim="passengerName" 
                            @focus="focus" 
                            @blur="blur" 
                            ref="passengerName" 
                            >
                            <div class="show-title normal" default-text="乘机人姓名，如吉祥，或JI/XIANG" hover-text="乘机人姓名">乘机人姓名，如吉祥，或JI/XIANG</div>
                            <div class="icons flexbox">
                                <div class="flex-1"></div>
                                <div class="close" v-show="passengerName != ''" @click="clearInput('passengerName')">
                                    <div class="icon"></div>
                                </div>
                                <div class="history" v-show="history.passengerNames.length != 0" @click="selectHistory('passengerNames', 'passengerName')">
                                    <div class="icon"></div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <input type="tel" class="form-control"
                            v-model.trim="tel" 
                            @focus="focus" 
                            @blur="blur" 
                            pattern="[0-9]*" 
                            ref="tel" 
                            >
                            <div class="show-title normal" default-text="输入手机号，用于接收值机短信" hover-text="手机号">手机号</div>
                            <div class="icons flexbox">
                                <div class="flex-1"></div>
                                <div class="close" v-show="tel != ''" @click="clearInput('tel')">
                                    <div class="icon"></div>
                                </div>
                                <div class="history" v-show="history.tels.length != 0" @click="selectHistory('tels', 'tel')">
                                    <div class="icon"></div>
                                </div>
                            </div>
                        </div>
                        <div class="form-btn">
                            <button class="cu-btn" :class="{'cu-btn-disabled': !ticketNo || !passengerName || !tel}" @click="getCheckIn">查询航班</button>
                        </div>
                    </div>
                </div>
                <div class="m-login" v-if="!loginStyle" :style="{top: clientTop}">
                    您可<a href="javascript:;" @click="login()">[登录]</a>查看待办值机航班
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
    import LogEvent from 'common/deploy/logEvent'
    import requesturl from 'common/deploy/requesturl'
    import localstorage from 'common/deploy/localstorage'
    import { juneyaoair } from 'common/logic/utils'
    import { RegEnum, Verify, ResultCode } from 'common/logic/enum'
    import service from "common/service/data"
    
    export default {
        data() {
            return {
                memberInfo: null,
                pageData: {},
                ticketNo: '',
                passengerName: '',
                tel: '',
                // 搜索历史记录
                history: {
                    ticketNos: [],
                    passengerNames: [],
                    tels: []
                },
                titleStyle: {
                    title: '值机选座',
                    titlestyle: 3,
                    isUseH5: true
                },
                loginStyle: 0,
                // 登录距离顶部距离
                clientTop: '12rem'
            }
        },
        created() {
            var that = this;
            // 查询历史记录
            let checkInHistory = controller.getStorage(localstorage.CHECKIN_HISTORY);
            if(checkInHistory){
                that.history.ticketNos = checkInHistory.ticketNos;
                that.history.passengerNames = checkInHistory.passengerNames;
                that.history.tels = checkInHistory.tels;
            }
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                let isload = true;
                if(that.pageData && that.pageData.loginStyle == 2){
                    isload = false;
                }
                that.init(isload);
                console.log('pagedata::' + JSON.stringify(that.pageData))
                controller.onshow(function() {
                    saveLoginInfo().then(memberInfo => {
                        that.memberInfo = memberInfo;
                        // 办理其他航班时不查询
                        if(that.pageData.loginStyle != 2){
                            that.init();
                        }
                    })
                })
            })
        },
        mounted(){
            let h = document.documentElement.clientHeight || document.body.clientHeight;
            this.clientTop = (h - 60) + 'px';
        },
        components: {
            Header
        },
        methods: {
            init(isload = true){
                let that = this;
                // 0:没有登录 1：登录无订单 2：办理其他航班
                if(that.pageData.loginStyle == 2){
                    that.loginStyle = 1;
                    that.titleStyle.titlestyle = 4;
                    that.titleStyle.title = '办理其他航班';
                    that.titleStyle.closetype = 1;
                }
                if(that.memberInfo){
                    that.loginStyle = 1;
                    that.titleStyle.titlestyle = 4;
                    if(isload){
                        that.getCheckIn(false);
                    }
                }
            },
            // 获取值机选座信息
            getCheckIn(isVerify = true){
                const that = this;
                let params = {};
                if(isVerify) {
                    if(!that.ticketNo || !that.passengerName || !that.tel){
                        return;
                    }
                    if(that.ticketNo == ''){
                        controller.toast({str: '请输入证件号或票号'});
                        return;
                    }
                    if(!juneyaoair.validateCertTicket(that.ticketNo)){
                        return;
                    }
                    if(that.passengerName == ''){
                        controller.toast({str: '请输入乘机人姓名'});
                        return;
                    }
                    if(!juneyaoair.validateNameAll(that.passengerName)){
                        return;
                    }
                    if(that.tel == ''){
                        controller.toast({str: '请输入手机号'});
                        return;
                    }
                    if(!juneyaoair.validateTel(that.tel)){
                        return;
                    }
                    that.passengerName = that.passengerName.toUpperCase();
                    params.certNo = that.ticketNo;
                    params.psgName = that.passengerName;
                    //params.withOrder = false;
                }
                controller.logEvent({
                    category: LogEvent.Checkin.Type,
                    event: LogEvent.Checkin.Events[0]
                })
                service.getCheckIn(params)
                .then(data=>{
                    if(data.resultCode === ResultCode.SUCCESS){
                        // 如果登陆了，没有行程
                        if(data.checkInSeatSegList.length == 0 && (!data.unCheckInSeatSegList || data.unCheckInSeatSegList.length == 0)){
                            that.loginStyle = 1;
                            if(isVerify){
                                controller.toast({str: Verify.BACK_ERR.toastEject});
                            }
                        } else {
                            // 保存历史记录
                            if(isVerify){
                                try{
                                    let ticketNos = JSON.stringify(that.history.ticketNos);
                                    if(ticketNos.indexOf(that.ticketNo) == -1){
                                        if(that.history.ticketNos.length >= 5){
                                            that.history.ticketNos.pop();
                                        }
                                        that.history.ticketNos.unshift({
                                            text: that.ticketNo,
                                            value: that.ticketNo
                                        })
                                    }
                                    let passengerNames = JSON.stringify(that.history.passengerNames);
                                    if(passengerNames.indexOf(that.passengerName) == -1){
                                        if(that.history.passengerNames.length >= 5){
                                            that.history.passengerNames.pop();
                                        }
                                        that.history.passengerNames.unshift({
                                            text: that.passengerName,
                                            value: that.passengerName
                                        })
                                    }
                                    let tels = JSON.stringify(that.history.tels);
                                    if(tels.indexOf(that.tel) == -1){
                                        if(that.history.tels.length >= 5){
                                            that.history.tels.pop();
                                        }
                                        that.history.tels.unshift({
                                            text: that.tel,
                                            value: that.tel
                                        })
                                    }
                                    controller.setStorage(localstorage.CHECKIN_HISTORY, that.history);
                                } catch(e){}
                            }
                            // 手动输入证件号查询时，证件号放到人里面(没有证件号的时候放入票号)
                            data.checkInSeatSegList.forEach(element => {
                                element.flightTourPsgInfoList.forEach(item => {
                                    item.tel =  that.tel;
                                    item.certNo = item.certNo || that.ticketNo || item.etCode;
                                })
                            })
                            let pageData = {
                                tel: that.tel,
                                checkInInfo: data
                            }
                            if(that.ticketNo){
                                pageData.psgInfo =  {};
                                pageData.psgInfo.certNo = that.ticketNo;
                                pageData.psgInfo.psgName = that.passengerName;
                            }
                            let pageObj = Page.checkIn.logged;
                            controller.open({
                                winName: pageObj.winName, 
                                path: pageObj.pageUrl, 
                                data: pageData,
                                newPage: true
                            })
                            if(!isVerify){
                                controller.close();
                            }
                        }
                    } else{
                        if(isVerify){
                            //controller.toast({str: data.errorInfo});
                            controller.alert({
                                title:"提示",
                                content: data.errorInfo,
                                alertBtn: "知道了"
                            })
                        }
                    }
                })
                .catch(data=>{
                    controller.toast({str: Verify.BACK_ERR.toastDetailsFail});
                });
            },
            login(){
                controller.logEvent({
                    category: LogEvent.Checkin.Type,
                    event: LogEvent.Checkin.Events[1]
                })
                getIsLogin(true);
            },
            // 点击返回按钮
            clickBackBtn() {
                controller.close();
            },
            // input获取焦点
            focus(event) {
                let target = event.target;
                this.focusFn(target);
            },
            // input失去焦点
            blur(event) {
                let target = event.target;
                this.blurFn(target);
            },
            focusFn(el){
                if(!el){
                    return;
                }
                if(el.value == ''){
                    el.classList.add('hover');
                    let nextEle = el.nextElementSibling;
                    let hoverText = nextEle.getAttribute('hover-text');
                    nextEle.innerText = hoverText;
                    nextEle.classList.remove('normal');
                    nextEle.classList.add('top');
                }
            },
            blurFn(el){
                if(!el){
                    return;
                }
                if(el.value == ''){
                    el.classList.remove('hover');
                    let nextEle = el.nextElementSibling;
                    let defaultText = nextEle.getAttribute('default-text');
                    nextEle.innerText = defaultText;
                    nextEle.classList.remove('top');
                    nextEle.classList.add('normal');
                }
            },
            clearInput(key) {
                this[key] = '';
                this.$refs[key].focus();
            },
            selectHistory(historyKey, dataKey) {
                let that = this;
                let historys = this.history[historyKey];
                this.historyPicker = this.$createPicker({
                    title: '历史记录',
                    data: [historys],
                    onSelect: (selectedVal, selectedIndex, selectedText) => {
                        that[dataKey] = selectedVal[0];
                        let el = that.$refs[dataKey];
                        that.focusFn(el);
                    }
                })
                this.historyPicker.show();
                controller.logEvent({
                    category: LogEvent.Checkin.Type,
                    event: LogEvent.Checkin.Events[2]
                })
            }
        }
    };
</script>
