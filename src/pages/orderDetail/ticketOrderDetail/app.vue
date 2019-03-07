<template>
  <div id="app">
    <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
    <div class="main">
      <div class="main-wrap">
        <div class="header-wrap">
          <div class="line-1 flexbox" v-if="currentPayState">
            <div class="text">{{payState}}</div>
            <div class="money flex-1" @click="clickPriceDetail">
              <div class="num"><span>&yen;</span>{{pageNeedInfo.actualAmount}}</div>
              <div class="tip-btn"></div>
            </div>
          </div>
          <div class="line-2 flexbox">
            <div class="flex-1">
              <div class="timeDown-tip" v-if="currentPayState === allPayState.READY_PAY">
                <span>请在</span><span class="icon"></span><span class="time">{{lastTimeTxt}}</span> <span>内完成支付</span>
              </div>
              <div class="haspay-tip" v-if="(currentPayState === allPayState.HAS_PAY)&&(orderPayType == allOrderPayType.CABIN_LEFT)">
                <div class="text-1">本订单仅退升舱部分的金额</div>
                <div class="text-2">原机票部分，请至原订单中提交申请</div>
              </div>
              <div class="haspay-tip" v-if="(currentPayState === allPayState.HAS_PAY)&&(orderPayType == allOrderPayType.CHANGE_DATE)">
                <div class="text-1">本订单仅退改期部分的金额</div>
                <div class="text-2">关于原机票部分，请联系原购票平台</div>
              </div>
            </div>
            <div class="rules-btn" @click="clickRules" v-if="currentPayState">
              <div class="text">退款规则</div>
              <div class="img"></div>
            </div>
          </div>
          <div class="all-btn">
            <div v-if="currentPayState === allPayState.READY_PAY">
              <div class="readyPay-btn flexbox justify-content">
                <div class="cancel-btn btn" @click="cancelOrder">取消订单</div>
                <div class="pay-btn btn" @click="goPay">去支付</div>
              </div>
            </div>
            <div class="flexbox" v-if="currentPayState === allPayState.HAS_PAY">
              <div class="refund-insurance flex-1" v-if="newInsurance.length>0" @click="refundInsurance">单独退保</div>
              <div class="apply-btn flex-1" @click="applyRefund">申请退票</div>
            </div>
          </div>
        </div>
        <div class="content-wrap">
          <!-- 升舱改期订单详情 -->
          <div class="up-change-order" v-if="orderPayType && (orderPayType !== allOrderPayType.PLANE)" v-for="(item,index) in allPlaneInfor" :key="'up-change'+index">
            <!-- 没有升舱改期 -->
            <div class="current-plane-infor come-style" v-if="(orderPayType !== allOrderPayType.PLANE)&&!item.changeFlag">
              <div class="close-wrap-wrap" v-show="!hasOpenPlane[index]" @click="openPlane(index)">
                <div class="close-wrap flexbox">
                  <div class="left-wrap">
                    <div class="signal">{{journeyType(index)}}</div>
                  </div>
                  <div class="center-wrap flex-1">
                    <div class="city-name">{{item.depCityName}} - {{item.arrCityName}}</div>
                    <div class="date">{{createNeedDate(item.depDateTime)}}</div>
                  </div>
                  <div class="right-wrap">展开</div>
                </div>
              </div>
              <div class="every-flight-infor" v-show="hasOpenPlane[index]">
                <div class="line-1 flexbox">
                  <div>{{journeyType(index)}}</div>
                  <div class="date">{{createNeedDate(item.depDateTime)}}</div>
                  <div class="luggage-btn flex-1" @click="clickLuggageBtn(item,index)">
                    <span class="img"></span>
                    <span class="text">行李额</span>
                  </div>
                </div>
                <div class="line-2">{{item.flightNo}} <span v-if="item.cabinClass">|</span> {{cabin(item.cabinClass,item.cabin)}} <span v-if="item.mealCode">|</span> {{meal(item.mealCode)}} <span v-if="item.aircraftModel">|</span> {{item.aircraftModel}}</div>
                <div class="line-3 flexbox">
                  <div class="start-wrap come-style flex-1">
                    <div class="add-day"></div>
                    <div class="time">{{planeTime(item.depDateTime)}}</div>
                    <div class="place">{{planePlace(item.depCityName,item.depAirportName,item.depTerm)}}</div>
                  </div>
                  <div class="fly-time">
                    <div class="time">{{flyTime(item.flightTime)}}</div>
                    <div class="img"></div>
                    <div class="stop-over"></div>
                  </div>
                  <div class="end-wrap come-style flex-1">
                    <div class="add-day"><span v-if="item.day">+{{item.day}}天</span></div>
                    <div class="time">{{planeTime(item.arrDateTime)}}</div>
                    <div class="place">{{planePlace(item.arrCityName,item.arrAirportName,item.arrTerm)}}</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 升舱改期 -->
            <div class="plane-infor come-style" v-if="(orderPayType !== allOrderPayType.PLANE)&&item.changeFlag">
              <div class="title">{{orderPayType == allOrderPayType.CABIN_LEFT?'升舱航班':'改期航班'}}</div>
              <div class="every-flight-infor com-border-bottom" :class="{'com-border-bottom': orderPayType == allOrderPayType.CABIN_LEFT}">
                <div class="line-1 flexbox">
                  <div>{{journeyType(index)}}</div>
                  <div class="date">{{createNeedDate(item.depDateTime)}}</div>
                  <div class="luggage-btn flex-1" @click="clickLuggageBtn(item,index)">
                    <span class="img"></span>
                    <span class="text">行李额</span>
                  </div>
                </div>
                <div class="line-2">{{item.flightNo}} <span v-if="item.cabinClass">|</span> {{cabin(item.cabinClass,item.cabin)}} <span v-if="item.mealCode">|</span> {{meal(item.mealCode)}} <span v-if="item.aircraftModel">|</span> {{item.aircraftModel}}</div>
                <div class="line-3 flexbox">
                  <div class="start-wrap come-style flex-1">
                    <div class="add-day"></div>
                    <div class="time">{{planeTime(item.depDateTime)}}</div>
                    <div class="place">{{planePlace(item.depCityName,item.depAirportName,item.depTerm)}}</div>
                  </div>
                  <div class="fly-time">
                    <div class="time">{{flyTime(item.flightTime)}}</div>
                    <div class="img"></div>
                    <div class="stop-over"></div>
                  </div>
                  <div class="end-wrap come-style flex-1">
                    <div class="add-day"><span v-if="item.day">+{{item.day}}天</span></div>
                    <div class="time">{{planeTime(item.arrDateTime)}}</div>
                    <div class="place">{{planePlace(item.arrCityName,item.arrAirportName,item.arrTerm)}}</div>
                  </div>
                </div>
              </div>
              <div class="cabin-type" v-if="orderPayType == allOrderPayType.CABIN_LEFT">{{item.formatCabinClassName}}({{item.formatCabin}})<span>升至</span>{{item.cabinClassName}}({{item.cabin}})</div>
            </div>
          </div>
          <!-- 机票订单详情 -->
          <div class="plane-ticket come-style" v-if="orderPayType == allOrderPayType.PLANE">
            <div class="every-flight-infor com-border-bottom" v-for="(item,index) in allPlaneInfor" :key="'flight'+index">
              <div class="line-1 flexbox">
                <div>{{journeyType(index)}}</div>
                <div class="date">{{createNeedDate(item.depDateTime)}}</div>
                <div class="luggage-btn flex-1" @click="clickLuggageBtn(item,index)">
                  <span class="img"></span>
                  <span class="text">行李额</span>
                </div>
              </div>
              <div class="line-2">{{item.flightNo}} <span v-if="item.cabinClass">|</span> {{cabin(item.cabinClass,item.cabin)}} <span v-if="item.mealCode">|</span> {{meal(item.mealCode)}} <span v-if="item.aircraftModel">|</span> {{item.aircraftModel}}</div>
              <div class="line-3 flexbox">
                <div class="start-wrap come-style flex-1">
                  <div class="add-day"></div>
                  <div class="time">{{planeTime(item.depDateTime)}}</div>
                  <div class="place">{{planePlace(item.depCityName,item.depAirportName,item.depTerm)}}</div>
                </div>
                <div class="fly-time">
                  <div class="time">{{flyTime(item.flightTime)}}</div>
                  <div class="img"></div>
                  <div class="stop-over"></div>
                </div>
                <div class="end-wrap come-style flex-1">
                  <div class="add-day"><span v-if="item.day">+{{item.day}}天</span></div>
                  <div class="time">{{planeTime(item.arrDateTime)}}</div>
                  <div class="place">{{planePlace(item.arrCityName,item.arrAirportName,item.arrTerm)}}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 乘机人信息（所有的页面都需要） -->
          <div class="person-infor" v-if="orderPassengerInfoList.length>0">
            <div class="content come-style flexbox" :class="{'com-border-bottom': index != orderPassengerInfoList.length-1}" v-for="(item,index) in orderPassengerInfoList" :key="'person'+index">
              <div class="name">乘机人</div>
              <div class="infor flex-1">
                <div class="infor-1">{{item.passengerName}} <span class="infor-content">{{judgeUsrType(item.passengerType)}}</span></div>
                <div class="infor-2">{{judgeCardType(item.certType,item.passengerType)}} {{item.certNo}}</div>
                <div class="infor-3">票号 {{item.eticketNo?item.eticketNo:"--"}}</div>
              </div>
            </div>
          </div>
          <div class="contact-person come-style flexbox" v-if="(orderPayType == allOrderPayType.PLANE)&&pageNeedInfo.linker">
            <div class="name">联系人</div>
            <div class="infor flex-1">
              <div class="infor-1">{{pageNeedInfo.linker}}</div>
              <div class="infor-2">手机号 {{pageNeedInfo.linkerHandphone}}</div>
            </div>
          </div>
          <!-- 增值服务 -->
          <div class="increment-service come-style" v-if="(orderPayType == allOrderPayType.PLANE)&&allAddService">
            <div class="display-wrap flexbox" :class="{'com-border-bottom': displayIncrement}" @click="clickIncrementService">
              <div class="name">增值服务</div>
              <div class="infor flex-1"><span v-show="!displayIncrement">{{allAddService}}</span></div>
              <div class="rotate-btn" :class="{'active': displayIncrement}"></div>
            </div>
            <div class="hidden-wrap" v-show="displayIncrement">
              <div class="every-service com-border-bottom" v-for="(item,index) in newInsurance" :key="'increment'+index">
                <div class="title">{{item.insuranceName}}</div>
                <div class="content">
                  <div class="every-infor flexbox">
                    <div class="name">购买份数</div>
                    <div class="content flex-1">{{item.insuranceNumber}}份</div>
                  </div>
                </div>
              </div>
              <!-- 境外wifi -->
              <div class="every-service com-border-bottom" v-if="pageNeedInfo.wifiBuyList">
                <div class="title special-title"><span>境外WIFI</span><span class="tip" @click="clickWifiBtn"></span></div>
                <div class="content">
                  <div class="every-wifi" v-for="(item,index) in pageNeedInfo.wifiBuyList" :key="'wifi'+index">
                    <div class="every-infor flexbox">
                      <div class="name">目的地</div>
                      <div class="content flex-1">{{item.wifiProductName}}</div>
                    </div>
                    <div class="every-infor flexbox">
                      <div class="name">取换日期</div>
                      <div class="content flex-1">{{item.takeDate.substring(0,10)}}至{{item.returnDate.substring(0,10)}}</div>
                    </div>
                    <div class="every-infor flexbox">
                      <div class="name">租赁件数</div>
                      <div class="content flex-1">{{item.purchaseQuantity}}件</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 贵宾休息室 -->
              <div class="every-service com-border-bottom" v-if="pageNeedInfo.loungeBuyList">
                <div class="title">贵宾休息室</div>
                <div class="content">
                  <div class="every-infor flexbox">
                    <div class="name">适用机场</div>
                    <div class="content flex-1">{{pageNeedInfo.loungeBuyList[0].loungeName}}</div>
                  </div>
                  <div class="every-infor flexbox">
                    <div class="name">休息室地址</div>
                    <div class="content flex-1">{{pageNeedInfo.loungeBuyList[0].address}}</div>
                  </div>
                </div>
              </div>
              <!-- 逾重行李 -->
              <div class="every-service com-border-bottom" v-if="pageNeedInfo.baggageBuyList">
                <div class="title">逾重行李</div>
                <div class="content">
                  <div class="every-infor flexbox">
                    <div class="name">行李额</div>
                    <div class="content flex-1"><span v-for="(item,index) in pageNeedInfo.baggageBuyList" :key="'baggage'+index">{{item.passengerName}}({{parseInt(item.weightNum) || 0}}{{item.weightUnite}}) </span></div>
                  </div>
                </div>
              </div>
              <!-- 邮寄行程单 -->
              <div class="every-service" v-if="pageNeedInfo.tripCertSendInfo">
                <div class="title">报销凭证</div>
                <div class="content">
                  <div class="every-infor flexbox">
                    <div class="name">收件人姓名</div>
                    <div class="content flex-1">{{pageNeedInfo.tripCertSendInfo.linker}}</div>
                  </div>
                  <div class="every-infor flexbox">
                    <div class="name">联系电话</div>
                    <div class="content flex-1">{{pageNeedInfo.tripCertSendInfo.handphoneNumber}}</div>
                  </div>
                  <div class="every-infor flexbox">
                    <div class="name">邮寄地址</div>
                    <div class="content flex-1">{{pageNeedInfo.tripCertSendInfo.provinceCityAddress || ''}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 订单编号 -->
          <div class="order-infor come-style" v-if="pageNeedInfo.orderNO">
            <div class="order-num flexbox every-order-infor">
              <div class="name">订单编号</div>
              <div class="content flex-1">{{pageNeedInfo.orderNO}}</div>
            </div>
            <div class="order-time flexbox every-order-infor">
              <div class="name">下单时间</div>
              <div class="content flex-1">{{pageNeedInfo.bookingDatetime}}</div>
            </div>
          </div>
        </div>
        <div class="delete-btn" v-if="currentPayState === allPayState.CANCEL" @click="deleteOrder">
          <div class="img"></div>
          <div class="text">删除订单</div>
        </div>
      </div>
    </div>
    <price-detail :orderDetail="orderDetail" v-show="displayPriceDetail" @hidePrice="closePriceDetail"></price-detail>
    <luggage-limit @closeLuggageLimit="closeLuggageLimit" v-show="displayLuggageLimit" :propsLuggage="propsLuggage"></luggage-limit>
    <!-- 改期规则 -->
    <RuleSlot :rulesTitle='changeRulesTitle' @clickCloseBtn='closeChangeRules' v-show='changeCanShow' :isShow='changeCanShow'>
      <div class="rulesInfo" slot="ruleInfo">
        <div class="title">已改期过的订单，暂不支持在线改期</div>
        <dl class="first-dl">
          <dt>改期后自愿退票： </dt>
          <dd>1. 客票变更后发生自愿退票，所收变更手续费不退; </dd>
          <dd>2. 客票变更后如发生自愿退票，客票差价部分按变更后新订座舱位的退票手续费标准办理，原票价按变更前订座舱位退票手续费标准办理，合计收取退票费。 </dd>
        </dl>
        <dl>
          <dt>改期后非自愿退票: </dt>
          <dd>1. 客票变更后退票发生非自愿退票，所收变更手续费不退; </dd>
          <dd>2. 客票变更后如发生非自愿退票，应先退还旅客升舱后的客票差价（即：补差金额），再按“票价计算”栏标注的原舱位的退票规定以自愿退票办理，以原票价计算退票费（即：升舱后的客票差价票款全退，原舱位票款按舱位规定扣除退票手续费后退款）</dd>
        </dl>
      </div>
    </RuleSlot>
    <!-- 升舱规则 -->
    <RuleSlot :rulesTitle='cabinRulesTitle' @clickCloseBtn='closeCabinRules' v-show='cabinCanShow' :isShow='cabinCanShow'>
      <div class="rulesInfo" slot="ruleInfo">
        <div class="title">普通升舱退改规则</div>
        <dl class="first-dl">
          <dt>1.自愿退票，变更</dt>
          <dd>升舱成功后，旅客自愿办理退票，升舱补差的费用按实际升舱后的头等舱舱位规定执行退票，若旅客使用升舱券支付，则将升舱券退回至旅客账户，有效期不变（自愿办理退票时，每张升舱券仅可退回1次）。升舱前的经济舱客票费用部分按原经济舱舱位规定执行退票。</dd>
          <dd>升舱成功后，旅客自愿办理变更，机票将按实际升舱后的头等舱舱位规定执行变更。</dd>
        </dl>
        <dl>
          <dt>2.非自愿退票，变更，签转</dt>
          <dd>升舱成功后，旅客办理非自愿退票，变更，签转，可按值机升舱后的头等舱舱位规定执行。</dd>
          <dd>若旅客使用升舱券支付，客票发生非自愿退票，则将升舱券退回至旅客账户，有效期不变。非自愿退票时，每张升舱券退回次数不限。</dd>
        </dl>
      </div>
    </RuleSlot>
    <!-- 机票规则 -->
    <RuleSlot :rulesTitle='ticketRulesTitle' @clickCloseBtn='closeTicketRules' v-show='ticketCanShow' :isShow='ticketCanShow'>
      <div class="rulesInfo" slot="ruleInfo">
        <div class="title">机票退改规则</div>
        <dl class="first-dl" v-for="(item,index) in allPlaneInfor" :key="'plane'+index">
          <dt>{{index==0?"去程规则":"返程规则"}}</dt>
          <dd>{{item.changedComment}}</dd>
          <dd>{{item.refundedComment}}</dd>
        </dl>
      </div>
    </RuleSlot>
  </div>
</template>

<script>
  import "common/tools/rem";
  import Header from "components/header.vue";
  import LuggageLimit from "components/luggageLimit.vue";
  import controller from "common/logic/controller";
  import requesturl from 'common/deploy/requesturl';
  import PriceDetail from "components/priceDetail.vue";
  import Page from 'common/deploy/page';
  import {
    getChannelCode
  } from 'common/logic/utils.js';
  import RuleSlot from "components/ruleSlot.vue";
  import {
    ResultCode,
    AllOrderPayType,
    AllOrderType
  } from "common/logic/enum.js";
  // 当前页面的状态
  const AllPayState = {
    HAS_PAY: "0", //已经支付
    READY_PAY: "1", //待支付
    CANCEL: "2", //取消
    REFUND: "3", //退款中
    HAS_REFUND: "4" //已经退款
  }
  export default {
    data() {
      return {
        pageData: {},
        // 是否展开航线
        hasOpenPlane: [],
        // 所有的订单状态
        allPayState: AllPayState,
        // 当前的订单状态
        currentPayState: "",
        // 订单详情的类型（升舱，改期, 航班订单）
        orderPayType: "",
        allOrderPayType: AllOrderPayType,
        // 页面请求到的所有信息
        pageNeedInfo: {},
        // 乘机人信息
        orderPassengerInfoList: [],
        // 航线信息
        allPlaneInfor: [],
        // 是否显示订单详情
        displayPriceDetail: false,
        // 是否显示退改规则
        displayRulesPage: false,
        // 订单价格详情
        orderDetail: {},
        // 显示增值服务
        displayIncrement: false,
        // 显示行李额
        displayLuggageLimit: false,
        // 行李额请求需要的数据
        propsLuggage: {
          flightType: "", //航班性质
          passengerType: "", //旅客类型
          cabinGrade: "", //舱位等级
          destination: "", //目的地(三字码)
          type: "" //传递的第几个行李额请求
        },
        // 剩余时间
        lastTimeTxt: "",
        // 设置头部
        setTitleStyle: {
          isUseH5: true,
          titlestyle: 3,
          title: '订单详情',
          isUseH5: true
        },
        // 保险信息
        newInsurance: [],
        // 改期规则标题
        changeRulesTitle: "退款规则",
        // 升舱规则标题
        cabinRulesTitle: "退改规则",
        // 机票规则标题
        ticketRulesTitle: "退款规则",
        // 显示改期规则
        changeCanShow: false,
        // 显示升舱规则
        cabinCanShow: false,
        // 显示机票规则
        ticketCanShow: false
      };
    },
    components: {
      Header,
      PriceDetail,
      LuggageLimit,
      RuleSlot
    },
    created() {
      var that = this;
      controller.ready().then(data => {
        that.memberInfo = data.memberInfo || {};
        that.pageData = data.data;
        console.log("进来ticketOrderDetial");
        console.log(that.pageData);
        // that.pageData = {
        //   channelOrderNo: "N2018122810212488430",
        //   orderNo: "ORD18122800015234"
        // }
        this.searchOrderDetail();
      });
    },
    methods: {
      // 关闭机票规则
      closeTicketRules() {
        this.ticketCanShow = false;
      },
      // 关闭升舱规则
      closeCabinRules() {
        this.cabinCanShow = false;
      },
      // 关闭改期规则
      closeChangeRules() {
        this.changeCanShow = false;
      },
      // 去支付
      goPay() {
        let pageInfor = null;
        let transmitData = {
          channelOrderNo: this.pageData.channelOrderNo,
          orderNo: this.pageData.orderNo,
          orderType: AllOrderType.FLIGHT
        }
        if (this.orderPayType == AllOrderPayType.PLANE) { //机票
          pageInfor = Page.myOrder.fltOrderPay;
          controller.setStorage('orderType', 'flightOrder');
          var data = controller.getStorage('orderDetail');
          if (!data) {
            controller.setStorage('orderDetail', this.pageNeedInfo);
          }
          controller.setStorage('isOrderPage', true);
          controller.open({
            winName: pageInfor.winName,
            path: pageInfor.pageUrl,
            closeLastPage: true
          });
        } else if (this.orderPayType == AllOrderPayType.CABIN_LEFT) { //升舱
          pageInfor = Page.cabinLift.cabinPay;
          controller.open({
            winName: pageInfor.winName,
            path: pageInfor.pageUrl,
            data: transmitData,
            closeLastPage: true
          });
        } else if (this.orderPayType == AllOrderPayType.CHANGE_DATE) { //改期
          pageInfor = Page.changeDate.orderPayment;
          controller.open({
            winName: pageInfor.winName,
            path: pageInfor.pageUrl,
            data: transmitData,
            closeLastPage: true
          });
        }
      },
      // 申请退票
      applyRefund() {
        let that = this;
        controller.confirm({
          title: '提示',
          message: '确认要申请退票吗？',
          buttons: ['考虑一下', '确认'],
          onConfirm() {
            console.log('refund---');
            that.confirmRefund();
          }
        })
      },
      // 确认退票
      confirmRefund() {
        let pageInfor = Page.refund.applyRefund;
        var url = WEBIP + pageInfor.pageUrl;
        url = url + '?channelCode=' + getChannelCode() + '&channelOrderNo=' + this.pageData.channelOrderNo + '&orderNo=' + this.pageData.orderNo + '&customerNo=' + this.memberInfo.id + '&loginKeyInfo=' + this.memberInfo.loginKeyInfo + '&orderSign=' + this.pageNeedInfo.orderSign + '&titlestyle=1'+ '&title=申请退票';
        controller.open({
          winName: pageInfor.winName,
          path: url,
          closeLastPage: true 
        });
      },
      // 单独退保
      refundInsurance() {
        let that = this;
        controller.confirm({
          title: '提示',
          message: '确认要单独退保吗？',
          buttons: ['考虑一下', '确认'],
          onConfirm() {
            console.log('refund---');
            that.confirmRefundInsurance();
          }
        })
      },
      // 确认单独退保
      confirmRefundInsurance() {
        // var url = WEBIP + '/refund/refund_insure.jsp';
        // url = url + '?channelCode=' + getChannelCode() + '&channelOrderNo=' + this.pageData.channelOrderNo + '&orderNo=' + this.pageData.orderNo + '&customerNo=' + this.memberInfo.id + '&loginKeyInfo=' + this.memberInfo.loginKeyInfo + '&orderSign=' + this.pageData.orderSign;
        // var activityData = {
        //   activity_title: '单独退保',
        //   activity_url: url
        // };
        // controller.setStorage('activityData', activityData);
        // controller.setStorage('activityType', 'refund');
        // let pageInfor = Page.refund.refundInsurance;
        // controller.open({
        //   winName: pageInfor.winName,
        //   path: pageInfor.pageUrl,
        //   closeLastPage: true 
        // });
        let appid = controller.getStorage('deviceID');
        let appsys = "";
        let appver = "";
        let pageInfor = Page.refund.refundInsurance;
        var url = WEBIP + pageInfor.pageUrl;
        url = url + '?channelCode=' + getChannelCode() + '&channelOrderNo=' + this.pageData.channelOrderNo + '&orderNo=' + this.pageData.orderNo + '&customerNo=' + this.memberInfo.id + '&loginKeyInfo=' + this.memberInfo.loginKeyInfo + '&orderSign=' + this.pageData.orderSign + '&titlestyle=1'+ '&title=单独退保';
        controller.open({
          winName: pageInfor.winName,
          path: url,
          closeLastPage: true 
        });
      },
      // 取消订单
      cancelOrder() {
        let that = this;
        controller.confirm({
          title: '提示',
          message: '确认要取消订单吗？',
          buttons: ['考虑一下', '确认'],
          onConfirm() {
            that.confirmCancel();
          }
        });
      },
      // 确认取消
      confirmCancel() {
        let that = this;
        controller
          .getJSON({
            method: "POST",
            url: requesturl.MY_ORDER.ORDER_CANCEL,
            oldParams: that.cancelParam()
          })
          .then(that.cancelOrderSucc)
          .catch(that.cancelOrderError);
      },
      // 取消订单参数
      cancelParam() {
        return {
          bookChannelCode: getChannelCode(),
          channelOrderNo: this.pageData.channelOrderNo,
          orderNo: this.pageData.orderNo,
          customerNo: this.memberInfo.id,
          loginKeyInfo: this.memberInfo.loginKeyInfo,
          orderType: this.pageNeedInfo.orderSort
        }
      },
      // 取消订单成功
      cancelOrderSucc(res) {
        if (res.resultCode == ResultCode.SUCCESS) {
          this.searchOrderDetail();
        } else {
          controller.toast({
            str: res.resultInfo
          });
        }
      },
      // 取消订单失败
      cancelOrderError() {
        controller.toast({
          str: "取消订单网络出错"
        });
      },
      // 删除订单
      deleteOrder() {
        let that = this;
        controller.confirm({
          title: '提示',
          message: '确认要删除订单吗？',
          buttons: ['考虑一下', '确认'],
          onConfirm() {
            that.confirmDelete();
          }
        });
      },
      // 删除订单确认
      confirmDelete() {
        let that = this;
        controller
          .getJSON({
            method: "POST",
            url: requesturl.MY_ORDER.AIR_TICKET_DEL,
            oldParams: that.deleteParam()
          })
          .then(that.deleteOrderSucc)
          .catch(that.deleteOrderError);
      },
      // 删除订单参数
      deleteParam() {
        return {
          request: {
            "customerNo": this.memberInfo.id,
            "loginKeyInfo": this.memberInfo.loginKeyInfo,
            "channelOrderNo": this.pageData.channelOrderNo,
            "orderNo": this.pageData.orderNo
          }
        };
      },
      // 删除订单成功
      deleteOrderSucc(result) {
        if (result.resultCode == ResultCode.SUCCESS) {
          controller.close();
        } else {
          controller.toast({
            str: result.resultInfo
          });
        }
      },
      // 删除订单失败
      deleteOrderError() {
        controller.toast({
          str: "删除订单网络出错"
        });
      },
      // 点击wifi按钮
      clickWifiBtn() {
        let wifiPage = Page.addService.wifi;
        controller.open({
          winName: wifiPage.winName,
          path: WEBIP + wifiPage.pageUrl,
          closeLastPage: true 
        });
      },
      // 旅行行程
      journeyType(index) {
        if (this.allPlaneInfor.length == 1) {
          return "单程";
        } else if (this.allPlaneInfor.length == 2) {
          return index == 0 ? "去程" : "返程";
        }
      },
      // 航行时长
      flyTime(time) {
        if (!time) {
          return "";
        }
        let hour = parseInt(time / 1000 / 60 / 60);
        let minute = parseInt((time - hour * 60 * 60 * 1000) / 1000 / 60);
        return hour + "h" + minute + "m";
      },
      // 返回日期的年月日对象
      allDateObj(dateStr) {
        let splitDate = dateStr.split(/[-|\s|:]/g);
        let year = parseInt(splitDate[0]);
        let month = parseInt(splitDate[1]);
        let day = parseInt(splitDate[2]);
        let hour = parseInt(splitDate[3]);
        let minute = parseInt(splitDate[4]);
        let dateObj = new Date(year, month - 1, day);
        let week = dateObj.getDay();
        return {
          year: year,
          month: month,
          day: day,
          week: week,
          hour: hour,
          minute: minute
        }
      },
      // 航班地址
      planePlace(city, airport, term) {
        return city + airport + ((term == "--" || term == null) ? "" : term)
      },
      // 航班具体时间
      planeTime(time) {
        return time.substring(10)
      },
      // 航班舱位
      cabin(oldCabin, detail) {
        let cabin = "";
        switch (oldCabin) {
          case 'F':
            cabin = `头等舱(${detail})`;
            break;
          case 'Y':
            cabin = `经济舱(${detail})`;
            break;
          case 'C':
            cabin = `商务舱(${detail})`;
            break;
        };
        return cabin
      },
      // 航班餐食
      meal(oldMeal) {
        var meal = '';
        // 判断餐食
        switch (oldMeal) {
          case 'B':
            meal = '含早餐';
            break;
          case 'L':
            meal = '含午餐';
            break;
          case 'D':
            meal = '含晚餐';
            break;
          case 'S':
            meal = '含点心';
            break;
        };
        return meal
      },
      // 航班日期
      createNeedDate(oldDate) {
        let needDate = this.allDateObj(oldDate);
        let weekStr = "日一二三四五六";
        let week = '周' + weekStr[needDate.week];
        return oldDate.split(/[\s]/g)[0] + " " + week;
      },
      /**乘客类型**/
      judgeUsrType(u) {
        var passengerName = "";
        switch (u) {
          case 'ADT':
            passengerName = "成人";
            break;
          case 'CHD':
            passengerName = "儿童";
            break;
          case 'INF':
            passengerName = "婴儿";
            break;
          default:
            passengerName = "无";
            break;
        }
        return passengerName;
      },
      // 点击行李额按钮
      clickLuggageBtn(item, index) {
        this.displayLuggageLimit = true;
        this.propsLuggage = {
          ffpCardNo: this.memberInfo.memberID,
          ffpId: this.memberInfo.id,
          loginKeyInfo: this.memberInfo.loginKeyInfo,
          memberLevel: this.memberInfo.memberLevelCode,
          flightType: this.pageNeedInfo.interFlag,
          cabinGrade: item.cabinClass,
          destination: item.arrCity,
          type: index
        }
      },
      // 关闭行李额页面
      closeLuggageLimit() {
        this.displayLuggageLimit = false;
      },
      // 点击增值服务
      clickIncrementService() {
        this.displayIncrement = !this.displayIncrement;
      },
      // 点击价格订单详情按钮
      clickPriceDetail() {
        this.displayPriceDetail = true;
      },
      // 关闭价格详情页面
      closePriceDetail() {
        this.displayPriceDetail = false;
      },
      // 点击退改规则按钮
      clickRules() {
        if (this.orderPayType == AllOrderPayType.PLANE) { //机票
          this.ticketCanShow = true;
        } else if (this.orderPayType == AllOrderPayType.CHANGE_DATE) { //改期
          this.changeCanShow = true;
        } else if (this.orderPayType == AllOrderPayType.CABIN_LEFT) { //升舱
          this.cabinCanShow = true;
        }
      },
      // 关闭退改规则
      closeRulesPage() {
        this.displayRulesPage = false;
      },
      /**证件类型**/
      judgeCardType(t, passengerType) {
        var certText = "";
        if (passengerType == 'INF') {
          return '出生日期'
        }
        switch (t) {
          case 'NI':
            certText = "身份证";
            break;
          case 'PP':
            certText = "护照";
            break;
          case 'MTP':
            certText = "台胞证 ";
            break;
          case 'ORI':
            certText = "回乡证 ";
            break;
            //case 'MIL':certText="军官证";break;
          case 'HTPP':
            certText = "港澳通行证";
            break;
          case 'TPP':
            certText = "台湾通行证";
            break;
          case 'HMT':
            certText = "港澳台居民居住证";
            break;
          case 'NIPP':
            certText = "外国人永久居留身份证";
            break;
          case 'GM':
            certText = "残疾军人证";
            break;
          case 'JC':
            certText = "伤残人民警察证";
            break;
          default:
            certText = "其它证件";
            break;
        }
        return certText;
      },
      // 查询订单详情
      searchOrderDetail() {
        let that = this;
        controller
          .getJSON({
            method: "POST",
            url: requesturl.MY_ORDER.PLANE_ORDER_DETAIL,
            oldParams: that.searchParams()
          })
          .then(that.searchSuccess)
          .catch(that.searchError);
      },
      // 查询参数
      searchParams() {
        return {
          "channelOrderNo": this.pageData.channelOrderNo,
          "orderNo": this.pageData.orderNo,
          "customerNo": this.memberInfo.id,
          "cardNo": "HO" + this.memberInfo.memberID,
          "loginKeyInfo": this.memberInfo.loginKeyInfo
        };
      },
      // 查询成功
      searchSuccess(result) {
        if (result.resultCode == ResultCode.SUCCESS) {
          this.pageNeedInfo = result;
          this.orderPassengerInfoList = result.orderPassengerInfoList;
          this.allPlaneInfor = this.orderPassengerInfoList[0].segmentPriceInfoList;
          this.currentOrderClass();
          this.currentOrderType();
          this.priceDetailData();
        } else {
          controller.toast({
            str: result.errorInfo
          });
        }
      },
      // 创建保险信息
      createInsurance() {
        let insurance = [];
        let insuranceCount = 0;
        let oldInsurance = [];
        for (let i = 0; i < this.orderPassengerInfoList.length; i++) {
          if (this.orderPassengerInfoList[i].insuranceList) {
            insuranceCount++;
            oldInsurance = this.orderPassengerInfoList[i].insuranceList;
          }
        }
        if (insuranceCount > 0) {
          for (let i = 0; i < oldInsurance.length; i++) {
            oldInsurance[i].insuranceNumber = oldInsurance[i].insuranceNumber * insuranceCount;
            insurance.push(oldInsurance[i]);
          }
        }
        this.newInsurance = insurance;
      },
      // 价格详情数据
      priceDetailData() {
        console.log(123);
        let detailData = {};
        let orderType = this.orderPayType;
        if (orderType == AllOrderPayType.PLANE) { //机票
          this.createInsurance();
          if (this.newInsurance.length>0) { //保险
            detailData.insuranceList = this.newInsurance;
          }
          if (this.pageNeedInfo.wifiBuyList) { //境外wifi
            detailData.wifiBuyList = this.pageNeedInfo.wifiBuyList;
          }
          if (this.pageNeedInfo.loungeBuyList) { //贵宾休息室
            detailData.loungeBuyList = this.pageNeedInfo.loungeBuyList;
          }
          if (this.pageNeedInfo.baggageBuyList) { //逾重行李
            detailData.baggageBuyList = this.pageNeedInfo.baggageBuyList;
          }
          if (this.pageNeedInfo.tripCertSendInfo) { //邮寄行程单
            detailData.tripCertSendInfo = this.pageNeedInfo.tripCertSendInfo;
          }
          detailData.couponAmount = this.pageNeedInfo.couponAmount; //优惠券
          detailData.ffpUseTotalScore = this.pageNeedInfo.useScore; //积分抵扣
          console.log(this.orderPassengerInfoList);
          detailData.flightTicket = this.dealFlightTicket(this.orderPassengerInfoList); //机票信息
          detailData.orderTotalAmount = this.pageNeedInfo.actualAmount; //总价格
        } else if (orderType == AllOrderPayType.CABIN_LEFT) { //升舱
          console.log(124);
          detailData.upCabin = true;
          let cabinTicketCount = 0;
          for (let i = 0; i < this.allPlaneInfor.length; i++) {
            if (this.allPlaneInfor[i].useUpgradeCouponFlag) {
              cabinTicketCount++;
            }
          }
          console.log(126);
          if (cabinTicketCount == 0) {
            detailData.orderName = "升舱差价";
            detailData.orderContent = "￥" + (parseFloat(this.pageNeedInfo.actualAmount) + parseInt(this.pageNeedInfo.useScore));
          } else {
            detailData.orderName = "头等舱权益券";
            detailData.orderContent = cabinTicketCount + "张";
          }
          detailData.ffpUseTotalScore = this.pageNeedInfo.useScore; //积分抵扣
          detailData.orderTotalAmount = this.pageNeedInfo.actualAmount; //总价格
        } else if (orderType == AllOrderPayType.CHANGE_DATE) { //改期
          detailData.changeDate = this.dealChangeDateData(this.orderPassengerInfoList); //改期信息
          detailData.orderTotalAmount = this.pageNeedInfo.actualAmount; //总价格
        }
        this.orderDetail = detailData;
      },
      // 处理机票数据
      dealFlightTicket(flightTicket) {
        let flightTickObj = {};
        let flightTickArr = [];
        for (let i = 0; i < flightTicket.length; i++) {
          let key = flightTicket[i].passengerType;
          if (flightTickObj[key]) {
            flightTickObj[key].count = ++flightTickObj[key].count;
          } else {
            flightTickObj[key] = flightTicket[i];
            flightTickObj[key].count = 1;
            flightTickObj[key].chName = this.judgeUsrType(flightTicket[i].passengerType);
            flightTickObj[key].totalPrice = this.flightPrice(flightTicket[i]);
            flightTickObj[key].taxPrice = this.flightTax(flightTicket[i]);
          }
        }
        for (var key in flightTickObj) {
          flightTickArr.push(flightTickObj[key]);
        }
        return flightTickArr
      },
      // 处理改期的价格详情数据
      dealChangeDateData(flightTicket) {
        let flightTickObj = {};
        let flightTickArr = [];
        for (let i = 0; i < flightTicket.length; i++) {
          let key = flightTicket[i].passengerType;
          if (flightTickObj[key]) {
            flightTickObj[key].count = ++flightTickObj[key].count;
          } else {
            flightTickObj[key] = flightTicket[i];
            flightTickObj[key].count = 1;
            flightTickObj[key].ticketPrice = this.ticketPriceDifference(flightTicket[i]);
            flightTickObj[key].poundage = flightTicket[i].upgradeFee;
            flightTickObj[key].totalPrice = this.totalPriceDifference(flightTicket[i]);
            flightTickObj[key].chName = this.judgeUsrType(flightTicket[i].passengerType)
          }
        }
        for (var key in flightTickObj) {
          flightTickArr.push(flightTickObj[key]);
        }
        console.log(535353);
        console.log(flightTickArr);
        return flightTickArr
      },
      // 机票实际价格
      flightPrice(item) {
        return Number(item.parPrice) + this.flightTax(item);
      },
      // 机票税费
      flightTax(item) {
        return Number(item.yqtax) + Number(item.cntax) + Number(item.otherTax) + Number(item.qfee);
      },
      // 票面差价
      ticketPriceDifference(flight) {
        return Number(flight.parPrice) - Number(flight.upgradeFee);
      },
      // 总差价
      totalPriceDifference(flight) {
        return Number(flight.parPrice) + Number(flight.cntax) + Number(flight.yqtax) + Number(flight.otherTax) + Number(flight.qfee);
      },
      // 订单是哪一种订单（升舱，改期，机票）
      currentOrderClass() {
        let orderSort = this.pageNeedInfo.orderSort;
        if (orderSort == "Normal") { //机票
          this.orderPayType = AllOrderPayType.PLANE;
        } else if (orderSort == "Upgrade") { //升舱
          this.orderPayType = AllOrderPayType.CABIN_LEFT;
          console.log(this.orderPayType);
        } else if (orderSort == "Change") { //改期
          this.orderPayType = AllOrderPayType.CHANGE_DATE;
        }
      },
      // 获取当前订单状态(已支付，已取消，待支付)
      currentOrderType() {
        if(this.pageNeedInfo.orderPayState  == 'UnPay') {//代付款
          this.currentPayState = this.allPayState.READY_PAY;
          // 开始倒计时
          this.timeDown(this.pageNeedInfo.orderRemainTime);
        } else if(this.pageNeedInfo.orderPayState  == 'Pay') {//已支付
          this.currentPayState = this.allPayState.HAS_PAY;
        } else if(this.pageNeedInfo.orderPayState  == 'Cancel') {//已取消
          this.currentPayState = this.allPayState.CANCEL;
        } else if(this.pageNeedInfo.orderPayState  == 'Refunding') {//退款中
          this.currentPayState = this.allPayState.REFUND;
        } else if(this.pageNeedInfo.orderPayState  == 'Refund') {//已退款
          this.currentPayState = this.allPayState.HAS_REFUND;
        } 
      },
      formaIOSDate(date) {
        var sDate, sTime, oDate;
        var y, M, d, h, m, s;
        if ((typeof date) != 'string') return false;
        sDate = date.split('-');
        if (date.indexOf(' ') >= 0) {
          var spt = date.split(' ');
          sDate = spt[0].split('-');
          sTime = spt[1].split(':');
          h = sTime[0] ? sTime[0] : '';
          m = sTime[1] ? sTime[1] : '';
          s = sTime[2] ? sTime[2] : '';
        }
        y = sDate[0];
        M = sDate[1] - 1;
        d = sDate[2];
        return new Date(y, M, d, h, m, s);
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
      // 倒计时结束
      timeOut() {
        this.searchOrderDetail();
      },
      // 处理毫秒值
      dealTime(time) {
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
      // 查询失败
      searchError() {
        controller.toast({
          str: "查询航班网络问题"
        });
      },
      clickBackBtn() {
        controller.close();
      },
      // 展开航线
      openPlane(index) {
        let newOpenPlane = [];
        for(let i=0;i < 2; i++) {
          if(i == index) {
            newOpenPlane[i] = true;
          } else {
            newOpenPlane[i] = false;
          }
        }
        this.hasOpenPlane = newOpenPlane;
      }
    },
    computed: {
      allAddService() {
        let serviceText = "";
        if (this.pageNeedInfo.wifiBuyList) {
          serviceText += "境外WI-FI、";
        }
        if (this.pageNeedInfo.loungeBuyList) {
          serviceText += "贵宾休息室、";
        }
        if (this.pageNeedInfo.baggageBuyList) {
          serviceText += "逾重行李、";
        }
        if (this.pageNeedInfo.tripCertSendInfo) {
          serviceText += "邮寄行程单、";
        }
        if (this.orderPassengerInfoList.length > 0 && this.orderPassengerInfoList[0].insuranceList) {
          serviceText += "保险、";
        }
        return serviceText.slice(0, -1);
      },
      payState() {
        if (this.currentPayState === AllPayState.HAS_PAY) {
          return "已支付";
        }
        if (this.currentPayState === AllPayState.READY_PAY) {
          return "待付款";
        }
        if (this.currentPayState === AllPayState.CANCEL) {
          return "已取消";
        }
        if (this.currentPayState === AllPayState.REFUND) {
          return "退款中";
        }
        if (this.currentPayState === AllPayState.HAS_REFUND) {
          return "已退款";
        }
        return "";
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
    min-height: 93%;
    margin: 0 auto;
  }
  .header-wrap {
    padding: 0 rem(30);
    padding-bottom: rem(30);
    box-sizing: border-box;
    background: linear-gradient(180deg, rgba(215, 53, 88, 1) 0%, rgba(196, 51, 100, 1) 100%);
    box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    color: #fff;
    .line-1 {
      margin-top: rem(187);
      line-height: rem(42);
      .text {
        font-size: rem(42);
        font-weight: 600;
        color: #fff;
      }
      .money {
        &>div {
          display: inline-block;
        }
        text-align: right;
        font-size: 0;
        .num {
          font-size: rem(42);
          color: #fff;
          line-height: 0;
          vertical-align: middle;
          ;
          span {
            font-size: rem(22);
          }
        }
        .tip-btn {
          width: rem(24);
          height: rem(24);
          margin-left: rem(8);
          vertical-align: bottom;
          @include bg("./img/hasPay_tip.png");
        }
      }
    }
    .line-2 {
      margin-top: rem(20);
      .timeDown-tip {
        font-size: rem(22);
        line-height: rem(22);
        color: #fff;
        span {
          display: inline-block;
        }
        .time {
          font-weight: bold;
        }
        .icon {
          width: rem(22);
          height: rem(22);
          margin: 0 rem(5);
          @include bg("./img/readyPay_time.png");
        }
      }
      .haspay-tip {
        font-size: rem(22);
        line-height: rem(22);
        color: #fff;
        .text-2 {
          margin-top: rem(15);
        }
      }
      .rules-btn {
        &>div {
          display: inline-block;
        }
        font-size: 0;
        line-height: rem(24);
        .text {
          font-size: rem(22);
          line-height: 0;
          vertical-align: middle;
        }
        .img {
          width: rem(24);
          height: rem(24);
          @include bg("./img/hasPay_arrow.png");
          vertical-align: middle;
        }
      }
    }
    .all-btn {
      margin-top: rem(30);
    }
    .readyPay-btn {
      .btn {
        width: rem(335);
        height: rem(68);
        line-height: rem(68);
        text-align: center;
        @include border-radius(rem(6));
        font-size: rem(28);
        background-color: #fff;
      }
      .cancel-btn {
        margin-right: rem(10);
        color: #848484;
      }
      .pay-btn {
        margin-left: rem(10);
        color: #B82970;
      }
    }
    .refund-insurance {
      margin-right: rem(20);
      height: rem(68);
      line-height: rem(68);
      text-align: center;
      @include border-radius(rem(6));
      background-color: #fff;
      color: #848484;
      font-size: rem(28);
    }
    .apply-btn {
      height: rem(68);
      line-height: rem(68);
      text-align: center;
      @include border-radius(rem(6));
      background-color: #fff;
      color: #848484;
      font-size: rem(28);
    }
  }
  .content-wrap {
    padding: rem(10) rem(30) rem(60) rem(30);
    .come-style {
      margin-top: rem(20);
      box-shadow: 0px rem(6) rem(10) 0px rgba(0, 0, 0, 0.02);
      @include border-radius(rem(6));
      background-color: #fff;
      overflow: hidden;
    }
    .current-plane-infor {
      .close-wrap {
        padding: 0 rem(30);
        height: rem(112);
        .signal {
          margin-top: rem(42);
          padding: rem(2) rem(8);
          line-height: rem(28);
          font-size: rem(24);
          font-weight: 600;
          text-align: center;
          background: linear-gradient(324deg, rgba(225, 185, 113, 1) 0%, rgba(227, 205, 158, 1) 100%);
          @include border-radius(rem(4));
          color: #fff;
        }
        .center-wrap {
          margin-left: rem(20);
          .city-name {
            margin-top: rem(23);
            font-size: rem(28);
            line-height: rem(28);
            color: #3A3D50;
            font-weight: 600;
          }
          .date {
            margin-top: rem(14);
            color: #ADADAD;
            font-size: rem(24);
            line-height: rem(24);
          }
        }
        .right-wrap {
          font-size: rem(28);
          line-height: rem(112);
          color: #CB9D6D;
        }
      }
    }
    .every-flight-infor {
      padding: rem(30);
      .line-1 {
        div {
          padding: rem(2) rem(8);
          background: linear-gradient(324deg, rgba(225, 185, 113, 1) 0%, rgba(227, 205, 158, 1) 100%);
          @include border-radius(rem(4));
          font-size: rem(24);
          font-weight: 600;
          color: #fff;
        }
        .date {
          margin-left: rem(8);
        }
        .luggage-btn {
          text-align: right;
          font-size: 0;
          padding: 0;
          background: none;
          font-weight: 400;
          span {
            display: inline-block;
            vertical-align: middle;
          }
          .img {
            width: rem(24);
            height: rem(24);
            @include bg("./img/luggage_tip.png");
          }
          .text {
            margin-left: rem(8);
            font-size: rem(24);
            color: #848484;
          }
        }
      }
      .line-2 {
        margin-top: rem(12);
        font-size: rem(24);
        color: #ADADAD;
      }
      .line-3 {
        margin-top: rem(12);
        &>.come-style {
          margin-top: 0;
          box-shadow: none;
          .add-day {
            height: rem(22);
            font-size: rem(22);
            line-height: rem(22);
            color: #3A3D50;
            font-weight: 600;
          }
          .time {
            font-size: rem(42);
            line-height: rem(42);
            font-weight: 500;
            color: #3A3D50;
          }
          .place {
            margin-top: rem(8);
            font-size: rem(24);
            line-height: rem(24);
            color: #848484;
          }
        }
        .fly-time {
          overflow: hidden;
          .time {
            margin-top: rem(22);
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
          .stop-over {
            margin-top: rem(7);
            font-size: rem(20);
            line-height: rem(20);
            color: #CB9D6D;
            text-align: center;
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
      }
    }
    .plane-infor {
      .title {
        height: rem(48);
        line-height: rem(48);
        text-align: center;
        background: linear-gradient(270deg, rgba(225, 185, 113, 1) 0%, rgba(227, 205, 158, 1) 100%);
        font-size: rem(28);
        font-weight: 600;
        color: #fff;
      }
      .cabin-type {
        padding-left: rem(30);
        height: rem(88);
        line-height: rem(88);
        font-size: rem(28);
        color: #3A3D50;
        span {
          margin: 0 rem(8);
          color: #ADADAD;
        }
      }
    }
    .person-infor {
      margin-top: rem(20);
      &>.content {
        position: relative;
      }
      .title {
        height: rem(50);
        line-height: rem(50);
        padding-left: rem(30);
        font-size: rem(24);
        color: #ADADAD;
      }
      .content {
        margin-top: 0;
        padding: rem(30);
        color: #3A3D50;
        font-size: rem(28);
        line-height: rem(28);
        .name {
          width: rem(152);
          font-weight: 600;
        }
        .infor-content {
          color: #CCCCCC;
        }
        .infor-2 {
          margin-top: rem(20);
        }
        .infor-3 {
          margin-top: rem(20);
        }
      }
    }
    .contact-person {
      padding: rem(30);
      .name {
        width: rem(152);
        font-weight: 600;
        color: #3A3D50;
        font-size: rem(28);
      }
      .infor {
        font-size: rem(28);
        line-height: rem(28);
        color: #3A3D50;
      }
      .infor-2 {
        margin-top: rem(20);
      }
    }
    .increment-service {
      .display-wrap {
        display: relative;
        height: rem(112);
        line-height: rem(112);
        padding: 0 rem(30);
        .name {
          width: rem(152);
          font-weight: 600;
          color: #3A3D50;
        }
        .infor {
          font-size: rem(24);
          color: #848484;
          span {
            display: inline-block;
            width: rem(430);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .rotate-btn {
          margin-left: rem(24);
          width: rem(24);
          height: rem(112);
          @include bg2("./img/drop-down.png");
          transition: all .3s;
          &.active {
            transform: rotate(180deg);
          }
        }
      }
      .hidden-wrap {
        .every-service {
          display: relative;
          padding: rem(30);
          .title {
            font-size: rem(28);
            color: #3A3D50;
          }
          &>.content {
            margin-top: rem(18);
          }
          .every-infor {
            margin-top: rem(12);
            font-size: rem(24);
            color: #848484;
            .name {
              width: rem(160);
            }
          }
        }
      }
    }
    .order-infor {
      padding: rem(30);
      .every-order-infor {
        font-size: rem(28);
        line-height: rem(28);
        color: #3A3D50;
        .name {
          font-weight: 600;
          width: rem(152);
        }
      }
      .order-time {
        margin-top: rem(30);
      }
    }
  }
  .delete-btn {
    position: absolute;
    bottom: rem(-84);
    left: 0;
    width: rem(750);
    text-align: center;
    font-size: 0;
    padding-bottom: rem(60);
    &>div {
      display: inline-block;
    }
    .img {
      width: rem(24);
      height: rem(24);
      @include bg("./img/hasPay_delete.png");
      vertical-align: middle;
    }
    .text {
      margin-left: rem(10);
      font-size: rem(24);
      color: #848484;
      vertical-align: middle;
      line-height: 0;
    }
  }
  .com-border-bottom {
    @include bd-bottom(#f4f4f4);
  }
  .style-ios {
    .com-border-bottom {
      @include bd-bottom-ios(#f4f4f4);
    }
  } // 规则
  .rulesInfo {
    .title {
      font-size: rem(28);
      line-height: rem(28);
      color: #3A3D50;
    }
    dl {
      margin-top: rem(60);
      font-size: rem(24);
      line-height: rem(34);
      color: #848484;
      &.first-dl {
        margin-top: rem(20);
      }
    }
    dd {
      margin-top: rem(10);
    }
  }
</style>
