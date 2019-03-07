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
            &:nth-child(3){
                ul{
                    li{
                        .label-content{
                            .insurance-information{
                                .all-inputBox{
                                    margin-top: rem(20)
                                }
                            }
                        }
                    }
                }
            }
            &:nth-child(5){
                ul{
                    flex-wrap: wrap;
                    .add{
                        margin-bottom: rem(30);
                    }
                    li{
                        left: 0;
                        top: 0;
                        padding: 0;
                        width: rem(190);
                        height:rem(190);
                        margin-top: rem(30);
                        margin-left:rem(30); 
                        &:nth-child(1){
                            margin-bottom: rem(30);
                        }
                        &:nth-child(4){
                            margin-bottom: rem(30);
                            margin-top: rem(0);
                        }
                        &:nth-child(5){
                            margin-top: rem(0);
                        }
                        &:nth-child(6){
                            margin-top: rem(0);
                        }
                        &:nth-child(7){
                            margin-bottom: rem(30);
                            margin-top: rem(0);
                        }
                        img{
                            width: rem(190);
                            height: rem(190);
                        }
                        &:nth-child(8){
                            margin-top: rem(0);
                        }
                        &:nth-child(9){
                            margin-top: rem(0);
                            margin-bottom: rem(30);
                        }
                        label{
                            width: rem(190) !important;
                            height: rem(190) !important;
                            border: 1px #F5F5F5 solid;
                            position:absolute;
                            top:0;
                            left:0;
                            img{
                               width: rem(66);
                               height:rem(50);
                               margin-top: rem(74);
                               margin-left: rem(65);
                            }
                            input{
                                display: none;
                            }
                        }
                    }
                }
                
            }
             &:nth-child(6){
                ul{
                    li{
                        height: rem(250);
                        label{
                            .areatxt{
                                margin-top: rem(30);
                                margin-bottom: rem(30);
                                resize: none;
                                height: rem(194);
                                width: 100%;
                                color: #3A3D50;
                                font-size: rem(28);
                                line-height: 1.8;
                                overflow: auto;
                                &:-moz-placeholder{
                                    color:#ccc;
                                }
                                &::-moz-placeholder{
                                    color:#ccc;
                                }
                                &:-ms-input-placeholder{
                                    color:#ccc;
                                }
                                &::-webkit-input-placeholder{
                                    color:#ccc;
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
                                <input type="text" v-model="psgInfo.ticketNo" :readonly='isDetailPage' placeholder="选填，若已购票请输入票号" class="all-input-style flex-1">
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
                <!-- 行李问题 -->
                <div class="post-wrapper">
                    <div class="writeInformation-title">行李问题</div>
                    <ul>
                         <li class="every-insurance clearfix" v-if="isDetailPage ? isDetailPage && psgInfo.serviceType === BagClaim.LOSS : true">
                            <div class="label-content flexbox">
                                <div class="insurance-information flex-1">
                                    <div class="all-inputBox">
                                        <span class="name">遗失</span>
                                    </div>
                                </div>
                            </div>
                            <label class="select-checkbox clearfix" v-show="!isDetailPage">
                                <input type="radio" name = "Problem" v-model="psgInfo.serviceType" class="label-checkbox" :value="BagClaim.LOSS">
                                <span class="select-btn"></span>
                            </label>
                        </li>

                        <li class="every-insurance clearfix" v-if="isDetailPage ? isDetailPage && psgInfo.serviceType === BagClaim.WORN : true">
                            <div class="label-content flexbox">
                                <div class="insurance-information flex-1">
                                    <div class="all-inputBox">
                                        <span class="name">破损</span>
                                    </div>
                                </div>
                            </div>
                            <label class="select-checkbox clearfix" v-show="!isDetailPage">
                                <input type="radio" name = "Problem"  v-model="psgInfo.serviceType" class="label-checkbox" :value="BagClaim.WORN">
                                <span class="select-btn"></span>
                            </label>
                        </li>
                    </ul>
                </div>
                <!-- 申诉人信息 -->
                <div class="post-wrapper">
                    <div class="writeInformation-title">申诉人信息</div>
                    <ul>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>姓名</span>
                                </div>
                                <input type="text" v-model="psgInfo.keeper" :readonly='isDetailPage' placeholder="请输入申诉人姓名" class="all-input-style flex-1">
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>手机</span>
                                </div>
                                <input type="tel" pattern="[0-9]*" v-model="psgInfo.keeperHandphone" :readonly='isDetailPage' placeholder="请输入申诉人手机号" class="all-input-style flex-1">
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>邮箱</span>
                                </div>
                                <input type="email" v-model="psgInfo.keeperEmail" :readonly='isDetailPage' placeholder="请输入申诉人邮箱" class="all-input-style flex-1">
                            </label>
                        </li>
                    </ul>
                </div>
                 <!-- 附件上传 -->
                <div class="post-wrapper" v-show="isfadding">
                    <div class="writeInformation-title">附件上传(选填)</div>
                    <ul class="flexbox">
                        <li v-for='(item ,index) in imgArr' :key="index" @click="openImg(index,item)">
                            <img :src="item">
                        </li>
                        
                        <li class="add" @click="add_img($event)" v-show="isfeed">
                            <label class="flexbox">
                                <img src="../../../common/imgs/addphoto.png" alt="">
                                <!-- <input type="file"  :readonly='isDetailPage' accpet = "image/*" capture = "camera" multiple="multiple" @change='add_img($event)'> -->
                            </label>
                        </li>
                    </ul>
                </div>
                <!-- 行李问题 -->
                <div class="post-wrapper" v-if="!ifcomments">
                    <div class="writeInformation-title">备注(选填)</div>
                    <ul>
                        <li>
                            <label class="flexbox">
                                <textarea class="areatxt" rows="4" v-model='psgInfo.Headquarters' spellcheck="false"  :readonly='isDetailPage' placeholder="可详细描述您破损或遗失行李的细节..."></textarea>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <Footer v-if='!isDetailPage'>
            <!-- 灰色 g-disabled 橙色 g-btn-->
            <button slot="sureBtn" :class="submitBtnCls" @click='submitApply'>提交</button>
        </Footer>
        <city-select v-show='canShowciSel' :isShow='canShowciSel' :enter='clickElemStr' :selectData='selectData' @clickSelectItem='clickSelectItem' @closeSelectPage='closeSelectPage'></city-select>
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
        BagClaim,
        ResultCode,
        SuccType,
        SelType,
        FILETYPE
    } from 'common/logic/enum'
    import { dealPlaneLineData , saveLoginInfo, getIsLogin  } from 'common/logic/logic'
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
                    title: '异常行李申诉',
                    titlestyle: 4
                },
                memberInfo: null,
                pageData: {},
                title: '异常行李申诉',
                BagClaim:BagClaim,
                isDetailPage: false,
                psgInfo: {
                    // 乘机人信息
                    certType: 'NI',
                    flightDate: '',
                    serviceType: '',
                    flightNo: '',
                    adultbirthdate: '',
                    accompanyName:'',
                    accompanyHandphone:'',
                    meetName:'',
                    meetPhone:'',
                    sendName:'',
                    sendPhone:'',
                    Headquarters:''
                },
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
                //图片地址存储
                imgArr: [],
                //附件地址
                imgarr:[],
                //控制添加图片
                ifaddimg:false,
                //保存返回信息
                imgmsg:"",
                attachment:"",
                areatext:"",
                ifcomments:false,
                isfadding:true,
                isfeed:false
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

                var _this = that;
                controller.onshow(function(){
                    let imgUrl = controller.getStorage("imgarr");
                    controller.clearStorage("imgarr");
                    let index = _this.imgArr.indexOf(imgUrl);
                    
                    if (index > -1) {
                        _this.imgArr.splice(index, 1);
                    } 


                    saveLoginInfo().then(memberInfo => {
                        that.memberInfo = memberInfo
                    })
                })

                controller.navRightTitle(_this.rightcallback)
            })
        },
        watch: {
            //少于九张图片显示加号，多于则不显示
            imgArr: {
                handler(newName, oldName) {
                    if(newName.length < 9){
                        this.ifaddimg = false;
                    }else{
                        this.ifaddimg = true;
                    }
                },
                immediate: true,
                deep: true
            }
        },
        computed: {
            submitBtnCls() {
                if (this.psgInfo.passengerName && this.psgInfo.certType && this.psgInfo.certNo &&
                    this.psgInfo.flightDate && this.psgInfo.depAirportName && this.psgInfo.arrAirportName &&
                    this.psgInfo.keeper && this.psgInfo.keeperHandphone && this.psgInfo.keeperEmail && this.psgInfo.serviceType) {
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
            openImg(index,data){
                let that = this;
                let imgDisplay = Page.passengers.imgDisplay;
                controller.open({
                    winName: imgDisplay.winName,
                    path: imgDisplay.pageUrl,
                    data:{isDetailPage:that.isDetailPage}
                });
                controller.setStorage("imgUrl",data)
            },
            //显示附件图片
            add_img(event){  
                let that = this;
                if(!that.isDetailPage){
                    controller.openCamera(function(data){
                        that.imgArr.push(data)
                    })
                }
            },
            // 点击返回按钮
            clickBackBtn(data) {
                if(this.isDetailPage) {
                    let appealPage = Page.abnormalBaggage.appeal;
                    controller.close({pageUrl: '/' + appealPage.pageUrl});
                } else {
                    controller.close({
                        flag:-3
                    });
                }
            },
            //跳转到我的申诉页面
            rightcallback(data){
                console.log(data)
                if(data == "1"){
                    // 是否登录
                    if (!getIsLogin(true)) {
                        return;
                    }
                    controller.open({
                        winName: Page.abnormalBaggage.appeal.winName,
                        path: Page.abnormalBaggage.appeal.pageUrl,
                    })
                }
            },
            // 初始化页面
            initPage() {
                let previousPageData = this.pageData;
                this.isDetailPage = previousPageData.isDetailPage != undefined ? previousPageData.isDetailPage : false;
                if (this.isDetailPage) {
                    this.seeDetails()
                }
                // controller.setTitle(this.$filters.formatPsgTitle(this.title, this.isDetailPage));
            },
            // 查看详情
            seeDetails() {
                const that = this;
                controller.getJSON({
                    method: 'POST',
                    url: requesturl.ABNORMALBAG.ABNORDETAIL,
                    params: that.createDetailParams(),
                })
                .then((res) => {
                    console.log(res)
                    if (res.resultCode === ResultCode.SUCCESS) {
                        that.psgInfo = res.objData;

                        this.psgInfo.passengerName = res.objData.passName
                        this.psgInfo.certType = res.objData.passCertType
                        this.psgInfo.certNo = res.objData.passCertNum
    
                        this.psgInfo.ticketNo = res.objData.ticketNo
                        this.psgInfo.flightNo = res.objData.flightNo
                        this.psgInfo.flightDate = res.objData.flightDate
                        this.psgInfo.depAirportName = res.objData.depatureStationName
                        this.psgInfo.arrAirportName = res.objData.arrivalStationName

                        this.psgInfo.serviceType = res.objData.luggageProType

                        this.psgInfo.keeper = res.objData.complPersonName
                        this.psgInfo.keeperHandphone = res.objData.complPersonPhone
                        this.psgInfo.keeperEmail = res.objData.email

                        this.psgInfo.Headquarters = res.objData.comments;

                        
                        if(res.objData.comments == null){
                            console.log(1)
                            this.ifcomments = true;
                            console.log(this.ifcomments)
                        }
                        if(res.objData.url != null){
                            let str = res.objData.url
                            this.imgArr = str.split(",")
                        }else{
                            this.isfadding = false;
                        }

                        if(res.objData.luggageProType == "1" ){
                            this.title = "遗失行李申诉";
                            this.titleStyle.title = "遗失行李申诉";
                            this.titleStyle.navRightItem = 0;
                            controller.setTitle(this.$filters.formatPsgTitle(this.title, this.isDetailPage), this.titleStyle);
                        }else{
                            this.title = "破损行李申诉";
                            this.titleStyle.title = "破损行李申诉";
                            this.titleStyle.navRightItem = 0;
                            controller.setTitle(this.$filters.formatPsgTitle(this.title, this.isDetailPage), this.titleStyle);
                        }

                        if(this.psgInfo.compStatus == "0"){
                            this.psgInfo.applyStatusName = "您的申诉已取消"
                        }
                        if(this.psgInfo.compStatus == "1"){
                            this.psgInfo.applyStatusName = "您的申诉已申请"
                        }
                        if(this.psgInfo.compStatus == "2"){
                            this.psgInfo.applyStatusName = "您的申诉已受理"
                        }
                        if(this.psgInfo.compStatus == "3"){
                            this.psgInfo.applyStatusName = "您的申诉已结案"
                        }
                    } else {
                        controller.toast({str: res.resultInfo});
                    }
                })
                .catch(that.errorCallback_1)
            },
            // 创建详情请求参数
            createDetailParams() {
                return {
                        "ffpCardNo": this.memberInfo.memberID,
                        "ffpId": this.memberInfo.id,
                        "loginKeyInfo": this.memberInfo.loginKeyInfo,
                        "statementId": this.pageData.id
                }
            },
            errorCallback() {
                this.imgarr = [];
                controller.toast({str: Verify.BACK_ERR.toastNet});
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
                if (this.isDetailPage) {
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
            // 提交申请
            submitApply() {
                if (!getIsLogin(true)) {
					return;
                }
                let that = this;
                if(that.canClickBtn && that.valify()){
                    controller.mfupload({
                        dst:requesturl.UPLOAD + FILETYPE.ABNORBAG,
                        src:that.imgArr,
                        successCallback:that.successful
                    }) 
                    console.log(that.imgArr)
                    if(that.imgArr.length == 0){
                        controller.getJSON({
                            method: 'POST',
                            url: requesturl.ABNORMALBAG.ABNORFILL,
                            params: that.createParams(),
                        })
                        .then((res) => {
                            console.log(res)
                            if (res.resultCode === ResultCode.SUCCESS) {
                                controller.alert({
                                    title:"提示",
                                    content:"异常行李申诉登记成功,我们将在2个工作日内联系您，您可以在我的申诉页面查看进展",
                                    onConfirm:that.confirmly,
                                    alertBtn:"确定"
                                })
                            }
                        })
                        .catch(that.errorCallback)
                    }
                }
            },
            confirmly(){
                controller.open({
                    winName: Page.abnormalBaggage.appeal.winName,
                    path: Page.abnormalBaggage.appeal.pageUrl,
                });
            },
            successful(data){
                console.log(data)
                console.log(data[1])
                let msg = JSON.parse(data[1])
                let ImgMsg = msg;
                let that = this ;
                this.imgarr = []
                for(let i=0;i<ImgMsg.length;i++){
                    this.imgarr.push(ImgMsg[i].fileURL);
                    if(ImgMsg[i].fileSize > 1024*1024*10){
                        controller.confirm({
                                title: '提示',
                                message: '图片的大小不能超过10M且最多只能上传9张图片',
                                buttons: ['取消', '确定'],
                                onConfirm() {
                                
                                }
                        })
                            return;
                    }
                }
                console.log(this.imgarr)

                this.attachment = this.imgarr.toString()
                // console.log(this.attachment)
                if (that.canClickBtn && that.valify()) {
                    controller.getJSON({
                        method: 'POST',
                        url: requesturl.ABNORMALBAG.ABNORFILL,
                        params: that.createParams()
                    })
                    .then((res) => {
                        console.log(res)
                        if (res.resultCode === ResultCode.SUCCESS) {
                                controller.alert({
                                    title:"提示",
                                    content:"异常行李申诉登记成功,我们将在2个工作日内联系您，您可以在我的申诉页面查看进展",
                                    onConfirm:that.confirmly,
                                    alertBtn:"确定"
                                })
                        } else {
                            controller.toast({str: res.resultInfo});
                        }
                    })
                    .catch(that.errorCallback)
                }

            },
            // 生成申请参数
            createParams() {
                const _that = this;
                return {
                        "loginKeyInfo" : _that.memberInfo.loginKeyInfo,
                        "ffpId" : _that.memberInfo.id,
                        "ffpCardNo" : _that.memberInfo.memberID,
                        "passName" :  _that.psgInfo.passengerName,
                        "passCertType": _that.psgInfo.certType,
                        "idNum": _that.psgInfo.certNo,
                        "flightNo": _that.psgInfo.flightNo,
                        "flightDate": _that.psgInfo.flightDate,
                        "ticketNo": _that.psgInfo.ticketNo,
                        "departureName": _that.psgInfo.depAirportName,
                        "arrivalName": _that.psgInfo.arrAirportName,
                        "departureStation": _that.startAirportEName,
                        "arrivalStation": _that.endAirportEName,
                        "luggageProType": _that.psgInfo.serviceType,
                        "statementName": _that.psgInfo.keeper,
                        "statementMobile": _that.psgInfo.keeperHandphone,
                        "comment":_that.psgInfo.Headquarters,
                        "imgUrls":_that.attachment,
                        "email": _that.psgInfo.keeperEmail
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
            selectCard() {
                if (this.isDetailPage) {
                    return;
                }
                if (!this.cardPicker) {
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
                if (this.isDetailPage) {
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
                if (this.isDetailPage) {
                    return;
                }
                if (!this.agePicker) {
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
                if (this.isDetailPage) {
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
