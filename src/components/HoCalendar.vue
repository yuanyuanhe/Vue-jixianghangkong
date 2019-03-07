<template>
    <transition name='selectwrap'>
        <div id="calendar" class="calendar-select">
            <Header @clickHeader="clickBack" :setTitleStyle="titleStyle"></Header>
            <div class="date-title flexbox">
                <div class="flex-1">日</div>
                <div class="flex-1">一</div>
                <div class="flex-1">二</div>
                <div class="flex-1">三</div>
                <div class="flex-1">四</div>
                <div class="flex-1">五</div>
                <div class="flex-1">六</div>
            </div>
            <div class="main mainNotBottom">
                <div class="calendar-container">
                    <div class="date-container nextmonth" 
                        v-for="(item, index) in dateArr" 
                        :key="index">
                        <div class="date-header">{{item.year}}年{{item.month}}月</div>
                        <div class="date-board">
                            <div v-for="i in new Date(item.year, item.month-1, 1).getDay()" :key="-i"></div>
                            <div class="date-block" 
                                :class="{todayBlock: isClickFun(index, i)}"
                                v-for="i in getMonthDayByMonthYear(item.month, item.year)"
                                @click.stop="currentClick(item.year, item.month, i, !isClickFun(index, i))"
                                :key="i">
                                <span>{{ i }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import "common/tools/rem"
    import Header from "components/header.vue"
    import { controller } from "common/logic/controller"
    import { dateFormat } from "common/logic/utils"
    
    // 传入的开始日期和结束日期可以跨一年（如：2018-01-01 到 2019-12-30）  
    // 不可以跨两年（如2018-12-12 到 2020-01-30  是不可以的）   
    // 选中后回调函数中数据
    // date: Array [year, month, day, week]
    // month: 月份不需要加1  
    // week: 0-6（周天-周六）
    export default {
        props: {
            dateObj: {
                type: Object,
                default: () => {
                    return {
                        start: new Date(),
                        end: new Date()
                    }
                }
            },
            isShow: {
                type: Boolean,
                default: false
            },
            isShowBar: {//是否显示头部
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // 头部信息
                titleStyle: {
                    isUseH5: true,
                    title: '选择日期',
                    titlestyle: 4
                },
                dateFormat: dateFormat,
                dateArr: [],
                isClick: []
            }
        },
        created() {
            this.totalMonthFun();
        },
        methods: {
            // 判断哪些日期不可选
            isClickFun(index, i){
                return (index == (this.dateArr.length - 1) && i > dateFormat.formatIOSDate(this.dateObj.end).getDate()) || 
                                    (index == 0 && i < dateFormat.formatIOSDate(this.dateObj.start).getDate())
            },
            // 选择后回调
            currentClick(year, month, day, isClick) {
                let week = dateFormat.formatIOSDate(`${year+'-'+month+'-'+day}`).getDay();
                if(isClick) {
                    this.$emit('clickDate', [year, month, day, week])
                }
            },
            // 点击返回按钮
            clickBack() {
                this.$emit('clickBack');
                if(this.isShowBar) {
                    controller.showBar(1);
                }
            },
            totalMonthFun() {
                let startY = dateFormat.formatIOSDate(this.dateObj.start).getFullYear();
                let endY = dateFormat.formatIOSDate(this.dateObj.end).getFullYear();
                let startM = dateFormat.formatIOSDate(this.dateObj.start).getMonth() + 1;
                let endM = dateFormat.formatIOSDate(this.dateObj.end).getMonth() + 1;
                let yCha = endY - startY;
                for(let i = 0; i <= yCha; i++){
                    if(i == 0) {
                        for(let k = startM; k <= 12; k++) {
                            this.dateArr.push({
                                year: startY + i,
                                month: k % 12 ? k % 12 : 12
                            })
                        }
                    }
                    if( i > 0) {
                        for(let k = 1; k <= (i * 12 - startM + endM) && k <= endM; k++) {
                            this.dateArr.push({
                                year: startY + i,
                                month: k % 12 ? k % 12 : 12
                            })
                        }
                    }
                }
                console.log(this.dateArr);
            },
            getMonthDayByMonthYear(month, year) { // 获取某年某月的天数
                // 判断是否为闰年
                const isLeap = (year % 100 === 0) ? (year % 400 === 0 ? 1 : 0) : (year % 4 === 0) ? 1 : 0
                const monthDay = [31, 28 + isLeap, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] // 数组中的每一项代表每个月的天数
                return monthDay[month-1]
            },
        },
        watch: {
            isShow(newVal, oldVal) {
                console.log('newVal:' + newVal + ' oldVal:' + oldVal);
                if(newVal&&this.isShowBar){
                    controller.hiddenBar(1);
                }
            }
        },
        components: {
            Header
        },
    }
</script>

<style lang="scss" scoped>
    @import '~common/styles/common/common'; // 动画
    .selectwrap-enter-active,
    .selectwrap-leave-active {
        transition: all 400ms;
    }

    .selectwrap-enter,
    .selectwrap-leave-to {
        transform: translate3d(0, 100%, 0);
    } // 盒子
    .style-ios .calendar-select {
        padding-top: 0.4rem;
    }

    @supports (top: constant(safe-area-inset-top)) or (top: env(safe-area-inset-top)) {
        .style-ios .calendar-select {
            padding-top: constant(safe-area-inset-top) !important;
            padding-top: env(safe-area-inset-top) !important;
        }
        .main {
            .style-ios & {
                top: rem(128);
                padding-top: constant(safe-area-inset-top) !important;
                padding-top: env(safe-area-inset-top) !important;
            }
        }
    }
    .calendar-select {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        background: #F7F7F7;
    }
    body.style-ios header.g-header {
        height: rem(120);
    }
    header.g-header .f-fx {
        box-shadow: none;
        body.style-ios & {
            box-shadow: none;
            padding-top: rem(40);
        }
    } // 内容
    .date-title {
        height: rem(48);
        line-height: rem(48);
        text-align: center;
        background: #FBEFD8;
        color: #CB9D6D;
        font-size: rem(18);
        width: 100%;
    }

    .main {
        overflow-y: auto;
    }
    .main {
        top: rem(136);
        .style-ios & {
            top: rem(168);
        }
    }

    .calendar-container {
        overflow-y: scroll;
        overflow-scrolling: touch;
        .date-container {
            margin-bottom: rem(20);
            background-color: #fff;
            &:last-child {
                margin-bottom: 0;
            }
            .date-header {
                text-align: center;
                padding: rem(30) 0;
                color: #3A3D50;
                font-size: rem(34);
            }
            .date-board {
                display: flex;
                display: -webkit-flex;
                flex-wrap: wrap;
                -webkit-flex-wrap: wrap;
                text-align: center;
                div {
                    width: calc(100%/7);
                    height: rem(98);
                    line-height: rem(98);
                    font-size: rem(28);
                    color: #3A3D50;
                }
                .todayBlock {
                    span {
                        color: #ADADAD;
                    }
                }
            }
        }
    }

    .fold-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: .10rem;
        color: #0893FF;
        border-bottom: .01rem solid #d1d1d1;
        .topArrow {
            font-size: 0;
            line-height: 0;
            margin-left: .10rem;
            border: .05rem solid;
            border-color: transparent transparent #0893FF transparent;
        }
        .bottomArrow {
            font-size: 0;
            line-height: 0;
            margin-left: .10rem;
            border: .05rem solid;
            border-color: #0893FF transparent transparent transparent;
        }
    }
</style>