
<style lang="scss" scoped>
    @import '~common/styles/common/function.scss';
    .main{
        .post-wrapper{
            &:nth-child(1){
                ul{
                    li{
                        &:nth-child(3){
                            label{
                                &:nth-child(1){
                        
                                    width: 62%;
                                    input{
                                        text-align: left;
                                    }
                                    .btn{
                                        width: rem(21)
                                    }
                                }
                                &:nth-child(2){
                                    width: 38%;
                                    .all-inputBox{
                                       min-width: rem(126) 
                                    }
                                    
                                    input{
                                        text-align: left;
                                    }
                                    .btn{
                                        width: rem(21)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


</style>

<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header>
        <div class="main" :class='{mainHasBottom : !isDetailPage}'>
            <div class="hint" v-if='isDetailPage'>{{psgInfo.applyStatusName}}</div>
            <div class="container">


                <!-- 乘机人信息 -->
                <div class="post-wrapper">
                    <div class="writeInformation-title">乘机人信息</div>
                    <ul>


                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>姓名</span>
                                </div>
                                <input
                                type="text"
                                v-model="psgInfo.passengerName" 
                                placeholder="请输入姓名" 
                                class="all-input-style flex-1" 
                                :readonly='isDetailPage'>
                            </label>
                        </li>


                        <li>
                            <div class="flexbox">
                                <div class="all-inputBox" @click="selectCard('psg')">
                                    <span v-text="juneyaoair.CardType(psgInfo.certType)"></span>
                                    <div class="btndown" v-if='!isDetailPage'></div>
                                </div>
                                <input 
                                type="text" 
                                v-model.trim="psgInfo.certNo" 
                                :readonly='isDetailPage' 
                                placeholder="请输入乘机所持证件号" 
                                class="all-input-style flex-1">
                            </div>
                        </li>


                        <li class="dblflexbox" v-show="psgInfo.certType === 'NI' ? false : true">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>出生日期</span>
                                </div>
                                <input type="text" @click='selectBirthdate' placeholder="请选择"  class="all-input-style flex-1" v-model="psgInfo.adultbirthdate" readonly>
                                <div class="btn" @click='selectBirthdate' v-if='!isDetailPage'></div>
                            </label>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>性别</span>
                                </div>
                                <input type="text" placeholder="请选择" :value="juneyaoair.SexType(psgInfo.sex)" @click="selectSex()" readonly class="all-input-style flex-1">
                                <div class="btn" @click="selectSex()" v-if='!isDetailPage'></div>
                            </label>
                        </li>
                    </ul>
                </div>



                <!-- 航班信息 -->
                <div class="post-wrapper">
                    <div class="writeInformation-title">航班信息</div>
                    <ul>
                        <li v-if="!isDetailPage || psgInfo.ticketNo">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>票号</span>
                                </div>
                                <input type="text" v-model="psgInfo.ticketNo" placeholder="选填，若已购票请输入票号" class="all-input-style flex-1" :readonly='isDetailPage'>
                            </label>
                        </li>
                        <li v-if="!isDetailPage || psgInfo.flightNo">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>航班号</span>
                                </div>
                                <input type="text" v-model="psgInfo.flightNo" placeholder="选填，例：HO1244" class="all-input-style flex-1" :readonly='isDetailPage'>
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>出行日期</span>
                                </div>
                                <input type="text" @click="selectDate" v-model="psgInfo.flightDate" readonly placeholder="请选择" class="all-input-style flex-1">
                                <div class="btn" @click="selectDate" v-if='!isDetailPage'></div>
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>出发站</span>
                                </div>
                                <input type="text" v-model="psgInfo.depAirportName" placeholder="请选择始发机场" class="all-input-style flex-1" readonly @click='selectAirport(0)'>
                                <div class="btn" @click="selectAirport(0)" v-if='!isDetailPage'></div>
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>到达站</span>
                                </div>
                                <input type="text" v-model="psgInfo.arrAirportName" placeholder="请选择到达机场" class="all-input-style flex-1" readonly @click='selectAirport(1)'>
                                <div class="btn" @click="selectAirport(1)" v-if='!isDetailPage'></div>
                            </label>
                        </li>
                    </ul>
                </div>
                <!-- 预订人信息 -->
                <div class="post-wrapper">
                    <div class="writeInformation-title">预订人信息</div>
                    <ul>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>姓名</span>
                                </div>
                                <input type="text" v-model="psgInfo.keeper" placeholder="请输入预订人姓名" class="all-input-style flex-1" :readonly='isDetailPage'>
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>手机</span>
                                </div>
                                <input type="tel" pattern="[0-9]*" v-model="psgInfo.keeperHandphone" placeholder="请输入预订人手机号" class="all-input-style flex-1" :readonly='isDetailPage'>
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>邮箱</span>
                                </div>
                                <input type="email" v-model="psgInfo.keeperEmail" placeholder="请输入邮箱" class="all-input-style flex-1" :readonly='isDetailPage'>
                            </label>
                        </li>
                    </ul>
                </div>
                <div class="serviceRules" v-if='!isDetailPage'>
                    <label for="voucher-slect" class="select-checkbox flexbox">
                        <input type="checkbox" v-model="checkInput" class="label-checkbox" id="voucher-slect">
                        <span class="select-btn"></span>
                        <div class="ruleTxt">
                            我已阅读且同意
                            <a href="javascript:;" @click='clickRulesBtn'>服务规则说明</a>
                        </div>
                    </label>
                </div>
            </div>
        </div>
        <Footer v-if='!isDetailPage'>
            <!-- 灰色 g-disabled 橙色 g-btn-->
            <button slot="sureBtn" :class="submitBtnCls" @click='submitApply'>提交</button>
        </Footer>
        <city-select v-show='canShowciSel' :isShow='canShowciSel' :enter='clickElemStr' :selectData='selectData' @clickSelectItem='clickSelectItem' @closeSelectPage='closeSelectPage'></city-select>
        <rules :rulesInfo='rulesData' @clickCloseBtn='closeRulesPage' v-show='canShowRules' :isShow='canShowRules'></rules>
    </div>
</template>

<script>
    import 'common/tools/rem'
    import 'common/styles/common/common.scss'
    import 'common/styles/slice_sass/content.scss'
    import Header from 'components/header.vue'
    import Footer from 'components/footer.vue'
    import Page from 'common/deploy/page'
    import controller from 'common/logic/controller'
    import requesturl from 'common/deploy/requesturl'
    import Rules from 'components/rules.vue'
    import {SpecialTravellerRules} from 'common/deploy/configRule'
    import service from 'common/service/data'
    import {
        vilidation,
        dateFormat,
        juneyaoair,
        ChannelOrderNo
    } from 'common/logic/utils'
    import {
        RegEnum,
        Verify,
        ServiceCode,
        ResultCode,
        SuccType,
        SelType
    } from 'common/logic/enum'
    import { dealPlaneLineData } from 'common/logic/logic'
    import CitySelect from 'components/citySelect.vue'
    // 点击选择城市元素的名字
    const CLICK_ELEM_NAME = {
        startPlace: 'startPlace',
        endPlace: 'endPlace'
    }
    export default {
        data() {
            return {
                isUseHeader: false, 
                titleStyle:{
                    title: '电动轮椅托运旅客',
                    titlestyle: 4,
                },
                memberInfo: null,
                pageData: {},
                title: '电动轮椅托运旅客',
                isDetailPage: false,        
                psgInfo: {
                    // 乘机人信息
                    certType: 'NI',
                    sex: '',
                    age: '',
                    flightDate: '',
                    pregnancyWeeks: '',
                    adultbirthdate: ''
                },
                checkInput: false,
                canClickBtn: false,
                juneyaoair: juneyaoair,
                canShowciSel: false,
                clickElemStr: '',
                selectData: [],
                // 出发机场的数据
                startAirport: [],
                // 到达机场的数据
                endAirport: [],
                // 和出发机场相对应的到达机场位置
                endAirportIndex: [],
                // 出发机场的三字码
                startAirportEName: '',
                // 到达机场的三字码
                endAirportEName: '',
                endAirportEName: '',
                rulesData: SpecialTravellerRules.EWCON_PEOPLE,
                canShowRules: false
            }
        },
        components: {
            Header,
            Footer,
            CitySelect,
            Rules
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                this.initPage();
                controller.clickBack(() => {
                    that.clickBackBtn();
                })
            })
        },
        computed: {
            submitBtnCls() {
                if (this.checkInput && this.psgInfo.passengerName && this.psgInfo.certType && this.psgInfo.certNo &&
                    this.psgInfo.flightDate && this.psgInfo.depAirportName && this.psgInfo.arrAirportName &&
                    this.psgInfo.keeper && this.psgInfo.keeperHandphone && this.psgInfo.keeperEmail) {
                    if (this.psgInfo.certType !== 'NI') {
                        if (this.psgInfo.adultbirthdate && this.psgInfo.sex) {
                            this.canClickBtn = true;
                        } else {
                            this.canClickBtn = false;
                            return 'g-disabled'
                        }
                    }
                    this.canClickBtn = true;
                    return 'g-btn'
                } else {
                    this.canClickBtn = false;
                    return 'g-disabled'
                }

                this.canClickBtn = true;
                return 'g-btn'
            }
        },
        methods: {
            // // H5头部回调
            // getTitleStyle(titleObj, isTtile) {
            //     console.log('isTitle:'+isTtile);
            //     this.isUseHeader = isTtile;
            // },
            // 关闭规则页面
            closeRulesPage() {
                this.canShowRules = false;
            },
            // 点击规则按钮
            clickRulesBtn() {
                this.canShowRules = true;
            },
            // 点击返回按钮
            clickBackBtn(data) {
                if(this.isDetailPage) {
                    let applyPage = Page.passengers.applyList;
                    if(this.pageData.originPage === 'sucApply') {
                        controller.open({
                            winName: applyPage.winName,
                            path: applyPage.pageUrl,
                            closeLastPage: true
                        });
                        return;
                    }
                    controller.close({pageUrl: '/' + applyPage.pageUrl});
                } else {
                    let carePage = Page.passengers.care;
                    controller.close({pageUrl: '/' + carePage.pageUrl});
                }
            },
            // 初始化页面
            initPage() {
                let previousPageData = this.pageData;
                this.isDetailPage = previousPageData.isDetailPage != undefined ? previousPageData.isDetailPage : false;
                if(this.isDetailPage) {
                    this.getDetailInfor();
                }
                // controller.setTitle(this.$filters.formatPsgTitle(this.title, this.isDetailPage));
                //  controller.setTitle(this.$filters.formatPsgTitle(this.title, this.isDetailPage), this.titleStyle);
            },
            // 请求详情数据
            getDetailInfor() {
                const that = this;
                controller.getJSON({
                        method : 'POST',
                        url: requesturl.PASSENGERS.APPLYDETAIL,
                        params: that.createParams_2(),
                    
                })
                .then(that.sucCallback_2)
                .catch(that.errCallback_2)
            },
            // 创建详情请求接口参数
            createParams_2() {
                return {
                    "request": {
                        "ffpCardNo": this.memberInfo.memberID ,
                        "ffpId": this.memberInfo.id,
                        "loginKeyInfo": this.memberInfo.loginKeyInfo,
                        "id": this.pageData.id
                    }
                }
            },
            // 请求详情成功回调
            sucCallback_2(res) {
                console.log(res)
                this.psgInfo = res.objData;

                this.psgInfo.passengerName = res.objData.passName
                this.psgInfo.certType = res.objData.passCertType
                this.psgInfo.certNo = res.objData.passCertification
                this.psgInfo.adultbirthdate = res.objData.passBirthDate
                this.psgInfo.sex = res.objData.passSex


                this.psgInfo.ticketNo = res.objData.ticketNo
                this.psgInfo.flightNo = res.objData.flightNo
                this.psgInfo.flightDate = res.objData.flightDate
                this.psgInfo.depAirportName = res.objData.departureStationName
                this.psgInfo.arrAirportName = res.objData.destinationStationName

                this.psgInfo.keeper = res.objData.ydPersonName
                this.psgInfo.keeperHandphone = res.objData.ydPersonPhone
                this.psgInfo.keeperEmail = res.objData.ydPersonEmail

                if(this.psgInfo.recordStatus == "1"){
                    this.psgInfo.applyStatusName = "您的资料预约成功"
                }
                if(this.psgInfo.recordStatus == "3"){
                    this.psgInfo.applyStatusName = "审核中，请耐心等待"
                }
                if(this.psgInfo.recordStatus == "5"){
                    this.psgInfo.applyStatusName = "您已取消该服务申请"
                }
                if(this.psgInfo.recordStatus == "2"){
                    this.psgInfo.applyStatusName = "您的资料申请成功"
                }
                if(this.psgInfo.recordStatus == "4"){
                    this.psgInfo.applyStatusName = "您的资料审核失败"
                }
            },
            // 请求详情失败回调
            errCallback_2() {
                controller.toast({str: Verify.BACK_ERR.toastDetailsFail});
            },
            closeSelectPage() {
                this.canShowciSel = false;
            },
            // 城市选择之后的回调
            clickSelectItem(result) {
                this.closeSelectPage();
                if (result.clickElemStr == CLICK_ELEM_NAME.startPlace) {
                    this.startAirportName = result.airPortEName;
                    this.psgInfo.depAirportName = result.name;
                    // 保存出发机场的三字码
                    this.startAirportEName = result.value;
                    this.psgInfo.arrAirportName = '';
                } else {
                    this.psgInfo.arrAirportName = result.name;
                    // 保存出到达机场的三字码
                    this.endAirportEName = result.value;
                }
            },
            // 点击选择出发站
            selectAirport(index) {
                if(this.isDetailPage) {
                    return;
                }
                if (index === 0) {
                    this.clickElemStr = CLICK_ELEM_NAME.startPlace;
                    if (this.startAirport.length === 0) {
                        this.getAirportLine();
                    } else {
                        this.selectData = this.startAirport;
                        this.canShowciSel = true;
                    }
                } else {
                    this.clickElemStr = CLICK_ELEM_NAME.endPlace;
                    if (!this.psgInfo.depAirportName) {
                        controller.toast({
                            str: '请先选择始发机场'
                        });
                    } else {
                        this.selectData = this.endAirport[this.startAirportName];
                        this.canShowciSel = true;
                    }
                }
            },
            // 请求航线
            getAirportLine() {
                var that = this;
                service.getAirLine()
                    .then(that.sucPlaneLineBack)
                    .catch(that.errPlaneLineBack);
            },
            // 请求航线的成功的回调
            sucPlaneLineBack(data) {
                let dealResultData = dealPlaneLineData(data.objData);

                this.startAirport = dealResultData.startAirport;
                this.endAirport = dealResultData.endAirport;
                this.selectData = this.startAirport;
                this.canShowciSel = true;
            },
            // 请求航线的失败的回调
            errPlaneLineBack(data) {
                controller.toast({str: Verify.BACK_ERR.toastCityListFail});
            },
            submitApply() {
                const _that = this
                if (_that.canClickBtn && _that.valify()) {
                    controller.getJSON({
                        method: 'POST',
                        url: requesturl.PASSENGERS.EWCP,
                        params: _that.createParams(),
                       
                    })
                    .then(_that.sucCallback_1)
                    .catch(_that.errorCallback)
                } 
            },
            errorCallback() {
                controller.toast.toast({str: Verify.BACK_ERR.toastNet});
            },
            // 请求成功的回调
            sucCallback_1(data) {
                console.log(data)
                if(data.resultCode === ResultCode.SUCCESS){
                    let applyObj = Page.passengers.sucApply;
                    let id = data.objData.id
                    controller.open({
                        winName: applyObj.winName, 
                        path: applyObj.pageUrl, 
                        data: {title: this.title, type: SuccType.APPLY_SUCC, pageName: Page.passengers.EWConPeople.winName, id: id},
                        closeLastPage: true
                    });
                } else {
                    controller.toast({str: data.resultInfo});
                }
            },
            createParams(){
                const _that = this;
                return {
                    "request": {
                        "ffpCardNo":  _that.memberInfo.memberID,
                        "ffpId": _that.memberInfo.id,
                        "loginKeyInfo": _that.memberInfo.loginKeyInfo,
                        "passengerInfo": {
                            "passName": _that.psgInfo.passengerName,
                            "passCertType": _that.psgInfo.certType,
                            "passCertNo": _that.psgInfo.certNo,
                            "passSex":  _that.psgInfo.sex,
                            "passBirthDate": _that.psgInfo.adultbirthdate,
                            // "gestationalWeek": _that.psgInfo.pregnancyWeeks
                        },
                        "flightInfo": {
                            "ticketNo": _that.psgInfo.ticketNo,
                            "flightNo": _that.psgInfo.flightNo,
                            "flightDate": _that.psgInfo.flightDate,
                            "depAirCode": _that.startAirportEName,
                            "arrAirCode": _that.endAirportEName
                        },
                        "ydPersonInfo": {
                            "ydPersonName": _that.psgInfo.keeper,
                            "ydPersonPhone": _that.psgInfo.keeperHandphone,
                            "ydPersonEmail": _that.psgInfo.keeperEmail
                        },
                        "serviceType": ServiceCode.EWC,
                        // "channelOrderNo": ChannelOrderNo(new Date())
                    }
                }
            },
            // 验证信息
            valify(){
                if(this.psgInfo.passengerName.length > 25){
                    controller.toast({str: Verify.BACK_ERR.toastNameLen});
                    return false;
                }
                // 乘机人信息验证
                if(!this.vertificate(this.psgInfo.passengerName,RegEnum.NAME_ALL, 2000)) {
                    return false;
                }
                if(this.psgInfo.certType === 'NI' && !this.vertificate(this.psgInfo.certNo,RegEnum.ID_CARD, 2000)) {
                    return false;
                }
                if(this.psgInfo.certType !== 'NI' && this.psgInfo.certNo === '') {
                    controller.toast({str: Verify.BACK_ERR.toastCard})
                    return false;
                }
                if(this.psgInfo.certType !== 'NI' && this.psgInfo.adultbirthdate === '') {
                    controller.toast({str: '请选择出生年月'})
                    return false;
                }
                if(this.psgInfo.certType.trim() !== 'NI' && this.psgInfo.sex === ''){
                    controller.toast({str: '请选择性别'})
                    return false;
                }

                // 航班信息验证
                if (this.psgInfo.ticketNo) {
                    if(!this.vertificate(this.psgInfo.ticketNo,RegEnum.TICKET_NO, 2000)){
                        return false;
                    }
                }
                if(!!this.psgInfo.flightNo){
                    if (!this.vertificate(this.psgInfo.flightNo, RegEnum.FLIGHT_NO, 2000)) {
                        return false;
                    }
                }
                if (!this.vertificate(this.psgInfo.flightDate, RegEnum.DATE_CH, 2000)) {
                    return false;
                }

                // 预订人信息验证
                if(this.psgInfo.keeper.length > 25){
                    controller.toast({str: Verify.BACK_ERR.toastNameLen});
                    return false;
                }
                if(!this.vertificate(this.psgInfo.keeper, RegEnum.NAME_ALL, 2000)) {
                    return false;
                }
                if(!this.vertificate(this.psgInfo.keeperHandphone, RegEnum.MOBILE, 2000)){
                    return false;
                }
                if(!this.vertificate(this.psgInfo.keeperEmail, RegEnum.EMAIL, 2000)){
                    return false;
                }

                return true;
            },
            // 通用的验证方法
            vertificate(content, reg, time) {
                let verificateResult = vilidation(content, reg);
                if(typeof verificateResult === 'string') {  
                    controller.toast({str: verificateResult, times: time});
                    return false;
                }
                return true;
            },
            maxStartDate() {
                return new Date(new Date().setMonth(new Date().getMonth() + 6))
            },
            selectCard() {
                if(this.isDetailPage) {
                    return;
                }
                if(!this.cardPicker){
                    this.cardPicker = this.$createPicker({
                        title: '选择证件类型',
                        data: [juneyaoair.selStr(SelType.card)],
                        onSelect: (selectedVal, selectedIndex, selectedText) => {
                            this.psgInfo.certType = selectedVal[0]
                        }
                    })
                }
                this.cardPicker.show()
            },
            selectSex() {
                if(this.isDetailPage) {
                    return;
                }
                if(!this.sexPicker){
                    this.sexPicker = this.$createPicker({
                        title: '选择性别',
                        data: [juneyaoair.selStr(SelType.sex)],
                        onSelect: (selectedVal, selectedIndex, selectedText) => {
                            this.psgInfo.sex = selectedVal[0]
                        }
                    })
                }
                this.sexPicker.show()
            },
            selectAge() {
                if(this.isDetailPage) {
                    return;
                }
                if(!this.agePicker){
                    this.agePicker = this.$createPicker({
                        title: '选择年龄',
                        data: [juneyaoair.selCount(SelType.age)],
                        onSelect: (selectedVal, selectedIndex, selectedText) => {
                            this.psgInfo.age = selectedVal[0]
                        }
                    })
                }
                this.agePicker.show()
            },
            selectDate() {
                if(this.isDetailPage) {
                    return;
                }
                if(!this.datePicker){
                    this.datePicker = this.$createDatePicker({
                        title: '请选择日期',
                        min: new Date(),
                        max: this.maxStartDate(),
                        value: new Date(),
                        format: {
                            year: 'YYYY年',
                            month: 'MM月',
                            date: 'dd日'
                        },
                        onSelect: (data) => {
                            this.psgInfo.flightDate = dateFormat.getFormatDate(new Date(data), 'yyyy-MM-dd')
                        }
                    })
                }
                this.datePicker.show()
            },
            selectBirthdate() {
                if(this.isDetailPage) {
                    return;
                }
                if(!this.birthdatePicker) {
                    this.birthdatePicker = this.$createDatePicker({
                        title: '请您选择日期',
                        min: this.mindate(),
                        max: this.maxdate(),
                        value: new Date(),
                        format: {
                            year: 'YYYY年',
                            month: 'MM月',
                            date: 'dd日'
                        },
                        onSelect: this.birthdateConfirm,
                        onCancel: this.cancelDate
                    })
                }
                this.birthdatePicker.show()
            },
            birthdateConfirm(date) {
                this.adultbirthdate = date;
                this.psgInfo.adultbirthdate = dateFormat.getFormatDate(date, 'yyyy-MM-dd');
                console.log(this.psgInfo.adultbirthdate);
            },
            mindate(){
                // let date = new Date();
                // date.setFullYear(new Date().getFullYear() - 100);
                // return new Date(date.getFullYear());
                return new Date(1918, 1, 1, 0 , 0 , 0);
            },
            maxdate(){
                let date = new Date();
                date.setDate(new Date().getDate());
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
            }
        }
    }
</script>
