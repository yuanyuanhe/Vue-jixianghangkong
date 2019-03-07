<style lang="scss" scope>
    @import '~common/styles/common/common.scss';
    .container{
        padding: rem(30) rem(30) rem(60) rem(30);
        .query-plane {
            box-shadow: 0 rem(6) rem(10) 0 rgba(0, 0, 0, 0.02);
            @include border-radius(rem(6));
            background-color: #fff;
            padding: rem(10) rem(30) rem(40) rem(30);
            .input-wrap {
                position: relative;
                margin-top: rem(10);
                height: rem(112);
                &.active {
                    .input-name {
                        top: rem(21);
                        font-size: rem(22);
                        line-height: rem(22);
                        color: #ADADAD;
                    }
                    input {
                        display: block;
                    }
                    .delete-btn {
                        visibility: visible;
                    }
                }
                .delete-btn {
                    visibility: hidden;
                    width: rem(24);
                    height: rem(112);
                    margin-right: rem(20);
                    @include bg2("./img/cabinLift_close_1.png");
                    transition: all .1s;
                    -moz-transition: all .1s;
                    -webkit-transition: all .1s; 
                    -o-transition: all .1s; 
                }
                .calendar-btn {
                    width: rem(42);
                    height: rem(112);
                    margin-right: rem(20);
                    @include bg2("./img/calendar.png");
                    transition: all .1s;
                    -moz-transition: all .1s;
                    -webkit-transition: all .1s; 
                    -o-transition: all .1s; 
                }
                .input-name {
                    position: absolute;
                    width: 100%;
                    top: rem(42);
                    font-size: rem(28);
                    line-height: rem(28);
                    color: #CCCCCC;
                    transition: all .1s;
                    -moz-transition: all .1s;
                    -webkit-transition: all .1s;
                    -o-transition: all .1s;
                }
                input {
                    margin-top: rem(43);
                    width: 80%;
                    height: rem(68);
                    font-size: rem(28);
                    color: #3A3D50;
                    transition: all .1s;
                    -moz-transition: all .1s;
                    -webkit-transition: all .1s;
                    -o-transition: all .1s;
                }
            }
        .query-btn {
            cursor:pointer;
            margin-top: rem(30);
            height: rem(88);
            line-height: rem(88);
            text-align: center;
            background: linear-gradient(270deg, rgba(225, 185, 113, 1) 0%, rgba(227, 205, 158, 1) 100%);
            box-shadow: 0 rem(10) rem(10) 0 rgba(0, 0, 0, 0.08);
            @include border-radius(rem(6));
            font-size: rem(32);
            font-weight: 600;
            color: #fff;
            &.no-search {
                background: none;
                background-color: #D8D8D8;
            }
        }
        }
        .buy-rules {
        margin-top: rem(50);
        padding:rem(10);
            .every-rules {
                    margin-top: rem(40);
                    .title {
                    font-size: rem(28);
                    color: #3A3D50;
                    }
                    .content {
                    margin-top: rem(20);
                    font-size: rem(24);
                    line-height: rem(34);
                    color: #848484;
                    }
                }
            .special-title {
                .line-1 {
                    text-align: center;
                    font-size: 0;
                    line-height: rem(36);
                    span {
                    display: inline-block;
                    }
                    .line {
                    width: rem(40);
                    height: rem(2);
                    background-color: #3A3D50;
                    vertical-align: middle;
                    }
                    .name {
                    margin: 0 rem(20);
                    font-size: rem(36);
                    font-weight: 600;
                    color: #25292F;
                    vertical-align: middle;
                    }
                }
                .line-2 {
                    margin-top: rem(20);
                    text-align: center;
                    font-size: rem(24);
                    color: #848484;
                }
            }
        }
    }
</style>
<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="TitleStyle"></Header>
        <div class="main">
            <div class="container">
                <!-- 信息输入 -->
                <div class="query-plane">
                    <div class="input-wrap com-border-bottom flexbox" :class="{'active': inputFocus_1}">
                    <div class="left-wrap flex-1">
                        <label class="input-name" for="cad-num">乘机所持证件号/票号</label>
                        <input type="text" id="cad-num" v-model="cardNum" ref="input_1" placeholder="" @focus="clickInput(1)" @blur="inputBlur(1 , $event)">
                    </div>
                    <div class="delete-btn" @click="deleteInput(1)" v-if="showDel"></div>
                    </div>

                    <div class="input-wrap com-border-bottom flexbox active">
                        <div class="left-wrap flex-1" @click="chooseDate">
                            <div class="input-name">航班日期</div>
                            <input type="text" v-model="flightTime" readonly ref="input_2">
                        </div>
                        <div class="calendar-btn" @click="chooseDate"></div>
                    </div>
                    

                    <div class="query-btn " :class="{'no-search': !canSearchPlane}" @click="searchPlane" v-text="search">查询</div>
                </div>
                <!-- 温馨提示 -->
                <div class="buy-rules">
                    <div class="special-title">
                    <div class="line-1">
                        <span class="line"></span>
                        <span class="name">温馨提示</span>
                        <span class="line"></span>
                    </div>
                    </div>
                    <div class="rules-content">
                        <div class="every-rules">
                            <div class="content">
                            1.航班信息证明目前仅适用于吉祥航空承运的航班。
                            </div>
                        </div>
                        <div class="every-rules">
                            <div class="content">
                            2.提供当前日期前后三个月内，所乘坐的航班发生取消或延误超过15分钟以上等情况的航班信息下载功能。 
                            </div>
                        </div>
                        <div class="every-rules">
                            <div class="content">
                            3.此证明仅作为航班信息的证明，不作为旅客办理非自愿变更/退票操作的唯一依据，非自愿变更/退票应通过吉祥航空客服中心确认航班不正常信息后，据以办理非自愿手续。航班不正常信息发布之前的退座/退票，应按自愿变更/自愿退票收取相关费用。
                            </div>
                        </div>
                        <div class="every-rules">
                            <div class="content">
                            4.为保证查询结果的准确性，建议您航班计划起飞时间2小时后打印延误证明。
                            </div>
                        </div>
                        <div class="every-rules">
                            <div class="content">
                            5.“航班/取消延误证明”上有唯一编号，该编号可在“航班延误/取消证明验真”板块进行验证。
                            </div>
                        </div>
                        <div class="every-rules">
                            <div class="content">
                            6.如有疑问可拨打客服电话95520进行咨询。
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
    import {
        controller
    } from "common/logic/controller"
    import {
        saveLoginInfo
    } from 'common/logic/logic'
    import Page from 'common/deploy/page'
    import requesturl from 'common/deploy/requesturl'
    import {
        vilidation,
        urlParam,
        juneyaoair,
        dateFormat
    } from 'common/logic/utils'
    import {
        RegEnum,
        Verify,
        ResultCode
    } from 'common/logic/enum';

    export default {
        data() {
            return {
                //查询按钮
                search:'查询',
                pageData: {},
                TitleStyle: {
                    title: '航变电子证明申请',
                    titlestyle: 4,
                },
                // 输入框是否捕获焦点
                inputFocus_1: false,
                // 票号
                cardNum: "",
                // 航班日期
                flightTime:'',
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                // 禁止原生返回事件
                controller.clickBack(() => {
                    that.clickBackBtn();
                })
                that.init();
            })
        },
        components: {
            Header
        },
        methods: {
            
            // 初始化日期
            init(){
                var myDate = new Date();
                var year = myDate.getFullYear() + '';
                var month = myDate.getMonth() + 1 + '';
                var day = myDate.getDate() + '';
                this.flightTime = year + '-' + month + '-' + day;
            },
            // 点击返回按钮
            clickBackBtn() {
                controller.close({
                    flag: -3
                });
            },
            // 补零
            addZero(num){
                if(num<10){
                    return '0'+num;
                }else return num;
            },
            // 输入框是否捕获焦点
            clickInput(index) {
                this['inputFocus_' + index] = true;
            },
            inputBlur(index, event) {
                if (/^[\s]*$/.test(event.srcElement.value)) {
                event.srcElement.value = "";
                this['inputFocus_' + index] = false;
                }
            },
            deleteInput(index) {
                this.$refs['input_' + index].value = "";
                this['inputFocus_' + index] = false;
                if (index == 1) {
                this.cardNum = "";
                } else if (index == 2) {
                this.personName = "";
                }
            },
            // 票号证件号验证
            searchPlane() {
                var that = this;
                if (!this.canSearchPlane) {
                return;
                }
                if(juneyaoair.validateCertTicket(that.cardNum)){
                   that.searchByUrl();//验证完成查询
                }
            },
            //查询航班
            searchByUrl(){
                let that = this;
                let params = {
                            "request":{
                                        "passengerCard": this.cardNum,
                                        "flightDate": this.flightTime
                                    }
                            }
                            
                controller.getJSON({
                        method : 'POST',
                        url: requesturl.FLIGHTCHANGE.CHECKFLIGHT,
                        params: params
                })
                .then((data)=>{
                    if(data.resultCode === ResultCode.SUCCESS){
                        that.flight = data.objData;
                        let userMsg = {};
                        userMsg.flight = that.flight;
                        // 成功跳至申请页
                        controller.open({
                            winName: Page.flightChange.changeMsg.winName,
                            path: Page.flightChange.changeMsg.pageUrl,
                            data: userMsg,
                        });
                    } else{
                        controller.toast({str: data.resultInfo});
                    }
                })
                .catch((data)=>{
                    controller.toast({str: '网络出现问题，请重试'});
                })
            },
            //日期选择
            chooseDate(){
                if (!this.datePicker) {
                    this.datePicker = this.$createDatePicker({
                        title: '请选择日期',
                        min: this.minStartDate(),
                        max: this.maxStartDate(),
                        value: new Date(),
                        format: {
                            year: 'YYYY年',
                            month: 'MM月',
                            date: 'dd日'
                        },
                        onSelect: (data) => {
                            this.flightTime = dateFormat.getFormatDate(new Date(data), 'yyyy-MM-dd')
                        }
                    })
                }
                this.datePicker.show()
            },
            // 最小日期
            minStartDate() {
                return new Date(new Date().setMonth(new Date().getMonth() - 3))
            },
            // 最大日期
            maxStartDate() {
                return new Date(new Date().setMonth(new Date().getMonth() + 3))
            },
            // 获得周几日期
            getWeek(week){
                var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];  
                var myDate = new Date(Date.parse(week));
                this.myWeek = weekDay[myDate.getDay()];
            }
            
        },
        computed: {
            // 是否能查询航班
            canSearchPlane() {
                if (this.cardNum && this.flightTime) {
                    this.search = '查询航班';
                return true;
                } else {
                    this.search = '查询';
                return false;
                }
            },
            showDel(){
                if(this.cardNum != ''){
                    return true;
                }else{
                    return false;
                }
            }
        }
    };
</script>
