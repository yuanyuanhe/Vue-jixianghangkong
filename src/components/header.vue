<template lang="html">
  <header class="g-header" 
  :class="{fixed: titleObj.titlestyle == 3,hasMainTop: (!!titleObj.titlestyle&&titleObj.titlestyle != 3)}"
  v-if="titleObj.titlestyle!=null && titleObj.titlestyle!=undefined && titleObj.titlestyle!=0">
    <div class="f-fx clearfix" 
    :class="Object.assign(classObject, titleObj.titleClass)"
    >
        <a class="goBack" :class="{close: titleObj.closetype == 1}" href="javascript:;" @click='clickBack'></a>
        <div class="title-wp">
          <div class="u-txt">{{ titleObj.title }}</div>
        </div>
        <a href="javascript:;" class="skip" @click='clickSkip' v-if="titleObj.navRightItem">
          <span v-if="titleObj.navRightItem == 1"></span><i class="iconfont" :class="titleObj.iconClass" v-if="titleObj.iconClass || titleObj.rightIcon" style="line-height: inherit;" v-html="titleObj.rightIcon"></i>
          <span v-if="titleObj.navRightItem == 2">{{ titleObj.navRightTitle }}</span>
        </a>
    </div>
  </header>
</template>

<script>
import { urlParam } from '../common/logic/utils'
import device from '../common/logic/device'
  export default {
    props: {
      /*
      * titleObj 默认title信息
      * {barStyle} 设置ios状态栏文字颜色  0: 黑色  1：白色
      * {titlestyle}  title样式 0：没有头部 1：红色渐变(默认) 2：暂无 3：透明头部  4: 白色头部
      * {title}  title内容
      * {navRightItem}  title右侧icon（仅 titlestyle == 3）  0：没有 1：分享按钮 2：文字
      * {navRightTitle}  title右侧文字
      * 
      * {closetype} 返回按钮 0: 默认关闭样式 1:叉号
      * {isUseH5} true: 使用H5头部 false: 不使用H5头部
      * 
      * {rightIcon} String 右侧icon（unicode）
      * {iconClass} String 右侧icon（font-class）
      * 
      * {titleClass} Object {类名: true/false} true 为添加类名
      */
      setTitleStyle: {
        type: Object,
        default() {
          return {
            isUseH5: false
          }
        }
      }
    },
    computed: {
      classObject() {
        return {
          transparent: this.titleObj.titlestyle == 3,
          white: this.titleObj.titlestyle == 4
        }
      }
    },
    watch: {
      setTitleStyle: {
        handler (newVal) {
          console.log(newVal);
          if(device.isApp &&  !newVal.isUseH5){
            return;
          }
          this.titleObj = newVal;
          this.onParentTitleStyle();
        },
        deep:true
      }
    },
    data(){
      return {
        titleObj: {}
      }
    },
    created() {
      // 不是app 或者 强制使用 H5
      if(!device.isApp || this.setTitleStyle.isUseH5){
        // 默认从url取设置信息
        this.titleObj.titlestyle = urlParam('titlestyle');
        this.titleObj.title = urlParam('title');
        this.titleObj.navRightItem = urlParam('navRightItem');
        this.titleObj.navRightTitle = urlParam('navRightTitle');
        if(this.titleObj.navRightTitle){
          this.titleObj.navRightTitle = decodeURIComponent(this.titleObj.navRightTitle);
        }
        if(this.titleObj.title){
          this.titleObj.title = decodeURIComponent(this.titleObj.title);
        }
        // 父组件覆盖当前内容
        Object.assign(this.titleObj, this.setTitleStyle);
      }
      this.onParentTitleStyle();
    },
    methods: {
      clickBack() {
        this.$emit('clickHeader');
      },
      clickSkip() {
        this.$emit('clickSkip');
      },
      // 通知父组件当前style样式
      onParentTitleStyle() {
          this.$emit('h5TitleStyle', this.titleObj, !!this.titleObj.titlestyle);
      }
    }
  }
</script>


<style lang="scss">
  @import '../common/styles/slice_sass/header';
  @import '../common/styles/common/iconfont';
  .hasMainTop + .main {
    top: rem(88)!important;
  }
  .style-ios {
    .hasMainTop + .main {
      top: rem(120)!important;
    }
    @supports (top: constant(safe-area-inset-top)) or (top: env(safe-area-inset-top)) {
      .hasMainTop + .main {
        top: rem(80)!important;
        padding-top: constant(safe-area-inset-top) !important;
        padding-top: env(safe-area-inset-top) !important;
      }
    }
  }
</style>
