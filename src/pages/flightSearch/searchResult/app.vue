<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
        <div class="main">
            <div class="main-wrap">
                <div class="every-result" v-for="(item,index) in pageNeedInfo" :key="'list'+index" @click="jumpPage(item)">
                    <div class="line-1"><span>{{item.flight_date}}</span>&nbsp;|&nbsp;<span>{{item.flight_no}}</span>&nbsp;|&nbsp;<span>{{item.airPortInfo}}</span></div>
                    <div class="plane-infor flexbox">
                        <div class="left-wrap come-style flex-1">
                            <div class="time">{{getSpecificTime(item.std)}}</div>
                            <div class="place">{{item.departure_city}}{{item.depAirPortName}}{{item.flightHTerminal}}</div>
                        </div>
                        <div class="middle-wrap flexbox justify-content align-items" :class="[flyStateClass(item.flight_status)]">
                            <div class="current-state">
                                <div class="text">{{item.flight_status}}</div>
                            </div>
                            <div class="line"></div>
                        </div>
                        <div class="right-wrap come-style flex-1">
                            <div class="time">{{getSpecificTime(item.sta)}}</div>
                            <div class="place">{{item.arrival_city}}{{item.arrAirPortName}}{{item.flightTerminal}}</div>
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
                // 航班列表
                pageNeedInfo: []
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                console.log(that.pageData);
                that.pageNeedInfo = that.pageData.flightList;
                that.setTitleStyle.title = that.pageData.headerTitle;
            });
        },
        components: {
            Header
        },
        methods: {
            // 需要的起飞，到达时间
            needFlyArrTime(item,type) {
                let status = item.flight_status;
                if(type == 0) {//起飞时间
                    if(status == "起飞" || status == "到达" || status == "备降") {  
                        return item.atd;
                    } else {
                        return item.std;
                    }
                } else if(type == 1) {//到达时间
                    if(status == "到达") {
                        return item.ata;
                    } else {
                        return item.sta;
                    }
                }
            },
            // 点击跳转页面
            jumpPage(transData) {
                let jumpPage = Page.flightDynamic.flightDynamic;
                controller.open({
                    winName: jumpPage.winName,
                    path: jumpPage.pageUrl,
                    data: transData,
                    closeLastPage: false
                });
            },
            // 获取具体时间
            getSpecificTime(time) {
                if(!time) {
                    return "--";
                }
                let separateTime = time.split(" ")[1].split(":");
                return separateTime[0] + ":" + separateTime[1];
            },
            // 飞行状态css类名
            flyStateClass(state) {
                let className = "type-1"
                if(state == "取消") {
                    className = "type-2";
                }
                if(state == "延误") {
                    className = "type-3";
                }
                return className;
            },
            clickBackBtn() {
                controller.close();
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "~common/styles/common/common.scss";
    @import "~common/styles/common/mixin/layout.tlx";
    .main-wrap {
        padding: rem(10) rem(30) rem(96) rem(30);
        .every-result {
            margin-top: rem(20);
            padding: rem(30);
            box-shadow: 0px rem(6) rem(10) 0px rgba(0, 0, 0, 0.02);
            @include border-radius(rem(6));
            background-color: #fff;
            .line-1 {
                color: #ADADAD;
                font-size: rem(24);
                line-height: rem(24);
            }
            .plane-infor {
                margin-top: rem(36);
                .come-style {
                    .time {
                        color: #3A3D50;
                        font-size: rem(42);
                        line-height: rem(42);
                        font-weight: 500;
                    }
                    .place {
                        margin-top: rem(9);
                        font-size: rem(24);
                        line-height: rem(24);
                        color: #848484;
                    }
                }
                .right-wrap {
                    .time {
                        text-align: right;
                    }
                    .place {
                        text-align: right;
                    }
                }
                .middle-wrap {
                    position: relative;
                    width: rem(219);
                    .current-state {
                        position: relative;
                        height: rem(48);
                        @include border-radius(rem(24));
                        z-index: 10;
                        .text {
                            padding: 0 rem(20);
                            height: rem(48);
                            line-height: rem(48);
                            font-size: rem(28);
                            @include border-radius(rem(24));
                        }
                    }
                    .line {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: rem(219);
                        height: rem(18);
                        z-index: 5;
                        transform: translate3d(-50%,-50%,0);
                    }
                    &.type-1 {
                        .text {
                            background-color: #D8F5EE;
                            color: #1DC1AF;
                        }
                        .line {
                            @include bg("./img/line-type-1.png");
                        }
                    }
                    &.type-2 {
                        .text {
                            background-color: #FDECEC;
                            color: #F04741;
                        }
                        .line {
                           @include bg("./img/line-type-2.png");
                        }
                            
                    }
                    &.type-3 {
                        .text {
                            background-color: #FFEACC;
                            color: #FE9500;
                        }
                        .line {
                           @include bg("./img/line-type-3.png");
                        }
                    }
                }
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
