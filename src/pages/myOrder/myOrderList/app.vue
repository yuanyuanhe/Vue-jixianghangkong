<template>
    <div class="app">
        <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header>
        <!-- tab -->
        <div class="navBox" v-show="isShowNav">
            <ul class="nav flexbox">
                <li class="flex-1" v-for="(item,index) in arr" 
                    :class="{navItem: isNavItem == index}" 
                    @click="tabChange(index ,$event)"
                    :key="index">
                    {{item}}
                </li>
            </ul>
            <div class="line" :style="{left: lineLeft}"></div>
        </div>
        <!-- 列表 -->
        <keep-alive>
            <component :is="tabView[isNavItem]" ref="navItem" :isShowNav="isShowNav" :memberInfo="memberInfo"></component>
        </keep-alive>
    </div>
</template>
<script>
    import 'common/tools/rem'
    import Header from 'components/header.vue'
    import plane from './components/plane.vue' //机票
    import tour from './components/tour.vue' //旅游
    import service from './components/service.vue' //权益/服务
    import shop from './components/shop.vue' //如意购
    import controller from "common/logic/controller";

    export default {
        data() {
            return {
                // 头部相关
                titleStyle: {},
                // tab相关数据
                arr: ['机票', '旅游', '权益/服务', '如意购'],
                tabView: ['plane', 'tour', 'service', 'shop'],
                isNavItem: 0,
                lineLeft: '.66rem',
                isShowNav: false,
                memberInfo: {},
            }
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo || {};
                that.pageData = data.data;

                that.orderState = controller.getStorage('orderState');
                console.log(that.orderState);
                if(that.orderState=='all') {  // 待付款、所有的
                    that.isShowNav = true;
                }
                
                controller.clickBack(() => {
                    that.clickBackBtn();
                });
                controller.onshow(() => {
                    that.$refs.navItem.getOrderList(1);
                })
            });
        },
        methods: {
            // 返回
            clickBackBtn() {
                controller.close({flag: -5});
            },
            // 点击tab
            tabChange(index, ev) {
                this.isNavItem = index;
                this.lineLeft = (index * (ev.target.offsetWidth) + ev.target.offsetWidth/2 - ev.target.parentNode.nextElementSibling.offsetWidth/2) + 'px';
            }
        },
        components: {
            Header,
            plane,
            tour,
            service,
            shop
        }
    }
</script>

<style lang="scss">
    @import "~common/styles/common/common.scss";
    @import "~common/styles/myOrder.scss";
</style>