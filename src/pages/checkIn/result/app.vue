<style lang="scss" scope>
    @import '~common/styles/checkIn.scss';
</style>
<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header>
        <div class="main">
            <div class="check-result-head">
                <div class="check-result-head-top">
                    <div class="m-remind" v-if="checkInItem.checkInSeatStatus == CheckInSeatStatus.SELECT">我们将自动为您办理值机，请留意办理结果的短信通知</div>
                    <div class="m-flight-info">
                        <div class="flight-seg flexbox">
                            <div class="city">{{checkInResult.depCityName + checkInResult.depAirportName}}</div>
                            <div class="flight-icon flex-1"></div>
                            <div class="city">{{checkInResult.arrCityName + checkInResult.arrAirportName}}</div>
                        </div>
                        <div class="aircraft">
                            <div class="img " :class="[checkInResult.planeType == '789' ? 'B787' : '' ]"></div>
                            <div class="info">{{checkInResult.flightNo}}｜{{checkInResult.planeTypeName}}</div>
                        </div>
                        <div class="flight-info flexbox">
                            <div class="item">
                                <div class="title">登机时间</div>
                                <div class="cnt">{{checkInResult.bordingTime || '--' }}</div>
                            </div>
                            <div class="flex-1"></div>
                            <div class="item right">
                                <div class="title">登机口</div>
                                <div class="cnt">{{checkInResult.boardingGateNumber || '待定'}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="checkin-bg"></div>
            <div class="check-result-content">
                <div class="psg-list">
                    <div class="psg-item" v-for="(item, index) in checkInResult.checkInReservePsgInfos" v-if="checkInItem.checkInSeatStatus == CheckInSeatStatus.CHECKIN">
                        <div class="item-head flexbox">
                            <div class="name flex-1">{{item.psrName || item.psrEnName}}</div>
                            <div class="add-traveller flexbox" v-if="!(item.checkInStatus == CheckInStatus.CANCEL && !item.cardID)" @click="addPsgCard(item, index)">
                                <div class="text">{{item.cardID ? cardAirline(item.cardAirline, item.cardID) : '添加常旅客卡'}}</div>
                                <div class="icon"></div>
                            </div>
                        </div>
                        <div class="item-body">
                            <div class="flight-info flexbox">
                                <div class="item flex-1">
                                    <div class="name">座位号</div>
                                    <div class="val">{{item.seatNo || '未选座'}}</div>
                                </div>
                                <div class="item flex-1">
                                    <div class="name">登机牌</div>
                                    <div class="val" v-if="item.checkInStatus == CheckInStatus.CANCEL">已取消值机</div>
                                    <div class="val" @click="showQrCode(item, index)" v-else-if="isQRcode(item.validationTypes)">
                                        <span v-if="!item.ebpList">二维码生成中...</span>
                                        <div v-else>
                                            <img :src="defaultCode" alt="" v-show="currentBoardingPass.index != index">
                                            <span v-show="currentBoardingPass.index == index">扫码登机</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="item flex-1">
                                    <div class="name">舱位</div>
                                    <div class="val">{{item.cabinName}}</div>
                                </div>
                            </div>
                            <div class="code-box" v-if="isQRcode(item.validationTypes) && currentBoardingPass.index == index">
                                <div class="qr-code">
                                    <div class="img">
                                        <!-- 航信通 -->
                                        <div v-if="item.validationTypes.indexOf(CheckinType.BOARDING_PASS) > -1">
                                            <img class="qrcode" :src="boardingPassList[index] ? boardingPassList[index].boardingpass.bdPassImg : ''" alt="">
                                            <div class="pass" >
                                                <img :src="statusImgUrl" alt="">
                                            </div>
                                        </div>
                                        <!-- 值机二维码 -->
                                        <img class="qrcode" v-else-if="item.validationTypes.indexOf(CheckinType.E_BOARDING) > -1" :src="showQRCodeImg(item.ebpList)">
                                    </div>
                                    <div class="text">
                                        使用截止时间：航班计划起飞前40分钟 <br>
                                        请到{{checkInResult.depAirportName}}机场{{desBlocks}}，扫描二维码，通过安检及登机
                                    </div>
                                </div>
                                <div class="m-btns flexbox">
                                    <div class="flex-1 item">
                                        <div class="m-btn cancel" @click="cancelCheckIn(item, index)">取消值机</div>
                                    </div>
                                    <div class="flex-1 item">
                                        <div class="m-btn share" @click="share(item)">分享</div>
                                    </div>
                                    <div class="flex-1 item">
                                        <div class="m-btn save" @click="save()">保存</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="psg-item" v-for="(item, index) in checkInResult.selectSeatReservePsgInfos" v-if="checkInItem.checkInSeatStatus == CheckInSeatStatus.SELECT">
                        <div class="item-head flexbox">
                            <div class="name flex-1">{{item.psgrName || item.psrEnName}}</div>
                            <div class="add-traveller flexbox" @click="addPsgCard(item, index)">
                                <div class="text">{{item.cardID ? cardAirline(item.cardAirline, item.cardID) : '添加常旅客卡'}}</div>
                                <div class="icon"></div>
                            </div>
                        </div>
                        <div class="item-body">
                            <div class="flight-info flexbox">
                                <div class="item flex-1">
                                    <div class="name">座位号</div>
                                    <div class="val">{{item.seatNo || '未选座'}}</div>
                                </div>
                                <div class="item flex-1">
                                    <div class="name">登机牌</div>
                                    <div class="val">暂未办理值机</div>
                                </div>
                                <div class="item flex-1">
                                    <div class="name">舱位</div>
                                    <div class="val">{{item.cabinName}}</div>
                                </div>
                            </div>
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
    import { saveLoginInfo } from 'common/logic/logic'
    import Page from 'common/deploy/page'
    import LogEvent from 'common/deploy/logEvent'
    import requesturl from 'common/deploy/requesturl'
    import { ResultCode, CheckInSeatStatus, CheckInStatus, CheckinType, StarAirs, Verify } from 'common/logic/enum'
    import localstorage from "common/deploy/localstorage"
    import service from 'common/service/data'
    let defaultCode = require('../../../common/imgs/checkIn/icon_ewm.png')
    export default {
        data() {
            return {
                memberInfo: null,
                CheckinType: CheckinType,
                defaultCode: defaultCode,
                pageData: {},
                checkInResult: {},
                checkInItem: {},
                CheckInSeatStatus: CheckInSeatStatus,
                CheckInStatus: CheckInStatus,
                titleStyle: {
                    title: '值机结果',
                    titlestyle: 3,
                    isUseH5: true
                },
                // 航信通值机安全通道
                desBlocks: '相应安全通道',
                // 获取航信通登机牌
                boardingPassList: [],
                // 航信通电子验讫章
                statusImgUrl: '',
                // 刷新安检状态时间间隔
                refreshInteval: 3000,
                // 当前需要刷新航信通数据
                currentBoardingPass: {
                    item: {},
                    index: null
                },
                // 定时刷新定时器
                timerInteval: null,
                // 是否值机选座页面跳转过来的
                isSeatPage: false
            }
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                that.checkInItem = that.pageData.checkInItem;
                that.isSeatPage = that.pageData.isSeatPage;
                // 值机/选座 不一样字段
                if(that.checkInItem.checkInSeatStatus == CheckInSeatStatus.CHECKIN){
                    that.checkInResult = that.pageData.checkInResultData.checkInReserveResponse;
                    // 没有值机二维码循环主动拉取
                    that.checkInResult.checkInReservePsgInfos.forEach(item=>{
                        if(!item.ebpList && item.validationTypes.indexOf(CheckinType.E_BOARDING) > -1){
                            item.loadNum = 0;
                            that.queryBoardingCheck(item);
                        }
                    })
                } else if(that.checkInItem.checkInSeatStatus == CheckInSeatStatus.SELECT){
                    that.checkInResult = that.pageData.checkInResultData.selectSeatReserveResponse;
                }
                
                controller.onshow(function() {
                    saveLoginInfo().then(memberInfo => {
                        that.memberInfo = memberInfo
                    });
                    // 添加常旅客回显
                    let starPsg = controller.getStorage(localstorage.TEMP_PAGE_DATA);
                    if(starPsg){
                        let idx = starPsg.index, 
                            cardID = starPsg.cardID, 
                            cardAirline = starPsg.cardAirline;
                        controller.clearStorage(localstorage.TEMP_PAGE_DATA);
                        if(that.checkInItem.checkInSeatStatus == CheckInSeatStatus.CHECKIN){
                            that.checkInResult.checkInReservePsgInfos[idx].cardID = cardID;
                            that.checkInResult.checkInReservePsgInfos[idx].cardAirline = cardAirline;
                        } else {
                            that.checkInResult.selectSeatReservePsgInfos[idx].cardID = cardID;
                            that.checkInResult.selectSeatReservePsgInfos[idx].cardAirline = cardAirline;
                        }
                    }
                })
            })
        },
        components: {
            Header
        },
        methods: {
            // 值机二维码图片
            showQRCodeImg(ebpList){
                if(!!ebpList){
                    for(let i=0; i<ebpList.length; i++){
                        // ebpType: 3电子登机牌
                        let item = ebpList[i];
                        if(item.ebpType == 3){
                            return item.ebpUrl;
                        }
                    }
                }
                return '';
            },
            // 显示值机二维码块
            showQrCode(item, index){
                // 清除定时器
                window.clearInterval(this.timerInteval);
                // 点击自己关闭
                if(this.currentBoardingPass.index == index){
                    this.currentBoardingPass.item = null;
                    this.currentBoardingPass.index = null;
                    return;
                }
                // 还没有值机二维码
                if(!item.ebpList && item.validationTypes.indexOf(CheckinType.E_BOARDING) > -1){
                    return;
                }
                this.currentBoardingPass.item = item;
                this.currentBoardingPass.index = index;
                if(item.validationTypes.indexOf(CheckinType.BOARDING_PASS) > -1){    //航信通
                    // 判断是否获取过航信通数据
                    if(!this.boardingPassList[index]){
                        this.getBoardingPass(item, index);
                    } else {
                        this.timerInteval = window.setInterval(this.getBoardingPassStatus, this.refreshInteval);
                    }
                }
            },
            // 查看登机牌
            queryBoardingCheck(item){
                // 一个人最多取三次
                if(item.loadNum >= 3){
                    return;
                }
                item.loadNum++;

                let that = this;
                let params = {
                    etCode: item.etCode,
                    flightNo: that.checkInResult.flightNo,
                    flightDate: that.checkInResult.flightDate,
                    depAirportCode: that.checkInResult.depAirportCode,
                    arrAirportCode: that.checkInResult.arrAirportCode,
                    segNo: item.segNo,
                    seatNo: item.seatNo
                }
                service.queryBoardingCheck(params, false)
                .then(data=>{
                   if(data.resultCode === ResultCode.SUCCESS){
                        if(data.checkInReservePsgInfos && data.checkInReservePsgInfos[0] && data.checkInReservePsgInfos[0].ebpList){
                            item.ebpList = data.checkInReservePsgInfos[0].ebpList;
                        } else {
                            // that.refreshInteval 秒之后重新请求
                            (function(item){
                                setTimeout(function(){
                                    that.queryBoardingCheck(item);
                                }, that.refreshInteval)
                            })(item);
                        }
                    } else {
                        (function(item){
                            setTimeout(function(){
                                that.queryBoardingCheck(item);
                            }, that.refreshInteval)
                        })(item);
                    }
                })
                .catch(data=>{
                    controller.toast({str: Verify.BACK_ERR.toastDetailsFail});
                });
            },
            // 获取航信通登机牌
            getBoardingPass(item, index){
                let that = this;
                let params = {
                    tktNum: item.etCode,
                    tourIndex: item.segNo,
                    hostFlightNo: that.checkInResult.flightNo,
                    flightDate: that.checkInResult.flightDate,
                    deptCode: that.checkInResult.depAirportCode,
                    destCode: that.checkInResult.arrAirportCode,
                    passengerName: item.psrName || item.psrEnName,
                }
                controller.getJSON({
                        method : 'POST',
                        url: requesturl.CHECKIN.GET_BOARDPASS,
                        params: params
                })
                .then((data)=>{
                    if(data.resultCode === ResultCode.SUCCESS){
                        // 用 $set 方式保存信息并去刷电子验讫章
                        that.$set(that.boardingPassList, index, data);
                        that.timerInteval = window.setInterval(that.getBoardingPassStatus, that.refreshInteval);
                        // 显示安检柜台和安检通道
                        if(data.boardingpass.instructions && data.boardingpass.instructions.length != 0){
                            let instructions = data.boardingpass.instructions;
                            if(instructions && instructions.length > 0){
                                let desBlockText = '';
                                for(let i = 0, len = instructions.length; i < len; i++){
                                    instructions[i].desBlocks.forEach(uem=>{
                                        if(uem.text.indexOf('安检柜台') > -1 || uem.text.indexOf('安检通道') > -1){
                                            desBlockText += uem.text;
                                        }
                                    })
                                }
                                that.desBlocks = desBlockText;
                            }
                        }
                    } else {
                        controller.toast({str: data.errorInfo});
                    }
                })
                .catch(data=>{
                    controller.toast({str: Verify.BACK_ERR.toastDetailsFail});
                });
            },
            // 航信通电子验讫章
            getBoardingPassStatus(){
                let that = this;
                let item = this.currentBoardingPass.item;
                let index  = this.currentBoardingPass.index;
                let params = {
                    tktNum: item.etCode,
                    tourIndex: item.segNo,
                    hostFlightNo: that.checkInResult.flightNo,
                    deptCode: that.checkInResult.depAirportCode,
                    destCode: that.checkInResult.arrAirportCode
                }
                controller.getJSON({
                        method : 'POST',
                        url: requesturl.CHECKIN.GET_BOARDPASS_STATUS,
                        params: params,
                        isloading: false
                })
                .then((data)=>{
                    if(data.resultCode === ResultCode.SUCCESS){
                        that.statusImgUrl = data.statusImgUrl;
                    } else {
                        controller.toast({str: data.errorInfo});
                    }
                })
                .catch(data=>{
                    controller.toast({str: Verify.BACK_ERR.toastDetailsFail});
                });
            },
            // 分享
            share(item){
                controller.logEvent({
                    category: LogEvent.Checkin.Type,
                    event: LogEvent.Checkin.Events[9]
                })
                let params = {
                    scene: '0',
                    type: '2',
                    successCallback(data){
                        controller.toast({str: '分享成功'});
                    },
                    failureCallback(data){
                        controller.toast({str: '分享失败'});
                    }
                }
                controller.wxShare(params);
            },
            // 保存
            save(){
                controller.logEvent({
                    category: LogEvent.Checkin.Type,
                    event: LogEvent.Checkin.Events[10]
                })
                controller.screenShot(()=>{
                    controller.toast({str: '已为您保存至相册'});
                })
            },
            // 判断是否显示值机二维码
            isQRcode(validationTypes){
                let idx4 = validationTypes.indexOf(CheckinType.E_BOARDING);
                let idx5 = validationTypes.indexOf(CheckinType.BOARDING_PASS);
                if(idx5 > -1 || idx4 > -1){
                    return true;
                } else {
                    return false;
                }
            },
            cardAirline(cardAirline, cardID){
                for(var i = 0; i<StarAirs.length; i++){
                    let item = StarAirs[i];
                    if(item.value == cardAirline){
                        return (item.text + '(' + cardAirline + ') ' + cardID)
                    }
                }
            },
            // 添加常旅客
            addPsgCard(item, index){
                let that = this;
                if(item.checkInStatus == CheckInStatus.CANCEL){
                    return;
                }
                if(item.cardAirline){
                    controller.logEvent({
                        category: LogEvent.Checkin.Type,
                        event: LogEvent.Checkin.Events[13]
                    })
                } else {
                    controller.logEvent({
                        category: LogEvent.Checkin.Type,
                        event: LogEvent.Checkin.Events[11]
                    })
                }
                let pageObj = Page.checkIn.addStarPsg;
                controller.open({
                    winName: pageObj.winName, 
                    path: pageObj.pageUrl, 
                    data: {
                        checkInSeatStatus: that.checkInItem.checkInSeatStatus,
                        checkInResult: that.checkInResult,
                        psgItem: item,
                        index: index
                    },
                    animateType: 1,
                    newPage: true
                })
            },
            // 取消值机
            cancelCheckIn(item, index) {
                controller.logEvent({
                    category: LogEvent.Checkin.Type,
                    event: LogEvent.Checkin.Events[8]
                })
                let that = this;
                controller.confirm({
                    title: "提示",
                    message: "最多可取消2次，确认要取消值机吗？",
                    buttons: ["暂不取消", "确认"],
                    onConfirm() {
                        that.cancel(item);
                    }
                });
            },
            // 取消值机接口
            cancel(item){
                let that = this;
                let params = {
                    flightNo: that.checkInResult.flightNo,
                    flightDate: that.checkInResult.flightDate,
                    depAirportCode: that.checkInResult.depAirportCode,
                    arrAirportCode: that.checkInResult.arrAirportCode,
                    //certType: "TN",
                    certNo: item.certNo || item.etCode,
                    cellPhone: item.phone,
                    checkCode: item.checkCode,
                    checkInEmail: ''
                }
                if(that.memberInfo){
                    params.ffpId = that.memberInfo.id;
                    params.ffpCardNo = that.memberInfo.memberID;
                    params.loginKeyInfo = that.memberInfo.loginKeyInfo;
                }
                controller.getJSON({
                        method : 'POST',
                        url: requesturl.CHECKIN.CANCEL_CHECKIN,
                        params: params
                })
                .then((data)=>{
                    if(data.resultCode === ResultCode.SUCCESS){
                        //that.checkInResult.checkInReservePsgInfos[index].checkInStatus = CheckInStatus.CANCEL;
                        // 清除定时器
                        window.clearInterval(that.timerInteval);

                        item.seatNo = '';
                        item.checkInStatus = CheckInStatus.CANCEL;
                        that.currentBoardingPass.item = null;
                        that.currentBoardingPass.index = null;
                        controller.toast({str: '取消成功'});
                    } else if(data.resultCode === '10099'){
                        controller.alert({
                            title:"提示",
                            content: '您已取消过2次，请至值机柜台办理取消值机',
                            alertBtn: "知道了"
                        })
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
                if(this.memberInfo){
                    // 跳转列表
                    if(this.isSeatPage){
                        this.getCheckIn();
                    } else {
                        controller.close();
                    }
                } else {
                    this.popIndex();
                }
            },
            // 获取值机选座信息
            getCheckIn(){
                const that = this;
                let params = {};
                service.getCheckIn(params)
                .then(data=>{
                    if(data.resultCode === ResultCode.SUCCESS){
                        // 如果登陆了，没有行程
                        if(data.checkInSeatSegList.length == 0 && (!data.unCheckInSeatSegList || data.unCheckInSeatSegList.length == 0)){
                            that.popIndex();
                        } else {
                            let pageObj = Page.checkIn.logged;
                            controller.popWindowName({
                                winName: pageObj.winName,
                                data: data
                            })
                        }
                    } else {
                        that.popIndex();
                    }
                })
                .catch(data=>{
                    that.popIndex();
                });
            },
            // 置顶值机查询页面
            popIndex(){
                let pageObj = Page.checkIn.index;
                controller.popWindowName({
                    winName: pageObj.winName
                })
            }
        }
    };
</script>
