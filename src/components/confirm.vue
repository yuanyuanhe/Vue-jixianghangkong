<template>
    <div class="model" v-show="canConfirm">
        <div class="prompt center-block">
            <div class="p-head">{{title}}</div>
            <div class="p-main">
                <p>{{content}}</p>
            </div>
            <div class="p-foot flexbox">
                <button class="consider flex-1" @click="clickBtn1">{{buttons[0]}}</button>
                <div class="line"></div>
                <button class="sure flex-1" @click="clickBtn2">{{buttons[1]}}</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: '提示'
            },
            content: {
                type: String,
                default: ''
            },
            buttons: {
                type: Array,
                default: function () {
                    return ['考虑一下','确定']
                }
            }
        },
        data() {
          return {
              canConfirm: false
          }
        },
        methods: {
            clickBtn2() {
                this.canConfirm = false;
                this.$emit('clickBtn2');
            },
            clickBtn1() {
                this.canConfirm = false;
                this.$emit('clickBtn1');
            }
        }
    }
</script>

<style lang="scss">
    @import '../common/styles/common/_mixin.scss';
    @import '../common/styles/common/function.scss';
    .model {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 9, .3);
        z-index: 100;
    }

    .prompt {
        width: rem(540);
        background: #fff;
        @include border-radius(rem(6));
        margin-top: 50%;
        @include textAlign(center);
        overflow: hidden;
        .p-head {
            height: rem(100);
            line-height: rem(100);
            font-size: rem(32);
            color: #3A3D50;
        }
        .p-main {
            padding: rem(88) rem(72);
            p {
                font-size: rem(28);
                color: #878E99;
            }
        }
        .p-foot{
            height: rem(90);
            line-height: rem(90);
            @include bd-top(#CFD2DA);
            .style-ios & {
                @include bd-top-ios(#CFD2DA);
            }
            color: #ADADAD;
            .line{
                height: rem(50);
                margin-top: rem(20);
                @include bd-left(#CFD2DA);
                .style-ios & {
                    @include bd-left-ios(#CFD2DA);
                }
            }
            button{
                background: #fff;
                font-size: rem(28);
            }
            .sure{
                color: #CB9D6D;
            }
        }
    }
</style>
