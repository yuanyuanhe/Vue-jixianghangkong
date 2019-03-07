<template>
    <div class="time-down">
        <div class="line-1 flexbox" @click="clickDetailBtn">
            <div class="money flex-1">
                <span class="name">订单金额</span>
                <span class="content">&yen;{{timeDownInfor.money}}</span>
            </div>
            <div class="detial-btn" >
                <span class="name">明细</span>
                <span class="img" :class="{'active': timeDownInfor.showDetail}"></span>
            </div>
        </div>
        <div class="line-2">请在<span class="img"></span><span class="time">{{lastTimeTxt}}</span> 内完成支付，以免耽误出行</div>
    </div>
</template>

<script>
    export default {
        props: {
            timeDownInfor: {
                type: Object,
                default: () => {
                    return {
                        money: "",
                        timeStamp: "",
                        showDetail: false
                    }
                }
            }
        },
        data() {
            return {
                lastTimeTxt: "",
                timmer: ""
            }
        },
        methods: {
            clickDetailBtn() {
                this.timeDownInfor.showDetail = ! this.timeDownInfor.showDetail;
                this.$emit("displayDetail",this.timeDownInfor.showDetail);
            },
            // 倒计时结束
            timeOut() {
                this.$emit("timeOut");
            },
            // 开始倒计时
            timeDown(time) {
                if (!time) {
                    return;
                }
                this.lastTimeTxt = this.dealTime(time);
                if (time > 0) {
                    this.timmer = setTimeout(() => {
                        time -= 1000;
                        if (time > 0) {
                            this.timeDown(time);
                        } else if (time <= 0) {
                            this.timeOut();
                        }
                    }, 1000);
                } else if (time <= 0) {
                    this.timeOut();
                }
            },
            // 处理毫秒值
            dealTime(time) {
                if(time< 0) {
                    return 0;
                }
                let minute = parseInt(time / 1000 / 60);
                let second = parseInt(time / 1000 - minute * 60);
                minute = this.prefixInteger(minute, 2);
                second = this.prefixInteger(second, 2);
                return minute + ':' + second;
            },
            // 处理分，秒位数
            prefixInteger(num, length) {
                return (Array(length).join('0') + num).slice(-length);
            },
        },
        watch: {
            timeDownInfor: {
                handler(newVal,oldVal) {
                    if(newVal.timeStamp && newVal.timeStamp != oldVal.timeStamp) {
                        clearTimeout(this.timmer);
                        this.timeDown(newVal.timeStamp);
                    }
                },
                deep: true
            }
        }
    }
</script>


<style lang="scss">
    @import "~common/styles/common/function.scss";
    @import "~common/styles/common/common.scss";
    .time-down {
        padding: 0 rem(30);
        height: rem(112);
        overflow: hidden;
        .line-1 {
            margin-top: rem(22);
            font-size: rem(28);
            line-height: rem(28);
            .money {
                font-weight: 600;
                .name {
                    color: #3A3D50;
                }
                .content {
                    margin-left: rem(16);
                    color: #CB9D6D;
                }
            }
            .detial-btn {
                color: #848484;
                span {
                    display: inline-block;
                }
                .name {
                    vertical-align: middle;
                }
                .img {
                    margin-left: rem(10);
                    width: rem(20);
                    height: rem(15);
                    vertical-align: middle;
                    @include bg("./imgs/icon_up.png");
                    transform: rotate3d(0, 0, 1, 180deg);
                    -webkit-transform: rotate3d(0, 0, 1, 180deg);
                    transition: all .3s;
                    &.active {
                        transform: rotate3d(0, 0, 1, 0);
                        -webkit-transform: rotate3d(0, 0, 1, 0);
                    }
                }
            }
        }
        .line-2 {
            margin-top: rem(14);
            font-size: rem(22);
            line-height: rem(22);
            color: #848484;
            span {
                display: inline-block;
                vertical-align: middle;
            }
            .img {
                margin: 0 rem(5);
                width: rem(22);
                height: rem(22);
                @include bg("./imgs/icon_clock.png");
            }
            .time {
                color: #CB9D6D;
            }
        }
    }
</style>
