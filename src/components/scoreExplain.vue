<template>
        <transition  name='rules-page'>
            <div class="main mainNot">
                <div class="model">
                <!-- 证件类型说明 -->
                    <div class="m-explain">
                        <div class="mu-title">
                            积分使用说明
                        </div>
                        <div class="mu-con">
                            <p>1.1积分可以抵扣1元人民币。</p>
                            <p>2.积分可以抵扣吉祥航空机票机票、积分商城及部分允许兑换的其他产品或服务（如贵宾休息室）。</p>
                            <p>3.订单页面会提示可使用积分数，勾选使用可扣除对应的金额。</p>
                            <p>4.使用积分抵扣的部分均不提供发票。</p>
                        </div>
                    </div>
                </div>
                <span class="close-btn" @click='clickCloseBtn'>
                    <img src="./imgs/close.png" alt="">
                </span>
            </div>
        </transition>
</template>

<script>
import controller from "common/logic/controller";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    canShowBar: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 点击关闭按钮
    clickCloseBtn() {
      this.$emit("clickCloseBtn");
      if(this.canShowBar) {
        controller.showBar(1);
      }
    }
  },
  watch: {
    isShow(newVal, oldVal) {
      console.log("newVal:" + newVal + " oldVal:" + oldVal);
      if (newVal) {
        controller.hiddenBar(1);
      }
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../common/styles/common/_mixin.scss";
@import "../common/styles/common/function.scss";
body.style-ios {
  .main.mainNot,
  .rule-main {
    padding-top: rem(40);
  }
}
@supports (top: constant(safe-area-inset-top)) or (top: env(safe-area-inset-top)) {
  body.style-ios .main.mainNot,
  body.style-ios .rule-main {
    padding-top: calc(0.2rem + constant(safe-area-inset-top)) !important;
    padding-top: calc(0.2rem + env(safe-area-inset-top)) !important;
  }
}
.main {
  background: #fff;
  z-index: 100;
}
.model {
  display: block;
  background: #fff;
  .m-explain {
    padding: 0 rem(40) 0 rem(30);
    position: absolute;
    top: rem(179);
    bottom: rem(130);
    overflow: auto;
    padding-top: 0;
    height: auto;
    .mu-title {
      height: rem(48);
      font-size: rem(28);
      color: #3a3d50;
      line-height: rem(48);
    }
    .mu-con {
      margin-top: rem(20);
      p{
        font-size: rem(24);
        line-height: rem(32);
        color: #848484;
      }
    }
  }
}
.close-btn {
  position: fixed;
  bottom: rem(50);
  left: 50%;
  display: block;
  width: rem(80);
  margin: 0 auto;
  z-index: 100;
  img {
    width: 100%;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
  }
}
.rules-page-enter-active,
.rules-page-leave-active {
  transition: all 0.5s;
}
.rules-page-enter,
.rules-page-leave-to {
  transform: translate3d(0, 100%, 0);
}
</style>
