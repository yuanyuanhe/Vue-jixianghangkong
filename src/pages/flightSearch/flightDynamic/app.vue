<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
        <div class="main">
            <div class="main-wrap">
                <div class="current-state flexbox" :class="[flightDynamicType,headerType]">
                    <div class="state com-border-right">{{currentStatus}}</div>
                    <div class="probability">历史准点率{{pageData.ontimeRate}}</div>
                    <div class="special-probalility">
                        <div class="line-1">历史准点率{{pageData.ontimeRate}}</div>
                        <div class="line-2">{{headerInfor}}</div>
                    </div>
                </div>
                <div class="flight-infor come-style">
                    <div class="title">航班信息</div>
                    <div class="content flexbox">
                        <div class="left-wrap" :class="[flightDynamicType]">
                            <div class="line" ref="progress">
                                <div class="inner-line" ref="innerLine">
                                    <div class="icon"></div>
                                </div>
                            </div>
                        </div>
                        <div class="right-wrap flex-1" ref="rightWrap">
                            <!-- 起飞 -->
                            <div class="every-infor" ref="everyInfor1">
                                <div class="place-infor flexbox" ref="placeInfor">
                                    <div class="name flex-1">{{pageData.departure_city}}{{pageData.depAirPortName}}{{pageData.flightHTerminal}}</div>
                                    <div class="temperature">
                                        <div class="icon" v-if="pageData.deptWeather">
                                            <img :src="pageData.deptWeatherPic" alt="">
                                        </div>
                                        <div class="text">{{pageData.deptTemp}}</div>
                                    </div>
                                    <div class="pm " v-if="pageData.deptpm">
                                        <div class="pm-wrap flexbox">
                                            <div class="text-1">PM2.5</div>
                                            <div class="text-2">{{pageData.deptpm?pageData.deptpm:"--"}}</div>
                                        </div>
                                    </div>
                                    <div class="dot active" ref="dot1"></div>
                                </div>
                                <div class="plane-time">计划起飞时间 {{pageData.std}} GMT+8</div>
                                <div class="airport-infor flexbox">
                                    <div class="every-airport-infor flex-1">
                                        <div class="name">{{flyArrTime.text1}}</div>
                                        <div class="content">{{flyArrTime.time1}}</div>
                                    </div>
                                    <div class="every-airport-infor flex-1">
                                        <div class="name">值机柜台</div>
                                        <div class="content">{{pageData.checkinTable?pageData.checkinTable:"--"}}</div>
                                    </div>
                                    <div class="every-airport-infor flex-1">
                                        <div class="name">登机口</div>
                                        <div class="content">{{pageData.boardGate?pageData.boardGate:"--"}}<span class="tip-infor">{{pageData.bridge}}</span></div>
                                    </div>
                                </div>
                            </div>
                            <!-- 第一段备降 -->
                            <div class="every-infor stop-land" v-if="landFirst" ref="everyInfor2">
                                <div class="place-infor flexbox">
                                    <div class="dot" ref="dot2"></div>
                                </div>
                                <div class="land-infor">
                                    <div class="land-place">备降{{landFirstInfor.place}}</div>
                                    <div class="land-time">{{landFirstInfor.landTimeText}} {{landFirstInfor.landTime}} - {{landFirstInfor.flyTimeText}} {{landFirstInfor.flyTime}}</div>
                                </div>
                            </div>
                            <!-- 经停 -->
                            <div class="every-infor fly-stop-infor" v-if="pageData.is_interline == 'Y'" ref="everyInfor4">
                                <div class="place-infor flexbox">
                                    <div class="stop">经停</div>
                                    <div class="name flex-1">{{pageData.stopovert_airPortName}}</div>
                                    <div class="temperature">
                                        <div class="icon" v-if="pageData.stopovert_weather">
                                            <img :src="pageData.stopovertWeatherPic" alt="">
                                        </div>
                                        <div class="text">{{pageData.stopovert_Temp}}</div>
                                    </div>
                                    <div class="pm " v-if="pageData.stopovert_pm">
                                        <div class="pm-wrap flexbox">
                                            <div class="text-1">PM2.5</div>
                                            <div class="text-2">{{pageData.stopovert_pm?pageData.stopovert_pm:"--"}}</div>
                                        </div>
                                    </div>
                                    <div class="dot" ref="dot4"></div>
                                </div>
                                <div class="plane-time">计划到达时间 {{pageData.stopover_eta}} GMT+8</div>
                                <div class="airport-infor flexbox">
                                    <div class="every-airport-infor flex-1">
                                        <div class="name">{{stopoverTime(0,true)}}</div>
                                        <div class="content">{{stopoverTime(0,false)}}</div>
                                    </div>
                                    <div class="every-airport-infor flex-1">
                                        <div class="name">行李转盘</div>
                                        <div class="content">{{pageData.stopovert_baggageID?pageData.stopovert_baggageID:"--"}}</div>
                                    </div>
                                    <div class="every-airport-infor flex-1">
                                        <div class="name">到达口</div>
                                        <div class="content">--</div>
                                    </div>
                                </div>
                                <div class="plane-time fly-stop-time">计划起飞时间 {{pageData.stopover_etd}} GMT+8</div>
                                <div class="airport-infor flexbox">
                                    <div class="every-airport-infor flex-1">
                                        <div class="name">{{stopoverTime(1,true)}}</div>
                                        <div class="content">{{stopoverTime(1,false)}}</div>
                                    </div>
                                    <div class="every-airport-infor flex-1">
                                        <div class="name">值机柜台</div>
                                        <div class="content">{{pageData.stopovert_checkinTable}}</div>
                                    </div>
                                    <div class="every-airport-infor flex-1">
                                        <div class="name">登机口</div>
                                        <div class="content">{{pageData.stopovert_boardGate}}</div>
                                    </div>
                                </div>
                            </div>
                            <!-- 第二段备降 -->
                            <div class="every-infor stop-land" v-if="landSecond" ref="everyInfor5">
                                <div class="place-infor flexbox">
                                    <div class="dot" ref="dot5"></div>
                                </div>
                                <div class="land-infor">
                                    <div class="land-place">备降{{landSecondInfor.place}}</div>
                                    <div class="land-time">{{landSecondInfor.landTimeText}} {{landSecondInfor.landTime}} - {{landSecondInfor.flyTimeText}} {{landSecondInfor.flyTime}}</div>
                                </div>
                            </div>
                            <!-- 到达 -->
                            <div class="every-infor" ref="everyInfor3">
                                <div class="place-infor flexbox">
                                    <div class="name flex-1">{{pageData.arrival_city}}{{pageData.arrAirPortName}}{{pageData.flightTerminal}}</div>
                                    <div class="temperature">
                                        <div class="icon" v-if="pageData.destWeather">
                                            <img :src="pageData.destWeatherPic" alt="">
                                        </div>
                                        <div class="text">{{pageData.destTemp}}</div>
                                    </div>
                                    <div class="pm " v-if="pageData.destpm">
                                        <div class="pm-wrap flexbox">
                                            <div class="text-1">PM2.5</div>
                                            <div class="text-2">{{pageData.destpm?pageData.destpm:"--"}}</div>
                                        </div>
                                    </div>
                                    <div class="dot" ref="dot3"></div>
                                </div>
                                <div class="plane-time">计划到达时间 {{pageData.sta}} GMT+8</div>
                                <div class="airport-infor flexbox">
                                    <div class="every-airport-infor flex-1">
                                        <div class="name">{{flyArrTime.text2}}</div>
                                        <div class="content">{{flyArrTime.time2}}</div>
                                    </div>
                                    <div class="every-airport-infor flex-1">
                                        <div class="name">行李转盘</div>
                                        <div class="content">{{pageData.baggageID?pageData.baggageID:"--"}}</div>
                                    </div>
                                    <div class="every-airport-infor flex-1">
                                        <div class="name">到达口</div>
                                        <div class="content">{{pageData.reachexit?pageData.reachexit:"--"}}<span class="tip-infor">{{pageData.arr_bridge}}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 前序航班 -->
                <div class="pre-flight come-style" v-if="pageData.pre_departure_city">
                    <div class="title">前序航班</div>
                    <div class="content">
                        <div class="line-1 com-border-bottom flexbox">
                            <div class="flight-name flex-1">{{pageData.pre_flight_no}}</div>
                            <div class="flight-time flex-1" :class="{'active': preFlightActive}">
                                {{preFlightState()}}
                            </div>
                        </div>
                        <div class="line-2 flexbox">
                            <div class="start-infor flex-1 airport-infor">
                                <div class="name">{{pageData.pre_departure_city}}{{pageData.pre_depAirPortName}}{{pageData.pre_deptTerminal}}</div>
                                <div class="time-1">实际起飞 {{getSpecificTime(pageData.pre_atd)}}</div>
                                <div class="time-2">计划起飞 {{getSpecificTime(pageData.pre_std)}}</div>
                            </div>
                            <div class="fly-icon flexbox align-items">
                                <div class="img"></div>
                            </div>
                            <div class="end-infor flex-1 airport-infor">
                                <div class="name">{{pageData.pre_arrival_city}}{{pageData.pre_arrAirPortName}}{{pageData.pre_arrTerminal}}</div>
                                <div class="time-1">实际到达 {{getSpecificTime(pageData.pre_ata)}}</div>
                                <div class="time-2">计划到达 {{getSpecificTime(pageData.pre_sta)}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "common/tools/rem";
    import Header from "components/header.vue";
    import controller from "common/logic/controller";
    import requesturl from 'common/deploy/requesturl'
    import Page from 'common/deploy/page'
    import {
        dateFormat
    } from 'common/logic/utils.js'
    const AllFlightDynamic = {
        PLANE: 0, //计划
        FLY: 1, //起飞
        DELAY: 3, //延误
        CANCEL: 4, //取消
        ARRIVE: 5, //到达
        LAND: 6, // 备降
    }
    export default {
        data() {
            return {
                // 头部信息
                isUseHeader: false,
                // 设置头部信息
                setTitleStyle: {
                    titlestyle: 4,
                    title: '',
                    isUseH5: true
                },
                // 当前航班动态
                currentFlightDynamic: AllFlightDynamic.PLANE,
                allFlightDynamic: AllFlightDynamic,
                // 页面需要的信息
                pageData: {},
                // 头部具体信息
                headerInfor: "",
                // 航班的状态
                currentStatus: "",
                // 前序航班状态
                preFlightActive: false,
                // 头部的布局 (header-1 //只有历史准点率,header-2//历史准点率和延误)
                headerType: "header-1",
                // 明确的起飞，到达时间
                flyArrTime: {
                    text1: "",
                    time1: "",
                    text2: "",
                    time2: ""
                }
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                console.log(111);
                console.log(that.pageData);
                this.setTitleStyle.title = that.pageData.flight_no;
                let flightStatus = that.pageData.flight_status;
                this.currentFlightStatus(flightStatus);
                this.headerStatus();
                this.currentStatus = flightStatus;
                this.specificTime();
            });
        },
        mounted() {
            setTimeout(() => {
                // 计算精度条高度
                this.computedHeight();
                // 改变精度条进度
                this.changeFlightProgress();
            }, 200);
        },
        components: {
            Header
        },
        methods: {
            // 经停的具体时间
            stopoverTime(type, isText) {
                if (type == 0) { //到达
                    if (this.pageData.stopover_ata) { //有实际到达时间
                        if (isText) {
                            return "实际到达"
                        } else {
                            return this.getSpecificTime(this.pageData.stopover_ata)
                        }
                    } else if (this.pageData.stopover_eta) { //有计划到达
                        if (isText) {
                            return "计划到达"
                        } else {
                            return this.getSpecificTime(this.pageData.stopover_eta)
                        }
                    } else {
                        if (isText) {
                            return "计划到达"
                        } else {
                            return "--"
                        }
                    }
                } else if (type == 1) { //起飞
                    if (this.pageData.stopover_atd) { //有实际起飞时间
                        if (isText) {
                            return "实际起飞"
                        } else {
                            return this.getSpecificTime(this.pageData.stopover_atd)
                        }
                    } else if (this.pageData.stopover_etd) { //有计划起飞
                        if (isText) {
                            return "计划起飞"
                        } else {
                            return this.getSpecificTime(this.pageData.stopover_etd)
                        }
                    } else {
                        if (isText) {
                            return "计划起飞"
                        } else {
                            return "--"
                        }
                    }
                }
            },
            // 起飞降落的具体的时间
            specificTime() {
                let newFlyArrTime = {}
                if (this.pageData.atd) { //实际起飞
                    newFlyArrTime.text1 = "实际起飞";
                    newFlyArrTime.time1 = this.getSpecificTime(this.pageData.atd);
                } else if (this.pageData.etd) { //预计起飞
                    newFlyArrTime.text1 = "预计起飞";
                    newFlyArrTime.time1 = this.getSpecificTime(this.pageData.etd);
                } else if (this.pageData.std) { //计划起飞
                    newFlyArrTime.text1 = "预计起飞";
                    newFlyArrTime.time1 = this.getSpecificTime(this.pageData.std);
                } else { //没有数据
                    newFlyArrTime.text1 = "预计起飞";
                    newFlyArrTime.time1 = "--";
                }
                if (this.pageData.ata) { //实际到达
                    newFlyArrTime.text2 = "实际到达";
                    newFlyArrTime.time2 = this.getSpecificTime(this.pageData.ata);
                } else if (this.pageData.eta) { //预计到达
                    newFlyArrTime.text2 = "预计到达";
                    newFlyArrTime.time2 = this.getSpecificTime(this.pageData.eta);
                } else if (this.pageData.sta) { //计划到达
                    newFlyArrTime.text2 = "预计到达";
                    newFlyArrTime.time2 = this.getSpecificTime(this.pageData.sta);
                } else { //没有数据
                    newFlyArrTime.text2 = "预计到达";
                    newFlyArrTime.time2 = "--";
                }
                this.flyArrTime = newFlyArrTime;
            },
            // 计算进度
            createProgress(beginTime, endTime) {
                return (new Date() - dateFormat.formatIOSDate(beginTime)) / (dateFormat.formatIOSDate(endTime) - dateFormat.formatIOSDate(beginTime))
            },
            // 修改航线进度条
            changeFlightProgress() {
                let flighHeight1 = this.$refs.everyInfor1 ? this.$refs.everyInfor1.clientHeight : 0;
                let flighHeight2 = this.$refs.everyInfor2 ? this.$refs.everyInfor2.clientHeight : 0;
                let flighHeight4 = this.$refs.everyInfor4 ? this.$refs.everyInfor4.clientHeight : 0;
                let flighHeight5 = this.$refs.everyInfor5 ? this.$refs.everyInfor5.clientHeight : 0;
                if (!this.pageData.ata) { // 航班还没有到达
                    if (this.pageData.atd) { // 航班已经起飞
                        if (this.pageData.is_interline == "Y") { //航班有经停
                            if (this.pageData.divert_airport1) { //有第一段备降
                                if (this.pageData.divert_ata1) { //第一段备降已经降落
                                    if (this.pageData.divert_atd1) { //第一段备降已经起飞
                                        if (this.pageData.stopover_ata) { //经停实际到达
                                            if (this.pageData.stopover_atd) { //经停实际起飞
                                                if (this.pageData.divert_airport2) { //有第二段备降
                                                    if (this.pageData.divert_ata2) { //第二段备降降落
                                                        if (this.pageData.divert_atd2) { //第二段备降起飞
                                                            let progress = "";
                                                            if (this.pageData.eta) { //有预计到达时间
                                                                progress = this.createProgress(this.pageData.divert_atd2, this.pageData.eta);
                                                            } else {
                                                                progress = this.createProgress(this.pageData.divert_atd2, this.pageData.sta);
                                                            }
                                                            this.$refs.innerLine.style.height = (flighHeight1 + flighHeight2 + flighHeight4 + flighHeight5 * progress) + "px";
                                                        } else {
                                                            this.$refs.innerLine.style.height = (flighHeight1 + flighHeight2 + flighHeight4) + "px";
                                                        }
                                                        this.$refs.dot5.className = this.$refs.dot5.className + " active";
                                                    } else {
                                                        let progress = this.createProgress(this.pageData.stopover_atd, this.pageData.divert_eta2);
                                                        this.$refs.innerLine.style.height = (flighHeight1 + flighHeight2 + flighHeight4 * progress) + "px";
                                                    }
                                                } else {
                                                    let progress = "";
                                                    if (this.pageData.eta) { //有预计到达时间
                                                        progress = this.createProgress(this.pageData.stopover_atd, this.pageData.eta);
                                                    } else {
                                                        progress = this.createProgress(this.pageData.stopover_atd, this.pageData.sta);
                                                    }
                                                    this.$refs.innerLine.style.height = (flighHeight1 + flighHeight2 + flighHeight4 * progress) + "px";
                                                }
                                            } else {
                                                this.$refs.innerLine.style.height = (flighHeight1 + flighHeight2) + "px";
                                            }
                                            this.$refs.dot4.className = this.$refs.dot4.className + " active";
                                        } else {
                                            let progress = this.createProgress(this.pageData.divert_atd1, this.pageData.stopover_eta);
                                            this.$refs.innerLine.style.height = (flighHeight1 + progress * flighHeight2) + "px";
                                        }
                                    } else {
                                        this.$refs.innerLine.style.height = flighHeight1 + "px";
                                    }
                                    this.$refs.dot2.className = this.$refs.dot2.className + " active";
                                } else { //第一段备降还没有降落
                                    let progress = this.createProgress(this.pageData.atd, this.pageData.divert_eta1);
                                    this.$refs.innerLine.style.height = flighHeight1 * progress + "px";
                                }
                            } else {
                                if (this.pageData.stopover_ata) { //经停实际到达
                                    if (this.pageData.stopover_atd) { //经停实际起飞
                                        if (this.pageData.divert_airport2) { //第二段备降
                                            if (this.pageData.divert_ata2) { //第二段航班已经降落
                                                if (this.pageData.divert_atd2) { //第二段航班已经起飞
                                                    let progress = "";
                                                    if (this.pageData.eta) { //有预计到达时间
                                                        progress = this.createProgress(this.pageData.divert_atd2, this.pageData.eta);
                                                    } else {
                                                        progress = this.createProgress(this.pageData.divert_atd2, this.pageData.sta);
                                                    }
                                                    this.$refs.innerLine.style.height = (flighHeight1 + flighHeight4 + progress * flighHeight5) + "px";
                                                } else {
                                                    this.$refs.innerLine.style.height = (flighHeight1 + flighHeight4) + "px";
                                                }
                                                this.$refs.dot5.className = this.$refs.dot5.className + " active";
                                            } else {
                                                let progress = this.createProgress(this.pageData.stopover_atd, this.pageData.divert_eta2);
                                                this.$refs.innerLine.style.height = (flighHeight1 + progress * flighHeight4) + "px";
                                            }
                                        } else {
                                            let progress = "";
                                            if (this.pageData.eta) { //有预计到达时间
                                                progress = this.createProgress(this.pageData.stopover_atd, this.pageData.eta);
                                            } else {
                                                progress = this.createProgress(this.pageData.stopover_atd, this.pageData.sta);
                                            }
                                            this.$refs.innerLine.style.height = (flighHeight1 + progress * flighHeight4) + "px";
                                        }
                                    } else {
                                        this.$refs.innerLine.style.height = flighHeight1 + "px";
                                    }
                                    this.$refs.dot4.className = this.$refs.dot4.className + " active";
                                } else {
                                    let progress = this.createProgress(this.pageData.atd, this.pageData.stopover_eta);
                                    this.$refs.innerLine.style.height = progress * flighHeight1 + "px";
                                }
                            }
                        } else { //航班没有经停
                            if (this.pageData.divert_airport) { //航班需要备降
                                if (!this.pageData.divert_ata) { //航班未到备降机场
                                    let progress = (new Date() - dateFormat.formatIOSDate(this.pageData.atd)) / (dateFormat.formatIOSDate(this.pageData.divert_atd) - dateFormat.formatIOSDate(this.pageData.atd));
                                    let height = flighHeight1 * progress + "px";
                                    this.$refs.innerLine.style.height = height;
                                } else { //航班已经到备降机场
                                    if (this.pageData.divert_atd) { //备降机场起飞
                                        let progress = "";
                                        if (this.pageData.eta) { //有预计到达时间
                                            progress = (new Date() - dateFormat.formatIOSDate(this.pageData.divert_atd)) / (dateFormat.formatIOSDate(this.pageData.eta) - dateFormat.formatIOSDate(this.pageData.divert_atd))
                                        } else {
                                            progress = (new Date() - dateFormat.formatIOSDate(this.pageData.divert_atd)) / (dateFormat.formatIOSDate(this.pageData.sta) - dateFormat.formatIOSDate(this.pageData.divert_atd));
                                        }
                                        let height = flighHeight1 + flighHeight2 * progress + "px";
                                        this.$refs.innerLine.style.height = height;
                                    } else {
                                        this.$refs.innerLine.style.height = flighHeight1 + "px";
                                    }
                                    this.$refs.dot2.className = this.$refs.dot2.className + " active";
                                }
                            } else { //起飞但没有到达
                                let progress = "";
                                if (this.pageData.eta) { //有预计到达时间
                                    progress = (new Date() - dateFormat.formatIOSDate(this.pageData.atd)) / (dateFormat.formatIOSDate(this.pageData.eta) - dateFormat.formatIOSDate(this.pageData.atd));
                                } else {
                                    progress = (new Date() - dateFormat.formatIOSDate(this.pageData.atd)) / (dateFormat.formatIOSDate(this.pageData.sta) - dateFormat.formatIOSDate(this.pageData.atd));
                                }
                                this.$refs.innerLine.style.height = progress * 100 + "%";
                            }
                        }
                    }
                } else { // 航班已经到达
                    if (this.pageData.divert_airport || this.pageData.divert_airport1) { //第一段备降
                        this.$refs.dot2.className = this.$refs.dot2.className + " active";
                    }
                    if (this.pageData.is_interline == "Y") { //经停
                        this.$refs.dot4.className = this.$refs.dot4.className + " active";
                    }
                    if (this.pageData.divert_airport2) { //第二段备降
                        this.$refs.dot5.className = this.$refs.dot5.className + " active";
                    }
                    this.$refs.innerLine.style.height = "100%";
                }
            },
            // 前序航班的状态
            preFlightState() {
                let stateText = "";
                let status = this.pageData.pre_flight_status;
                if (status == "取消") {
                    stateText = "航班已取消";
                } else if (status == "到达") {
                    stateText = "抵达";
                } else if (status == "起飞") {
                    let dealyTime = 0;
                    if (this.pageData.pre_eta) {//预计到达
                        dealyTime = this.dealyTime(new Date(), dateFormat.formatIOSDate(this.pageData.pre_eta));
                        if(dealyTime > 0) {
                            stateText = "还需要" + dealyTime + "分钟抵达";
                            this.preFlightActive = true;
                        }
                    } else if(this.pageData.pre_sta) {//计划到达
                        dealyTime = this.dealyTime(new Date(), dateFormat.formatIOSDate(this.pageData.pre_sta));
                        if(dealyTime > 0) {
                            stateText = "还需要" + dealyTime + "分钟抵达";
                            this.preFlightActive = true;
                        }
                    }
                } else {
                    stateText = status;
                }
                return stateText;
            },
            // 修改时间
            changeTime(time) {
                if (!time) {
                    return "";
                }
                return time.slice(0, -3);
            },
            // 更改航线状态
            currentFlightStatus(status) {
                let newStatus = "";
                if (status == "计划") {
                    newStatus = this.allFlightDynamic.PLANE;
                } else if (status == "起飞") {
                    newStatus = this.allFlightDynamic.FLY;
                } else if (status == "延误") {
                    newStatus = this.allFlightDynamic.DELAY;
                } else if (status == "取消") {
                    newStatus = this.allFlightDynamic.CANCEL;
                } else if (status == "到达") {
                    newStatus = this.allFlightDynamic.ARRIVE;
                } else if (status == "备降") {
                    newStatus = this.allFlightDynamic.LAND;
                } else {
                    newStatus = this.allFlightDynamic.FLY;
                }
                this.currentFlightDynamic = newStatus;
            },
            // 当前航线的进度
            flightProgress() {
                let currentProgress = 0;
                if (this.pageData.ata) {
                    currentProgress = 100;
                    console.log(555);
                    console.log(currentProgress);
                    return;
                }
                let starTime = dateFormat.formatIOSDate(this.pageData.atd);
                let endTime = dateFormat.formatIOSDate(this.pageData.sta);
                let flyTime = endTime - starTime;
                let hasFly = new Date() - starTime;
                currentProgress = hasFly / flyTime * 100;
                console.log(555);
                console.log(currentProgress);
            },
            // 获取具体时间
            getSpecificTime(time) {
                if (!time) {
                    return "--";
                }
                let separateTime = time.split(" ")[1].split(":");
                return separateTime[0] + ":" + separateTime[1];
            },
            // 头部但前的具体状态
            headerStatus() {
                let dynamic = this.currentFlightDynamic;
                console.log(7777);
                console.log(dynamic);
                if (dynamic == this.allFlightDynamic.DELAY) {
                    var time = this.dealyTime(dateFormat.formatIOSDate(this.pageData.std), new Date());
                    this.headerInfor = "距离计划起飞时间已经延误" + time + "分钟";
                    this.headerType = "header-2";
                } else if (dynamic == this.allFlightDynamic.CANCEL) {
                    this.headerInfor = "该航班已取消";
                    this.headerType = "header-2";
                } else if (dynamic == this.allFlightDynamic.ARRIVE) {
                    let time = this.dealyTime(dateFormat.formatIOSDate(this.pageData.sta), dateFormat.formatIOSDate(this.pageData.ata));
                    if (time < 0) {
                        this.headerType = "header-1";
                    } else if (time > 0) {
                        this.headerInfor = "距离计划到达时间已经延误" + time + "分钟";
                        this.headerType = "header-2";
                    }
                } else if (dynamic == this.allFlightDynamic.ARRIVE) {
                    this.headerInfor = "备降" + this.pageData.divert_airport;
                    this.headerType = "header-2";
                } else {
                    this.headerType = "header-1";
                }
            },
            // 延误时间
            dealyTime(time1, time2) {
                return parseInt((time2 - time1) / 1000 / 60);
            },
            // 计算页面dom高度
            computedHeight() {
                let calculateDom = this.$refs.rightWrap.children;
                console.log(calculateDom);
                let everyDomHeight = [];
                let progressHeight = 0;
                let currentHeight = 0;
                let allProgress = [0];
                for (let i = 0; i < calculateDom.length - 1; i++) {
                    let height = calculateDom[i].clientHeight;
                    console.log(height);
                    progressHeight += parseFloat(height);
                    everyDomHeight.push(height)
                }
                for (let i = 0; i < everyDomHeight.length; i++) {
                    currentHeight += everyDomHeight[i];
                    allProgress.push(currentHeight / progressHeight);
                }
                this.progressHeight = progressHeight;
                this.allProgress = allProgress;
                this.changeProgressDom();
            },
            // 修改精度条dom
            changeProgressDom() {
                this.$refs.progress.style.height = this.progressHeight + "px";
            },
            clickBackBtn() {
                controller.close();
            }
        },
        computed: {
            // 是否备降到第一段
            landFirst() {
                if ((this.pageData.is_interline == "Y" && this.pageData.divert_airport1) || (this.pageData.is_interline == "N" && this.pageData.divert_airport)) {
                    return true;
                }
                return false;
            },
            // 备降到第一段信息
            landFirstInfor() {
                let landTime = "";
                let landTimeText = "";
                let flyTime = "";
                let flyTimeText = "";
                if (this.pageData.is_interline == "Y" && this.pageData.divert_airport1) {
                    if (this.pageData.divert_ata1) { //实际降落
                        landTime = this.pageData.divert_ata1;
                        landTimeText = "实际降落";
                    } else {
                        landTime = this.pageData.divert_eta1;
                        landTimeText = "预计降落";
                    }
                    if (this.pageData.divert_atd1) { //实际起飞
                        flyTime = this.pageData.divert_atd1;
                        flyTimeText = "实际起飞"
                    } else {
                        flyTime = this.pageData.divert_etd1;
                        flyTimeText = "预计起飞"
                    }
                    return {
                        place: this.pageData.divert_airPortName1,
                        landTime: this.getSpecificTime(landTime),
                        landTimeText: landTimeText,
                        flyTime: this.getSpecificTime(flyTime),
                        flyTimeText: flyTimeText
                    };
                }
                if (this.pageData.is_interline == "N" && this.pageData.divert_airport) {
                    if (this.pageData.divert_ata) { //实际降落
                        landTime = this.pageData.divert_ata;
                        landTimeText = "实际降落";
                    } else {
                        landTime = this.pageData.divert_eta;
                        landTimeText = "预计降落";
                    }
                    if (this.pageData.divert_atd) { //实际起飞
                        flyTime = this.pageData.divert_atd;
                        flyTimeText = "实际起飞"
                    } else {
                        flyTime = this.pageData.divert_etd;
                        flyTimeText = "预计起飞"
                    }
                    return {
                        place: this.pageData.divert_airPortName,
                        landTime: this.getSpecificTime(landTime),
                        landTimeText: landTimeText,
                        flyTime: this.getSpecificTime(flyTime),
                        flyTimeText: flyTimeText
                    };
                }
                return {
                    place: "--",
                    landTime: "--",
                    flyTime: "--"
                };
            },
            // 是否备降到第二段
            landSecond() {
                if (this.pageData.is_interline == "Y" && this.pageData.divert_airport2) {
                    return true;
                }
                return false;
            },
            // 备降到第二段信息
            landSecondInfor() {
                let landTime = "";
                let landTimeText = "";
                let flyTime = "";
                let flyTimeText = "";
                if (this.pageData.is_interline == "Y" && this.pageData.divert_airport2) {
                    if (this.pageData.divert_ata2) { //实际降落
                        landTime = this.pageData.divert_ata2;
                        landTimeText = "实际降落";
                    } else {
                        landTime = this.pageData.divert_eta2;
                        landTimeText = "预计降落";
                    }
                    if (this.pageData.divert_atd2) { //实际起飞
                        flyTime = this.pageData.divert_atd2;
                        flyTimeText = "实际起飞"
                    } else {
                        flyTime = this.pageData.divert_etd2;
                        flyTimeText = "预计起飞"
                    }
                    return {
                        place: this.pageData.divert_airPortName2,
                        landTime: this.getSpecificTime(landTime),
                        landTimeText: landTimeText,
                        flyTime: this.getSpecificTime(flyTime),
                        flyTimeText: flyTimeText
                    };
                }
                return {
                    place: "--",
                    landTime: "--",
                    flyTime: "--"
                };
            },
            flightDynamicType() {
                if (this.currentFlightDynamic == this.allFlightDynamic.DELAY) {
                    return "type-2";
                } else if (this.currentFlightDynamic == this.allFlightDynamic.CANCEL) {
                    return "type-3";
                } else {
                    return "type-1"
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "~common/styles/common/common.scss";
    @import "~common/styles/common/mixin/layout.tlx";
    .main-wrap {
        width: rem(750);
        margin: 0 auto;
        padding-bottom: rem(104);
    }
    .current-state {
        padding: rem(47) 0 rem(47) rem(50);
        color: #fff;
        line-height: rem(66);
        &.type-1 {
            background: linear-gradient(90deg, #35DEB9 0%, #1DC1AF 100%);
        }
        &.type-2 {
            background: linear-gradient(90deg, #FDBA30 0%, #FF925D 100%);
        }
        &.type-3 {
            background: linear-gradient(90deg, #FC7865 0%, #FF5647 100%);
        }
        &.header-1 {
            .probability {
                display: block;
            }
        }
        &.header-2 {
            .special-probalility {
                display: block;
            }
        }
        .state {
            position: relative;
            height: rem(66);
            padding-right: rem(20);
            font-size: rem(54);
            font-weight: bold;
        }
        .probability {
            padding-left: rem(21);
            font-size: rem(32);
            display: none;
        }
        .special-probalility {
            display: none;
            padding-left: rem(21);
            .line-1 {
                font-size: rem(32);
                line-height: rem(32);
            }
            .line-2 {
                margin-top: rem(10);
                font-size: rem(24);
                line-height: rem(24);
            }
        }
    }
    .main-wrap {
        &>.come-style {
            padding: rem(20) rem(30) 0 rem(30);
            &>.title {
                height: rem(50);
                line-height: rem(50);
                padding-left: rem(30);
                font-size: rem(24);
                color: #ADADAD;
            }
            &>.content {
                background-color: #fff;
                box-shadow: 0px rem(6) rem(10) 0px rgba(0, 0, 0, 0.02);
                @include border-radius(rem(6));
            }
        }
    }
    .flight-infor {
        &>.content {
            padding: rem(23) rem(30) rem(30) 0;
        }
        .left-wrap {
            position: relative;
            margin: 0 rem(16);
            padding-top: rem(21);
            width: rem(42);
            &.type-1 {
                .inner-line {
                    background-color: #1DC1AF;
                    .icon {
                        @include bg("./img/plane_icon.png");
                    }
                }
            }
            &.type-2 {
                .inner-line {
                    background-color: #FEB652;
                    .icon {
                        @include bg("./img/plane_icon_1.png");
                    }
                }
            }
            &.type-3 {
                .inner-line {
                    background-color: #FD7766;
                    .icon {
                        @include bg("./img/plane_icon_2.png");
                    }
                }
            }
            .line {
                margin: 0 auto;
                width: rem(2);
                height: rem(233);
                background-color: #CCCCCC;
            }
            .inner-line {
                position: relative;
                width: rem(2);
                height: 0%;
                .icon {
                    position: absolute;
                    left: rem(-20);
                    bottom: rem(-21);
                    width: rem(42);
                    height: rem(42);
                    z-index: 10;
                }
            }
        }
        .every-infor:nth-child(1) {
            padding-bottom: rem(53);
        }
        .every-infor {
            &.fly-stop-infor {
                &.special-stop {
                    padding-bottom: rem(88);
                }
                padding-bottom: rem(53);
                .stop {
                    position: relative;
                    top: rem(4);
                    width: rem(69);
                    height: rem(34);
                    line-height: rem(34);
                    text-align: center;
                    background-color: #F5F5F5;
                    font-size: rem(24);
                    color: #848484;
                    margin-right: rem(10);
                }
            }
            &.stop-land {
                position: relative;
                height: rem(109);
                .land-infor {
                    position: absolute;
                    top: rem(-35);
                    left: 0;
                    height: rem(112);
                    width: rem(586);
                    background-color: #F5F5F5;
                    box-sizing: border-box;
                    padding: rem(25) rem(20);
                    .land-place {
                        font-size: rem(28);
                        line-height: rem(28);
                        color: #3A3D50;
                    }
                    .land-time {
                        margin-top: rem(14);
                        font-size: rem(24);
                        line-height: rem(24);
                        color: #848484;
                    }
                }
            }
            .fly-land {
                margin-top: rem(60);
                background-color: #F5F5F5;
                padding: rem(25) rem(20);
                .land-place {
                    font-size: rem(28);
                    line-height: rem(28);
                    color: #3A3D50;
                }
                .land-time {
                    margin-top: rem(14);
                    font-size: rem(24);
                    line-height: rem(24);
                    color: #848484;
                }
            }
            .place-infor {
                position: relative;
                height: rem(42);
                .name {
                    height: rem(42);
                    line-height: rem(42);
                    font-size: rem(28);
                    color: #3A3D50;
                    font-weight: bold;
                }
                .temperature {
                    font-size: 0;
                    line-height: rem(42);
                    &>div {
                        display: inline-block;
                    }
                    .icon {
                        width: rem(28);
                        height: rem(28);
                        vertical-align: middle;
                        img {
                            width: rem(28);
                            height: rem(28);
                        }
                    }
                    .text {
                        margin-left: rem(8);
                        font-size: rem(24);
                        color: #848484;
                        vertical-align: middle;
                    }
                }
                .pm {
                    position: relative;
                    top: rem(7);
                    margin-left: rem(20);
                    width: rem(124);
                    height: rem(28);
                    line-height: rem(28);
                    font-size: rem(20);
                    text-align: center;
                    .pm-wrap {
                        border: 1px solid #CCCCCC;
                    }
                    .text-1 {
                        width: rem(76);
                        height: rem(28);
                        color: #848484;
                    }
                    .text-2 {
                        width: rem(48);
                        height: rem(28);
                        background-color: #ADADAD;
                    }
                }
                .dot {
                    position: absolute;
                    top: rem(14);
                    left: rem(-44);
                    width: rem(14);
                    height: rem(14);
                    @include border-radius(rem(7));
                    border: 1px solid #CCCCCC;
                    background-color: #fff;
                    box-sizing: border-box;
                    &.active {
                        border: 1px solid #1DC1AF;
                        background-color: #1DC1AF;
                    }
                }
            }
            .plane-time {
                margin-top: rem(22);
                font-size: rem(24);
                line-height: rem(24);
                color: #3A3D50;
                &.fly-stop-time {
                    margin-top: rem(60);
                }
            }
            .airport-infor {
                margin-top: rem(34);
                .every-airport-infor {
                    .name {
                        font-size: rem(24);
                        line-height: rem(24);
                        color: #ADADAD;
                    }
                    .content {
                        margin-top: rem(10);
                        font-size: rem(36);
                        line-height: rem(36);
                        color: #3A3D50;
                        font-weight: bold;
                        .tip-infor {
                            font-size: rem(22);
                            font-weight: 400;
                            color: #CB9D6D;
                        }
                    }
                }
            }
        }
    }
    .pre-flight {
        .line-1 {
            position: relative;
            padding: 0 rem(30);
            height: rem(80);
            line-height: rem(80);
            .flight-name {
                font-size: rem(28);
                font-weight: bold;
                color: #3A3D50;
            }
            .flight-time {
                font-size: rem(24);
                color: #848484;
                text-align: right;
                &.active {
                    color: #CB9D6D;
                }
            }
        }
        .line-2 {
            padding: rem(30);
            .airport-infor {
                .name {
                    font-size: rem(28);
                    line-height: rem(28);
                    font-weight: bold;
                    color: #3A3D50;
                }
                .time-1 {
                    margin-top: rem(14);
                    font-size: rem(24);
                    line-height: rem(24);
                    color: #3A3D50;
                }
                .time-2 {
                    margin-top: rem(14);
                    font-size: rem(24);
                    line-height: rem(24);
                    color: #ADADAD;
                }
            }
            .end-infor {
                .name {
                    text-align: right;
                }
                .time-1 {
                    text-align: right;
                }
                .time-2 {
                    text-align: right;
                }
            }
            .fly-icon {
                width: rem(178);
                .img {
                    width: rem(178);
                    height: rem(18);
                    @include bg("./img/selectCabinLift_icon.png");
                }
            }
        }
    }
    .com-border-right {
        @include bd-right(#ffffff);
    }
    .com-border-bottom {
        @include bd-bottom(#F4F4F4);
    }
    .com-border {
        @include border(#CCCCCC);
    }
    .style-ios {
        .com-border-right {
            @include bd-right-ios(#ffffff);
        }
        .com-border-bottom {
            @include bd-bottom-ios(#F4F4F4);
        }
        .com-border {
            @include border-ios(#CCCCCC);
        }
    }
</style>
