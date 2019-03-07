<template>
	<div id="app">
		<Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
		<div class="main mainHasBottom" >
			<div class="main-wrap">
				<div class="banner">
					<img src="./img/cabinLiftTicket_bg.png" alt="">
				</div>
				<div class="content-wrap">
					<div class="select-ticket-wrap com-wrap-style">
						<div class="title flexbox">
              <div class="select-voucher flex-1">选择权益券</div>
              <div class="check-plane flex-1" @click="checkPlane">查看适应航线</div>
            </div>
						<div class="content clearfix" >
							<div class="every-select" @click='selectTicket(index)' :class='{"active": curSelectIndex == index, "com-border": curSelectIndex != index}' v-for="(item, index) in ticketInfo" :key="'select'+index">
									<div class="wrap flexbox justify-content flex-v">
										<div class="weight">{{item.activityName}}</div>
										<div class="money">{{item.price}}元/张</div>
									</div>
									<div class="btn"></div>
							</div>
						</div>
					</div>
					<div class="buy-count-wrap com-wrap-style ">
						<div class="every-line flexbox">
							<div class="left-wrap flex-1">
								<div class="txt">购买数量</div>
							</div>
							<div class="right-wrap flexbox">
								<div class="reduce" @click='reduce' :class='{"not-click" : buyCount == 1}'></div>
								<div class="count">{{buyCount}}</div>
								<div class="add" @click='add' :class='{"not-click" : buyCount == 5}'></div>
							</div>
						</div>
					</div>
					<div class="score-wrap com-wrap-style">
						<div class="my-score every-line flexbox" :class="{'com-border-bottom' : isUseScore}">
							<div class="left-wrap flex-1">
								<div class="txt">积分</div>
								<div class="tip-btn" @click='displayScoreExplain'></div>
							</div>
							<div class="right-wrap flexbox ">
								<div class="can-use-score flex-1">{{scoreDescribe}}</div>
								<div class="select-btn" :class="{active : isUseScore}" @click="selectUseScore"></div>
							</div>
						</div>
						<div class="hidden-content" :class="{active : isUseScore}">
							<div class="every-line com-border-bottom flexbox">
								<div class="left-wrap">
									<div class="txt">使用额度</div>
								</div>
								<div class="right-wrap com-input-style-1 flex-1">
									<input type="tel" placeholder="请输入使用积分额" pattern="[0-9]*" v-model="scoreObj.useScore">
								</div>
							</div>
							<div class="password every-line flexbox">
								<div class="left-wrap">
									<div class="txt">消费密码</div>
								</div>
								<div class="right-wrap flex-1 flexbox">
									<input type="password" placeholder="请输入消费密码" class="flex-1" pattern="[0-9]*" v-model="password">
									<div class="btn" @click="forgetPassword">忘记密码</div>
								</div>
							</div>
						</div>
					</div>
					<div class="buy-rules com-wrap-style">
						<div class="every-line flexbox" @click='clickRulesBtn'>
							<div class="left-wrap flex-1">
								<div class="txt">购买须知</div>
							</div>
							<div class="right-wrap">
								<div class="btn"></div>
							</div>
						</div>
					</div>
				</div>
				<transition name="detailAnimate">
					<div class="detail-page" v-show='displayDetail' @click='clickDetailBtn'>
						<div class="detail-wrap">
							<div class="commodity-title every-detail  flexbox" :class="{'com-border-bottom' : scoreObj.useScore}">
								<div class="txt flex-1">升舱券</div>
								<div class="content flex-1"><span>&yen;</span>{{curSelectTick.price}} x {{buyCount}}</div>
							</div>
							<div class="use-score every-detail flexbox" v-show="scoreObj.useScore">
								<div class="txt flex-1">积分抵扣</div>
								<div class="content flex-1"><span>-&yen;</span>{{scoreObj.useScore?scoreObj.useScore:0}}</div>
							</div>
						</div>
					</div>
				</transition>
			</div>
		</div>
		<Footer>
			<div class="buyBox flexbox" slot="sureBtn">
				<div class="money flex-1" @click='clickDetailBtn'>
					<span v-show="buyCount !== 1">总计：</span>
					<span class="symbol">￥</span>
					<span class="count">{{totalPrice}}</span>
          <span class="original-price" v-show="buyCount === 1 && curSelectTick.originalPrice">
            <span class="unit">/张</span> 
            <span class="money">&yen;<span>{{curSelectTick.originalPrice}}</span></span>
          </span>
					<div class="tip"></div>
					<span>明细</span>
				</div>
				<div class="buyBtn ratio-2" @click='payOrder'>去支付</div>
			</div>
		</Footer>
		<score-explain v-show='canDisplayExplain' @clickCloseBtn='closeScoreExplain' :isShow='canDisplayExplain' :canShowBar="showBar"></score-explain>
    <suited-plane v-show="displaySuitedPlane" @suitedPlaneClose="checkPlane"></suited-plane>
	</div>
</template>

<script>
import "common/tools/rem";
import Header from "components/header.vue";
import Footer from "components/footer.vue";
import SuitedPlane from "components/suitedPlane.vue";
import ScoreExplain from "components/scoreExplain.vue";
import controller from "common/logic/controller";
import { saveLoginInfo, getIsLogin, ruleScore } from "common/logic/logic";
import Page from "common/deploy/page";
import lsKey from "common/deploy/localstorage";
import requesturl from "common/deploy/requesturl";
import service from "common/service/data";
import { ChannelOrderNo, mul2 } from "common/logic/utils";
import {
  ResultCode,
  AuthType,
  RegEnum,
  Verify,
  AllOrderType,
  PayRes,
  PayInfo,
  couponType
} from "common/logic/enum";
const AuthStatus = {
  AUTH_SUCC: 1,
  AUTH_FAIL: -1,
  NOT_AUTH: 0
};
export default {
  data() {
    return {
      pageData: {},
      // 抵用券的列表
      ticketInfo: [],
      // 当前选择的券的index
      curSelectIndex: -1,
      // 当前选择的抵用券
      curSelectTick: {
        price: 0
      },
      // 购买的数量
      buyCount: 1,
      // 是否使用积分
      isUseScore: false,
      // 是否显示订单详情
      displayDetail: false,
      // 积分
      scoreObj: {
        allScore: -1,
        canUseScore: -1,
        useScore: ""
      },
      password: "",
      // 认证状态
      authStatus: -2,
      // 是否请求实名认证接口
      isGetAuthJson: false,
      // 是否显示积分说明
      canDisplayExplain: false,
      // 是否显示适应航线
      displaySuitedPlane: false,
      // 设置头部
      setTitleStyle: {
        title: '升舱券',
        titlestyle: 3,
        isUseH5: true
      },
      // 积分页面是否showBar
      showBar: false
    };
  },
  created() {
    var that = this;
    controller.ready().then(data => {
      that.memberInfo = data.memberInfo || {};
      that.pageData = data.data;
      that.getCabinTicket();
      controller.onshow(function() {
        saveLoginInfo().then(memberInfo => {
          that.memberInfo = memberInfo;
          that.getCabinTicket();
        });
      });
    });
  },
  components: {
    Header,
    Footer,
    ScoreExplain,
    SuitedPlane
  },
  methods: {
    // 查看航线
    checkPlane() {
      this.displaySuitedPlane = !this.displaySuitedPlane;
    },
    // 显示积分说明页面
    displayScoreExplain() {
      this.canDisplayExplain = true;
    },
    // 关闭积分说明页面
    closeScoreExplain() {
      this.canDisplayExplain = false;
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
    // 获取升舱券信息
    getCabinTicket() {
      const that = this;
      controller
        .getJSON({
          method: "POST",
          url: requesturl.CABIN_LIFT.CABIN_TICKET_LIFT,
          params: that.cabinTicketParams()
        })
        .then(that.cabinTicketSucc)
        .catch(that.cabinTicketErr);
    },
    cabinTicketParams() {
      return {
        request: {
          ffpCardNo: this.memberInfo.memberID,
          ffpId: this.memberInfo.id,
          loginKeyInfo: this.memberInfo.loginKeyInfo
        }
      };
    },
    cabinTicketSucc(data) {
      console.log(data);
      if (data.resultCode == ResultCode.SUCCESS) {
        let objData = data.objData;
        if (this.memberInfo.id) {
          this.scoreObj.allScore = objData.availableScore;
        } else {
          this.scoreObj.allScore = objData.availableScore || -1;
        }
        this.ticketInfo = objData.saleCouponList;
        // 默认选中第一个
        this.selectTicket(0);
      } else {
        controller.toast({
          str: data.resultInfo
        });
      }
    },
    cabinTicketErr() {
      controller.toast({
        str: "升舱券请求网络异常"
      });
    },
    // 支付订单
    payOrder() {
      if (!getIsLogin(true)) {
        return;
      }
      if (!this.curSelectTick.price) {
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
        this.getOrderJson();
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
        this.getOrderJson();
      } else {
        controller.toast({
          str: result.errorInfo
        });
      }
    },
    vilidateErrBack() {
      controller.toast({
        str: Verify.BACK_ERR.toastDetailsFail
      });
    },
    // 请求支付接口
    getOrderJson() {
      const that = this;
      controller
        .getJSON({
          method: "POST",
          url: requesturl.CABIN_LIFT.BUY_CABIN_TICKET,
          params: that.orderParams()
        })
        .then(that.orderSucBack)
        .catch(that.orderErrBack);
    },
    orderParams() {
      return {
        request: {
          ffpCardNo: this.memberInfo.memberID,
          ffpId: this.memberInfo.id,
          loginKeyInfo: this.memberInfo.loginKeyInfo,
          payAmount: this.totalPrice,
          useScore: this.scoreObj.useScore,
          channelOrderNo: ChannelOrderNo(new Date()),
          salePwd: this.password,
          saleCouponList: [
            {
              activityNo: this.curSelectTick.activityNo,
              count: this.buyCount
            }
          ],
          couponSource: couponType.CABIN_TICKET
        }
      };
    },
    orderSucBack(result) {
      if (result.resultCode == ResultCode.SUCCESS) {
        let objData = result.objData;
        objData.orderType = AllOrderType.CABIN_TICKET;
        let payment = Page.cabinLift.cabinTicketPay;
        controller.open({
          winName: payment.winName,
          path: payment.pageUrl,
          data: objData,
          closeLastPage: true
        });
      } else if (result.resultCode == "P10001") {
        let objData = result.objData;
        let successPage = Page.commonPage.payResult;
        controller.open({
          winName: successPage.winName,
          path: successPage.pageUrl,
          data: {
            type: PayRes.PAY_SUC,
            resultData: PayInfo.PAY_SUC,
            channelOrderNo: objData.channelOrderNo,
            orderNo: objData.orderNo
          },
          closeLastPage: true
        });
      } else {
        controller.toast({
          str: result.resultInfo
        });
      }
    },
    orderErrBack() {},
    // 提交订单
    submitPayOrder() {},
    // 点击详情按钮
    clickDetailBtn() {
      if (!this.curSelectTick.price) {
        return;
      }
      this.displayDetail = !this.displayDetail;
    },
    clickBackBtn() {
      controller.close();
    },
    // 选择抵用券
    selectTicket(index) {
      this.curSelectIndex = index;
      this.curSelectTick = this.ticketInfo[index];
      this.buyCount = 1;
    },
    // 点击减少购买数量
    reduce() {
      if (this.curSelectIndex === -1) {
        return;
      }
      if (this.buyCount <= 1) {
        return;
      }
      this.buyCount = this.buyCount - 1;
      this.scoreObj.useScore = "";
    },
    // 点击增加购买数量
    add() {
      if (this.curSelectIndex === -1) {
        return;
      }
      if (this.buyCount >= 5) {
        return;
      }
      this.buyCount = this.buyCount + 1;
    },
    // 选择使用积分
    selectUseScore() {
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
            str: "暂无可用积分"
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
    // 点击购买须知按钮
    clickRulesBtn() {
      let buyRulesPage = Page.cabinLift.buyRules;
      controller.open({
        winName: buyRulesPage.winName,
        path: buyRulesPage.pageUrl
      });
    }
  },
  computed: {
    totalPrice() {
      if (this.curSelectIndex == -1) {
        return 0;
      }
      let curTickPrice = this.curSelectTick.price;
      return mul2(curTickPrice, this.buyCount) - this.scoreObj.useScore;
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
        if (this.curSelectIndex == -1) {
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
        if (val.useScore > this.curSelectTick.price * this.buyCount) {
          val.useScore = this.curSelectTick.price * this.buyCount;
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
  .banner {
    width: rem(750);
    height: rem(567);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .content-wrap {
    position: relative;
    top: rem(-109);
    padding: 0 rem(30);
    .com-wrap-style {
      margin-top: rem(20);
      background-color: #fff;
      box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.02);
      @include border-radius(rem(6));
      .every-line {
        position: relative;
        height: rem(112);
        line-height: rem(112);
        .left-wrap {
          width: rem(197);
          padding-left: rem(30);
          color: #3a3d50;
          font-size: rem(28);
          font-weight: bold;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
        }
        .right-wrap {
          padding-right: rem(30);
          &.com-input-style-1 {
            input {
              width: 100%;
            }
          }
        }
        input {
          width: 100%;
          color: #3a3d50;
          font-size: rem(28);
          @include inputPlaceholder(#ccc);
        }
      }
    }
    .select-ticket-wrap {
      .title {
        padding: rem(30);
        padding-bottom: 0;
        line-height: rem(28);
        .select-voucher {
          color: #3a3d50;
          font-size: rem(26);
          font-weight: bold;
        }
        .check-plane {
          font-size: rem(24);
          color: #cb9d6d;
          text-align: right;
        }
      }
      .content {
        padding-bottom: rem(30);
        .every-select {
          position: relative;
          float: left;
          margin: rem(30) 0 0 rem(30);
          width: rem(300);
          height: rem(102);
          &.active {
            .wrap {
              background-color: #fbefd8;
            }
            .btn {
              display: block;
            }
            .weight {
              color: #cb9d6d;
            }
            .money {
              color: #cb9d6d;
            }
          }
          .wrap {
            width: 100%;
            height: 100%;
            @include border-radius(rem(4));
            overflow: hidden;
          }
          .weight {
            font-size: rem(28);
            color: #3a3d50;
            text-align: center;
          }
          .money {
            font-size: rem(24);
            color: #3a3d50;
            text-align: center;
          }
          .btn {
            display: none;
            position: absolute;
            right: rem(-10);
            top: rem(-10);
            width: rem(32);
            height: rem(32);
            @include bg("./img/select.png");
          }
        }
      }
    }
    .buy-count-wrap {
      .right-wrap {
        .reduce {
          width: rem(48);
          padding-right: rem(22);
          background: url("./img/reduce_on_btn.png") no-repeat center left;
          background-size: rem(48) auto;
          -webkit-background-size: rem(48) auto;
          &.not-click {
            background: url("./img/reduce_off_btn.png") no-repeat center left;
            background-size: rem(48) auto;
            -webkit-background-size: rem(48) auto;
          }
        }
        .count {
          width: rem(60);
          font-size: rem(40);
          text-align: center;
          color: #cb9d6d;
        }
        .add {
          width: rem(48);
          padding-left: rem(22);
          background: url("./img/add_on_btn.png") no-repeat center right;
          background-size: rem(48) auto;
          -webkit-background-size: rem(48) auto;
          &.not-click {
            background: url("./img/add_off_btn.png") no-repeat center right;
            background-size: rem(48) auto;
            -webkit-background-size: rem(48) auto;
          }
        }
      }
    }
    .score-wrap {
      .my-score {
        .left-wrap {
          font-size: 0;
          div {
            display: inline-block;
          }
          .txt {
            font-size: rem(28);
            vertical-align: middle;
          }
          .tip-btn {
            margin-left: rem(10);
            width: rem(24);
            height: rem(24);
            vertical-align: middle;
            @include bg("./img/detail.png");
          }
        }
        .right-wrap {
          .can-use-score {
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
      }
      .hidden-content {
        display: none;
        &.active {
          display: block;
        }
      }
      .password {
        .btn {
          margin-left: rem(24);
          color: #848484;
          font-size: rem(28);
        }
      }
    }
    .buy-rules {
      .btn {
        height: rem(112);
        width: rem(24);
        @include bg2("./img/right_arrow.png");
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
.com-border-bottom {
  @include bd-bottom(#f4f4f4);
}
.com-border {
  @include border(#eaeaea);
}
.style-ios {
  .com-border-bottom {
    @include bd-bottom-ios(#f4f4f4);
  }
  .com-border {
    @include border-ios(#eaeaea);
  }
}
</style>
