<template>
    <transition name='suited-plane'>
        <div class="main mainNot">
            <div class="title">适应航线</div>
            <div class="introduce">升舱券按航距分为四类, 每类所适应的航线见以下列表, 单位(KM)</div>
            <div class="change-tab-header flexbox justify-content">
                <div class="every-tab-header" :class="{'active': activeTab == 0}" @click="touchTab(0)">
                    <div class="bg-img">
                        <img src="./imgs/component_tab_bg.png" alt="">
                    </div>
                    <div class="text">航距&lt;1000</div>
                </div>
                <div class="every-tab-header" :class="{'active': activeTab == 1}" @click="touchTab(1)">
                    <div class="bg-img">
                        <img src="./imgs/component_tab_bg.png" alt="">
                    </div>
                    <div class="text">航距&lt;1500</div>
                </div>
                <div class="every-tab-header" :class="{'active': activeTab == 2}" @click="touchTab(2)">
                    <div class="bg-img">
                        <img src="./imgs/component_tab_bg.png" alt="">
                    </div>
                    <div class="text">航距&lt;2000</div>
                </div>
                <div class="every-tab-header" :class="{'active': activeTab == 3}" @click="touchTab(3)">
                    <div class="bg-img">
                        <img src="./imgs/component_tab_bg.png" alt="">
                    </div>
                    <div class="text">所有航距</div>
                </div>
            </div>
            <div class="change-tab-content">
                <div class="every-tab-content" :class="{'active': activeTab == 0}">
                    <div class="all-plane">
                        <table>
                            <tr v-for="(item,index) in plane_1" :key="'plane_1'+index">
                                <td v-for="(innerItem,innerIndex) in item" :key="'inner'+innerIndex">{{innerItem}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="every-tab-content" :class="{'active': activeTab == 1}">
                    <div class="tab-tip">航距&lt;1000内所有航线 + 1000-1500航距的航线，以下为1000-1500的航线；按序展示航距为1000-1500的航线；</div>
                    <div class="all-plane has-margin">
                        <table>
                            <tr v-for="(item,index) in plane_2" :key="'plane_1'+index">
                                <td v-for="(innerItem,innerIndex) in item" :key="'inner'+innerIndex">{{innerItem}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="every-tab-content" :class="{'active': activeTab == 2}">
                    <div class="tab-tip">航距&lt;1000内所有航线 + 航距&lt;1500内所有航线 + 1500-2000航距的航线，以下为1500-2000的航线；按序展示航距为1500-2000的航线；</div>
                    <div class="all-plane has-margin">
                        <table>
                            <tr v-for="(item,index) in plane_3" :key="'plane_1'+index">
                                <td v-for="(innerItem,innerIndex) in item" :key="'inner'+innerIndex">{{innerItem}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="every-tab-content" :class="{'active': activeTab == 3}">
                    <div class="tab-tip">航距&lt;1000内所有航线 + 航距&lt;1500内所有航线 + 航距&lt;2000 + 航距>2000的航线，以下为2000以上的航线；按序展示航距为2000以上的航线；</div>
                    <div class="all-plane has-margin">
                        <table>
                            <tr v-for="(item,index) in plane_4" :key="'plane_1'+index">
                                <td v-for="(innerItem,innerIndex) in item" :key="'inner'+innerIndex">{{innerItem}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="mask"></div>
            </div>
            <div class="close-btn" @click="clickCloseBtn"></div>
        </div>
    </transition>
</template>

<script>
    import controller from "common/logic/controller";
    const PLANE_1 = [["上海-长沙","上海-福州","上海-九华山"],["上海-连城","上海-南昌","上海-青岛"],["上海-三明","上海-温州","上海-武汉"],["上海-厦门","上海-郑州","南京-大连"],["南京-南昌","南京-青岛","南京-太原"],["南京-威海","南京-温州","南京-厦门"],["南京-盐城","南京-张家界","包头-乌兰察布"],["长沙-贵阳","长沙-茅台","重庆-张家界"],["大连-长白山","大连-延吉","贵阳-惠州"],["贵阳-丽江","杭州-青岛","惠州-张家界"],["昆明-毕节","兰州-金昌","兰州-张掖"],["绵阳-丽江","青岛-无锡","深圳-北海"],["深圳-贵阳","深圳-三明","沈阳-海拉尔"],["通辽-海拉尔","温州-长沙","武汉-惠州"],["西安-固原","西安-茅台","西安-西宁"],["西安-中卫","榆林-银川","张家界-昆明"]];
    const PLANE_2 = [["上海-北京","上海-长治","上海-大连"],["上海-东营","上海-广州","上海-桂林"],["上海-惠州","上海-深圳","上海-沈阳"],["上海-太原","上海-天津","上海-西安"],["上海-襄樊","上海-张家界","上海-珠海"],["南京-鞍山","南京-桂林","南京-呼和浩特"],["南京-惠州","南京-西安","南京-榆林"],["南京-重庆","北海-丽江","长沙-丽江"],["大连-海拉尔","大连-温州","贵阳-温州"],["杭州-大连","杭州-惠州","杭州-张家界"],["茅台-海口","南昌-海口","南昌-昆明"],["南昌-南宁","青岛-长白山","青岛-长春"],["青岛-哈尔滨","青岛-南昌","青岛-松原"],["青岛-银川","深圳-宜昌","沈阳-满洲里"],["太原-兰州","天津-长白山","温州-茅台"],["威海-大庆","无锡-惠州","厦门-贵阳"],["盐城-长春","宜昌-银川","张家界-太原"],["郑州-西宁"]];
    const PLANE_3 = [["上海-包头","上海-北海","上海-毕节"],["上海-长春","上海-成都","上海-贵阳"],["上海-哈尔滨","上海-海口","上海-汉中"],["上海-呼和浩特","上海-兰州","上海-茅台"],["上海-绵阳","上海-南宁","上海-重庆"],["上海-固原","上海-乌兰察布","上海-松原"],["南京-北海","南京-毕节","南京-长白山"],["南京-贵阳","南京-哈尔滨","南京-海口"],["南京-昆明","南京-兰州","南京-南宁"],["南京-沈阳","南京-西宁","南京-银川"],["南京-延吉","南京-长春","大连-张家界"],["广州-丽江","哈尔滨-无锡","杭州-毕节"],["杭州-博鳌","杭州-贵阳","杭州-海口"],["惠州-郑州","九华山-成都","丽江-深圳"],["南昌-丽江","青岛-贵阳","太原-温州"],["温州-三亚","无锡-海口","无锡-西宁"],["武汉-丽江","西安-海口","银川-乌鲁木齐"],["太原-温州"]];
    const PLANE_4 = [["上海-海拉尔","上海-昆明","上海-三亚"],["上海-通辽","上海-乌鲁木齐","上海-西宁"],["上海-银川","上海-中卫","上海-丽江"],["上海-金昌","上海-张掖","南京-海拉尔"],["南京-三亚","南京-大庆","南京-丽江"],["北海-沈阳","哈尔滨-桂林","哈尔滨-惠州"],["杭州-哈尔滨","杭州-丽江","惠州-太原"],["青岛-三亚","深圳-银川","太原-乌鲁木齐"],["温州-哈尔滨","温州-兰州","无锡-三亚"]];
    export default {
        props: {},
        data() {
            return {
                activeTab: 0,
                plane_1: PLANE_1,
                plane_2: PLANE_2,
                plane_3: PLANE_3,
                plane_4: PLANE_4
            }
        },
        methods: {
            touchTab(index) {
                this.activeTab = index;
            },
            clickCloseBtn() {
                this.$emit("suitedPlaneClose");
            }
        }
    };
</script>


<style lang="scss" scoped>
    @import "../common/styles/common/_mixin.scss";
    @import "../common/styles/common/function.scss";
    .suited-plane-enter-active,
    .suited-plane-leave-active {
        transition: all 0.5s
    }
    .suited-plane-enter,
    .suited-plane-leave-to {
        transform: translate3d(0, 100%, 0)
    }
    .main {
        background: #fff;
        z-index: 1000;
        padding-bottom: rem(50);
    }
    .title {
        margin-top: rem(67);
        font-size: rem(32);
        color: #3A3D50;
        text-align: center;
    }
    .introduce {
        margin-top: rem(31);
        font-size: rem(24);
        text-align: center;
        color: #848484;
    }
    .change-tab-header {
        margin-top: rem(60);
        .every-tab-header {
            position: relative;
            width: rem(176);
            height: rem(90);
            img {
                display: none;
                width: rem(176);
                height: rem(90);
            }
            .text {
                position: absolute;
                top: rem(25);
                left: 0;
                width: rem(176);
                font-size: rem(24);
                line-height: rem(24);
                color: #3A3D50;
                text-align: center;
            }
            &.active {
                img {
                    display: block;
                }
                .text {
                    color: #CB9D6D;
                    font-weight: 600;
                }
            }
        }
    }
    .change-tab-content {
        position: fixed;
        top: rem(344);
        bottom: rem(200);
        left: 0;
        right: 0;
        overflow-x: hidden; 
        overflow-y: auto;
        background-color: #fff;
        .mask {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: rem(40);
            background: rgba(255, 255, 255, 0.7);
        }
    }
    .every-tab-content {
        width: 100%;
        height: 100%;
        overflow-x: hidden; 
        overflow-y: auto;
        display: none;
        &.active {
            display: block;
        }
        .tab-tip {
            margin-top: rem(10);
            padding: rem(8) rem(30);
            background-color: #FBEFD8;
            font-size: rem(22);
            line-height: rem(32);
            color: #CB9D6D;
        }
        .all-plane {
            margin: 0 auto;
            width: rem(690);
            &.has-margin {
                margin-top: rem(20);
            }
            table {
                width: rem(690);
            }
            td {
                width: rem(230);
                height: rem(60);
                text-align: center;
                border: 1px solid #ECECEC;
                font-size: rem(24);
                color: #848484;
            }
        }
    }
    .close-btn {
        position: absolute;
        bottom: rem(50);
        left: rem(335);
        width: rem(80);
        height: rem(80);
        @include bg("./imgs/close.png");
    }
</style>
