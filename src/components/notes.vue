<template>
        <transition  name='rules-page'>
            <div class="main mainNot">
                    <div class="rule-head">
                        {{rulesInfo.title}}
                    </div>
                    <div class="rule-main">
                        <div class="rule-info" v-for='(item, index) in rulesInfo.content' :key='index'>
                            <div class="rule-title">{{item.title}}</div>
                             <div class="rule-title">{{item.text}}</div>
                            <div class="rule-txt">
                                <p v-for='content in item.cont' :key='content.title'>{{content}}</p>                               
                            </div>
                             <span>{{item.txt}}</span>
                        </div>
                    </div>
                    <div class="rule-foot">
                        <a href="javascript:;" class="close-btn" @click='clickCloseBtn'>
                            <!-- <img src="imgs/close.png" alt=""> -->
                        </a>
                    </div>
            </div>
        </transition>
</template>

<script>
    import controller from 'common/logic/controller'
    export default {
        props: {
            rulesInfo: {
                type: Object,
                default: function() {
                    return {
                        title: '',
                        content: []
                    }
                }
            },
            isShow: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            // 点击关闭按钮
            clickCloseBtn() {
                this.$emit('clickCloseBtn');
                controller.showBar(1);
            }
        },
        watch: {
            isShow (newVal, oldVal) {
                console.log('newVal:' + newVal + ' oldVal:' + oldVal);
                if(newVal){
                        controller.hiddenBar(1);
                }
            }
        }
    }
</script>


<style lang="scss" scoped>
    @import '../common/styles/common/_mixin.scss';
    @import '../common/styles/common/function.scss';
    .main {
     background:#fff;
      z-index: 1000;
    }
    body.style-ios {
        .main.mainNot,
        .rule-main {
            padding-top: rem(40);
        }
    }
    @supports (top: constant(safe-area-inset-top)) or (top: env(safe-area-inset-top)) {
        body.style-ios .main.mainNot,
        body.style-ios .rule-main{
            padding-top: calc(0.2rem + constant(safe-area-inset-top)) !important;
            padding-top: calc(0.2rem + env(safe-area-inset-top)) !important;
        }
    }
    .rules-page-enter-active, .rules-page-leave-active {
        transition: all 0.5s
    }
    .rules-page-enter, .rules-page-leave-to {
        transform: translate3d(0, 100%, 0)
    }
    .container {
        padding: 0 rem(30);
        color: #3A3D50;
        font-weight: 700;
    }
    .rule-head {
        margin: rem(67) 0;
        @include textAlign(center);
        font-size: rem(36);
        color:#25292F;
        font-weight:600;
    }
    .rule-main {
        position: absolute;
        top: rem(179);
        bottom: rem(200);
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        padding: 0 .3rem;
    }
    .rule-info {
        margin-bottom: rem(40);
        font-weight:400;
        .rule-title {
            font-size: rem(28);
        } 
        .rule-txt {
            margin-top:rem(40);
            margin-bottom:rem(25);
            font-size: rem(24);
            color: #848484;
            line-height: rem(34);
            
        }
        span{
           color:#848484;
        }
    }
    .rule-foot {
        width: 100%;
        position: fixed;
        bottom: rem(50);
        text-align: center;
        .close-btn {
            display: inline-block;
            width: .8rem;
            height: .8rem;
            background: url('imgs/close.png') no-repeat center;
            background-size: 100%;
        }
    }
</style>
