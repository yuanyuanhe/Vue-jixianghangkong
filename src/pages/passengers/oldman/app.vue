<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header>
        <div class="main" :class='{mainHasBottom: !isDetailPage}'>
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
                                <input type="text" v-model="psgInfo.passengerName" :readonly='isDetailPage' placeholder="请输入姓名" class="all-input-style flex-1">
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
                        <li v-show="psgInfo.certType === 'NI' ? false : true">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>年龄</span>
                                </div>
                                <input type="text" placeholder="请选择" :value="juneyaoair.AgeType(psgInfo.age)" @click="selectAge" readonly class="all-input-style flex-1">
                                <div class="btn" @click="selectAge" v-if='!isDetailPage'></div>
                            </label>
                        </li>
                        <li v-show="psgInfo.certType === 'NI' ? false : true">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>性别</span>
                                </div>
                                <input type="text" placeholder="请选择" :value="juneyaoair.SexType(psgInfo.sex)" @click="selectSex" readonly class="all-input-style flex-1">
                                <div class="btn" @click="selectSex" v-if='!isDetailPage'></div>
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
                                <input type="text" v-model.trim="psgInfo.ticketNo" :readonly='isDetailPage' placeholder="选填，若已购票请输入票号" class="all-input-style flex-1">
                            </label>
                        </li>
                        <li v-if="!isDetailPage || psgInfo.flightNo">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>航班号</span>
                                </div>
                                <input type="text" v-model="psgInfo.flightNo" :readonly='isDetailPage' placeholder="选填，例：HO1244" class="all-input-style flex-1">
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>出行日期</span>
                                </div>
                                <input type="text" @click="selectDate" v-model="psgInfo.flightDate" readonly placeholder="请选择" class="all-input-style flex-1">
                                <div class="btn" @click="selectDate"  v-if='!isDetailPage'></div>
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
                <!-- 送机人信息 -->
                <div class="post-wrapper">
                    <div class="writeInformation-title">送机人信息</div>
                    <ul>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>姓名</span>
                                </div>
                                <input type="text" v-model="psgInfo.sendName" :readonly='isDetailPage' placeholder="请输入送机人姓名" class="all-input-style flex-1">
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>手机</span>
                                </div>
                                <input type="tel" pattern="[0-9]*" v-model="psgInfo.sendPhone" :readonly='isDetailPage' placeholder="请输入送机人手机号" class="all-input-style flex-1">
                            </label>
                        </li>
                        <li>
                            <div class="flexbox">
                                <div class="all-inputBox" @click="selectCard('send')">
                                    <span v-text="juneyaoair.CardType(psgInfo.sendCertType)"></span>
                                    <div class="btndown" v-if='!isDetailPage'></div>
                                </div>
                                <input 
                                type="text" 
                                v-model.trim="psgInfo.sendCertNo" 
                                :readonly='isDetailPage' 
                                placeholder="请输入证件号码" 
                                class="all-input-style flex-1">
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 接机人信息 -->
                <div class="post-wrapper">
                    <div class="writeInformation-title">接机人信息</div>
                    <ul>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>姓名</span>
                                </div>
                                <input type="text" v-model="psgInfo.meetName" :readonly='isDetailPage' placeholder="请输入接机人姓名" class="all-input-style flex-1">
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>手机</span>
                                </div>
                                <input type="tel" pattern="[0-9]*" v-model="psgInfo.meetPhone" :readonly='isDetailPage' placeholder="请输入接机人手机号" class="all-input-style flex-1">
                            </label>
                        </li>
                        <li>
                            <div class="flexbox">
                                <div class="all-inputBox" @click="selectCard('pick')">
                                    <span v-text="juneyaoair.CardType(psgInfo.meetCertType)"></span>
                                    <div class="btndown" v-if='!isDetailPage'></div>
                                </div>
                                <input 
                                type="text" 
                                v-model.trim="psgInfo.meetCertNo" 
                                :readonly='isDetailPage' 
                                placeholder="请输入证件号码" 
                                class="all-input-style flex-1">
                            </div>
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
                                <input type="text" v-model="psgInfo.keeper" :readonly='isDetailPage' placeholder="请输入预订人姓名" class="all-input-style flex-1">
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>手机</span>
                                </div>
                                <input type="tel" pattern="[0-9]*" v-model="psgInfo.keeperHandphone" :readonly='isDetailPage' placeholder="请输入预订人手机号" class="all-input-style flex-1">
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>邮箱</span>
                                </div>
                                <input type="email" v-model="psgInfo.keeperEmail" :readonly='isDetailPage' placeholder="请输入邮箱" class="all-input-style flex-1">
                            </label>
                        </li>
                    </ul>
                </div>
                <!-- 协议 -->
                <div class="serviceRules"  v-if='!isDetailPage'>
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
                    title: '老人协助服务',
                    titlestyle: 4,
                },
                memberInfo: null,
                pageData: {},
                title: '老人协助服务',
                isDetailPage: false,
                psgInfo: {
                    // 乘机人信息
                    certType: 'NI',
                    sex: '',
                    age: '',
                    flightDate: '',
                    // 送机人信息
                    sendCertType: 'NI',
                    // 接机人信息
                    meetCertType: 'NI',
                    flightNo: ''
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
                rulesData: SpecialTravellerRules.OLDMAN,
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
                that.initPage();
                controller.clickBack(() => {
                    that.clickBackBtn();
                })
            })
        },
        computed: {
            submitBtnCls() {
                if (this.checkInput && this.psgInfo.passengerName && this.psgInfo.certType && this.psgInfo.certNo &&
                    this.psgInfo.flightDate && this.psgInfo.depAirportName && this.psgInfo.arrAirportName &&
                    this.psgInfo.sendName && this.psgInfo.sendPhone && this.psgInfo.sendCertType && this.psgInfo.sendCertNo &&
                    this.psgInfo.meetName && this.psgInfo.meetPhone && this.psgInfo.meetCertType && this.psgInfo.meetCertNo &&
                    this.psgInfo.keeper && this.psgInfo.keeperHandphone && this.psgInfo.keeperEmail) {
                    if (this.psgInfo.certType !== 'NI') {
                        if (this.psgInfo.age && this.psgInfo.sex) {
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
                    this.seeDetails()
                }
                // controller.setTitle(this.$filters.formatPsgTitle(this.title, this.isDetailPage));
                // controller.setTitle(this.$filters.formatPsgTitle(this.title, this.isDetailPage), this.titleStyle);
            },
            // 查看详情
            seeDetails(){
                const that = this;
                controller.getJSON({
                    method: 'POST',
                    url: requesturl.PASSENGERS.APPLYDETAIL,
                    params: that.createDetailParams(),
                 
                })
                .then((res) => {
                    console.log(res)
                    if (res.resultCode === ResultCode.SUCCESS) {
                        that.psgInfo = res.objData;
                        this.psgInfo.passengerName = res.objData.passName
                        this.psgInfo.certType = res.objData.passCertType
                        this.psgInfo.certNo = res.objData.passCertification
                        this.psgInfo.age = res.objData.passAge
                        this.psgInfo.sex = res.objData.passSex

                        this.psgInfo.ticketNo = res.objData.ticketNo
                        this.psgInfo.flightNo = res.objData.flightNo
                        this.psgInfo.flightDate = res.objData.flightDate
                        this.psgInfo.depAirportName = res.objData.departureStationName
                        this.psgInfo.arrAirportName = res.objData.destinationStationName

                        this.psgInfo.sendName = res.objData.sjPersonName
                        this.psgInfo.sendCertType = res.objData.sjPersionCertType
                        this.psgInfo.sendPhone = res.objData.sjPersonContact
                        this.psgInfo.sendCertNo = res.objData.sjPersonCert

                        this.psgInfo.meetName = res.objData.jjPersonName
                        this.psgInfo.meetCertType = res.objData.jjPersonCertType
                        this.psgInfo.meetPhone = res.objData.jjPersonContact
                        this.psgInfo.meetCertNo = res.objData.jjPersonCert

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
                    } else {
                        controller.toast({str: res.resultInfo});
                    }
                })
                .catch(that.errorCallback_1)
            },
            // 创建详情请求参数
            createDetailParams(){
                return {
                    "request": {
                        "ffpCardNo": this.memberInfo.memberID,
                        "ffpId": this.memberInfo.id,
                        "loginKeyInfo": this.memberInfo.loginKeyInfo,
                        "id": this.pageData.id
                    }
                }
            },
            errorCallback() {
                controller.stoast({str: Verify.BACK_ERR.toastNet});
            },
            errorCallback_1() {
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

                    let datas = {
                        request: {
                            ffpCardNo: _that.memberInfo.memberID,
                            ffpId: _that.memberInfo.id,
                            loginKeyInfo: _that.memberInfo.loginKeyInfo,
                            serviceType: ServiceCode.OLD,
                            passengerInfo: {
                                passName: _that.psgInfo.passengerName,
                                passCertType: _that.psgInfo.certType,
                                passCertNo: _that.psgInfo.certNo,
                                passAge: _that.psgInfo.age,
                                passSex: _that.psgInfo.sex
                            },
                            flightInfo: {
                                ticketNo: _that.psgInfo.ticketNo,
                                flightNo: _that.psgInfo.flightNo,
                                flightDate: _that.psgInfo.flightDate,
                                depAirCode: _that.startAirportEName,
                                arrAirCode: _that.endAirportEName,
                            },
                            sjPersonInfo: {
                                sjPersonName: _that.psgInfo.sendName,
                                sjPersonPhone: _that.psgInfo.sendPhone,
                                sjPersonCertType: _that.psgInfo.sendCertType,
                                sjPersonCertNo: _that.psgInfo.sendCertNo
                            },
                            jjPersonInfo: {
                                jjPersonName: _that.psgInfo.meetName,
                                jjPersonPhone: _that.psgInfo.meetPhone,
                                jjPersonCertType: _that.psgInfo.meetCertType,
                                jjPersonCertNo: _that.psgInfo.meetCertNo
                            },
                            ydPersonInfo: {
                                ydPersonName: _that.psgInfo.keeper,
                                ydPersonPhone: _that.psgInfo.keeperHandphone,
                                ydPersonEmail: _that.psgInfo.keeperEmail
                            },
                            // channelOrderNo: ChannelOrderNo(new Date())
                        }
                    }
                    controller.getJSON({
                        method: 'POST',
                        url: requesturl.PASSENGERS.NOCOMPANY,
                        params: datas,
                       
                    })
                    .then((res) => {
                        console.log(res)
                        if (res.resultCode === ResultCode.SUCCESS) {
                            let applyObj = Page.passengers.sucApply;
                            let id = res.objData.id
                            controller.open({
                                winName: applyObj.winName, 
                                path: applyObj.pageUrl, 
                                data: {title: this.title, type: SuccType.ORDER_SUCC, pageName: Page.passengers.oldman.winName, id: id},
                                closeLastPage: true
                            });
                        } else {
                            controller.toast({str: res.resultInfo});
                        }
                    })
                    .catch(_that.errorCallback)
                }
            },
            // 验证信息
            valify() {
                // 乘机人信息验证
                if(this.psgInfo.passengerName.length > 25){
                    controller.toast({str: Verify.BACK_ERR.toastNameLen});
                    return false;
                }
                if (!this.vertificate(this.psgInfo.passengerName, RegEnum.NAME_ALL, 2000)) {
                    return false;
                }
                if (this.psgInfo.certType === 'NI' && !this.vertificate(this.psgInfo.certNo, RegEnum.ID_CARD, 2000)) {
                    return false;
                }
                if (this.psgInfo.certType !== 'NI' && this.psgInfo.certNo === '') {
                    controller.toast({
                        str: Verify.BACK_ERR.toastCard
                    })
                    return false;
                }
                if (this.psgInfo.certType !== 'NI' && this.psgInfo.age === '') {
                    controller.toast({
                        str: '请选择年龄'
                    })
                    return false;
                }
                if (this.psgInfo.certType !== 'NI' && this.psgInfo.sex === '') {
                    controller.toast({
                        str: '请选择性别'
                    })
                    return false;
                }

                // 航班信息验证
                if (this.psgInfo.ticketNo) {
                    if(!this.vertificate(this.psgInfo.ticketNo, RegEnum.TICKET_NO, 2000)){
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

                // 送机人信息验证
                if(this.psgInfo.sendName.length > 25){
                    controller.toast({str: Verify.BACK_ERR.toastNameLen});
                    return false;
                }
                if (!this.vertificate(this.psgInfo.sendName, RegEnum.NAME_ALL, 2000)) {
                    return false;
                }
                if (!this.vertificate(this.psgInfo.sendPhone, RegEnum.MOBILE, 2000)) {
                    return false;
                }
                if (this.psgInfo.sendCertType === 'NI' && !this.vertificate(this.psgInfo.sendCertNo, RegEnum.ID_CARD, 2000)) {
                    return false;
                }
                if (this.psgInfo.sendCertType !== 'NI' && this.psgInfo.sendCertNo === '') {
                    controller.toast({
                        str: Verify.BACK_ERR.toastCard
                    })
                    return false;
                }

                // 接机人信息验证
                 if(this.psgInfo.meetName.length > 25){
                    controller.toast({str: Verify.BACK_ERR.toastNameLen});
                    return false;
                }
                if (!this.vertificate(this.psgInfo.meetName, RegEnum.NAME_ALL, 2000)) {
                    return false;
                }
                if (!this.vertificate(this.psgInfo.meetPhone, RegEnum.MOBILE, 2000)) {
                    return false;
                }
                if (this.psgInfo.meetCertType === 'NI' && !this.vertificate(this.psgInfo.meetCertNo, RegEnum.ID_CARD, 2000)) {
                    return false;
                }
                if (this.psgInfo.meetCertType !== 'NI' && this.psgInfo.meetCertNo === '') {
                    controller.toast({
                        str: Verify.BACK_ERR.toastCard
                    })
                    return false;
                }

                // 预订人信息验证
                if(this.psgInfo.keeper.length > 25){
                    controller.toast({str: Verify.BACK_ERR.toastNameLen});
                    return false;
                }
                if (!this.vertificate(this.psgInfo.keeper, RegEnum.NAME_ALL, 2000)) {
                    return false;
                }
                if (!this.vertificate(this.psgInfo.keeperHandphone, RegEnum.MOBILE, 2000)) {
                    return false;
                }
                if (!this.vertificate(this.psgInfo.keeperEmail, RegEnum.EMAIL, 2000)) {
                    return false;
                }

                return true;
            },
            // 通用的验证方法
            vertificate(content, reg, time) {
                let verificateResult = vilidation(content, reg);
                if (typeof verificateResult === 'string') {
                    controller.toast({
                        str: verificateResult,
                        times: time
                    });
                    return false;
                }
                return true;
            },
            maxStartDate() {
                return new Date(new Date().setMonth(new Date().getMonth() + 6))
            },
            selectCard(idf) {
                if(this.isDetailPage) {
                    return;
                }
                this.isCard = idf
                if (!this.cardPicker) {
                    this.cardPicker = this.$createPicker({
                        title: '选择证件类型',
                        data: [juneyaoair.selStr(SelType.card)],
                        onSelect: (selectedVal, selectedIndex, selectedText) => {
                            if (this.isCard === 'psg') {
                                this.psgInfo.certType = selectedVal[0]
                            } else if (this.isCard === 'send') {
                                this.psgInfo.sendCertType = selectedVal[0]
                            } else if (this.isCard === 'pick') {
                                this.psgInfo.meetCertType = selectedVal[0]
                            }
                        }
                    })
                }
                this.cardPicker.show()
            },
            selectSex() {
                if(this.isDetailPage) {
                    return;
                }
                if (!this.sexPicker) {
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
                if (!this.psgAgePicker) {
                    this.psgAgePicker = this.$createPicker({
                        title: '选择年龄',
                        data: [juneyaoair.selCount(SelType.oldman)],
                        onSelect: (selectedVal, selectedIndex, selectedText) => {
                            this.psgInfo.age = selectedVal[0]
                        }
                    })
                }
                this.psgAgePicker.show()
            },
            selectDate() {
                if(this.isDetailPage) {
                    return;
                }
                if (!this.datePicker) {
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
            }
        }
    }
</script>
