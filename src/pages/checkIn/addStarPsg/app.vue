<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="titleStyle" @h5TitleStyle="getTitleStyle">
        </Header>
        <div class="main" :class='{mainNotTop: !isUseHeader}'>
            <div class="m-content">
                <div class="post-wrapper">
                    <ul>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>姓名</span>
                                </div>
                                <input type="text" placeholder="请输入姓名" v-model.trim="psgObj.name" class="all-input-style flex-1">
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>航司</span>
                                </div>
                                <input type="text" placeholder="请选择航司" v-model="psgObj.airName" readonly class="all-input-style flex-1" @click='selectAir()'>
                                <div class="btn" @click="selectAir()"></div>
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>卡号</span>
                                </div>
                                <input type="text" placeholder="请输入卡号" v-model.trim="psgObj.card" class="all-input-style flex-1">
                            </label>
                        </li>
                    </ul>
                </div>
                <div class="form-btn">
                    <button class="cu-btn" :class="{'cu-btn-disabled': !psgObj.name || !psgObj.airCode || !psgObj.card}" @click="addPsg()">确定添加</button>
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
    import { RegEnum, StarAirs, CheckInSeatStatus, Verify, ResultCode } from "common/logic/enum"
    import { payParams } from "common/logic/logic"
    import Page from "common/deploy/page"
    import LogEvent from 'common/deploy/logEvent'
    import localstorage from "common/deploy/localstorage"
    import { juneyaoair } from 'common/logic/utils'
    export default {
        data() {
            return {
                memberInfo: null,
                pageData: {},
                isUseHeader: false,
                titleStyle: {
                    title: '添加常旅客卡',
                    titlestyle: 4,
                    closetype: 1
                },
                psgObj: {
                    name: '',
                    airName: '',
                    airCode: '',
                    card: ''
                },
                // 航班信息
                checkInResult: null,
                // 旅客信息
                psgItem: null
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                that.checkInResult = that.pageData.checkInResult;
                that.psgItem = that.pageData.psgItem;
                if(that.psgItem.cardID){
                    that.psgObj.name = that.psgItem.psrName;
                    that.psgObj.airCode = that.psgItem.cardAirline;
                    that.psgObj.card = that.psgItem.cardID;
                    StarAirs.forEach(item=>{
                        if(item.value == that.psgItem.cardAirline){
                            that.psgObj.airName = item.text;
                        }
                    })
                }
                controller.clickBack(() => {
                    that.clickBackBtn();
                })
            });
        },
        methods: {
            // 添加常旅客
            addPsg(){
                let that = this;
                if(that.psgObj.name==""){
                    controller.toast({str: '请输入姓名'})
                    return;
                }
                if(!juneyaoair.validateNameAll(that.psgObj.name)){
                    return;
                }
                if(that.psgObj.airCode==""){
                    controller.toast({str: '请选择航司'})
                    return;
                }
                if(that.psgObj.card==""){
                    controller.toast({str: '请输入卡号'})
                    return;
                }
                if(!RegEnum.properties[RegEnum.EN_NUMBER].reg.test(that.psgObj.card)){
                    controller.toast({str: '请输入正确的卡号'})
                    return;
                }
                let params = {
                    cardID: that.psgObj.card,
                    cardAirline: that.psgObj.airCode,
                    psrName: that.psgObj.name,
                    seatNo: that.psgItem.seatNo,
                    flightNo: that.checkInResult.flightNo,
                    flightDate: that.checkInResult.flightDate
                }
                if(that.memberInfo){
                    params.ffpId = that.memberInfo.id;
                    params.ffpCardNo = that.memberInfo.memberID;
                    params.loginKeyInfo = that.memberInfo.loginKeyInfo;
                }
                params.depAirportCode = that.checkInResult.depAirportCode
                params.arrAirportCode = that.checkInResult.arrAirportCode
                if(that.pageData.checkInSeatStatus == CheckInSeatStatus.CHECKIN){
                    params.checkInOrSelectSeat = 'CHECKIN'
                    params.id = that.psgItem.checkInId
                    params.segNo = that.psgItem.segNo
                    params.etCode = that.psgItem.etCode
                } else {
                    params.checkInOrSelectSeat = 'SELECTSEAT'
                    params.id = that.psgItem.id
                    params.segNo = that.psgItem.airsegIndex
                    params.etCode = that.psgItem.tktNo
                }
                controller.logEvent({
                    category: LogEvent.Checkin.Type,
                    event: LogEvent.Checkin.Events[12]
                })
                controller.getJSON({
                        method : 'POST',
                        url: requesturl.CHECKIN.ADD_PSGCARD,
                        params: params
                })
                .then((data)=>{
                    if(data.resultCode === ResultCode.SUCCESS){
                        let obj = {
                            cardID: that.psgObj.card,
                            cardAirline: that.psgObj.airCode,
                            index: that.pageData.index
                        }
                        controller.setStorage(localstorage.TEMP_PAGE_DATA, obj);
                        controller.close({closePage: true});
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
                let that = this;
                if(that.psgObj.name && that.psgObj.airCode && that.psgObj.card){
                    controller.confirm({
                        title: "提示",
                        message: '信息尚未保存，确认关闭吗？',
                        buttons: ["取消", "确定"],
                        onConfirm() {
                            controller.close();
                        }
                    })
                } else {
                    controller.close();
                }
            },
            getTitleStyle(titleObj, isTtile) {
                this.isUseHeader = isTtile;
            },
            selectAir() {
                let that = this;
                if (!this.airlist) {
                    this.airlist = this.$createPicker({
                        title: '选择航司',
                        data: [StarAirs],
                        onSelect: (selectedVal, selectedIndex, selectedText) => {
                            that.psgObj.airName = selectedText[0];
                            that.psgObj.airCode = selectedVal[0];
                        }
                    })
                }
                this.airlist.show();
            }
        },
        components: {
            Header
        }
    };
</script>

<style lang="scss">
    @import "~common/styles/common/function.scss";
    @import "~common/styles/common/common.scss";
    @import '~common/styles/slice_sass/content.scss';
    .m-content{
        margin: rem(50) rem(30);
        background-color: #fff;
        @include border-radius(rem(6));
        @include box-shadow(0 rem(6) rem(10) 0 rgba(0,0,0,0.1));
        .form-btn{
            padding: rem(30);
        }
    }
    ul li:last-child::before{
        border-color: #f4f4f4;
    }
    .post-wrapper ul{
        -webkit-box-shadow: none;
        -ms-box-shadow: none;
        -o-box-shadow: none;
        box-shadow: none;
    }
</style>
