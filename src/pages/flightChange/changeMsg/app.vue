<style lang="scss" scope>
    @import '~common/styles/common/common.scss';
    .container{
        padding: rem(10) rem(30) rem(60) rem(30);
        .plane-infor {
            padding: rem(30);
            overflow: hidden;
            .line-1 {
            &>div {
                padding: rem(2) rem(8);
                background: linear-gradient(324deg, rgba(225, 185, 113, 1) 0%, rgba(227, 205, 158, 1) 100%);
                @include border-radius(rem(4));
                font-size: rem(24);
                font-weight: 600;
                color: #fff;
            }
            .plane-num {
                margin-left: rem(10);
            }
            }
            .line-2 {
            margin-top: rem(4);
            .come-style {
                .add-day {
                height: rem(22);
                line-height: rem(22);
                font-size: rem(22);
                color: #3A3D50;
                font-weight: 600;
                }
                .time {
                font-size: rem(42);
                line-height: rem(42);
                color: #3A3D50;
                font-weight: 500;
                }
                .place {
                margin-top: rem(9);
                font-size: rem(24);
                line-height: rem(24);
                color: #848484;
                }
            }
            .end-wrap {
                .add-day {
                text-align: right;
                }
                .time {
                text-align: right;
                }
                .place {
                text-align: right;
                }
            }
            .fly-time {
                .time {
                margin-top: rem(21);
                font-size: rem(22);
                line-height: rem(22);
                color: #ADADAD;
                text-align: center;
                }
                .img {
                margin-top: rem(6);
                width: rem(178);
                height: rem(18);
                @include bg("./img/selectCabinLift_icon.png");
                }
                .pass-place {
                margin-top: rem(7);
                font-size: rem(20);
                line-height: rem(20);
                color: #CB9D6D;
                text-align: center;
                }
            }
            }
        }
        
        .container-style {
            margin-top: rem(20);
            background-color: #fff;
            @include border-radius(rem(6));
            box-shadow: 0 rem(-1) 0 0 rgba(244, 244, 244, 1);
        }

        .person-infor {
            .come-style {
                position: relative;
                padding: 0 rem(30);
                height: rem(112);
                label {
                    display: inline-block;
                    width: rem(166);
                    font-size: rem(28);
                    line-height: rem(112);
                    font-weight: 600;
                    color: #3A3D50;
                }
                input {
                    height: rem(40);
                    width: rem(450);
                    font-size: rem(28);
                    color: #3A3D50;
                }
            }
        }
    }
</style>
<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="TitleStyle"></Header>
        <div class="main mainHasBottom">
            <div class="container">
                <!-- 航班信息 -->
                <div v-for="(item, index) in flight" :key="index">
                    <div class="plane-infor container-style">
                        <div class="line-1 flexbox">
                            <div class="date">{{item.flightDate}} {{item.weekStr}}</div>
                            <div class="plane-num">{{item.flightNo}}</div>
                        </div>
                        <div class="line-2 flexbox">
                            <div class="start-wrap come-style flex-1">
                                <div class="add-day"></div>
                                <div class="time">{{item.depSpecificTime}}</div>
                                <div class="place">{{item.depAirportName+dealAir(item.depAirportTerminal)}}</div>
                            </div>
                            <div class="fly-time">
                            <!--经停机场，暂时没有-->
                            <!--<div class="pass-place" v-if="item.stopCity">经停{{item.stopCity}}</div> -->
                                <div class="time">{{dealFlyTime(item.flightTime)}}</div>
                                <div class="img"></div>
                                <div class="pass-place"></div>
                            </div>
                            <div class="end-wrap come-style flex-1">
                                <div class="add-day">{{item.days>0?'+1天':''}}</div>
                                <div class="time">{{item.arrSpecificTime}}</div>
                                <div class="place">{{item.arrAirportName+dealAir(item.arrAirportTerminal)}}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 航变原因 -->
                    <div class="person-infor container-style">
                        <div class="person-name come-style com-border-bottom">
                            <label for="changeReason">航变原因</label>
                            <input id="changeReason" type="text" readonly v-model="item.statusReason">
                        </div>
                    </div>
                </div>
                <div class="person-infor container-style">
                    <div class="person-name come-style com-border-bottom">
                        <label for="personName">乘机人</label>
                        <input id="personName" readonly type="text" v-model="personName">
                    </div>
                    <div class="person-id come-style ">
                        <label for="personMail">电子邮箱</label>
                        <input id="personMail" type="email" placeholder="请输入正确邮箱，用于接收航变证明" v-model="mail">
                    </div>
                </div>
                
            </div>
        </div>


        <!-- FOOTER -->
        <Footer>
            <!-- 灰色 g-disabled 橙色 g-btn  -->
            <button :class="submitBtnCls" slot="sureBtn" @click="sendMail">提交</button>
            
        </Footer>
    </div>
</template>

<script>
    import "common/tools/rem"
    import Header from "components/header.vue"
    import Footer from 'components/footer.vue'
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
        urlParam
    } from 'common/logic/utils'
    import {
        RegEnum,
        Verify,
        ResultCode
    } from 'common/logic/enum';

    export default {
        data() {
            return {
                reason:'',
                personName:'',
                mail:'',
                showListT:'提示',
                showListC:'您的航变证明已发送</br>请注意查收邮件',
                showListB:'知道了',
                pageData: {},
                TitleStyle: {
                    title: '航变电子证明申请',
                    titlestyle: 4,
                },
                flight:[]
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                that.flight = that.pageData.flight;//航班数据
                that.personName = that.flight[0].passengerName;
            })
        },
        components: {
            Header,Footer
        },
        methods: {
            // 点击返回按钮
            clickBackBtn() {
                controller.close();
            },
            // 处理飞行时长
            dealFlyTime(time) {
                let hour = parseInt(time / 1000 / 60 / 60);
                let minute = parseInt((time - hour * 60 * 60 * 1000) / 1000 / 60);
                return hour + 'h' + minute + 'm';
            },
            // 航站楼处理
            dealAir(port){
                if(port == "--"){
                    return '';
                }else{
                    return port;
                }
            },


            // 验证邮件格式
            sendMail() {
                let that = this;
                if (that.mail) {
                    let reg = RegEnum.properties[RegEnum.EMAIL].reg;
                    if(reg.test(that.mail)){
                        that.submitApply()
                    }else{
                        controller.toast({str: '请输入正确邮箱'});
                    }
                }
                
            },

            //提交成功弹框
            showList(){
                var that = this;
                controller.alert({
                    title: that.showListT,
                    content: that.showListC,
                    showClose: false,
                    alertBtn: that.showListB,
                    onClose: () => {
                        // console.log('删除按钮回调，不需要则不用传');
                    },
                    onConfirm: () => {
                        controller.close({
                            flag: -3
                        });
                    }
                })
            },
            // 发送邮件
            submitApply(){
                const that = this;
                that.proofResps = [];
                // 定义参数
                for(let i=0;i<that.flight.length;i++){
                    that.proofResps.push({
                                        "PassengerName":that.flight[i].passengerName,
                                        "FlightDate": that.flight[i].flightDate ,
                                        "dstCity": that.flight[i].dstCity,
                                        "dstEnCity": that.flight[i].dstEnCity,
                                        "idNo": that.flight[i].idNo,
                                        "idType": that.flight[i].idType,
                                        "orgCity": that.flight[i].orgCity,
                                        "orgEnCity": that.flight[i].orgEnCity,
                                        "flightNo": that.flight[i].flightNo,
                                        "DepTime": that.flight[i].depTime,
                                        "ArrTime": that.flight[i].arrTime,
                                        "ActDepTime": that.flight[i].actDepTime,
                                        "ActArrTime": that.flight[i].actArrTime,
                                        "SegmentStatus": that.flight[i].segmentStatus,
                                        "StatusReason": that.flight[i].statusReason ,
                                        "ArrAirportCode":that.flight[i].arrAirportCode,
                                        "DepAirportCode":that.flight[i].depAirportCode

                                    })
                }
                let params = {
                            "request": {
                                    "toMail": that.mail,
                                    "proofResps": that.proofResps,
                                    "type":"sendFlightChange"
                                },
                            }
                controller.getJSON({
                        method : 'POST',
                        url: requesturl.FLIGHTCHANGE.SENDMAIL,
                        params: params
                })
                .then((data)=>{
                    if(data.resultCode === ResultCode.SUCCESS){
                        that.showList();
                    }else{
                        controller.toast({str: '网络出现问题，请重试'});
                    }
                })
                .catch((data)=>{
                    controller.toast({str: '网络出现问题，请重试'});
                })
            }
        },
        computed: {
            // 底部提交按钮的状态判定
             submitBtnCls() {
                
                if (this.mail) {               
                    this.canClickBtn = true;
                    return 'g-btn'
                } else {
                    this.canClickBtn = false;
                    return 'g-disabled'
                }

                this.canClickBtn = true;
                return 'g-btn'

            },
        },
    };
</script>
