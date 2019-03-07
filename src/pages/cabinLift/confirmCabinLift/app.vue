<template>
  <div id="app">
    <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
    <div class="main mainHasBottom">
      <div class="main-wrap">
        <div class="plane-infor container-style">
          <div class="line-1 flexbox">
            <div class="date">{{currentCabinInfo.flightDate}} {{currentCabinInfo.flightWeek}}</div>
            <div class="plane-num">{{currentCabinInfo.flightNo}}</div>
          </div>
          <div class="line-2 flexbox">
            <div class="start-wrap come-style flex-1">
              <div class="add-day"></div>
              <div class="time">{{currentCabinInfo.deptTime}}</div>
              <div class="place">{{currentCabinInfo.deptCityName+currentCabinInfo.deptAirPortName+currentCabinInfo.deptTerminal}}</div>
            </div>
            <div class="fly-time">
              <div class="time">{{dealFlyTime(currentCabinInfo.flightTime)}}</div>
              <div class="img"></div>
              <div class="pass-place" v-if="currentCabinInfo.stopCity">经停{{currentCabinInfo.stopCityName}}</div>
            </div>
            <div class="end-wrap come-style flex-1">
              <div class="add-day">{{currentCabinInfo.days>0?'+1天':''}}</div>
              <div class="time">{{currentCabinInfo.arrTime}}</div>
              <div class="place">{{currentCabinInfo.arrCityName+currentCabinInfo.arrAirPortName+currentCabinInfo.arrTerminal}}</div>
            </div>
          </div>
        </div>
        <div class="person-infor container-style">
          <div class="person-name come-style com-border-bottom">
            <label for="personName">乘机人</label>
            <input id="personName" readonly type="text" v-model="personName">
          </div>
          <div class="person-id come-style ">
            <label for="personId">证件号</label>
            <input id="personId" readonly type="text" v-model="personId">
          </div>
        </div>
        <div class="can-up-cabin container-style">
          <div class="text">当前{{currentCabinInfo.cabinClassName}}({{currentCabinInfo.cabin}})，可升级至以下舱位</div>
          <div class="up-cabin-wrap flexbox">
            <div class="every-up-cabin" v-for="(item, index) in updateCabin" :key="'cabin'+index" :class="{'active': currentCabin == index, 'frame-border': currentCabin != index}" @click="clickUpCabin(index)">
              <div class="cabin-name">{{item.cabinName}}({{item.cabinCode}})</div>
              <div class="price">&yen;{{item.upgradeFee}}</div>
              <div class="select-tip"></div>
            </div>
          </div>
        </div>
        <div class="right-ticket-wrap container-style" v-if="allCabinTicket">
          <div class="display-wrap flexbox " @click="clickCabinTicket" :class="{'com-border-bottom': cabinTicketOpen}">
            <div class="name">升舱权益券</div>
            <div class="num flex-1">可用{{cabinNum}}张</div>
            <div class="btn" :class="{'active': cabinTicketOpen}"></div>
          </div>
          <div class="hidden-wrap" v-show="cabinTicketOpen">
            <div class="every-select-ticket com-border-bottom flexbox" @click="selectCabinTicket(index)" v-for="(item,index) in allCabinTicket" :key="'cabin'+index" v-if="displayMoreCabin(index)">
              <div class="img-wrap">
                <div class="img"></div>
              </div>
              <div class="ticket-infor flex-1">
                <div class="name">{{item.couponActivityName}}</div>
                <div class="number come-style flexbox">
                  <div class="name">券 号</div>
                  <div class="content">{{item.couponNo}}</div>
                </div>
                <div class="date come-style flexbox">
                  <div class="name">有效期</div>
                  <div class="content">{{item.usedStEndDt.split("~")[0]}}至{{item.usedStEndDt.split("~")[1]}}</div>
                </div>
              </div>
              <div class="select-btn" :class="{'active': currentCabinTicket == index}"></div>
            </div>
            <div class="more-btn" v-if="displayMoreBtn" @click="clickMoreBtn">查看更多</div>
          </div>
        </div>
        <div class="score-wrap container-style">
          <div class="display-wrap flexbox" :class="{'com-border-bottom' : isUseScore}">
            <div class="name">
              <span class="txt">积分</span>
              <span class="explain-btn" @click='displayScoreExplain'></span>
            </div>
            <div class="score-num flex-1">{{scoreDescribe}}</div>
            <div class="select-btn" :class="{active : isUseScore}" @click="selectUseScore"></div>
          </div>
          <div class="hidden-wrap" v-show="isUseScore">
            <div class="use-count come-style com-border-bottom ">
              <div class="input-wrap">
                <label for="score-count">使用额度</label>
                <input id="score-count" type="tel" placeholder="请输入使用积分额" pattern="[0-9]*" v-model="scoreObj.useScore">
              </div>
            </div>
            <div class="consume-password come-style flexbox">
              <div class="input-wrap">
                <label for="score-count">消费密码</label>
                <input type="password" placeholder="请输入消费密码" pattern="[0-9]*" v-model="password">
              </div>
              <div class="forget-btn" @click="forgetPassword">忘记密码</div>
            </div>
          </div>
        </div>
        <transition name="detailAnimate">
          <div class="detail-page" v-show='displayDetail' @click='clickDetailBtn'>
            <div class="detail-wrap">
              <div class="commodity-title every-detail  flexbox">
                <div class="txt flex-1">{{orderDetailName}}</div>
                <div class="content flex-1">{{orderDetailPrice}}</div>
              </div>
              <div class="use-score every-detail flexbox" v-show="scoreObj.useScore">
                <div class="txt flex-1">积分抵扣</div>
                <div class="content flex-1"><span>-&yen;</span>{{scoreObj.useScore}}</div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <Footer>
      <div class="buyBox flexbox" slot="sureBtn">
        <div class="money flex-1" @click='clickDetailBtn'>
          <span>总计：</span>
          <span class="symbol">￥</span>
          <span class="count">{{totalPrice}}</span>
          <div class="tip"></div>
          <span>明细</span>
        </div>
        <div class="buyBtn ratio-2" @click="goPay">去支付</div>
      </div>
    </Footer>
    <score-explain v-show='canDisplayExplain' @clickCloseBtn='closeScoreExplain' :isShow='canDisplayExplain'></score-explain>
  </div>
</template>

<script>
  import "common/tools/rem";
  import Header from "components/header.vue";
  import Footer from "components/footer.vue";
  import ScoreExplain from "components/scoreExplain.vue";
  import controller from "common/logic/controller";
  import requesturl from 'common/deploy/requesturl';
  import {
    getIsLogin,
    ruleScore
  } from "common/logic/logic";
  import service from "common/service/data";
  import {
    ResultCode,
    AllOrderType
  } from "common/logic/enum";
  import Page from "common/deploy/page";
  import {
    ChannelOrderNo
  } from "common/logic/utils";
  const AuthStatus = {
    AUTH_SUCC: 1,
    AUTH_FAIL: -1,
    NOT_AUTH: 0
  };
  export default {
    data() {
      return {
        // header 的样式
        isUseHeader: false,
        pageData: {},
        // 头部白色
        blankHeader: true,
        // 是否显示详情
        displayDetail: false,
        // 现在选中的舱位
        currentCabin: -1,
        // 升舱权益券展开
        cabinTicketOpen: false,
        // 现在选中的升舱权益券
        currentCabinTicket: -1,
        // 所有的权益券
        allCabinTicket: null,
        // 权益券的张数
        cabinNum: 0,
        // 第一次点开升舱权益券
        firstClickCabinTicket: true,
        // 点击更多优惠券按钮
        hasClickMoreBtn: false,
        // 展示更多的升舱券
        displayMoreTicket: false,
        personName: "",
        personId: "",
        // 可升级的舱位
        updateCabin: [],
        // 当前舱位信息
        currentCabinInfo: {},
        // 积分
        scoreObj: {
          allScore: -1,
          canUseScore: -1,
          useScore: ""
        },
        // 是否使用积分
        isUseScore: false,
        // 是否请求实名认证接口
        isGetAuthJson: false,
        // 认证状态
        authStatus: -2,
        // 积分密码
        password: "",
        // 是否显示积分说明
        canDisplayExplain: false,
        // 设置头部样式
        setTitleStyle: {
          title: '确认升舱信息',
          titlestyle: 4
        }
      };
    },
    components: {
      Header,
      Footer,
      ScoreExplain
    },
    created() {
      var that = this;
      controller.ready().then(data => {
        that.memberInfo = data.memberInfo || {};
        that.pageData = data.data;
        console.log(111);
        console.log(that.pageData);
        that.personName = that.pageData.personInfor.personName;
        that.personId = that.pageData.personInfor.personId;
        that.currentCabinInfo = that.pageData.searchResult[0];
        that.searchCabinPrice();
        that.getTotalScore();
        that.searchCabinTicket();
      });
    },
    methods: {
      // 获取总积分
      getTotalScore() {
        service
          .getTotalScore()
          .then(this.totalScoreSuccess)
          .catch(err => {
            console.log(err);
          });
      },
      // 获取总积分成功
      totalScoreSuccess(res) {
        if (res.resultCode === ResultCode.SUCCESS) {
          this.scoreObj.allScore = res.point - res.freezePoint;
        } else {
          controller.toast({
            str: res.resultInfo
          });
        }
      },
      // 显示积分说明页面
      displayScoreExplain() {
        this.canDisplayExplain = true;
      },
      // 关闭积分说明页面
      closeScoreExplain() {
        this.canDisplayExplain = false;
      },
      // 是否显示更多的权益券
      displayMoreCabin(index) {
        if (index >= 2 && !this.hasClickMoreBtn) {
          return false;
        } else {
          return true;
        }
      },
      // 处理飞行时长
      dealFlyTime(time) {
        let hour = parseInt(time / 1000 / 60 / 60);
        let minute = parseInt((time - hour * 60 * 60 * 1000) / 1000 / 60);
        return hour + 'h' + minute + 'm';
      },
      // 升舱券查询
      searchCabinTicket() {
        let that = this;
        controller
          .getJSON({
            method: "POST",
            url: requesturl.CABIN_LIFT.SEARCH_CABIN_TICKET,
            params: that.cabinTicketParams()
          })
          .then(that.cabinTicketSuccess)
          .catch(that.cabinTicketError);
      },
      // 查询升舱券接口参数
      cabinTicketParams() {
        return {
          request: {
            ffpCardNo: this.memberInfo.memberID,
            ffpId: this.memberInfo.id,
            loginKeyInfo: this.memberInfo.loginKeyInfo,
            flightInfoList: this.pageData.searchResult[0].flightInfoList,
            passengerInfoList: this.pageData.searchResult[0].passengerInfoList
          }
        };
      },
      cabinTicketSuccess(data) {
        if (data.resultCode == ResultCode.SUCCESS) {
          console.log(333);
          console.log(data);
          this.allCabinTicket = data.objData;
          this.cabinNum = this.allCabinTicket.length;
        } else {
          controller.toast({
            str: data.resultInfo
          });
        }
      },
      cabinTicketError() {
        controller.toast({
          str: "升舱券网络问题"
        });
      },
      // 升舱费用查询
      searchCabinPrice() {
        let that = this;
        controller
          .getJSON({
            method: "POST",
            url: requesturl.CABIN_LIFT.SEARCH_PRICE,
            params: that.searchParams()
          })
          .then(that.searchPriceSuccess)
          .catch(that.searchPriceError);
      },
      // 升舱费用查询参数
      searchParams() {
        return {
          request: {
            ffpCardNo: this.memberInfo.memberID,
            ffpId: this.memberInfo.id,
            loginKeyInfo: this.memberInfo.loginKeyInfo,
            ticketNo: this.pageData.personInfor.personId,
            passName: this.pageData.personInfor.personName,
            upPriceSegList: this.pageData.searchResult
          }
        };
      },
      // 升舱费用查询响应成功
      searchPriceSuccess(data) {
        if (data.resultCode == ResultCode.SUCCESS) {
          this.updateCabin = data.objData.aClassInfoList;
          console.log(222);
          console.log(this.updateCabin);
          if (this.updateCabin.length > 0) {
            this.currentCabin = 0;
          } else {
            controller.toast({
              str: "没有查询到可以升舱的舱位"
            });
          }
        } else {
          controller.toast({
            str: data.resultInfo
          });
        }
      },
      // 升舱费用查询响应失败
      searchPriceError() {
        controller.toast({
          str: "升舱费用网络问题"
        });
      },
      clickBackBtn() {
        controller.close();
      },
      // 点击详情按钮
      clickDetailBtn() {
        this.displayDetail = !this.displayDetail;
      },
      // 选择升舱券
      clickUpCabin(index) {
        this.currentCabin = index;
      },
      // 点击升舱权益券
      clickCabinTicket() {
        if (!this.allCabinTicket || this.allCabinTicket.length == 0) {
          return;
        }
        if (this.firstClickCabinTicket) {
          this.firstClickCabinTicket = false;
          this.currentCabinTicket = 0;
          this.isUseScore = false;
          this.scoreObj.useScore = 0;
        }
        this.cabinTicketOpen = !this.cabinTicketOpen;
      },
      // 选择升舱券
      selectCabinTicket(index) {
        this.currentCabinTicket = index;
      },
      // 点击更多升舱券
      clickMoreBtn() {
        this.hasClickMoreBtn = true;
      },
      // 选择使用积分
      selectUseScore() {
        if (this.currentCabinTicket !== -1) {
          controller.toast({
            str: "选择升舱权益券后不能使用积分"
          });
          return;
        }
        // 是否登录
        if (!getIsLogin(true)) {
          return;
        }
        // 是否请求实名认证接口
        if (!this.isGetAuthJson) {
          this.getAuthResult();
          return;
        }
        // 没有实名认证，提示让实名认证
        if (this.authStatus !== AuthStatus.AUTH_SUCC) {
          this.showModel(this.openAuthPage);
          return;
        }
        // 已经实名认证
        if (this.authStatus === AuthStatus.AUTH_SUCC) {
          // 没有请求到可用积分
          if (this.scoreObj.canUseScore === -1) {
            this.getIntegral();
          }
          // 请求到的可用积分是0
          if (this.scoreObj.canUseScore == 0) {
            return;
          }
          this.isUseScore = !this.isUseScore;
          if (!this.isUseScore) {
            this.scoreObj.useScore = "";
            this.password = "";
          }
        }
      },
      // 获取实名认证信息
      getAuthResult() {
        service
          .getAuthResult()
          .then(this.AuthSucBack)
          .catch(err => {
            console.log(err);
          });
      },
      AuthSucBack(data) {
        if (data.resultCode == ResultCode.SUCCESS) {
          this.isGetAuthJson = true;
          let resultData = data.objData;
          if (resultData.verifyStatus == AuthStatus.AUTH_SUCC) {
            this.authStatus = AuthStatus.AUTH_SUCC;
            this.getIntegral();
          } else {
            this.showModel(this.openAuthPage);
          }
        } else {
          controller.toast({
            str: data.resultInfo
          });
        }
      },
      // 获取积分
      getIntegral() {
        service
          .getUseIntegral()
          .then(this.integralSucBack)
          .catch(err => {
            console.log(err);
          });
      },
      integralSucBack(res) {
        if (res.resultCode === ResultCode.SUCCESS) {
          this.scoreObj.canUseScore = res.userScore;
          if (this.scoreObj.canUseScore == 0) {
            controller.toast({
              str: '暂无可用积分'
            });
            return;
          }
          this.isUseScore = !this.isUseScore;
        } else {
          controller.toast({
            str: res.resultInfo
          });
        }
      },
      // 显示弹框
      showModel(confirm) {
        let that = this;
        controller.confirm({
          title: "提示",
          message: "使用积分需实名认证，是否去实名认证？",
          buttons: ["考虑一下", "去认证"],
          onConfirm() {
            confirm();
          }
        });
      },
      // 打开实名认证页面
      openAuthPage() {
        let authPage = Page.my.auth;
        controller.open({
          winName: authPage.winName,
          path: authPage.pageUrl
        });
      },
      // 忘记密码
      forgetPassword() {
        // let authPage = Page.my.auth;
        // controller.open({
        //   winName: authPage.winName,
        //   path: authPage.pageUrl
        // });
        controller.forgetConsumerPwd();
      },
      // 去支付
      goPay() {
        if (!getIsLogin(true)) {
          return;
        }
        if (this.currentCabin == -1) {
          controller.toast({
            str: "请选择抵用券后再支付"
          });
          return;
        }
        if (this.isUseScore) {
          if (this.scoreObj.useScore > 0) {
            this.vilidatePassword();
          } else {
            controller.toast({
              str: "使用积分额必须大于0"
            });
          }
        } else {
          this.requestOrderData();
        }
      },
      // 验证密码
      vilidatePassword() {
        if (!this.password) {
          controller.toast({
            str: "请输入消费密码"
          });
          return;
        }
        const that = this;
        controller
          .getJSON({
            method: "POST",
            url: requesturl.VILIDATE_PASSWORD,
            params: that.vilidateParams()
          })
          .then(that.vilidateSucBack)
          .catch(that.vilidateErrBack);
      },
      vilidateParams() {
        return {
          channelCode: ChannelOrderNo(new Date()),
          id: this.memberInfo.id,
          loginKeyInfo: this.memberInfo.loginKeyInfo,
          pwd: this.password
        };
      },
      vilidateSucBack(result) {
        if (result.resultCode == ResultCode.SUCCESS) {
          this.requestOrderData();
        } else {
          controller.toast({
            str: result.errorInfo
          });
        }
      },
      vilidateErrBack() {
        controller.toast({
          str: "验证密码网络出错"
        });
      },
      requestOrderData() {
        let that = this;
        controller
          .getJSON({
            method: "POST",
            url: requesturl.CABIN_LIFT.CABIN_PAY,
            params: that.payParams()
          })
          .then(that.paySuccess)
          .catch(that.payError);
      },
      // 支付接口传参
      payParams() {
        let upFlightInfo = this.currentCabinInfo;
        upFlightInfo.upAVFlightInfoList = this.updateCabin[this.currentCabin].upAVFlightInfoList;
        upFlightInfo.upgradeFee = this.updateCabin[this.currentCabin].upgradeFee;
        if (this.currentCabinTicket != -1) {
          upFlightInfo.upCouponCode = this.allCabinTicket[this.currentCabinTicket].couponNo;
        }
        return {
          request: {
            ticketNo: this.pageData.personInfor.personId,
            passName: this.pageData.personInfor.personName,
            ffpCardNo: this.memberInfo.memberID,
            ffpId: this.memberInfo.id,
            loginKeyInfo: this.memberInfo.loginKeyInfo,
            channelOrderNo: ChannelOrderNo(new Date()),
            upFlightInfo: upFlightInfo,
            score: this.scoreObj.useScore,
            salePwd: this.password
          }
        };
      },
      // 支付成功
      paySuccess(result) {
        if (result.resultCode == ResultCode.SUCCESS) {
          let objData = result.objData;
          if (objData.payState) { //表示已经支付成功
            let payment = Page.myOrder.paySuccess;
            controller.open({
              winName: payment.winName,
              path: payment.pageUrl,
              data: {
                orderType: "upCabin",
                channelOrderNo: objData.channelOrderNo,
                orderNo: objData.orderNo
              },
              closeLastPage: true
            });
          } else { //跳转到支付页
            objData.orderType = AllOrderType.FLIGHT;
            let payment = Page.cabinLift.cabinPay;
            controller.open({
              winName: payment.winName,
              path: payment.pageUrl,
              data: objData,
              closeLastPage: true
            });
          }
        } else {
          controller.toast({
            str: result.resultInfo
          });
        }
      },
      // 支付失败
      payError() {}
    },
    computed: {
      // 是否有更多的按钮
      displayMoreBtn() {
        if (this.hasClickMoreBtn || this.cabinNum <= 2) {
          return false;
        }
        return true;
      },
      totalPrice() {
        if (this.currentCabin == -1) {
          this.isUseScore = false;
          this.scoreObj.useScore = 0;
          return 0;
        }
        if (this.currentCabinTicket !== -1) {
          return 0;
        }
        return this.updateCabin[this.currentCabin].upgradeFee - this.scoreObj.useScore;
      },
      orderDetailName() {
        if (this.currentCabin == -1) {
          return "";
        }
        if (this.currentCabinTicket == -1) {
          return "升舱差价";
        } else {
          return "头等舱权益券";
        }
      },
      orderDetailPrice() {
        if (this.currentCabin == -1) {
          return "";
        }
        if (this.currentCabinTicket == -1) {
          return '￥' + this.updateCabin[this.currentCabin].upgradeFee;
        } else {
          return "x1";
        }
      },
      scoreDescribe() {
        let describe = "";
        if (this.scoreObj.allScore > -1) {
          describe = "共" + this.scoreObj.allScore + "积分";
        }
        if (this.scoreObj.canUseScore > -1) {
          describe += " , 可用" + this.scoreObj.canUseScore + "积分";
        }
        return describe;
      }
    },
    watch: {
      scoreObj: {
        handler(val) {
          // 积分规则
          let myUseScore = ruleScore(val.useScore);
          if (myUseScore == "undefined") {
            return;
          } else if (myUseScore == 0 || myUseScore) {
            val.useScore = myUseScore;
          }
          if (val.canUseScore < 0) {
            return;
          }
          if (this.currentCabin == -1) {
            val.useScore = "";
            controller.toast({
              str: "请先选择抵用券"
            });
            return;
          }
          if (val.useScore < 0) {
            val.useScore = "";
            controller.toast({
              str: "使用积分额必须大于0"
            });
          } else if (val.useScore > val.canUseScore) {
            val.useScore = val.canUseScore;
            controller.toast({
              str: "使用积分额不能大于可使用积分"
            });
          }
          if (val.useScore > this.updateCabin[this.currentCabin].upgradeFee) {
            val.useScore = this.updateCabin[this.currentCabin].upgradeFee;
            controller.toast({
              str: "使用积分额不能大于购买产品的价格"
            });
          }
        },
        deep: true
      }
    }
  };
</script>

<style lang="scss">
  @import "~common/styles/common/common.scss";
  @import "~common/styles/common/mixin/layout.tlx";
  .main-wrap {
    width: rem(750);
    margin: 0 auto;
    padding: rem(18) rem(30) rem(60) rem(30);
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
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
    box-shadow: 0px -1px 0px 0px rgba(244, 244, 244, 1);
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
        width: rem(420);
        font-size: rem(28);
        color: #3A3D50;
      }
    }
  }
  .can-up-cabin {
    padding: rem(30);
    padding-right: 0;
    overflow: hidden;
    .text {
      font-size: rem(26);
      font-weight: 600;
      color: #3A3D50;
    }
    .up-cabin-wrap {
      margin-top: rem(30);
    }
    .every-up-cabin {
      position: relative;
      float: left;
      width: rem(200);
      height: rem(102);
      margin-right: rem(15);
      &.active {
        background-color: #FBEFD8;
        @include border-radius(rem(4));
        .select-tip {
          display: block;
        }
      }
      .cabin-name {
        margin-top: rem(20);
        font-size: rem(28);
        line-height: rem(28);
        color: #CB9D6D;
        text-align: center;
      }
      .price {
        margin-top: rem(10);
        text-align: center;
        font-size: rem(24);
        line-height: rem(24);
        color: #CB9D6D;
        text-align: center;
      }
      .select-tip {
        display: none;
        position: absolute;
        top: rem(-10);
        right: rem(-10);
        width: rem(32);
        height: rem(32);
        @include bg("./img/select.png");
      }
    }
  }
  .right-ticket-wrap {
    &>.display-wrap {
      position: relative;
      padding: 0 rem(30);
      height: rem(112);
      font-size: rem(28);
      line-height: rem(112);
      .name {
        font-weight: 600;
        color: #3A3D50;
      }
      .num {
        color: #CB9D6D;
        text-align: right;
      }
      .btn {
        margin-left: rem(31);
        height: rem(112);
        width: rem(24);
        @include bg2("./img/confirmCabinLift_arrow.png");
        transform: rotate3d(0, 0, 1, 180deg);
        transition: all .3s;
        &.active {
          transform: rotate3d(0, 0, 1, 0);
        }
      }
    }
    &>.hidden-wrap {
      .every-select-ticket {
        position: relative;
        padding: 0 rem(30);
        height: rem(156);
        .img {
          margin-top: rem(20);
          width: rem(48);
          height: rem(48);
          @include bg("./img/confirmCabinLift_vip.png");
        }
        .ticket-infor {
          margin-left: rem(20);
          &>.name {
            width: rem(492);
            margin-top: rem(30);
            font-size: rem(28);
            line-height: rem(28);
            color: #3A3D50;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .come-style {
            margin-top: rem(10);
            font-size: rem(24);
            line-height: rem(24);
            color: #848484;
            .name {
              width: rem(92);
            }
          }
        }
        .select-btn {
          width: rem(40);
          height: rem(156);
          @include bg2("./img/not_select.png");
          &.active {
            @include bg2("./img/select.png");
          }
        }
      }
      .more-btn {
        height: rem(80);
        line-height: rem(80);
        font-size: rem(28);
        text-align: center;
        color: #CCCCCC;
      }
    }
  }
  .score-wrap {
    .display-wrap {
      position: relative;
      padding: 0 rem(30);
      height: rem(112);
      .name {
        font-size: 0;
        span {
          display: inline-block;
        }
        .txt {
          font-size: rem(28);
          font-weight: 600;
          color: #3A3D50;
          line-height: rem(112);
          vertical-align: middle;
        }
        .explain-btn {
          margin-left: rem(10);
          width: rem(24);
          height: rem(24);
          vertical-align: middle;
          @include bg("./img/detail.png");
        }
      }
      .score-num {
        line-height: rem(112);
        text-align: right;
        font-size: rem(24);
        color: #848484;
      }
      .select-btn {
        margin-left: rem(24);
        width: rem(40);
        @include bg2("./img/not_select.png");
        &.active {
          @include bg2("./img/select.png");
        }
      }
    }
    .hidden-wrap {
      .come-style {
        height: rem(112);
        padding: 0 rem(30);
      }
      .input-wrap {
        height: rem(112);
        width: rem(518);
        label {
          display: inline-block;
          line-height: rem(112);
          width: rem(167);
          font-size: rem(28);
          font-weight: 600;
          color: #3A3D50;
        }
        input {
          width: rem(340);
          height: rem(40);
          font-size: rem(28);
          color: #3A3D50;
        }
      }
      .consume-password {
        .forget-btn {
          font-size: rem(28);
          line-height: rem(112);
          color: #848484;
        }
      }
    }
  }
  .detail-page {
    position: fixed;
    bottom: rem(120);
    top: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    .detail-wrap {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      @include box-sizing(border-box);
      padding: 0 rem(30);
      background: #fff;
      .every-detail {
        position: relative;
        padding: rem(40) 0;
        .content {
          text-align: right;
        }
      }
      .commodity-title {
        font-size: rem(26);
        line-height: rem(40);
        .txt {
          color: #25292f;
        }
        .content {
          color: #25292f;
          span {
            font-size: rem(22);
          }
        }
      }
      .use-score {
        font-size: rem(24);
        line-height: rem(24);
        .txt {
          color: #848484;
        }
        .content {
          color: #cb9d6d;
          span {
            font-size: rem(20);
          }
        }
      }
    }
  }
  input {
    @include inputPlaceholder(#CCCCCC);
  }
  .com-border-bottom {
    @include bd-bottom(#f4f4f4);
  }
  .frame-border {
    @include border(#EAEAEA, rem(4));
  }
  .style-ios {
    .com-border-bottom {
      @include bd-bottom-ios(#f4f4f4);
    }
    .frame-border {
      @include border-ios(#EAEAEA, rem(4));
    }
  }
  .detailAnimate-enter-active,
  .detailAnimate-leave-active {
    transition: all 300ms;
    .detail-wrap {
      transition: all 300ms;
    }
  }
  .detailAnimate-enter,
  .detailAnimate-leave-to {
    transform: translate3d(0, 0, 100%);
    .detail-wrap {
      transform: translate3d(0, 100%, 0);
    }
  }
</style>
