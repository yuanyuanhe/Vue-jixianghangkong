<template>
  <transition name='selectwrap'>
    <div class="city-select" >
      <header class="search-header city-header">
        <div class="f-fx">
          <div class="m-search-wp flexbox">
            <div class="f-close" @click='closePage'></div>
            <div class="m-search-form flex-1 flexbox">
              <div class="search-btn"></div>
              <div class="input flex-1">
                <input type="text" placeholder="请输入中文/拼音" v-model="searchInput"  @input='search' id="search">
              </div>
              <div class="empty-btn" @click='emptyInput'></div>
            </div>
          </div>
        </div>
	    </header>
      <cube-index-list
        id='index-list'
        :data="searchResult"
        :title="title"
         @select="selectItem"
        @title-click="clickTitle"
        ref='indexList'
        ></cube-index-list>
        <div class="info-tip" v-show='notResult'>没有搜索结果</div>
    </div>
  </transition>
</template>

<script>
  import {IndexList} from 'cube-ui'
  import Vue from 'vue'
  import controller from 'common/logic/controller'
  Vue.use(IndexList)
  export default {
    data() {
      return {
        searchInput: '',
        notResult: false,
        searchResult: []
      }
    },
    props: {
      // 进入城市选择页面的位置
      enter: {
        type: String,
        default: ''
      },
      // 顶部title
      title: {
        type: String,
        default: ''
      },
      // 选择数据
      selectData: {
        type: Array,
        default() {
          return []
        }
	  },
	  isShow: {
		  type: Boolean,
		  default: false
	  }
    },
    methods: {
        // 清空input
        emptyInput() {
        	this.searchInput = '';
        	this.search();
        },
        search() {
          this.searchResult = this.searchData(this.searchInput);
          if(this.searchResult.length === 0) {
            this.notResult = true;
          }
        },
        closePage () {
          this.closeOpt();
          // 清空搜索历史
          this.$emit('closeSelectPage');
        },
        selectItem(item) {
          this.closeOpt();
          item.clickElemStr = this.enter
          this.$emit('clickSelectItem', item);
          document.querySelector('#search').blur();
        },
        clickTitle(title) {
          console.log(title)
        },
        closeOpt() {
          this.searchInput = '';
		  controller.showBar(1);
		  this.searchResult = this.searchData(this.searchInput);
        },
        changeStyle() {
          let elem = this.$refs.indexList.$el;
          // elem.style.position = 'absolute'
          // elem.style.top = '0.8rem';
          // elem.style.left = '0';
          // elem.style.right = '0';
          // elem.style.bottom = '0';
          // elem.style.height = 'auto';
          elem.style.height = 'calc(100% - .8rem)';
          setTimeout(() => {
            
            this.$refs.indexList.refresh();
          },2000)
        },
        // 搜索输入的值
        searchData(val) {
            
            let searchObj = [];
            for(let i=0;i < this.selectData.length; i++) {
              let everyBlockItem = this.selectData[i].items;
              let everyBlockName = this.selectData[i].name;
              for(let j=0;j < everyBlockItem.length; j++) {
                  if(this.isSatisfy(everyBlockItem[j], val)) {
          
                    let currentIndex = this.isIncludeName(searchObj, everyBlockName);
                    if(currentIndex > -1) {
                      searchObj[currentIndex].items.push(everyBlockItem[j]);
                    } else {
                      searchObj.push({
                        name: everyBlockName,
                        items: [
                          everyBlockItem[j]
                        ]
                      })
                    }
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
          // 机场名字
          let airpotName = dataObj.name;
          // 机场三字码
          let airportVal = dataObj.value.toLowerCase();
          // 机场拼音
          let airportEName = dataObj.airPortEName.toLowerCase();
          // 输入框中输入的值
          let inputVal = val.toLowerCase().trim();
          if(
            airpotName.indexOf(inputVal) > -1 
            || airportVal.indexOf(inputVal) > -1 
			|| airportEName.indexOf(inputVal) > -1
            || cityName.indexOf(inputVal) > -1 
			|| cityPinYin.indexOf(inputVal) > -1
            ) {
            return true;
          }
          return false;
        },
        // 判断对象是否包含name
        isIncludeName(searchObj, name) {
          for(let i=0;i < searchObj.length; i++) {
            if(searchObj[i].name === name) {
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
      selectData: function(newVal, oldVal) {
        this.searchResult = this.selectData;
        setTimeout(() => {
          this.$refs.indexList.refresh();
        },500);
	  },
	  isShow (newVal, oldVal) {
		  if(newVal){
				controller.hiddenBar(1);
				console.log('newVal:' + newVal + ' oldVal:' + oldVal);
		  }
	  }
    }
  }
</script>

<style lang="scss" scope>
  .selectwrap-enter-active,.selectwrap-leave-active {
    transition: all 400ms;
  }
  .selectwrap-enter,.selectwrap-leave-to {
    transform: translate3d(0, 100%, 0);
  }
  .info-tip {
    text-align: center;
    font-size: 0.3rem;
  }

  body.style-ios .city-select{
    padding-top: 0.4rem;
  }
  @supports (top: constant(safe-area-inset-top)) or (top: env(safe-area-inset-top)) {
    body.style-ios .city-select {
        padding-top: constant(safe-area-inset-top) !important;
        padding-top: env(safe-area-inset-top) !important;
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
</style>
