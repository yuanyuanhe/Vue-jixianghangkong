<template>
    <div id="app">
    <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle" ></Header>
        <div class="main">
            <div class="search-wrap">
                <div class="content">
                     <div class="u-head clearfix">
                            <div class="uh-lf">
                                <span>出发城市</span>                       
                            </div>
                            <div class="uh-rt">
                                <span>到达城市</span>
                            </div>
                    </div>
                    <div class="city-name-search com-border-bottom">
                        <div class="input-city flexbox">
                            <div class="start-city city flex-1"  @click="selectCity(0)">
                                <input :class="{'exchange':changeCity}" type="text" placeholder="请选择" v-model="starCity" readonly>
                            </div>
                            <div class="change-btn" @click="exchangeCity"></div>
                            <div class="end-city city flex-1" @click="selectCity(1)">
                                <input :class="{'exchange':changeCity}"  type="text" placeholder="请选择" v-model="arrCity" readonly>
                            </div>
                        </div>
                    </div>
                    <div class="select-date com-border-bottom" @click="clickCalendar">
                         <div class="date-tp">出发日期</div>
                        <span class="date">{{searchDate.date}}</span>
                        <span class="week">{{searchDate.week}}</span>
                    </div>
                    <div class="search-btn" :class="{'active':isCanSearch}" @click="searchFlight">查询</div>
                </div>
            </div>
            <div class="lists" v-show="objData.length>0">
                   <div  v-for="(item,index) of objData" class="ticket-information-wrapper" :key="index" @click="switchStyle(index,item)">
                        <div class="m-item">
                            <!-- 日期、退改规则 -->                          
                                <div class="u-head clearfix">
                                    <div class="uh-lf">
                                        <span>{{item.flightNo}}</span>                       
                                    </div>
                                    <div class="uh-rt" v-show="item.waitingPersonNum>0">
                                        <span>前面{{item.waitingPersonNum}}人候补</span>
                                    </div>
                                </div>
                            <!-- 出发地、目的地、+1天 -->
                                <div class="u-con">  
                                     <!-- +1天 -->
                                     <div class="uc-day" v-show="item.days>0">
                                      <span>+{item.days}天</span>
                                    </div>                         
                                    <div class="clearfix">
                                    <!-- 出发地 -->
                                        <div class="uc-lf">
                                            <div class="s-time">{{item.depDateTime}}</div>
                                            <div class="s-address">{{item.depAirportName+item.depAirportTerminal}}</div>
                                        </div>
                                        <!-- 行程时间、经停站 -->
                                        <div class="uc-ct">
                                            <div class="s-totalTime">{{item.arrDateTime?dealFlyTime(item.flightTime):''}}</div>
                                            <img src="./img/stopSite.png" alt="">
                                            <div class="s-stopSite" v-show="item.isStop=='Y'">{{item.stopCityName?'经停'+item.stopCityName:' '}}</div>
                                        </div>
                                        <!-- 目的地 -->
                                        <div class="uc-rt">
                                            <div class="s-time">{{item.arrDateTime?item.arrDateTime:'--:--'}}</div>
                                            <div class="s-address">{{item.arrAirportName+item.arrAirportTerminal}}</div>
                                        </div>
                                    </div>
                                </div>   
                        </div>                            
                    </div>                   
               </div>
                <div v-show="canShowImg" class="Imgs">
                   <img src="./img/err.png"/>
                   <p>目前尚未有可候补的航班</p>
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
    import {controller} from "common/logic/controller";
    import requesturl from 'common/deploy/requesturl';
    import Page from 'common/deploy/page';
    import HoCalendar from "components/HoCalendar.vue"
    import {ResultCode,Verify} from "common/logic/enum";
    import { saveLoginInfo, getIsLogin } from 'common/logic/logic'
    export default {
        data() {
            return {    
                 titleStyle:{
                    title:'候补查询',
                    titlestyle: 4,
                    isUseH5: true,
                    barStyle:0
                },  
                objData:[],
                 // 是否隐藏原生头部
                isHidenHeader: true ,
                canShowImg:false,       
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
                searchRequestDate: ""
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                that.searchDate = that.createTodayDate();
                 controller.clickBack(() => {
                    that.clickBackBtn()
                })
                 controller.onshow(function(){
                    saveLoginInfo().then(memberInfo => {
                        that.memberInfo = memberInfo
                    })
                })  
            })
            controller.onPopWindowName((data)=>{
                console.log('157wwwwww',data.data)
                if(data.data){
                    that.objData=[]
                    that.starCity= ""             
                    that.arrCity= ""
                    that.searchDate = that.createTodayDate();
                }
            })
        },
        components: {
            Header,
            CitySelector,
            HoCalendar
        },
        methods: {
            //点击跳转
            switchStyle(index,item){
                  const that=this     
                  let subUrl = Page.alternate.newPassenger;
                    controller.open({
                        winName:subUrl.winName,
                        path: subUrl.pageUrl,
                        data:{
                            item:item,
                        },
                        /*  closeLastPage:true */
                    });                
             },
             // 处理飞行时长
                dealFlyTime(time) {
                    let hour = parseInt(time / 1000 / 60 / 60);
                    let minute = parseInt((time - hour * 60 * 60 * 1000) / 1000 / 60);
                     if(hour==0){
                        return minute + 'm';
                    }
                    if(minute==0){
                        return hour + 'h'
                    }
                    return hour + 'h' + minute + 'm';
                },
              // 点击返回按钮
            clickBackBtn() {
                controller.close({
                    flag: -5
                });
            },
            // 产生当前日期
            createTodayDate() {
                let year = new Date().getFullYear();
                let month = new Date().getMonth()+1;
                month = month>=10?month:"0"+month;
                let day = new Date().getDate();
                day = day>=10?day:"0"+day;
                let week = new Date().getDay();
                let weekArr = ["日","一","二","三","四","五","六"];
                this.searchRequestDate = year+"-"+month+"-"+day;
                return {
                    date: month+"月"+day+"日",
                    week: "周"+weekArr[week]
                }
            },
            // 选择日历
            clickCalendar() {
                this.isShowCalendar = true;
            },
            // 日历的开始时间
            calendarOpenTime() {
                let year = new Date().getFullYear();
                let month = new Date().getMonth();
                let day = new Date().getDate();
              /*   month --; */
                if(month<0) {
                    year--;
                    month = 0;
                }
                return year+"-"+(month+1)+"-"+day;
            },
            // 日历的结束时间
            calendarEndTime() {
                let year = new Date().getFullYear();
                let month = new Date().getMonth();
                let day = new Date().getDate();
                month+= 3;
                if(month>12) {
                    year++;
                    month = month - 12;
                }
                return year+"-"+(month+1)+"-"+day;
            },
            // 日历组件返回
            dateBack() {
                this.isShowCalendar = false;  
            },
            // 点击日历日期
            clickDate(date) {
                console.log(date);
                let year = date[0];
                let month = date[1]>=10?date[1]:"0"+date[1];
                let day = date[2]>=10?date[2]:"0"+date[2];
                let weekArr = ["日","一","二","三","四","五","六"];
                this.searchRequestDate = year+"-"+month+"-"+day;
                this.searchDate = {
                   date: month+"月"+day+"日",
                   week: "周"+weekArr[date[3]]
                }
                this.isShowCalendar = false;
            },
            // 切换出发到达城市
            exchangeCity() {
                this.changeCity = !this.changeCity;
            },
            // 选择城市
            selectCity(index) {
                if((index ==0 && !this.changeCity)||(index == 1 && this.changeCity)) {
                    this.selectCityType = 0;
                    this.transStarCity = "";
                    // 进入页面点击首次插入城市选择器dom
                    if(!this.firstDisplayCityList) {
                        this.firstDisplayCityList = true;
                    }
                    this.displayCityList = true;
                } else if((index ==0 && this.changeCity)||(index == 1 && !this.changeCity)) {
                    if(this.changeCity && this.arrCity) {
                        this.selectCityType = 1;
                        this.transStarCity = this.arrCity;
                        this.displayCityList = true;
                    } else if(!this.changeCity && this.starCity) {
                        this.selectCityType = 1;
                        this.transStarCity = this.starCity;
                        this.displayCityList = true;
                    }else {
                        controller.toast({
                            str: "请选择出发城市",
                            times: 2000
                        });
                    }
                }
            },
            // 选择城市结果
            selectCityResult(city) {
                this.displayCityList = false;
                if(this.selectCityType == 0) {
                    if(!this.changeCity) {
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
                } else if(this.selectCityType == 1) {
                    if(!this.changeCity) {
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
                    let start = "";
                    let end = "";
                    if(!this.changeCity) {
                        start = this.startCityObj.cityCode;
                        end = this.arrCityObj.cityCode;
                    } else {
                        start = this.arrCityObj.cityCode;
                        end = this.startCityObj.cityCode;
                    }
                     const that=this
                    if(this.isCanSearch) {
                         //判断是否登录
                    if (!getIsLogin(true)) {
                        return;
                    }
                      controller.getJSON({
                        method: 'POST',
                        url: requesturl.ALTERNATE.ALTERNATEQUERY,
                        params: that.createParams(start, end),                     
                   
                    })
                    .then(that.sucCallback)
                   .catch(that.errCallback)
                    }     
                 },
                    
                 //请求发送字段
             createParams(start,end){
                    return{
                         "request":{
                               "ffpCardNo":this.memberInfo.memberID,
                              "ffpId":this.memberInfo.id,
                              "loginKeyInfo":this.memberInfo.loginKeyInfo,
                              "flightDate":this.searchRequestDate,   //航班日期
                              "depCity":start,        //出发城市
                              "arrCity":end        //到达城市
                         }
                    }
             },
              //请求成功回调
             sucCallback(res){
                   console.log(res)    
                   if(res.resultCode==ResultCode.SUCCESS){
                      this.canShowImg=false
                      this.objData=res.objData
                      console.log(this.objData)
                   }else if(res.resultCode=="10002"){
                       this.canShowImg=true
                       this.objData=[]
                   }else{
                      
                      controller.toast({str:res.resultInfo});
                       this.canShowImg=false
                       this.objData=[]
                   }
             },
             //请求失败回调
             errCallback(data) {
                controller.toast({str: Verify.BACK_ERR.toastNet});
            },
    },       
      computed: {
            isCanSearch() {
                 if(this.starCity && this.arrCity) {
                    return true;
                } else {
                    return false;
                }
            }
        },
    };
</script>

<style lang="scss" scoped>
     @import "~common/styles/common/_mixin.scss";
    @import "~common/styles/common/function.scss";
     @import '~common/styles/common/common.scss';
 .main{
    .search-wrap {
        width: rem(710);
        margin: rem(30) auto;
        background-color: #fff;
        box-shadow: 0px rem(6) rem(10) 0px rgba(0, 0, 0, 0.02);
        @include border-radius(rem(6));
        .u-head {
                    font-size: rem(22);                 
                     padding:rem(60) 0 0;                  
                    .uh-lf {
                        float: left;
                        color: #848484;
                        height: rem(35);
                        line-height: rem(38);
                    }
                    .uh-rt {
                        float: right;
                        color: #848484;
                        height: rem(35);
                        line-height: rem(38);
                    }
                }
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
        
        .city-name-search {
            position: relative;
            .input-city {
                height: rem(80);
                padding-bottom:rem(30);
                .city {
                    input {
                        position: relative;
                        top: rem(22);
                        width: 100%;
                        font-weight: bold;
                        font-size: rem(40);
                        color: #3A3D50;
                        @include inputPlaceholder(#CCCCCC);
                        background: transparent;
                        transition: transform .3s;
                    }
                }
                .start-city {
                    input.exchange {
                        transform: translate3d(rem(351),0,0);
                        text-align: right;
                    }
                }
                .end-city {
                    input {
                        text-align: right;
                        &.exchange {
                            transform: translate3d(rem(-351),0,0);
                            text-align: left;
                        }
                    }
                }
                .change-btn {
                    width: rem(52);
                    @include bg2("./img/change_btn.png");
                }
            }
        }
        .select-date {
            margin-top:rem(30);
            margin-bottom:rem(10);
            position: relative;
            font-size: rem(32);
            height: rem(110);
            color: #3A3D50;
            .date-tp{
                    font-size:rem(22);
                    font-family:PingFangSC-Regular;
                    font-weight:bold;
                    color:#848484;
                    margin-bottom:rem(10);
                   
            }
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
            background-color: #cccccc;
            @include border-radius(rem(6));
            font-size: rem(32);
            color: #fff;
            font-weight: bold;
            &.active {
               background:linear-gradient(324deg,rgba(225,185,113,1) 0%,rgba(227,205,158,1) 100%);
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
      .lists{
        margin-top:rem(30);
        .ticket-information-wrapper{
            padding:0 rem(20);
            margin-bottom:rem(20); 
            .m-item { 
                overflow: hidden; 
                padding: rem(30);
                background: #fff;
                @include border-radius(rem(6));
                @include box-shadow(0 rem(6) rem(10) 0 rgba(0,0,0,0.02));            
                    .u-head {
                             font-size: rem(24);
                    .uh-lf {
                        float: left;
                        color: #fff;
                        span {
                            display: inline-block;
                            height: rem(28);
                            line-height: rem(28);
                            min-width:rem(108);
                            text-align: center;
                            margin-right: rem(8);
                            @include linear-gradient($lg);
                            @include border-radius(rem(6));
                        }
                    }
                    .uh-rt {
                        float: right;
                        color: #848484;
                        height: rem(35);
                        line-height: rem(38);
                    }
                }

                .u-bread {
                    p {
                        font-size: rem(24);
                        color: #ADADAD;
                        text-align: left;
                        margin-top: rem(10);
                    }
                }

                .u-con {
                    .uc-day {
                        height: rem(22);
                        width: 100%;
                        text-align: right;
                        font-size: rem(22);
                        color: #3A3D50;
                    }
                    .uc-lf, .uc-rt {
                        .s-time {
                            font-size: rem(42);
                            color: #3A3D50;
                            font-weight: 400;
    
                        }
                        .s-address { 
                            font-family:PingFangSC-Regular;
                            font-weight:400;
                            font-size: rem(24);
                            color: rgba(132,132,132,1);
                        }
                    }
                    .uc-lf {
                        float: left;
                        width: 33.33%;
                        text-align: left;
                       
                    }
                    .uc-ct {
                        float: left;
                        width: 33.33%;
                        margin-top: rem(6);
                        text-align: center;
                        .s-totalTime {
                            height: rem(26);
                            font-size: rem(22);
                            color: #ADADAD;
                        }
                        img {
                            height: rem(18);
                            display: block;
                            margin: 0 auto;
                        }
                        .s-stopSite {
                            font-family:PingFangSC-Regular;
                            font-weight:400;
                            height: rem(20);
                            font-size: rem(20);
                            color: rgba(203,157,109,1);
                        }
                    }
                    .uc-rt {
                        transition: 0.5 ease all;
                        float: right;
                        width: 33.33%;
                        text-align: right;
                    }
                }
        }
        
        }
    }
     .Imgs{
       width:100%;
       text-align: center; 
       margin-top:rem(30);   
       img{
           display:block;
          width:40%;
          height:40%;
          margin:0 auto;
       }
       p{
           margin-top:rem(20);
            font-size:rem(24);
            font-weight:bold;
            color:rgba(132,132,132,1);
            line-height:rem(22);
            text-align: center;  
       }
       
    }
 }    

</style>
