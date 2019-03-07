<template>
  <div id="app">
    <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
    <div class="main">
      <div class="main-wrap">
        <div class="every-rules">
          <div class="title">1.购买规则</div>
          <div class="content">每位旅客的账户中未使用的权益券的数量不得超过5张；</div>
        </div>
        <div class="every-rules">
          <div class="title">2.使用规则</div>
          <div class="content">
            <p>持有行李额度兑换券的旅客可在官网、APP购票时兑换使用；</p>
            <p class="margin-top">每位旅客每个航段仅可使用1张行李额度兑换券；</p>
            <p class="margin-top">行李券使用实行“多不退、少需补”的原则，如实际行李重量超过购买重量，请在现场补足行李额度；</p>
            <p class="margin-top">适用航线：吉祥航空实际承运的由虹桥出港前往三亚、南昌、毕节、厦门、包头、乌鲁木齐、重庆、太原、武汉、北京、广东等地的部分航线，具体以实际情况为准；</p>
            <p class="margin-top">"赠送中"的权益券若受赠人24小时未领取，则退回至原会员账户中。</p>
          </div>
        </div>
        <div class="every-rules">
          <div class="title">3.退款规则</div>
          <div class="content">行李券在有效期内且未使用时可提交退款申请。</div>
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
        // 设置头部样式
        setTitleStyle: {
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
          pageUrl: '/' + Page.luggage.home.pageUrl
        });
      },
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
