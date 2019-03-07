<template>
  <div id="app">
    <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
    <div class="main">
      <div class="main-wrap">
        <div class="every-cabinlift" v-for="(item, index) in cabinInfor" :key="'cabinlift'+index">
          <div class="plane-infor com-border-bottom">
            <div class="line-1 flexbox">
              <div class="date">{{item.flightDate}} {{item.flightWeek}}</div>
              <div class="plane-num">{{item.flightNo}}</div>
            </div>
            <div class="line-2 flexbox">
              <div class="start-wrap come-style flex-1">
                <div class="add-day"></div>
                <div class="time">{{item.deptTime}}</div>
                <div class="place">{{item.deptCityName+item.deptAirPortName+item.deptTerminal}}</div>
              </div>
              <div class="fly-time">
                <div class="time">{{dealFlyTime(item.flightTime)}}</div>
                <div class="img"></div>
                <div class="pass-place" v-if="item.stopCity">经停{{item.stopCityName}}</div>
              </div>
              <div class="end-wrap come-style flex-1">
                <div class="add-day">{{item.days>0?'+1天':''}}</div>
                <div class="time">{{item.arrTime}}</div>
                <div class="place">{{item.arrCityName+item.arrAirPortName+item.arrTerminal}}</div>
              </div>
            </div>
          </div>
          <div class="can-cabinlift flexbox" v-if="item.ifUp">
            <div class="txt flex-1">当前舱位：{{item.cabinClassName
}}({{item.cabin}})</div>
            <div class="btn" @click="upCabinLift(index)">升舱</div>
          </div>
          <div class=" no-cabinlift" v-if="!item.ifUp && !isSellOut(item.isSellOut)">
            <div class="txt-1">当前舱位：{{item.cabinClassName
}}({{item.cabin}})</div>
            <div class="txt-2">{{item.notUpReason}}</div>
          </div>
          <div class="sell-out flexbox" v-if="!item.ifUp && isSellOut(item.isSellOut)">
            <div class="txt-1 flex-1">当前舱位：{{item.cabinClassName
}}({{item.cabin}})</div>
            <div class="txt-2 flex-1">{{item.notUpReason}}</div>
          </div>
        </div>
        <!-- <div class="every-cabinlift">
          <div class="plane-infor com-border-bottom">
            <div class="line-1 flexbox">
              <div class="date">2018-04-11 周二</div>
              <div class="plane-num">HO1234</div>
            </div>
            <div class="line-2 flexbox">
              <div class="start-wrap come-style flex-1">
                <div class="add-day"></div>
                <div class="time">10:35</div>
                <div class="place">浦东国际机场T2</div>
              </div>
              <div class="fly-time">
                <div class="time">5h30m</div>
                <div class="img"></div>
                <div class="pass-place">经停南京</div>
              </div>
              <div class="end-wrap come-style flex-1">
                <div class="add-day">+1天</div>
                <div class="time">16:05</div>
                <div class="place">首都机场T2</div>
              </div>
            </div>
          </div>
          <div class=" no-cabinlift ">
            <div class="txt-1">当前舱位：经济舱(V)</div>
            <div class="txt-2">当前舱位不符合升舱规则，如有疑问请咨询客服</div>
          </div>
        </div>
        <div class="every-cabinlift">
          <div class="plane-infor com-border-bottom">
            <div class="line-1 flexbox">
              <div class="date">2018-04-11 周二</div>
              <div class="plane-num">HO1234</div>
            </div>
            <div class="line-2 flexbox">
              <div class="start-wrap come-style flex-1">
                <div class="add-day"></div>
                <div class="time">10:35</div>
                <div class="place">浦东国际机场T2</div>
              </div>
              <div class="fly-time">
                <div class="time">5h30m</div>
                <div class="img"></div>
                <div class="pass-place">经停南京</div>
              </div>
              <div class="end-wrap come-style flex-1">
                <div class="add-day"></div>
                <div class="time">16:05</div>
                <div class="place">首都机场T2</div>
              </div>
            </div>
          </div>
          <div class="sell-out flexbox">
            <div class="txt-1 flex-1">当前舱位：经济舱(V)</div>
            <div class="txt-2 flex-1">头等舱位已售罄</div>
          </div>
        </div> -->
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
        // 头部白色
        blankHeader: true,
        // 舱位信息
        cabinInfor: {},
        // 设置头部样式
        setTitleStyle: {
          title: '选择需要升舱的航班',
          titlestyle: 4
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
        that.cabinInfor = that.pageData.searchResult;
        console.log(111);
        console.log(that.cabinInfor);
      });
    },
    methods: {
      upCabinLift(index) {
        let jumpPage = Page.cabinLift.confirmCabinLift;
        let personInfor = {
          personId: this.cabinInfor[index].ticketNo,
          personName: this.pageData.personInfor.personName
        }
        let transmitData = {
          personInfor: personInfor,
          searchResult: [this.cabinInfor[index]]
        };
        controller.open({
            winName: jumpPage.winName,
            path: jumpPage.pageUrl,
            data: transmitData,
            closeLastPage: false
        });
      },
      isSellOut(reason) {
        if(reason && reason != "") {
          if(reason.indexOf("售罄") != -1) {
            return true;
          }
        }
        return false;
      },
      dealFlyTime (time) {
        let hour = parseInt(time/1000/60/60);
        let minute = parseInt((time - hour*60*60*1000)/1000/60);
        return hour+'h'+minute+'m';
      },
      clickBackBtn() {
        controller.close();
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
    padding: rem(18) rem(30) rem(71) rem(30);
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  .every-cabinlift {
    margin-top: rem(20);
    box-shadow:0px 6px 10px 0px rgba(0,0,0,0.02);
    background-color: #fff;
    @include border-radius(rem(6));
    overflow: hidden;
    .plane-infor {
      position: relative;
      padding: 0 rem(30);
      padding-bottom: rem(32);
      .line-1 {
        margin-top: rem(32);
        &>div {
          padding: rem(2) rem(8);
          background:linear-gradient(324deg,rgba(225,185,113,1) 0%,rgba(227,205,158,1) 100%);
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
            font-size: rem(22);
            color: #3A3D50;
            font-weight: 600;
          }
          .time {
            font-size: rem(42);
            color: #3A3D50;
            font-weight: 500;
          }
          .place {
            margin-top: rem(9);
            font-size: rem(24);
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
            margin-top: rem(25);
            font-size: rem(22);
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
            color: #CB9D6D;
            text-align: center;
          }
        }
      }
    }
    .can-cabinlift {
      padding: rem(17) rem(30) rem(20) rem(30);
      .txt {
        height: rem(58);
        line-height: rem(58);
        font-size: rem(24);
        color: #848484;
      }
      .btn {
        width: rem(130);
        height: rem(58);
        line-height: rem(58);
        text-align: center;
        background:linear-gradient(324deg,rgba(225,185,113,1) 0%,rgba(227,205,158,1) 100%);
        font-size: rem(26);
        font-weight: 600;
        @include border-radius(rem(4));
        color: #fff;
      }
    }
    .no-cabinlift {
      padding: rem(30);
      .txt-1 {
        font-size: rem(24);
        color: #848484;
      }
      .txt-2 {
        margin-top: rem(10);
        font-size: rem(22);
        color: #ADADAD;
      }
    }
    .sell-out {
      height: rem(85);
      line-height: rem(85);
      padding: 0 rem(30);
      .txt-1 {
        font-size: rem(24);
        color: #848484;
      }
      .txt-2 {
        font-size: rem(22);
        color: #ADADAD;
        text-align: right;
      }
    }
  }
  .com-border-bottom {
    @include bd-bottom(#f4f4f4);
  }
  .style-ios {
    .com-border-bottom {
      @include bd-bottom-ios(#f4f4f4);
    }
  }
</style>
