<style lang="scss" scope>
    @import '~common/styles/checkIn.scss';
    @import '~common/styles/checkInItem.scss';
</style>
<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header>
        <div class="main checkin-seat-main" :class="classObj">
            <div class="checkIn-wp"  v-show="fixedStyle.isFixed">
                <div class="psg-box">
                    <div class="psg-list clearfix">
                        <div class="psg-item flexbox" v-for="(item, index) in pasArr" :class="{active: currentIdx == index}" @click="selectPsg(index)">
                            <div class="psg-name">{{index+1}}.{{item.psrName || item.psrEnName}}</div>
                            <div class="psg-seatNo">{{item.seatNo || '未选座'}}</div>
                            <div class="psg-remove" v-show="pasArr.length > 1" @click.stop="removePsg(index)"></div>
                        </div>
                        <div class="psg-item psg-add" @click="addPsg" v-if="pasArr.length < 10">
                            <div class="add-icon">新增</div>
                        </div>
                    </div>
                </div>
                <div class="seat-title">
                    <div class="flexbox flex-1" v-if="airType == 'A320' || airType == 'A321_190' || airType == 'A321_198'">
                        <div class="seat-title-group">
                            <div class="item">A</div>
                            <div class="item">B</div>
                            <div class="item">C</div>
                        </div>
                        <div class="seat-title-null"></div>
                        <div class="seat-title-group">
                            <div class="item">D</div>
                            <div class="item">E</div>
                            <div class="item">F</div>
                        </div>
                    </div>
                    <div class="flexbox flex-1" v-if="airType == 'A320F' || airType == 'A321_190_F'">
                        <div class="seat-title-group">
                            <div class="item">A</div>
                            <div class="item">C</div>
                        </div>
                        <div class="seat-title-null"></div>
                        <div class="seat-title-group">
                            <div class="item">D</div>
                            <div class="item">F</div>
                        </div>
                    </div>
                    <div class="flexbox flex-1" v-if="airType == 'B787'">
                        <div class="seat-title-group">
                            <div class="item">A</div>
                            <div class="item">B</div>
                            <div class="item">C</div>
                        </div>
                        <div class="seat-title-null"></div>
                        <div class="seat-title-group">
                            <div class="item">D</div>
                            <div class="item">E</div>
                            <div class="item">G</div>
                        </div>
                        <div class="seat-title-null"></div>
                        <div class="seat-title-group">
                            <div class="item">H</div>
                            <div class="item">J</div>
                            <div class="item">K</div>
                        </div>
                    </div>
                    <div class="flexbox flex-1" v-if="airType == 'B787_F'">
                        <div class="seat-title-group">
                            <div class="item">A/C</div>
                        </div>
                        <div class="seat-title-null"></div>
                        <div class="seat-title-group">
                            <div class="item">D</div>
                            <div class="item">F</div>
                        </div>
                        <div class="seat-title-null"></div>
                        <div class="seat-title-group">
                            <div class="item">H/K</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="checkin-seat">
                <div class="seat-head">
                    <div class="flight-box travelInfo">
                        <!-- 经济舱... -->
                        <div class="u-bread">
                            <span>{{checkInItem.flightDate}} {{dateToWeek(checkInItem.flightDate)}}</span> |
                            <span>{{checkInItem.flightNo}}</span> |
                            <span>{{checkInItem.planeTypeName}}</span>
                        </div>
                        <!-- 出发地、目的地、+1天 -->
                        <div class="u-con">
                            <!-- +1天 -->
                            <div class="uc-day" v-if="checkInItem.crossDay > 0">
                                <span>+{{checkInItem.crossDay}}天</span>
                            </div>
                            <div class="clearfix flexbox">
                                <!-- 出发地 -->
                                <div class="uc-lf flex-1">
                                    <div class="s-time">{{checkInItem.schDeptTime}}</div>
                                    <div class="s-address">{{checkInItem.depCityName + checkInItem.depAirportName + checkInItem.depTerminal}}</div>
                                </div>
                                <!-- 行程时间、经停站 -->
                                <div class="uc-ct flex-1">
                                    <div class="s-totalTime">{{formatDate(checkInItem.duration)}}</div>
                                    <div class="s-img"></div>
                                    <div class="s-stopSite"></div>
                                </div>
                                <!-- 目的地 -->
                                <div class="uc-rt flex-1">
                                    <div class="s-time">{{checkInItem.schArrTime}}</div>
                                    <div class="s-address">{{checkInItem.arrCityName + checkInItem.arrAirportName + checkInItem.arrTerminal}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="psg-box" id="detailPsgBox">
                        <div class="psg-list clearfix">
                            <div class="psg-item flexbox" v-for="(item, index) in pasArr" :class="{active: currentIdx == index}" @click="selectPsg(index)">
                                <div class="psg-name">{{index+1}}.{{item.psrName || item.psrEnName}}</div>
                                <div class="psg-seatNo">{{item.seatNo || '未选座'}}</div>
                                <div class="psg-remove" v-show="pasArr.length > 1" @click.stop="removePsg(index)"></div>
                            </div>
                            <div class="psg-item psg-add" @click="addPsg" v-if="pasArr.length < 10">
                                <div class="add-icon">新增</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="seat-body">
                    <div class="seat-info-show">
                        <div class="seat-show flexbox">
                            <div class="flex-1">
                                <div class="icon icon1">可选</div>
                            </div>
                            <div class="flex-1">
                                <div class="icon icon2">当前选择</div>
                            </div>
                            <div class="flex-1">
                                <div class="icon icon3">不可选</div>
                            </div>
                        </div>
                    </div>
                    <component
                        ref="seatAir" 
                        :is="planeType" 
                    ></component>
                </div>
            </div>
        </div>
        <Footer class="checkin-seat-ft">
            <div class="" slot="sureBtn">
                <div class="clause">点击提交选座，即已阅读且同意<a href="javascript:;" @click="checkInClause()">《值机相关协议》</a></div>
                <button class="g-btn" :class="{'g-disabled':!selectAll}" @click="submit()">提交选座</button>
            </div>
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
    import LogEvent from 'common/deploy/logEvent'
    import requesturl from 'common/deploy/requesturl'
    import { vilidation, urlParam } from 'common/logic/utils'
    import { RegEnum, Verify, ResultCode, CheckInSeatStatus, CheckinType } from 'common/logic/enum'
    import localstorage from "common/deploy/localstorage"
    import A320 from "./planeType/A320"
    import A320F from "./planeType/A320-F"    // A321-198 头等舱也用这个 checkInSeatStatus
    import A321_190 from "./planeType/A321-190"
    import A321_190_F from "./planeType/A321-190-F"
    import A321_198 from "./planeType/A321-198"
    import B787 from "./planeType/B787"
    import B787_F from "./planeType/B787-F"

    export default {
        data() {
            return {
                memberInfo: null,
                // 机型座位图
                airType: '',
                pageData: {},
                // 当前航班信息
                checkInItem: {},
                // 当前值机/选座数据
                checkInSeats: {},
                // 座位图list
                seatList: [],
                // 值机选座状态
                checkInSeatStatus: '',
                // scroll 是否固定
                fixedStyle:{
                    isFixed: false,
                    scrollTop: 0,
                    scrollHeight: 0,
                    fixedTop: 0,
                },
                // 设置header
                titleStyle: {
                    title: '值机选座',
                    titlestyle: 4
                },
                // 旅客列表
                pasArr: [],
                // 当前选中旅客index
                currentIdx: 0,
                // 自动顺序选座
                isFirst: true,
                // 是否所有旅客都已选座
                selectAll: false
            }
        },
        watch: {
            pasArr: {
                handler: function(val, oldVal){
                    console.log('pasArr' + val.length)
                    let that = this;
                    for(let i=0; i<val.length; i++){
                        let item = val[i];
                        if(!item.seatNo){
                            that.selectAll = false;
                            return;
                        }
                    }
                    that.selectAll = true;
                },
                deep: true
            }
        },
        computed: {
            fixedTop(){
                return this.fixedStyle.isFixed ? (this.fixedStyle.fixedTop + 'px') : 0
            },
            // 机型
            planeType(){
                return this.airType;
            },
            // 控制不同机型样式
            classObj() {
                return {
                    'A320-F': this.airType == 'A320F' || this.airType == 'A321_190_F',
                    'B787': this.airType == 'B787',
                    'B787-F': this.airType == 'B787_F',
                }
            }
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                that.checkInItem = that.pageData.checkInItem;
                that.checkInSeatStatus = that.checkInItem.checkInSeatStatus;
                // 值机/选座不同逻辑处理
                if(that.checkInSeatStatus == CheckInSeatStatus.CHECKIN){
                    that.checkInSeats = that.pageData.checkInSeatsData.checkInCharts;
                    that.seatList = that.checkInSeats.seatMapList;
                } else if(that.checkInSeatStatus == CheckInSeatStatus.SELECT){
                    that.checkInSeats = that.pageData.checkInSeatsData.selectSeatCharts;
                    that.seatList = that.checkInSeats.seatMaplist;
                }
                let planeType = that.checkInSeats.planeType;    // 机型
                let flightType = that.checkInSeats.flightType;  // 具体型号
                // 不同机型加载不同座位图
                if(that.pageData.checkInSeatsData.cabinClass == 'Y'){   //经济舱
                    if(planeType == '320'){
                        that.airType = 'A320';
                    } else if(planeType == '321'){
                        if(flightType == '190'){    //A321 190
                            that.airType = 'A321_190';
                        } else if(flightType == '198'){    //A321 198
                            that.airType = 'A321_198';
                        }
                    } else if(planeType == '787' || planeType == '789'){
                        that.airType = 'B787';
                    }
                } else {    // 头等舱，公务舱
                    if(planeType == '320'){
                        that.airType = 'A320F';
                    } else if(planeType == '321'){
                        if(flightType == '190'){
                            that.airType = 'A321_190_F';
                        } else if(flightType == '198'){
                            that.airType = 'A320F';
                        }
                    } else if(planeType == '787' || planeType == '789'){
                        that.airType = 'B787_F';
                    }
                }
                controller.onshow(function() {
                    saveLoginInfo().then(memberInfo => {
                        that.memberInfo = memberInfo
                    })
                    let psg = controller.getStorage(localstorage.TEMP_PAGE_DATA);
                    if(psg){
                        psg.seatNo = psg.seatNo || '';
                        psg.id = '';
                        that.pasArr.push(psg);
                        controller.clearStorage(localstorage.TEMP_PAGE_DATA);
                    }
                })
                let responseList = that.pageData.checkInSeatsData.getIBESelectSeatResponseList;

                // 操作乘机人列表
                that.checkInItem.flightTourPsgInfoList.forEach((item)=>{
                    let tempObj = Object.assign({}, item);
                    tempObj.seatNo = tempObj.checkInSeatNo || tempObj.asrSeatNo;

                    // 提取IBE里乘机人座位号
                    responseList.forEach(jItem=>{
                        if(tempObj.etCode == jItem.ticketNo && jItem.seatNo){
                            tempObj.seatNo = jItem.seatNo;
                        }
                    })
                    tempObj.existSeatNo = tempObj.seatNo;
                    tempObj.id = that.seatnoToId(tempObj.seatNo);

                    that.pasArr.push(tempObj);
                });
                setTimeout(()=>{
                    that.initSeatList(that.seatList);
                }, 0);
            })
        },
        mounted(){
            
        },
        components: {
            Header,
            Footer,
            A320,
            A320F,
            A321_190,
            A321_198,
            A321_190_F,
            B787,
            B787_F
        },
        methods: {
            // 添加乘机人
            addPsg(){
                let that = this;
                if(that.pasArr.length >= 10){
                    return;
                }
                controller.logEvent({
                    category: LogEvent.Checkin.Type,
                    event: LogEvent.Checkin.Events[5]
                })
                let pageObj = Page.checkIn.addPsg;
                controller.open({
                    winName: pageObj.winName, 
                    path: pageObj.pageUrl, 
                    data: {
                        checkInItem: that.checkInItem,
                        pasArr: that.pasArr
                    },
                    animateType: 1,
                    newPage: true
                })
            },
            // 座位号转ID
            seatnoToId(no){
                if(!!no){
                    let len = no.length-1;
                    return (no.charAt(len) + no.substring(0, len));
                } else {
                    return '';
                }
            },
            // 计算时间差
            formatDate(timestamp = '0000'){
                return timestamp.substring(0, 2) + 'h' + timestamp.substring(2) + 'm'
                //return (parseInt(timestamp/1000/60/60)+'h'+parseInt((timestamp%3600000)/60000)+'m')
            },
            // 计算日期是周几
            dateToWeek(date = ''){
                let a = date.split('-');
                let d = new Date(a[0], a[1]-1, a[2]);
                return '周' + '日一二三四五六'.charAt(d.getDay());
            },
            initSeatList(list) {
                let that = this;

                // head部分scroll fixed
                let psBox = document.querySelector('#detailPsgBox');
                let seatHead = document.querySelector('.seat-head');
                that.fixedStyle.scrollTop = psBox.offsetTop;
                that.fixedStyle.scrollHeight = seatHead.offsetHeight;
                
                document.querySelector('.checkin-seat').addEventListener('scroll', function(){
                    let scrollTop = this.scrollTop;
                    that.fixedStyle.fixedTop = scrollTop;
                    if(scrollTop >= that.fixedStyle.scrollTop){
                        that.fixedStyle.isFixed = true;
                    } else {
                        that.fixedStyle.isFixed = false;
                    }
                })

                // 座位绑定事件
                let airSeat = this.$refs.seatAir.$el;
                let seatNos = airSeat.querySelectorAll('.seat-no');
                // 渲染座位图
                list.forEach((item)=>{
                    let rowNo = '';
                    let columnNo = '';
                    let seatNumber = '';
                    let seatValue = '';
                    // 值机/选座 座位字段不一致
                    if(this.checkInSeatStatus == CheckInSeatStatus.CHECKIN){
                        rowNo = item.rowNo;
                        columnNo = item.columnNo;
                        seatNumber = item.seatNumber;
                        seatValue = item.seatValue;
                    } else if(this.checkInSeatStatus == CheckInSeatStatus.SELECT){
                        rowNo = item.seatRow;
                        columnNo = item.seatColumn;
                        seatNumber = rowNo + columnNo;
                        seatValue = item.seatStatus;
                    }
                    if(seatValue == '*'){
                        try{
                            let seat = airSeat.querySelector('#' + columnNo + rowNo);
                            seat.classList.add('seat-normal');
                            seat.setAttribute('seatno', seatNumber);
                        } catch(e){}
                    }
                })
                // 默认选中座位
                that.pasArr.forEach((item, index)=>{
                    if(item.id){
                        let seat =  airSeat.querySelector('#' + item.id);
                        if(!!seat){
                            seat.classList.add('seat-normal');
                            seat.classList.add('seat-active');
                            seat.innerText = (index + 1);
                        }
                    }
                })

                airSeat.addEventListener('click', function(event){
                    let ev = event || window.event;
                    let target = ev.target || ev.srcElement;
                    if(!target.classList.contains('seat-normal') || target.classList.contains('seat-active')){
                        return;
                    }
                    if(that.currentIdx < 0){
                        controller.toast({str: '请选择一位乘机人'});
                        return;
                    }
                    // 重新赋值
                    let currentSeat = that.pasArr[that.currentIdx];
                    that.clearSeatStyle(currentSeat.id);
                    target.innerText = (that.currentIdx + 1);
                    target.classList.add('seat-active');
                    currentSeat.seatNo = target.getAttribute('seatno');
                    currentSeat.id = target.id;
                    if(that.isFirst && that.currentIdx < that.pasArr.length-1){
                        that.currentIdx++;
                    }
                })
                
            },
            // 点击返回按钮
            clickBackBtn() {
                controller.close({
                    flag: -1
                });
            },
            // 清除选中的样式
            clearSeatStyle(id){
                let el = document.getElementById(id);
                if(el){
                    el.innerText = '';
                    el.classList.remove('seat-active');
                }
            },
            // 重新渲染选中座位
            renderSeatStyle(el){
                this.pasArr.forEach(function(item, index){
                    let seat = document.getElementById(item.id);
                    if(seat){
                        seat.innerText = (index + 1);
                        seat.classList.add('seat-active');
                    }
                })
            },
            // 选择乘机人
            selectPsg(index) {
                this.isFirst = false;
                this.currentIdx = index;
            },
            // 删除乘机人
            removePsg(index) {
                let that = this;
                controller.confirm({
                    title: "提示",
                    message: "确认要删除此同行人吗？",
                    buttons: ["取消", "确定"],
                    onConfirm() {
                        that.removePsgFn(index);
                    }
                });
            },
            removePsgFn(index){
                if(this.currentIdx == index){
                    this.currentIdx = -1;
                } else if(this.currentIdx > index){
                    this.currentIdx--;
                }
                this.clearSeatStyle(this.pasArr[index].id);
                this.pasArr.splice(index, 1);
                this.renderSeatStyle();
            },
            // 值机选座请求参数
            createParams(){
                let that = this;
                let params = {
                    checkInSeatStatus: that.checkInSeatStatus
                }
                if(that.memberInfo){
                    params.ffpId = that.memberInfo.id;
                    params.ffpCardNo = that.memberInfo.memberID;
                    params.loginKeyInfo = that.memberInfo.loginKeyInfo;
                }
                let baseObj = {
                    flightDate: that.checkInItem.flightDate,
                    flightNo: that.checkInItem.flightNo,
                    depAirportCode: that.checkInItem.depAirport,
                    arrAirportCode: that.checkInItem.arrAirport
                }
                that.pasArr.forEach(item=>{
                    let psgObj = {};
                        psgObj.certNo = item.certNo;
                        psgObj.seatNo = item.seatNo;
                        psgObj.gender = item.gender;
                        psgObj.pnrNo = item.pnrNo;
                        psgObj.psgrName = item.psrName || item.psrEnName;

                    if(that.checkInSeatStatus == CheckInSeatStatus.CHECKIN){
                        psgObj.etCode = item.etCode;
                        psgObj.asrSeatNo = item.asrSeatNo;
                        psgObj.segNo = item.segNo;
                        psgObj.checkInPhone = that.checkInItem.tel || item.phone;
                        psgObj.chd = item.chd;
                        params.checkInReserveInfos = params.checkInReserveInfos || [];
                        params.checkInReserveInfos.push(Object.assign(psgObj, baseObj));

                    } else if(that.checkInSeatStatus == CheckInSeatStatus.SELECT){
                        psgObj.tktNo = item.etCode;
                        psgObj.airsegIndex = item.segNo;
                        psgObj.mobile = that.checkInItem.tel || item.phone;
                        psgObj.cabin = item.cabin;
                        psgObj.existSeatNo = item.existSeatNo;
                        params.selectSeatReserveInfos = params.selectSeatReserveInfos || [];
                        params.selectSeatReserveInfos.push(Object.assign(psgObj, baseObj));
                    }
                })
                return params;
            },
            // 提交值机选座
            submit() {
                let that = this;
                if(!that.selectAll){
                    return;
                }
                controller.logEvent({
                    category: LogEvent.Checkin.Type,
                    event: LogEvent.Checkin.Events[7]
                })
                controller.getJSON({
                        method : 'POST',
                        url: requesturl.CHECKIN.DO_SEAT,
                        params: that.createParams()
                })
                .then((data)=>{
                    if(data.resultCode === ResultCode.SUCCESS){
                        let pageObj = Page.checkIn.result;
                        controller.open({
                            winName: pageObj.winName, 
                            path: pageObj.pageUrl, 
                            data: {
                                checkInItem: that.pageData.checkInItem,
                                checkInResultData: data,
                                isSeatPage: true
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
            // 值机服务协议
            checkInClause(){
                let pageObj = Page.checkIn.clause;
                controller.open({
                    winName: pageObj.winName, 
                    path: WEBIP + pageObj.pageUrl,
                    animateType: 1
                })
            }
        }
    };
</script>
