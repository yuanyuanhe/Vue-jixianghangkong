<style lang="scss" scope>
    @import '~common/styles/common/common.scss';
    @import '~common/styles/checkInItem.scss';
    .inputAnime:before{
        border-bottom: 1px solid #fff;
    }
</style>
<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' @clickSkip='clickSkip' :setTitleStyle="setTitleStyle"></Header>
        <div class="main">
            <div class="hint">航班起飞前2小时截止办理值机选座</div>
            <div class="container">
                <div class="itemBox">
                    <!-- 订单列表 -->
                    <div class="m-item" v-for="(item, index) in checkInInfo">
                        <div class="m-status" 
                        v-if="!!tourStatus(item.flightTourPsgInfoList)">{{ tourStatus(item.flightTourPsgInfoList) == 2 ? '已值机' : '已选座'}}</div>
                        <div class="travelInfo">
                            <!-- 经济舱... -->
                            <div class="u-bread">
                                <span>{{item.flightDate}} {{dateToWeek(item.flightDate)}}</span> |
                                <span>{{item.flightNo}}</span> |
                                <span>{{item.planeTypeName}}</span>
                            </div>
                            <!-- 出发地、目的地、+1天 -->
                            <div class="u-con">
                                <!-- +1天 -->
                                <div class="uc-day" v-if="item.crossDay > 0">
                                    <span>+{{item.crossDay}}天</span>
                                </div>
                                <div class="clearfix flexbox">
                                    <!-- 出发地 -->
                                    <div class="uc-lf flex-1">
                                        <div class="s-time">{{item.schDeptTime}}</div>
                                        <div class="s-address">{{item.depCityName + item.depAirportName + item.depTerminal}}</div>
                                    </div>
                                    <!-- 行程时间、经停站 -->
                                    <div class="uc-ct flex-1">
                                        <div class="s-totalTime">{{formatDate(item.duration)}}</div>
                                        <div class="s-img"></div>
                                        <div class="s-stopSite"></div>
                                    </div>
                                    <!-- 目的地 -->
                                    <div class="uc-rt flex-1">
                                        <div class="s-time">{{item.schArrTime}}</div>
                                        <div class="s-address">{{item.arrCityName + item.arrAirportName + item.arrTerminal}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-main">
                            <div class="inputBox flexbox" v-for="psg in item.flightTourPsgInfoList">
                                <div class="inputTxt">{{psg.psrName}}</div>
                                <input class="flex-1" type="text" 
                                v-bind:value="psg.checkInSeatNo ? ('座位号 '+psg.checkInSeatNo) : (psg.asrSeatNo ? ('座位号 '+psg.asrSeatNo) : '')"
                                readonly
                                :placeholder="item.checkInSeatStatus == CheckInSeatStatus.CHECKIN ? (psg.checkInSeatNo || '未值机') : (psg.asrSeatNo || '未选座')">
                                <!-- :readonly="item.checkInSeatStatus == CheckInSeatStatus.CHECKIN ? !psg.checkInSeatNo : !psg.asrSeatNo"  -->
                                <div class="inputBtn" @click="cancelSeat(item, psg)" v-if="item.checkInSeatStatus == CheckInSeatStatus.SELECT && !!psg.asrSeatNo">取消选座</div>        <!-- 选座 -->
                                <div class="inputCheck" @click="queryBoardingCheck(item, psg)" v-if="!!psg.checkInSeatNo">查看登机牌</div>   <!-- 值机 -->
                            </div>
                            <div class="inputAnime flexbox" v-if="item.canCheckInSelect && (isShowDetail(item, index) || tel)">
                                <label default-text="请输入手机号，用于接收值机短信" hover-text="手机号">请输入手机号，用于接收值机短信</label>
                                <input class="flex-1 inputTel" v-model.trim="item.tel" type="tel" pattern="[0-9]*" @focus="focus" @blur="blur($event, item)">
                                <div class="del" @click="del(item, index, $event)" v-show="item.tel"></div>
                            </div>
                        </div>
                        <div class="mt-foot" v-if="item.checkInSeatStatus == CheckInSeatStatus.SELECT && isAllSelect(item.flightTourPsgInfoList)">
                            我们将自动为您办理值机，请留意办理结果的短信通知
                        </div>
                        <div class="mt-btn" v-if="item.canCheckInSelect">
                            <button @click="checkInSeat(item, index)">选座/改座</button>
                        </div>
                        <div class="mt-foot" v-if="item.unCheckSeatReason">
                            <span>{{item.unCheckSeatReason}}</span>
                        </div>
                    </div>
                </div>
                <div class="unCheckin" v-if="!!unCheckInInfo && unCheckInInfo.length != 0">
                    <!-- 以下航班不能办理值机选座 -->
                    <div class="m-title">— 以下航班不能办理值机选座 —</div>
                    <div class="cannotBox">
                        <!-- 订单列表 -->
                        <div class="m-item" v-for="(item, index) in unCheckInInfo">
                            <div class="travelInfo">
                                <!-- 经济舱... -->
                                <div class="u-bread">
                                    <span>{{item.flightDate}} {{dateToWeek(item.flightDate)}}</span> |
                                    <span>{{item.flightNo}}</span> |
                                    <span>{{item.planeTypeName}}</span>
                                </div>
                                <!-- 出发地、目的地、+1天 -->
                                <div class="u-con">
                                    <!-- +1天 -->
                                    <div class="uc-day" v-if="item.crossDay > 0">
                                        <span>+{{item.crossDay}}天</span>
                                    </div>
                                    <div class="clearfix flexbox">
                                        <!-- 出发地 -->
                                        <div class="uc-lf flex-1">
                                            <div class="s-time">{{item.schDeptTime}}</div>
                                            <div class="s-address">{{item.depCityName + item.depAirportName + item.depTerminal}}</div>
                                        </div>
                                        <!-- 行程时间、经停站 -->
                                        <div class="uc-ct flex-1">
                                            <div class="s-totalTime">{{formatDate(item.duration)}}</div>
                                            <div class="s-img"></div>
                                            <div class="s-stopSite"></div>
                                        </div>
                                        <!-- 目的地 -->
                                        <div class="uc-rt flex-1">
                                            <div class="s-time">{{item.schArrTime}}</div>
                                            <div class="s-address">{{item.arrCityName + item.arrAirportName + item.arrTerminal}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-main">
                                <div class="inputBox flexbox" v-for="psg in item.flightTourPsgInfoList">
                                    <div class="inputTxt">{{psg.psrName}}</div>
                                    <input class="flex-1" type="text" 
                                    v-bind:value="psg.checkInSeatNo ? ('座位号 '+psg.checkInSeatNo) : (psg.asrSeatNo ? ('座位号 '+psg.asrSeatNo) : '')"
                                    readonly 
                                    :placeholder="item.checkInSeatStatus == CheckInSeatStatus.CHECKIN ? (psg.checkInSeatNo || '未值机') : (psg.asrSeatNo || '未选座')">
                                    <!-- :readonly="item.checkInSeatStatus == CheckInSeatStatus.CHECKIN ? !psg.checkInSeatNo : !psg.asrSeatNo"  -->
                                </div>
                            </div>
                            <div class="mt-foot" v-if="!!item.unCheckSeatReason">
                                {{item.unCheckSeatReason}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//tourStatus: 行程状态 "0:默认 1:已值机 2:未选座可值机 3:已选座可值机4:已选座不可值机 5:未选座可选座 6:未选座不可选座"
    import "common/tools/rem"
    import Header from "components/header.vue"
    import { controller,  native } from "common/logic/controller"
    import { saveLoginInfo } from 'common/logic/logic'
    import service from 'common/service/data'
    import Page from 'common/deploy/page'
    import LogEvent from 'common/deploy/logEvent'
    import requesturl from 'common/deploy/requesturl'
    import { vilidation, urlParam, formatIOSDate, juneyaoair } from 'common/logic/utils'
    import { RegEnum, Verify, ResultCode, CheckInSeatStatus } from 'common/logic/enum';

    export default {
        data() {
            return {
                tel: '',
                pageData: {},
                checkInInfo: [],
                memberInfo: null,
                unCheckInInfo: [],
                CheckInSeatStatus: CheckInSeatStatus,
                setTitleStyle: {
                    title: '值机选座',
                    titlestyle: 4,
                    navRightItem: 2,
                    navRightTitle: '办理其他航班',
                }
            };
        },
        created() {
            let that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                that.tel = that.pageData.tel;
                that.checkInInfo = that.pageData.checkInInfo.checkInSeatSegList;
                that.unCheckInInfo = that.pageData.checkInInfo.unCheckInSeatSegList;
                
                that.$nextTick(function () {
                    let inputTels = document.querySelectorAll('.inputTel');
                    Array.prototype.forEach.call(inputTels, function(element){
                        if(element.value){
                            let prev = element.previousElementSibling;
                            let hoverText = prev.getAttribute('hover-text');
                            prev.innerHTML = hoverText;
                            prev.classList.add('offset');
                        }
                    })
                })
            })
            controller.onPopWindowName(function(data){
                console.log('onPopWindowName:' + JSON.stringify(data)); 
                if(data && data.data){
                    let result = data.data;
                    that.checkInInfo = result.checkInSeatSegList;
                    that.unCheckInInfo = result.unCheckInSeatSegList;
                }
            });
            controller.navRightTitle(that.clickSkip)
        },
        components: {
            Header
        },
        methods: {
            // 是否显示电话号码输入框
            isShowDetail(item, index){
                let psgList = item.flightTourPsgInfoList;
                let tel = this.tel;;
                for(let i=0; i<psgList.length; i++){
                    let item = psgList[i];
                    if(item.phone){
                        if(item.tel == undefined){
                            this.$set(this.checkInInfo[index], 'tel', tel);
                        }
                        return false;
                    }
                }
                if(item.tel == undefined){
                    this.$set(this.checkInInfo[index], 'tel', tel);
                }
                return true;
            },
            // 是否全部选座
            isAllSelect(psgList){
                for(let i=0; i<psgList.length; i++){
                    let item = psgList[i];
                    if(!item.asrSeatNo){
                        return false;
                    }
                }
                return true;
            },
            // 查看登机牌
            queryBoardingCheck(item, psg){
                let that = this;
                let params = {
                    etCode: psg.etCode,
                    flightNo: item.flightNo,
                    flightDate: item.flightDate,
                    depAirportCode: item.depAirport,
                    arrAirportCode: item.arrAirport,
                    segNo: psg.segNo,
                    seatNo: psg.checkInSeatNo
                }
                service.queryBoardingCheck(params)
                .then(data=>{
                   if(data.resultCode === ResultCode.SUCCESS){
                        let pageObj = Page.checkIn.result;
                        controller.open({
                            winName: pageObj.winName, 
                            path: pageObj.pageUrl, 
                            data: {
                                checkInItem: item,
                                checkInResultData: {
                                    checkInReserveResponse: data
                                }
                            }
                        })
                    } else {
                        controller.toast({str: data.errorInfo});
                    }
                })
                .catch(data=>{
                    controller.toast({str: Verify.BACK_ERR.toastDetailsFail});
                });
            },
            // 获取值机选座信息
            getCheckIn(){
                const that = this;
                let params = {};
                if(that.pageData.psgInfo){
                    params = that.pageData.psgInfo;
                }
                service.getCheckIn(params)
                .then(data=>{
                    if(data.resultCode === ResultCode.SUCCESS){
                        that.checkInInfo = data.checkInSeatSegList;
                        that.unCheckInInfo = data.unCheckInSeatSegList;
                        // 延迟默认手机号输入框hover样式
                        setTimeout(function(){
                            let inputTels = document.querySelectorAll('.inputTel');
                            Array.prototype.forEach.call(inputTels, function(element){
                                if(element.value){
                                    let prev = element.previousElementSibling;
                                    let hoverText = prev.getAttribute('hover-text');
                                    prev.innerHTML = hoverText;
                                    prev.classList.add('offset');
                                }
                            })
                        }, 10)
                    } else{
                        controller.toast({str: data.errorInfo});
                    }
                })
                .catch(data=>{
                    controller.toast({str: Verify.BACK_ERR.toastDetailsFail});
                });
            },
            // 取消选座
            cancelSeat(flight, psg){
                let that = this;
                let params = {
                    flightNo: flight.flightNo,
                    flightDate: flight.flightDate,
                    depAirportCode: flight.depAirport,
                    arrAirportCode: flight.arrAirport,
                    pnrNo: psg.pnrNo,
                    seatNo: psg.asrSeatNo,
                    certNo: psg.certNo || psg.etCode,
                    tktNo: psg.etCode
                }
                if(that.memberInfo){
                    params.ffpId = that.memberInfo.id;
                    params.ffpCardNo = that.memberInfo.memberID;
                    params.loginKeyInfo = that.memberInfo.loginKeyInfo;
                }
                controller.getJSON({
                        method : 'POST',
                        url: requesturl.CHECKIN.CANCEL_SEAT,
                        params: params
                })
                .then((data)=>{
                    if(data.resultCode === ResultCode.SUCCESS){
                        that.getCheckIn();
                        controller.toast({str: '取消选座成功！'});
                    } else {
                        controller.toast({str: data.errorInfo});
                    }
                })
                .catch(data=>{
                    controller.toast({str: Verify.BACK_ERR.toastDetailsFail});
                });
            }, 
            // 跳转选座
            checkInSeat(item, index) {
                controller.logEvent({
                    category: LogEvent.Checkin.Type,
                    event: LogEvent.Checkin.Events[3]
                })
                let that = this;
                let isTel = that.isShowDetail(item, index);
                if(isTel){
                    if(!item.tel){
                        controller.toast({str: '请输入手机号！'});
                        return;
                    }
                    if(!juneyaoair.validateTel(item.tel)){
                        return;
                    }
                }
                // 值机的时候判断是否可以值机
                if(item.checkInSeatStatus == CheckInSeatStatus.CHECKIN){
                    for(let i = 0; i < item.flightTourPsgInfoList.length; i++){
                        let psg = item.flightTourPsgInfoList[i];
                        if(psg.checkInSeatNo){
                            // 获取座位
                            that.getCheckInCount(item, (data)=>{
                                if(data.resultCode === ResultCode.SUCCESS){
                                    controller.confirm({
                                        title: "提示",
                                        message: data.errorInfo,
                                        buttons: ["取消", "确定"],
                                        onConfirm() {
                                            // 获取座位
                                            that.getSeats(item)
                                        }
                                    })
                                } else {
                                    controller.alert({
                                        title:"提示",
                                        content: data.errorInfo,
                                        alertBtn: "知道了"
                                    })
                                }
                            })
                            return;
                        }
                    }
                }
                // 获取座位
                that.getSeats(item)
            },
            // 查询旅客值机次数
            getCheckInCount(item, cb){
                let that = this;
                let params = {
                    flightDate: item.flightDate,
                    flightNo: item.flightNo,
                    depAirportCode: item.depAirport,
                    arrAirportCode: item.arrAirport,
                    checkInCountInfos: []
                }
                if(that.memberInfo){
                    params.ffpId = that.memberInfo.id;
                    params.ffpCardNo = that.memberInfo.memberID;
                    params.loginKeyInfo = that.memberInfo.loginKeyInfo;
                }
                item.flightTourPsgInfoList.forEach(psg => {
                    params.checkInCountInfos.push({
                        psrName: psg.psrName,
                        etCode: psg.etCode,
                        segNo: psg.segNo
                    })
                })
                controller.getJSON({
                        method : 'POST',
                        url: requesturl.CHECKIN.CHECKIN_COUNT,
                        params: params
                })
                .then((data)=>{
                    if(cb){
                        cb(data);
                    }
                })
                .catch(data=>{
                    controller.toast({str: Verify.BACK_ERR.toastDetailsFail});
                });
            },
            // 获取座位图
            getSeats(item) {
                let that = this;
                let params = {
                    checkInSeatStatus: item.checkInSeatStatus,
                    flightDate: item.flightDate,
                    flightNo: item.flightNo,
                    depAirportCode: item.depAirport,
                    arrAirportCode: item.arrAirport,
                    getSeatMapPsgInfos: []
                }
                if(that.memberInfo){
                    params.ffpId = that.memberInfo.id;
                    params.ffpCardNo = that.memberInfo.memberID;
                    params.loginKeyInfo = that.memberInfo.loginKeyInfo;
                }
                item.flightTourPsgInfoList.forEach(psg => {
                    params.getSeatMapPsgInfos.push({
                        cabin: psg.cabin,
                        pnrNo: psg.pnrNo,
                        ticketNo: psg.etCode,
                        seatNo: psg.asrSeatNo,
                        psrName: psg.psrName,
                        psrEnName: psg.psrEnName
                    })
                })
                controller.getJSON({
                        method : 'POST',
                        url: requesturl.CHECKIN.GET_SEAT,
                        params: params
                })
                .then((data)=>{
                    if(data.resultCode === ResultCode.SUCCESS){
                        /* if(cb){
                            cb(data);
                        } */
                        let pageObj = Page.checkIn.seat;
                        controller.open({
                            winName: pageObj.winName, 
                            path: pageObj.pageUrl, 
                            data: {
                                tel: that.tel,
                                checkInItem: item,
                                checkInSeatsData: data
                            }
                        })
                    } else {
                        controller.toast({str: data.errorInfo});
                    }
                })
                .catch(data=>{
                    controller.toast({str: Verify.BACK_ERR.toastDetailsFail});
                });
            },
            // 计算时间差
            formatDate(timestamp){
                return timestamp.substring(0, 2) + 'h' + timestamp.substring(2) + 'm'
                //return (parseInt(timestamp/1000/60/60)+'h'+parseInt((timestamp%3600000)/60000)+'m')
            },
            // 计算日期是周几
            dateToWeek(date){
                let a = date.split('-');
                let d = new Date(a[0], a[1]-1, a[2]);
                return ('周'+'日一二三四五六'.charAt(d.getDay()));
            },
            // 状态
            tourStatus(flightTourPsgInfoList = []){
                let temp = {
                    checkIn: [],
                    select: []
                };
                flightTourPsgInfoList.forEach((item)=>{
                    temp.checkIn.push(item.checkInSeatNo);
                    temp.select.push(item.asrSeatNo);
                });
                // 2 值机  1 选座
                if(!!temp.checkIn.join('')){
                    return 2
                } else if(!!temp.select.join('')){
                    return 1
                } else {
                    return false;
                }
            },
            // 点击返回按钮
            clickBackBtn() {
                controller.close({
                    closePage: true
                });
            },
            // 点击右侧icon/文字 跳转
            clickSkip() {
                controller.logEvent({
                    category: LogEvent.Checkin.Type,
                    event: LogEvent.Checkin.Events[4]
                })
                let pageObj = Page.checkIn.index;
                controller.open({
                    winName: pageObj.winName, 
                    path: pageObj.pageUrl, 
                    data: {
                        loginStyle: 2
                    },
                    animateType: 1
                })
            },
            focus(event) {
                let target = event.target;
                let prev = target.previousElementSibling;
                let hoverText = prev.getAttribute('hover-text');
                prev.innerHTML = hoverText;
                prev.classList.add('offset');
            },
            blur(event, item) {
                let target = event.target;
                if(item.tel == ''){
                    let prev = target.previousElementSibling;
                    let defaultText = prev.getAttribute('default-text');
                    prev.innerHTML = defaultText;
                    prev.classList.remove('offset');
                }
            },
            del(item, index, event) {
                let target = event.target;
                //this.checkInInfo[index].tel = '';
                item.tel = '';
                //this.$set(item, 'tel', '');
                target.previousElementSibling.focus();
            }
        },
    };
</script>
