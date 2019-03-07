<template>
  <div id="app">
    <Header @clickHeader='clickBackBtn' :setTitleStyle="titleStyle"></Header>
    <div class="main">
      <div class="main-wrap">
        <div class="header-bg"></div>
        <div class="content-wrap">
          <div class="query-plane">
            <div class="input-wrap com-border-bottom flexbox" :class="{'active': inputFocus_1}">
              <div class="left-wrap flex-1">
                <label class="input-name" for="cad-num">乘机所持证件号/票号</label>
                <input type="text" id="cad-num" v-model="cardNum" ref="input_1" placeholder="" @focus="clickInput(1)" @blur="inputBlur(1 , $event)">
              </div>
              <div class="delete-btn" :class="{'active': displayDeleteBtn_1}" @click="deleteInput(1)"></div>
            </div>
            <div class="input-wrap com-border-bottom flexbox" :class="{'active': inputFocus_2}">
              <div class="left-wrap flex-1" >
                <label class="input-name" for="person-name">乘机人姓名,如吉祥,或JI/XIANG</label>
                <input type="text" id="person-name" v-model="personName" ref="input_2" @focus="clickInput(2)" @blur="inputBlur(2 , $event)">
              </div>
              <div class="delete-btn" :class="{'active': displayDeleteBtn_2}" @click="deleteInput(2)"></div>
            </div>
            <div class="query-btn " :class="{'no-search': !canSearchPlane}" @click="searchPlane">查询航班</div>
          </div>
          <div class="privilege-wrap">
            <div class="special-title">
              <div class="line-1">
                <span class="line"></span>
                <span class="name">升舱礼遇</span>
                <span class="line"></span>
              </div>
              <div class="line-2">升舱即可尊享头等舱贵宾特权</div>
            </div>
            <div class="all-privilege clearfix">
              <div class="every-privilege privilege-1">
                <div class="icon"></div>
                <div class="text">头等舱值机</div>
              </div>
              <div class="every-privilege privilege-2">
                <div class="icon"></div>
                <div class="text">贵宾休息室</div>
              </div>
              <div class="every-privilege privilege-3 no-margin">
                <div class="icon"></div>
                <div class="text">优先登机</div>
              </div>
              <div class="every-privilege privilege-4">
                <div class="icon"></div>
                <div class="text">静享真皮座椅</div>
              </div>
              <div class="every-privilege privilege-5">
                <div class="icon"></div>
                <div class="text">顶级客舱服务</div>
              </div>
              <div class="every-privilege privilege-6 no-margin">
                <div class="icon"></div>
                <div class="text">品味高端料理</div>
              </div>
            </div>
          </div>
          <div class="buy-rules">
            <div class="special-title">
              <div class="line-1">
                <span class="line"></span>
                <span class="name">购买须知</span>
                <span class="line"></span>
              </div>
            </div>
            <div class="rules-content">
              <div class="every-rules">
                <div class="title">1.适用旅客</div>
                <div class="content">
                  持吉祥航空实际承运的国内航线经济舱客票（票号“018”），在头等舱有空余座位（即F、P、A）的条件下可办理升舱。
                </div>
              </div>
              <div class="every-rules">
                <div class="title">2.支付方式</div>
                <div class="content">
                  在线支付、积分抵扣、升舱券抵扣。
                </div>
              </div>
              <div class="every-rules">
                <div class="title">3.头等舱权益</div>
                <div class="content">
                  升舱成功后免费行李额度、机场服务、机上服务、积分累计均按照头等舱标准执行。
                </div>
              </div>
              <div class="every-rules">
                <div class="title">4.暂不支持升舱的客票</div>
                <div class="content">
                  特价机票、团队机票、中转联程机票、免票、常旅客积分兑换机票（即机票舱位为：K、E、L、G、N、X）等目前不可在线办理此项业务，如需办理升舱业务可咨询客服热线95520。
                </div>
              </div>
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
  import {
    matchName,
    getIsLogin,
    saveLoginInfo
  } from "common/logic/logic.js";
  import {
    juneyaoair
  } from "common/logic/utils.js";
  import requesturl from 'common/deploy/requesturl';
  import {
    ResultCode
  } from "common/logic/enum";
  import Page from "common/deploy/page";
  export default {
    data() {
      return {
        pageData: {},
        // 头部是否透明
        isTransparent: true,
        // 输入框是否捕获焦点
        inputFocus_1: false,
        inputFocus_2: false,
        // 删除按钮显示
        displayDeleteBtn_1: false,
        displayDeleteBtn_2: false,
        // 票号
        cardNum: "",
        // 乘机人姓名
        personName: "",
        titleStyle: {
          title: '升舱',
          titlestyle: 3,
          isUseH5: true
        }
      };
    },
    components: {
      Header
    },
    created() {
      var that = this;
      controller.ready().then(data => {
        that.memberInfo = data.memberInfo || {};
        that.pageData = data.data;
        controller.onshow(function() {
          saveLoginInfo().then(memberInfo => {
            that.memberInfo = memberInfo;
          });
        });
      });
    },
    methods: {
      clickBackBtn() {
        controller.close();
      },
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
      // 查询航班
      searchPlane() {
        if (!this.canSearchPlane) {
          return;
        }
        if (!getIsLogin(true)) {
          return;
        }
        if (juneyaoair.validateNameAll(this.personName) && juneyaoair.validateCertTicket(this.cardNum)) {
          this.searchByUrl();
        }
      },
      // 调查询航班接口
      searchByUrl() {
        let that = this;
        controller
          .getJSON({
            method: "POST",
            url: requesturl.CABIN_LIFT.SEARCH_PLANE,
            params: that.searchParams()
          })
          .then(that.searchSuccess)
          .catch(that.searchError);
      },
      searchParams() {
        return {
          request: {
            ffpCardNo: this.memberInfo.memberID,
            ffpId: this.memberInfo.id,
            loginKeyInfo: this.memberInfo.loginKeyInfo,
            ticketNo: this.cardNum,
            passName: this.personName.toUpperCase()
          }
        };
      },
      searchSuccess(data) {
        if (data.resultCode == ResultCode.SUCCESS) {
          let searchResult = data.objData.upFlightInfoList;
          let transmitData = {};
          transmitData.searchResult = searchResult;
          transmitData.personInfor = {
            personName: this.personName,
            personId: this.cardNum
          }
          let jumpPage = null;
          if (searchResult.length == 1) {
            console.log(searchResult[0]);
            if (this.canUpCabin(searchResult[0])) {
              jumpPage = Page.cabinLift.confirmCabinLift;
            } else {
              controller.toast({
                str: "未查询到有效行程"
              });
              return;
            }
          } else if (searchResult.length > 1) {
            jumpPage = Page.cabinLift.selectCabinLift;
          }
          controller.open({
            winName: jumpPage.winName,
            path: jumpPage.pageUrl,
            data: transmitData,
            closeLastPage: false
          });
        } else {
          controller.toast({
            str: data.resultInfo
          });
        }
      },
      canUpCabin(infor) {
        if (infor.ifUp) {
          return true;
        }
        return false;
      },
      searchError() {
        controller.toast({
          str: "升舱查询航班网络问题"
        });
      }
    },
    computed: {
      // 是否能查询航班
      canSearchPlane() {
        if (!/^[\s]*$/.test(this.cardNum) && !/^[\s]*$/.test(this.personName)) {
          return true;
        } else {
          return false;
        }
      }
    },
    watch: {
      cardNum(newVal,oldVal) {//监听票号
        if(newVal) {
          this.displayDeleteBtn_1 = true;
        } else {
          this.displayDeleteBtn_1 = false;
        }
      },
      personName(newVal,oldVal) {//监听乘机人姓名
        if(newVal) {
          this.displayDeleteBtn_2 = true;
        } else {
          this.displayDeleteBtn_2 = false;
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~common/styles/common/common.scss";
  @import "~common/styles/common/mixin/layout.tlx";
  .main-wrap {
    position: relative;
    width: rem(750);
    margin: 0 auto;
  }
  .header-bg {
    height: rem(567);
    @include bg("./img/cabinLift_bg.png");
  }
  .content-wrap {
    position: absolute;
    top: rem(458);
    left: rem(30);
    width: rem(690);
    padding-bottom: rem(79);
    .query-plane {
      box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.02);
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
        }
        .delete-btn {
          visibility: hidden;
          width: rem(24);
          height: rem(112);
          margin-right: rem(20);
          @include bg2("./img/cabinLift_close_1.png");
          transition: all .1s;
          &.active {
            visibility: visible;
          }
        }
        .input-name {
          position: absolute;
          width: 100%;
          top: rem(42);
          font-size: rem(28);
          line-height: rem(28);
          color: #CCCCCC;
          transition: all .1s;
        }
        input {
          margin-top: rem(43);
          width: 80%;
          height: rem(68);
          font-size: rem(28);
          color: #3A3D50;
          transition: all .1s;
        }
      }
      .query-btn {
        margin-top: rem(30);
        height: rem(88);
        line-height: rem(88);
        text-align: center;
        background: linear-gradient(270deg, rgba(225, 185, 113, 1) 0%, rgba(227, 205, 158, 1) 100%);
        box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.08);
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
    .privilege-wrap {
      margin-top: rem(50);
      .all-privilege {
        margin-top: rem(30);
        .every-privilege {
          float: left;
          width: rem(210);
          height: rem(250);
          margin: 0 rem(30) rem(30) 0;
          &.privilege-1 {
            @include bg("./img/cabinLift_bg_1.png");
          }
          &.privilege-2 {
            @include bg("./img/cabinLift_bg_2.png");
          }
          &.privilege-3 {
            @include bg("./img/cabinLift_bg_3.png");
          }
          &.privilege-4 {
            @include bg("./img/cabinLift_bg_1.png");
          }
          &.privilege-5 {
            @include bg("./img/cabinLift_bg_2.png");
          }
          &.privilege-6 {
            @include bg("./img/cabinLift_bg_3.png");
          }
          .icon {
            margin-top: rem(30);
            height: rem(88);
          }
          .text {
            margin-top: rem(30);
            font-size: rem(28);
            color: #3A3D50;
            text-align: center;
          }
          &.no-margin {
            margin-right: 0;
          }
        }
        .privilege-1 {
          .icon {
            @include bg1("./img/cabinLift_icon_1.png");
          }
        }
        .privilege-2 {
          .icon {
            @include bg1("./img/cabinLift_icon_2.png");
          }
        }
        .privilege-3 {
          .icon {
            @include bg1("./img/cabinLift_icon_3.png");
          }
        }
        .privilege-4 {
          .icon {
            @include bg1("./img/cabinLift_icon_4.png");
          }
        }
        .privilege-5 {
          .icon {
            @include bg1("./img/cabinLift_icon_5.png");
          }
        }
        .privilege-6 {
          .icon {
            @include bg1("./img/cabinLift_icon_6.png");
          }
        }
      }
    }
    .buy-rules {
      margin-top: rem(60);
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
  .com-border-bottom {
    @include bd-bottom(#EBECEE);
  }
  .style-ios {
    .com-border-bottom {
      @include bd-bottom-ios(#EBECEE);
    }
  }
</style>
