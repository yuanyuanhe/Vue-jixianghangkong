<template>
  <transition name='selectwrap'>
    <div class="city-select">
      <header class="search-header city-header">
        <div class="f-fx">
          <div class="m-search-wp flexbox">
            <div class="f-close" @click='closePage'></div>
            <div class="m-search-form flex-1 flexbox">
              <div class="search-btn"></div>
              <div class="input flex-1">
                <input type="text" placeholder="请输入中文/拼音" v-model="searchInput" @input='search' @focus="inputFocus" id="search">
              </div>
              <div class="empty-btn" @click='emptyInput'></div>
            </div>
            <div class="cancel-btn" @click="cancelSearch"><span v-show="displaySearchPage">取消</span></div>
          </div>
        </div>
      </header>
      <div class="select-content">
        <!-- tab切换页 -->
        <div class="change-list flexbox com-border-top">
          <div class="n-list list flex-1 com-border-right" :class="{'active': currentList == 0}" @click="clickChangeList(0)">国内</div>
          <div class="i-list list flex-1" :class="{'active': currentList == 1}" @click="clickChangeList(1)">国际/港澳台</div>
        </div>
        <!-- 城市列表页 -->
        <div class="city-list-wrap">
          <cube-index-list id='index-list' :data="pageDisplayData" :title="title" @select="selectItem" @title-click="clickTitle" ref='indexList'></cube-index-list>
        </div>
        <!-- 搜索结果页 -->
        <div class="search-result-page" v-show="displaySearchPage" :class="{'has-search-result': displaySearchResult}">
          <ul class="com-border-top" v-show="displaySearchResult&&hasSearchResult">
            <li class="com-border-bottom" v-for="(item,index) in searchResult" :key="'city'+index" @click="clickSearchCity(item)">{{item.cityName}}</li>
          </ul>
          <div class="no-search-result" v-show="displaySearchResult&&!hasSearchResult">
            暂无搜索结果
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {
    IndexList
  } from 'cube-ui'
  import Vue from 'vue'
  import controller from 'common/logic/controller'
  import requesturl from 'common/deploy/requesturl';
  Vue.use(IndexList)
  export default {
    data() {
      return {
        searchInput: '',
        notResult: false,
        // 查询到的所有的数据
        searchResult: [],
        // 页面展示的数据
        pageDisplayData: [],
        // 当前选中的list
        currentList: 0,
        // 显示搜索界面
        displaySearchPage: false,
        // 显示搜索结果界面
        displaySearchResult: false,
        // 是否有搜索结果
        hasSearchResult: false,
        // 城市列表
        cityList: []
      }
    },
    props: {
      // 顶部title
      title: {
        type: String,
        default: ''
      },
      // 出发城市
      starCity: {
        type: String,
        default: ""
      }
    },
    created() {
      // 请求城市列表
      let that = this;
      controller
        .getJSON({
          method: "POST",
          url: requesturl.FLIGHT_DYNAMIC.CITY_LIST,
          params: {}
        })
        .then(that.cityListSuc)
        .catch(that.cityListErr);
    },
    methods: {
      // 创建所有需要的数据
      createAllNeedData(cityList) {
        // 国内，国际数据分开
        this.createSepareteList(cityList);
        // 创造出需要的所有数据
        this.allNeedData = this.createNeedList(cityList);
        // 创造出需要的国内数据
        this.nationNeedData = this.createNeedList(this.nationCity);
        // 创造出需要的国际数据
        this.interNeedData = this.createNeedList(this.interCity);
        this.currentList = 0;
        this.pageDisplayData = this.nationNeedData;
      },
      // 找到到达城市
      findArrCity(cityName) {
        for(let i=0; i< this.cityList.length; i++) {
          if(this.cityList[i].cityName == cityName) {
            return this.cityList[i].airline
          }
        }
        return [];
      },
      // 取消搜索
      cancelSearch() {
        this.searchInput = "";
        this.displaySearchPage = false,
          this.displaySearchResult = false,
          this.hasSearchResult = false
      },
      // 切换列表
      clickChangeList(index) {
        this.currentList = index;
        if (index == 0) {
          this.pageDisplayData = this.nationNeedData;
        } else {
          this.pageDisplayData = this.interNeedData;
        }
      },
      // 构建国内国际城市列表
      createSepareteList(list) {
        let nationCity = []; //国内城市
        let interCity = []; //国际城市
        for (let i = 0; i < list.length; i++) {
          if (list[i].isInternational == "D") {
            nationCity.push(list[i]);
          } else {
            interCity.push(list[i]);
          }
        }
        this.nationCity = nationCity;
        this.interCity = interCity;
      },
      // 构建需要的城市列表数据
      createNeedList(list) {
        let newList = [];
        let newListIndex = -1;
        for (let i = 0; i < list.length; i++) {
          let firstKey = list[i].cityPinYin[0];
          if (newList[newListIndex] && newList[newListIndex].name == firstKey) {
            newList[newListIndex].items.push({
              name: list[i].cityName,
              value: {
                cityCode: list[i].cityCode,
                cityEName: list[i].cityEName,
                cityName: list[i].cityName,
                cityPinYin: list[i].cityPinYin,
                cityPinYinAbb: list[i].cityPinYinAbb,
                cityTimeZone: list[i].cityTimeZone,
                countryCode: list[i].countryCode,
                countryNm: list[i].countryNm,
                isHotCity: list[i].isHotCity,
                isInternational: list[i].isInternational
              }
            })
          } else {
            newListIndex++;
            newList[newListIndex] = {
              name: firstKey,
              items: [{
                name: list[i].cityName,
                value: {
                  cityCode: list[i].cityCode,
                  cityEName: list[i].cityEName,
                  cityName: list[i].cityName,
                  cityPinYin: list[i].cityPinYin,
                  cityPinYinAbb: list[i].cityPinYinAbb,
                  cityTimeZone: list[i].cityTimeZone,
                  countryCode: list[i].countryCode,
                  countryNm: list[i].countryNm,
                  isHotCity: list[i].isHotCity,
                  isInternational: list[i].isInternational
                }
              }]
            }
          }
        }
        return newList;
      },
      // 请求成功
      cityListSuc(data) {
        if(data) {
          this.cityList = data;
          this.createAllNeedData(this.cityList);
        } else {
          controller.toast({
             str: "城市列表为空",
             times: 2000
          });
        }
      },
      // 请求失败
      cityListErr() {
        controller.toast({
          str: "城市列表请求失败",
          times: 2000
        });
      },
      // 清空input
      emptyInput() {
        this.searchInput = '';
        this.search();
      },
      // 输入框获得焦点
      inputFocus() {
        this.displaySearchPage = true;
      },
      search() {
        if (this.searchInput) {
          this.displaySearchResult = true;
          this.searchResult = this.searchData(this.allNeedData);
          if (this.searchResult.length > 0) {
            this.hasSearchResult = true;
          } else {
            this.hasSearchResult = false;
          }
        } else {
          this.displaySearchResult = false;
        }
      },
      // 点击搜索到的城市
      clickSearchCity(data) {
        this.cancelSearch();
        this.$emit('clickSelectItem', data);
      },
      closePage() {
        this.closeOpt();
        // 清空搜索历史
        this.$emit('closeSelectPage');
      },
      selectItem(item) {
        // this.closeOpt();
        // item.clickElemStr = this.enter
        // this.$emit('clickSelectItem', item);
        // document.querySelector('#search').blur();
        this.$emit('clickSelectItem', item.value);
      },
      clickTitle(title) {
        console.log(title)
      },
      closeOpt() {
        this.cancelSearch();
        this.searchResult = [];
      },
      changeStyle() {
        let elem = this.$refs.indexList.$el;
        elem.style.height = 'calc(100% - .8rem)';
        setTimeout(() => {
          this.$refs.indexList.refresh();
        }, 2000)
      },
      // 搜索输入的值
      searchData(data) {
        let searchObj = [];
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].items.length; j++) {
            if (this.isSatisfy(data[i].items[j].value, this.searchInput)) {
              searchObj.push(data[i].items[j].value);
            }
          }
        }
        return searchObj;
      },
      // 判断是否满足搜寻的条件
      isSatisfy(dataObj, val) {
        // 城市名字
        let cityName = dataObj.cityName;
        // 城市拼音
        let cityPinYin = dataObj.cityPinYin.toLowerCase();
        // 输入框中输入的值
        let inputVal = val.toLowerCase().trim();
        if (
          cityName.indexOf(inputVal) > -1 ||
          cityPinYin.indexOf(inputVal) > -1
        ) {
          return true;
        }
        return false;
      },
      // 判断对象是否包含name
      isIncludeName(searchObj, name) {
        for (let i = 0; i < searchObj.length; i++) {
          if (searchObj[i].name === name) {
            return i;
          }
        }
        return -1;
      }
    },
    mounted() {
      // 修改index-list组件的样式
      this.changeStyle()
    },
    watch: {
      // 监听是否有到达城市
      starCity(newVal,oldVal) {
        if(newVal != "") {
          let arrCity = this.findArrCity(this.starCity);
          this.createAllNeedData(arrCity);
        } else {
          this.createAllNeedData(this.cityList);
        }
      }
    }
  }
</script>

<style lang="scss">
  .cube-index-list-nav > ul > li {
    color: #CB9D6D!important;
    font-weight: bold;
  }
  .cube-index-list-nav > ul > li.active {
    color: #CB9D6D!important;
  }
  .cube-index-list-nav {
    top: 40px!important;
    -webkit-transform: translateY(0)!important;
    transform: translateY(0)!important;
  }
</style>

<style lang="scss" scope>
  @import "~common/styles/common/common.scss";
  @import "~common/styles/common/mixin/layout.tlx";
  .selectwrap-enter-active,
  .selectwrap-leave-active {
    transition: all 400ms;
  }
  .selectwrap-enter,
  .selectwrap-leave-to {
    transform: translate3d(0, 100%, 0);
  }
  .info-tip {
    text-align: center;
    font-size: 0.3rem;
  }
  body.style-ios .city-select {
    padding-top: 0.4rem;
  }
  body.style-ios .select-content {
    top: 1.2rem;
  }
  @supports (top: constant(safe-area-inset-top)) or (top: env(safe-area-inset-top)) {
    body.style-ios .city-select {
      padding-top: constant(safe-area-inset-top) !important;
      padding-top: env(safe-area-inset-top) !important;
    }
    body.style-ios .select-content {
      top: 0.8rem!important;
      margin-top: constant(safe-area-inset-top) !important;
      margin-top: env(safe-area-inset-top) !important;
    }
  }
  .city-select {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: #fff;
  }
  .search-header {
    position: relative;
    z-index: 2;
    width: 100%;
    height: .8rem;
    background-color: #fff
  }
  .search-header .f-fx {
    position: fixed;
    width: 100%;
    height: .8rem
  }
  .search-header .m-search-wp .f-close {
    width: 1.02rem;
    height: .8rem;
    background: url(imgs/icon_closed.png) center no-repeat;
    background-size: .34rem
  }
  .search-header .m-search-wp .m-search-form {
    height: .64rem;
    margin-right: .3rem;
    margin-top: .08rem;
    border-radius: .32rem;
    background-color: #F8F8F8
  }
  .search-header .m-search-wp .m-search-form .search-btn {
    width: .65rem;
    height: .64rem;
    background: url(imgs/icon_search.png) center no-repeat;
    background-size: .32rem
  }
  .search-header .m-search-wp .m-search-form .empty-btn {
    margin-right: .2rem;
    height: .64rem;
    width: .3rem;
    background: url('./imgs/empty.png') no-repeat center;
    background-size: 100% auto;
    -webkit-background-size: 100% auto;
  }
  .search-header .m-search-wp .m-search-form .input {
    margin-right: .2rem
  }
  .search-header .m-search-wp .m-search-form .input input {
    width: 100%;
    height: .64rem;
    line-height: .64rem;
    font-size: .28rem;
    background: #F8F8F8;
  }
  .search-header .m-search-wp .m-search-form .input input::-webkit-input-placeholder {
    color: #ADADAD
  }
  .search-header .m-search-wp .m-search-form .input input:-ms-input-placeholder {
    color: #ADADAD
  }
  .search-header .m-search-wp .m-search-form .input input::placeholder {
    color: #ADADAD
  }
  .search-header .m-search-wp .cancel-btn span {
    font-size: rem(30);
    line-height: rem(80);
    color: #ADADAD;
    margin: 0 rem(20);
  }
  .select-content {
    position: absolute;
    top: rem(80);
    bottom: 0;
    left: 0;
    right: 0;
    .change-list {
      position: relative;
      height: rem(98);
      .list {
        position: relative;
        height: rem(98);
        line-height: rem(98);
        text-align: center;
        font-size: rem(32);
        color: #ADADAD;
        &.active {
          color: #25292F;
          font-weight: bold;
          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: rem(118);
            width: rem(140);
            height: rem(5);
            background-color: #E2C388;
            border-radius: rem(3);
          }
        }
      }
      .n-list {
        &::before {
          height: rem(48);
          top: rem(25);
        }
      }
    }
    .city-list-wrap {
      position: absolute;
      top: rem(98);
      left: 0;
      right: 0;
      bottom: 0;
    }
    .search-result-page {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .4);
      z-index: 50;
      &.has-search-result {
        background: #fff;
      }
      ul {
        position: relative;
        width: 100%;
      }
      li {
        position: relative;
        width: 100%;
        height: rem(80);
        line-height: rem(80);
        font-size: rem(25);
        padding-left: rem(30);
      }
      .no-search-result {
        height: rem(200);
        line-height: rem(200);
        text-align: center;
        font-size: rem(25);
      }
    }
  }
  .style-ios ul li:last-child:before {
    border-bottom: 1px solid #f4f4f4!important;
  }
  .com-border-right {
    @include bd-right(#E6E6E6);
  }
  .com-border-top {
    @include bd-top(#F4F4F4);
  }
  .com-border-bottom {
    @include bd-bottom(#F4F4F4);
  }
  .style-ios {
    .com-border-right {
      @include bd-right-ios(#E6E6E6);
    }
    .com-border-top {
      @include bd-top-ios(#F4F4F4);
    }
    .com-border-bottom {
      @include bd-bottom-ios(#F4F4F4);
    }
  }
</style>
