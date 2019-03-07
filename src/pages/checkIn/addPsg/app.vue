<style lang="scss" scope>
    @import '~common/styles/checkIn.scss';
    @import '~common/styles/checkInItem.scss';
    .m-form{
        margin-top: rem(30);
    }
</style>
<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="titleStyle" @h5TitleStyle="getTitleStyle">
        </Header>
        <div class="main" :class='{mainNotTop: !isUseHeader}'>
            <div class="m-wp">
                <div class="m-box">
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
                        <div class="form-btn">
                            <button class="cu-btn" :class="{'cu-btn-disabled': !ticketNo || !passengerName}" @click="addPeer">确定添加</button>
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
    import controller from "common/logic/controller"
    import requesturl from "common/deploy/requesturl"
    import localstorage from "common/deploy/localstorage"
    import { ResultCode, Verify, StarAirs } from "common/logic/enum"
    import { payParams } from "common/logic/logic"
    import Page from "common/deploy/page"
    import LogEvent from 'common/deploy/logEvent'
    import { juneyaoair } from 'common/logic/utils'
    export default {
        data() {
            return {
                ticketNo: '',
                passengerName: '',
                memberInfo: null,
                pageData: {},
                history: {
                    ticketNos: [],
                    passengerNames: [],
                    tels: []
                },
                titleStyle: {
                    title: '添加同行人',
                    titlestyle: 4,
                    closetype: 1
                },
                // 当前航段信息
                checkInItem: {},
                // 已选乘机人列表 
                pasArr: [],
                isUseHeader: false
            };
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
                that.checkInItem = that.pageData.checkInItem;
                that.pasArr = that.pageData.pasArr;
            });
        },
        methods: {
            // 添加同行人
            addPeer(){
                let that = this;
                if(!that.ticketNo || !that.passengerName){
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
                that.passengerName = that.passengerName.toUpperCase();
                let params = {
                    checkInSeatStatus: that.checkInItem.checkInSeatStatus,
                    flightNo: that.checkInItem.flightNo,
                    flightDate: that.checkInItem.flightDate,
                    depAirportCode: that.checkInItem.depAirport,
                    arrAirportCode: that.checkInItem.arrAirport,
                    peerInfos: [],
                    peerCertNo: that.ticketNo,
                    peerName: that.passengerName
                }
                if(that.memberInfo){
                    params.ffpId = that.memberInfo.id;
                    params.ffpCardNo = that.memberInfo.memberID;
                    params.loginKeyInfo = that.memberInfo.loginKeyInfo;
                }
                that.pasArr.forEach(item=>{
                    params.peerInfos.push({
                        peerName: item.psrName || item.psrEnName,
                        tktNo: item.etCode,
                        cabin: item.cabin
                    })
                })
                controller.logEvent({
                    category: LogEvent.Checkin.Type,
                    event: LogEvent.Checkin.Events[6]
                })
                controller.getJSON({
                        method : 'POST',
                        url: requesturl.CHECKIN.ADD_PEER,
                        params: params
                })
                .then(data=>{
                    if(data.resultCode === ResultCode.SUCCESS){
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
                        } catch(e){}
                        data.certNo = that.ticketNo;
                        controller.setStorage(localstorage.CHECKIN_HISTORY, that.history);
                        controller.setStorage(localstorage.TEMP_PAGE_DATA, data);
                        //let pageObj = Page.checkIn.seat;
                        controller.close({
                            closePage: true
                        });
                    } else {
                        controller.toast({str: data.errorInfo});
                    }
                })
                .catch(data=>{
                    controller.toast({str: Verify.BACK_ERR.toastDetailsFail});
                });
            },
            // 点击返回按钮
            clickBackBtn() {
                controller.close();
            },
            getTitleStyle(titleObj, isTtile) {
                this.isUseHeader = isTtile;
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
            },
            clearInput(key) {
                this[key] = '';
                this.$refs[key].focus();
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
            }
        },
        components: {
            Header
        }
    };
</script>
