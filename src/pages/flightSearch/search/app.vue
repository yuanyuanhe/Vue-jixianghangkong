<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
        <div class="main">
            <div class="search-wrap">
                <div class="title flexbox com-border-bottom">
                    <div class="every-title flex-1 com-border-right" :class="{'active': curentSelectIndex == 0}" @click="changeSearchType(0)">按航班号</div>
                    <div class="every-title flex-1" :class="{'active': curentSelectIndex == 1}" @click="changeSearchType(1)">按城市名</div>
                </div>
                <div class="content">
                    <div class="flight-num-search" v-show="curentSelectIndex == 0">
                        <div class="input-num com-border-bottom">
                            <input type="text" placeholder="请输入航班号，例如HO1234或1234" v-model="flightNum">
                        </div>
                    </div>
                    <div class="city-name-search com-border-bottom" v-show="curentSelectIndex == 1">
                        <div class="input-city flexbox">
                            <div class="start-city city flex-1" @click="selectCity(0)">
                                <input :class="{'exchange':changeCity}" type="text" placeholder="请选择" v-model="starCity" readonly>
                            </div>
                            <div class="change-btn" @click="exchangeCity"></div>
                            <div class="end-city city flex-1" @click="selectCity(1)">
                                <input :class="{'exchange':changeCity}" type="text" placeholder="请选择" v-model="arrCity" readonly>
                            </div>
                        </div>
                    </div>
                    <div class="select-date com-border-bottom" @click="clickCalendar">
                        <span class="date">{{searchDate.date}}</span>
                        <span class="week">{{searchDate.week}}</span>
                    </div>
                    <div class="search-btn" :class="{'active':isCanSearch}" @click="searchFlight">查询</div>
                </div>
            </div>
        </div>
        <city-selector v-show="displayCityList" v-if="firstDisplayCityList" @clickSelectItem="selectCityResult" @closeSelectPage="closeCityList" :starCity="transStarCity"></city-selector>
        <ho-calendar :isShow="isShowCalendar" v-show="isShowCalendar" :dateObj="dateObj" @clickBack="dateBack" @clickDate="clickDate"></ho-calendar>
    </div>
</template>

<script>
    import "common/tools/rem";
    import Header from "components/header.vue";
    import CitySelector from "components/citySelector.vue";
    import controller from "common/logic/controller";
    import requesturl from 'common/deploy/requesturl';
    import Page from 'common/deploy/page';
    import HoCalendar from "components/HoCalendar.vue";
    import LogEvent from "common/deploy/logEvent.js";
    import {
        matchFlightNum
    } from "common/logic/logic.js";
    import {
        ResultCode
    } from "common/logic/enum";
    export default {
        data() {
            return {
                // 头部信息
                isUseHeader: false,
                // 当前选择按照什么方式查找
                curentSelectIndex: 0,
                // 航班号
                flightNum: "",
                // 是否显示城市选择器
                displayCityList: false,
                // 首次显示城市选择器
                firstDisplayCityList: false,
                // 出发城市
                starCity: "",
                // 出发城市对象
                startCityObj: {},
                // 到达城市
                arrCity: "",
                // 到达城市对象
                arrCityObj: {},
                // 切换出发到达城市
                changeCity: false,
                // 选择的是出发还是到达城市
                selectCityType: -1,
                // 需要传给城市选择器的出发城市
                transStarCity: "",
                // 是否可以查询
                canSearch: false,
                // 是否显示日历
                isShowCalendar: false,
                // 日历组件需要的数据
                dateObj: {
                    start: this.calendarOpenTime(),
                    end: this.calendarEndTime()
                },
                // 查询时间
                searchDate: {
                    date: "",
                    week: ""
                },
                // 查询请求时间
                searchRequestDate: "",
                // 设置头部样式
                setTitleStyle: {
                    title: '航班动态',
                    titlestyle: 4,
                    isUseH5: true
                },
                // 是否隐藏原生头部
                isHidenHeader: true
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                that.searchDate = that.createTodayDate();
            });
        },
        components: {
            Header,
            CitySelector,
            HoCalendar
        },
        methods: {
            // 产生当前日期
            createTodayDate() {
                let year = new Date().getFullYear();
                let month = new Date().getMonth() + 1;
                month = month >= 10 ? month : "0" + month;
                let day = new Date().getDate();
                day = day >= 10 ? day : "0" + day;
                let week = new Date().getDay();
                let weekArr = ["日", "一", "二", "三", "四", "五", "六"];
                this.searchRequestDate = year + "-" + month + "-" + day;
                return {
                    date: month + "月" + day + "日",
                    week: "周" + weekArr[week]
                }
            },
            // 选择日历
            clickCalendar() {
                controller.logEvent({
                    category: LogEvent.FlightDynamic.Type,
                    event: LogEvent.FlightDynamic.Events["2"]
                });
                this.isShowCalendar = true;
            },
            // 日历的开始时间
            calendarOpenTime() {
                let year = new Date().getFullYear();
                let month = new Date().getMonth();
                let day = new Date().getDate();
                month--;
                if (month < 0) {
                    year--;
                    month = 0;
                }
                return year + "-" + (month + 1) + "-" + day;
            },
            // 日历的结束时间
            calendarEndTime() {
                let year = new Date().getFullYear();
                let month = new Date().getMonth();
                let day = new Date().getDate();
                month += 3;
                if (month > 12) {
                    year++;
                    month = month - 12;
                }
                return year + "-" + (month + 1) + "-" + day;
            },
            // 日历组件返回
            dateBack() {
                this.isShowCalendar = false;
            },
            // 点击日历日期
            clickDate(date) {
                console.log(date);
                let year = date[0];
                let month = date[1] >= 10 ? date[1] : "0" + date[1];
                let day = date[2] >= 10 ? date[2] : "0" + date[2];
                let weekArr = ["日", "一", "二", "三", "四", "五", "六"];
                this.searchRequestDate = year + "-" + month + "-" + day;
                this.searchDate = {
                    date: month + "月" + day + "日",
                    week: "周" + weekArr[date[3]]
                }
                this.isShowCalendar = false;
            },
            // 切换出发到达城市
            exchangeCity() {
                this.changeCity = !this.changeCity;
            },
            // 选择城市
            selectCity(index) {
                if ((index == 0 && !this.changeCity) || (index == 1 && this.changeCity)) {
                    this.selectCityType = 0;
                    this.transStarCity = "";
                    // 进入页面点击首次插入城市选择器dom
                    if (!this.firstDisplayCityList) {
                        this.firstDisplayCityList = true;
                    }
                    this.displayCityList = true;
                } else if ((index == 0 && this.changeCity) || (index == 1 && !this.changeCity)) {
                    if (this.changeCity && this.arrCity) {
                        this.selectCityType = 1;
                        this.transStarCity = this.arrCity;
                        this.displayCityList = true;
                    } else if (!this.changeCity && this.starCity) {
                        this.selectCityType = 1;
                        this.transStarCity = this.starCity;
                        this.displayCityList = true;
                    } else {
                        controller.toast({
                            str: "请选择出发城市",
                            times: 2000
                        });
                    }
                }
            },
            // 选择城市结果
            selectCityResult(city) {
                console.log(city);
                this.displayCityList = false;
                if (this.selectCityType == 0) {
                    if (!this.changeCity) {
                        this.starCity = city.cityName;
                        this.startCityObj = city;
                        this.arrCity = "";
                        this.arrCityObj = {};
                    } else {
                        this.arrCity = city.cityName;
                        this.arrCityObj = city;
                        this.starCity = "";
                        this.startCityObj = {};
                    }
                } else if (this.selectCityType == 1) {
                    if (!this.changeCity) {
                        this.arrCity = city.cityName;
                        this.arrCityObj = city;
                    } else {
                        this.starCity = city.cityName;
                        this.startCityObj = city;
                    }
                }
            },
            // 关闭城市选择
            closeCityList() {
                this.displayCityList = false;
            },
            // 查询航班
            searchFlight() {
                if (!this.isCanSearch) {
                    return;
                }
                if (this.curentSelectIndex == 0) {
                    if (this.flightNumValidate(this.flightNum)) {
                        this.requestFlight(this.paramsByFlight());
                    }
                } else if (this.curentSelectIndex == 1) {
                    let start = "";
                    let end = "";
                    if (!this.changeCity) {
                        start = this.startCityObj.cityCode;
                        end = this.arrCityObj.cityCode;
                    } else {
                        start = this.arrCityObj.cityCode;
                        end = this.startCityObj.cityCode;
                    }
                    this.requestFlight(this.paramsByCity(start, end));
                }
            },
            // 通过航班号请求接口，参数
            paramsByFlight() {
                return {
                    request: {
                        queryType: "1", //查询方式
                        flightNo: this.flightNum, //航班号
                        flightDate: this.searchRequestDate, //航班日期
                    }
                };
            },
            // 通过城市请求接口，参数
            paramsByCity(start, end) {
                return {
                    request: {
                        queryType: "2", // 查询方式
                        flightDate: this.searchRequestDate, // 航班日期
                        departureCity: start, // 出发城市
                        arrivalCity: end // 到达城市
                    }
                }
            },
            // 请求航班动态接口
            requestFlight(params) {
                let that = this;
                controller
                    .getJSON({
                        method: "POST",
                        url: requesturl.FLIGHT_DYNAMIC.SEARCH,
                        params: params
                    })
                    .then(that.searchSuccess)
                    .catch(that.searchError);
            },
            // 查询成功
            searchSuccess(data) {
                if (data.resultCode == ResultCode.SUCCESS) {
                    let resultInfor = data.objData;
                    if (resultInfor.length > 0) { // 请求出来有数据
                        this.jumpResultPage(resultInfor);
                    } else {
                        controller.toast({
                            str: "没有查出需要的航班信息"
                        });
                    }
                } else {
                    controller.toast({
                        str: data.resultInfo
                    });
                }
            },
            // 查询失败
            searchError() {
                controller.toast({
                    str: "航班动态查询错误",
                    times: 2000
                });
            },
            // 跳转到查询结果页面
            jumpResultPage(resultInfor) {
                let headerTitle = "";
                if (this.curentSelectIndex == 0) {
                    headerTitle = this.createdTotalNum(this.flightNum);
                } else if (this.curentSelectIndex == 1) {
                    if (this.changeCity) {
                        headerTitle = this.arrCity + "-" + this.starCity;
                    } else {
                        headerTitle = this.starCity + "-" + this.arrCity;
                    }
                }
                let jumpPage = Page.flightDynamic.searchResult;
                let transData = {
                    flightList: resultInfor,
                    headerTitle: headerTitle
                }
                controller.open({
                    winName: jumpPage.winName,
                    path: jumpPage.pageUrl,
                    data: transData,
                    closeLastPage: false
                });
            },
            // 创建完整的航班号
            createdTotalNum(num) {
                num = num.toUpperCase();
                if (num.indexOf("HO") == -1) {
                    num = "HO" + num;
                }
                return num
            },
            // 航班号查询信息验证
            flightNumValidate(flightNum) {
                if (matchFlightNum(flightNum)) {
                    return true;
                }
                return false;
            },
            // 切换查找方式
            changeSearchType(index) {
                if (index == 0) { //航班号埋点
                    controller.logEvent({
                        category: LogEvent.FlightDynamic.Type,
                        event: LogEvent.FlightDynamic.Events["0"]
                    });
                } else if (index == 1) { //城市名埋点
                    controller.logEvent({
                        category: LogEvent.FlightDynamic.Type,
                        event: LogEvent.FlightDynamic.Events["1"]
                    });
                }
                this.curentSelectIndex = index;
            },
            clickBackBtn() {
                controller.close();
            }
        },
        computed: {
            isCanSearch() {
                if (this.curentSelectIndex == 0 && !!this.flightNum) {
                    return true;
                } else if (this.curentSelectIndex == 1 && !!this.starCity && !!this.arrCity) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "~common/styles/common/common.scss";
    @import "~common/styles/common/mixin/layout.tlx";
    .search-wrap {
        width: rem(690);
        margin: 0 auto;
        margin-top: rem(30);
        background-color: #fff;
        box-shadow: 0px rem(6) rem(10) 0px rgba(0, 0, 0, 0.02);
        @include border-radius(rem(6));
        .title {
            position: relative;
            height: rem(98);
            line-height: rem(98);
        }
        .every-title {
            position: relative;
            text-align: center;
            font-size: rem(32);
            color: #ADADAD;
            &.active {
                color: #3A3D50;
                font-weight: bold;
                &::after {
                    position: absolute;
                    bottom: 0;
                    left: rem(109);
                    content: "";
                    display: block;
                    width: rem(128);
                    height: rem(6);
                    background-color: #CB9D6D;
                }
            }
            &.com-border-right {
                &::before {
                    height: rem(40);
                    top: rem(29);
                }
            }
        }
        .content {
            padding: 0 rem(30);
            padding-bottom: rem(30);
        }
        .flight-num-search {
            margin-top: rem(30);
            .input-num {
                position: relative;
                height: rem(100);
                input {
                    position: relative;
                    top: rem(25);
                    width: 100%;
                    height: rem(50);
                    @include inputPlaceholder(#CCCCCC);
                    font-size: rem(32);
                }
            }
        }
        .city-name-search {
            position: relative;
            margin-top: rem(30);
            .input-city {
                height: rem(100);
                .city {
                    input {
                        position: relative;
                        top: rem(25);
                        width: 100%;
                        height: rem(50);
                        font-weight: bold;
                        font-size: rem(32);
                        color: #3A3D50;
                        @include inputPlaceholder(#CCCCCC);
                        background: transparent;
                        transition: transform .3s;
                    }
                }
                .start-city {
                    input.exchange {
                        transform: translate3d(rem(341), 0, 0);
                        text-align: right;
                    }
                }
                .end-city {
                    input {
                        text-align: right;
                        &.exchange {
                            transform: translate3d(rem(-341), 0, 0);
                            text-align: left;
                        }
                    }
                }
                .change-btn {
                    width: rem(52);
                    height: rem(100);
                    @include bg2("./img/change_btn.png");
                }
            }
        }
        .select-date {
            position: relative;
            margin-top: rem(30);
            font-size: rem(32);
            height: rem(110);
            line-height: rem(110);
            color: #3A3D50;
            .date {
                font-weight: bold;
            }
            .week {
                margin-left: rem(10);
            }
        }
        .search-btn {
            margin-top: rem(30);
            height: rem(88);
            line-height: rem(88);
            text-align: center;
            box-shadow: 0px rem(10) rem(10) 0px rgba(0, 0, 0, 0.08);
            background: #cccccc;
            @include border-radius(rem(6));
            font-size: rem(32);
            color: #fff;
            font-weight: bold;
            &.active {
                background: linear-gradient(-90deg, #E1b971 0%, #e3cd9e 100%);
            }
        }
    }
    .com-border-right {
        @include bd-right(#F4F4F4);
    }
    .com-border-bottom {
        @include bd-bottom(#F4F4F4);
    }
    .style-ios {
        .com-border-right {
            @include bd-right-ios(#F4F4F4);
        }
        .com-border-bottom {
            @include bd-bottom-ios(#F4F4F4);
        }
    }
</style>
