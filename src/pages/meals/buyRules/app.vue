<template>
  <div id="app">
     <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header> 
    <div class="main mainNotBottom">
      <div class="main-wrap">
        <div class="every-rules h1">
          尊敬的旅客，感谢您选择吉祥航空网上选餐服务。为了<br/>更好地体验该项服务，我们对您提供以下温馨提示。
        </div>
        <div class="every-rules">
          <div class="title">头等和公务选餐</div>
          <div class="content">
            <p>1.此项服务只适用于吉祥航空官网、APP客户端进行预订。</p> 
            <p>2.所有购买吉祥航空公务舱、头等舱客票且完成付款的旅客均可享受此项服务。（以购票舱位为准，临时升舱、有特殊餐食需求的旅客不适用）。</p> 
            <p>3.每位公务舱、头等舱客限订一份餐食，航班起飞前一日10时停止办理选餐。</p> 
            <p>4.已开通上海始发航班配餐，飞行时间在90分钟（含）以上配正餐、轻正餐、早餐的头等舱和商务舱航段。</p> 
            <p>5.如旅客变更班次、航段或舱位等，所预定的选餐记录将失效；旅客需再次上网重新选餐。</p> 
            <p>6.航班延误、取消或航班调配，预订的选餐可能会受到影响，敬请谅解。 最终解释权归上海吉祥航空股份有限公司。</p>
          </div>
        </div>
        <div class="every-rules">
          <div class="title">特殊餐食</div>
          <div class="content">
           <p>1.此项服务只适用于吉祥航空官网、APP客户端进行预订。</p> 
           <p>2.对于因宗教信仰或医疗原因提出特殊餐食需求的旅客，吉祥航空将竭力满足您的需求。旅客可在航班起飞前至少24小时（含）登陆吉祥航空官网、APP客户端查询并预定特殊餐食。</p> 
           <p>3.如旅客因健康或其它特殊原因，提出特殊餐食说明之外的特殊餐食需求时，请致电95520向客服人员准确、详细、清晰的表述，客服人员将在查询后及时回复预定情况。 </p>
           <p>4.杭州、大庆、沈阳、呼和浩特、包头、海拉尔、太原、珠海、南宁、桂林、贵阳、长沙、张家界、青岛、无锡、温州、宜昌、绵阳、武汉、南昌、威海、澳门始发航班暂无法提供穆斯林餐，敬请谅解。</p> 
           <p>5.特殊餐服务仅限正餐，轻正餐，点心，且每位旅客在一个航段上只能申请一人份特殊餐食（第二份是婴儿餐除外）。</p>
           <p>6.航班延误、取消或航班调配，预订的餐食可能会受到影响，敬请谅解。</p> 
           <p>最终解释权归上海吉祥航空股份有限公司。</p>
          </div>
        </div>
        <div class="every-rules">
          <div class="title">隐私</div>
          <div class="content">您在吉祥航空官网、APP客户端提供的个人信息，我们仅供网上<br/>选餐服务使用，并保留您的选餐预定记录，不会提供第三方另作<br/>他用。</div>
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
          titleStyle:{
                    title:'服务条款&隐私条款',
                    titlestyle: 4,
                    isUseH5:true,
                    barStyle:0,
                    closetype:null
              },
        pageData: {}
      };
    },
    created() {
      let that = this;
      controller.ready().then(data => {
       that.$set(that.titleStyle,'closetype',data.data.closetype)
          controller.clickBack(() => {
                    that.clickBackBtn()
             }) 
      })
    },
    components: {
      Header
    },
    methods: {
      clickBackBtn() {
         controller.close();      
      },      
    }
  };
</script>

<style lang="scss">
  @import "~common/styles/common/common.scss";
  body {
    font-family:PingFangSC-Regular;
    background: #fff!important;
  }
   header.g-header{
     .f-fx{
        &.white{
          @include box-shadow(inset 0 -1px 0 0 rgba(0, 0, 0, 0.10));
            .style-ios & {
               @include box-shadow(inset 0 -1px 0 0 rgba(0, 0, 0, 0.10));
            }
        }
     }
  } 
  .main-wrap {
    margin: 0 auto;
    padding: 0 rem(30);
    @include box-sizing(border-box);
    .h1{
      color:#3A3D50;
      font-size:rem(28);
      font-weight:400;
      line-height:rem(38);
    }
    .every-rules {
      margin-top: rem(40);
      .title {
        color: #3A3D50;
        font-size: rem(28);
        font-weight:400;
      }
      .content {
        margin-top: rem(20);
        color: #848484;
        font-size: rem(24);
        line-height: rem(34);
        font-weight:400;
       p{
          margin-top: rem(10);
        }
      }
    }
  }
</style>
