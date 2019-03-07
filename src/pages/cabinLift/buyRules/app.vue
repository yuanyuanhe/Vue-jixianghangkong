<template>
  <div id="app">
    <Header @clickHeader='clickBackBtn' :setTitleStyle="titleStyle"></Header>
    <div class="main">
      <div class="main-wrap">
        <div class="every-rules">
          <div class="title">1.购买规则</div>
          <div class="content">每位旅客的账户中未使用的权益券的数量不得超过5张；</div>
        </div>
        <div class="every-rules">
          <div class="title">2.使用规则</div>
          <div class="content">
            <p>持有适用航线经济舱客票的旅客，可在APP“快速升舱”页面凭客票号兑换使用，一张兑换券仅可办理单人、单航段升舱；</p>
            <p class="margin-top">适用航线：吉祥航空实际承运的国内航线使用；</p>
            <p class="margin-top">“赠送中”的权益券若受赠人24小时未领取，则退回至原会员账户中。</p>
          </div>
        </div>
        <div class="every-rules">
          <div class="title">3.退款规则</div>
          <div class="content">
            <p>升舱券不可提交退款申请。</p>
            <p class="margin-top">若已使用升舱券的客票发生自愿退票，则将升舱券退回至旅客账户，有效期不变（每张升舱券仅可退回1次）。</p>
            <p class="margin-top">若已使用升舱券的客票发生非自愿退票，则将升舱券退回至旅客账户，有效期不变（退回次数不限）。</p>
            <p class="margin-top">（注：一期升舱客票退票规则：请拨打吉祥航空客户服务热线95520办理退票）</p>
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
  import Page from "common/deploy/page";
  export default {
    data() {
      return {
        isUseHeader: false, 
        pageData: {},
        titleStyle: {
          title: '购买须知',
          titlestyle: 1
        }
      };
    },
    created() {
      let that = this;
      controller.ready().then(data => {
        that.pageData = data.data;
      })
    },
    components: {
      Header
    },
    methods: {
      clickBackBtn() {
        controller.close({
          pageUrl: '/' + Page.cabinLift.buyCabinTicket.pageUrl
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "~common/styles/common/common.scss";
  body {
    background: #fff!important;
  }
  .main-wrap {
    width: rem(750);
    margin: 0 auto;
    padding: 0 rem(40);
    @include box-sizing(border-box);
    .every-rules {
      margin-top: rem(40);
      .title {
        color: #3A3D50;
        font-size: rem(28);
      }
      .content {
        margin-top: rem(20);
        color: #848484;
        font-size: rem(24);
        line-height: rem(34);
        .margin-top {
          margin-top: rem(10);
        }
      }
    }
  }
</style>
