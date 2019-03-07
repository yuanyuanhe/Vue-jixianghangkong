<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="titleStyle" @h5TitleStyle="getTitleStyle">
        </Header>
        <div class="main mainNotBottom" :class='{mainNotTop: !isUseHeader}'>
            <div class="m-content">
                <div class="post-wrapper">
                    <ul>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>姓名</span>
                                </div>
                                <input type="text" placeholder="" v-model="psgObj.name" readonly class="all-input-style flex-1">
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>航司</span>
                                </div>
                                <input type="text" placeholder="请选择航司" v-model="psgObj.airName" class="all-input-style flex-1" readonly @click='selectAir()'>
                                <div class="btn" @click="selectAir()"></div>
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>卡号</span>
                                </div>
                                <input type="text" placeholder="请输入卡号" v-model="psgObj.card" class="all-input-style flex-1">
                            </label>
                        </li>
                    </ul>
                </div>
                <div class="form-btn">
                    <button class="cu-btn cu-btn-disabled">确定添加</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "common/tools/rem";
    import Header from "components/header.vue";
    import controller from "common/logic/controller";
    import requesturl from "common/deploy/requesturl";
    import { StarAirs } from "common/logic/enum";
    import { payParams } from "common/logic/logic";
    import Page from "common/deploy/page";
    export default {
        data() {
            return {
                memberInfo: null,
                pageData: {},
                isUseHeader: false,
                titleStyle: {
                    title: '添加常旅客卡',
                    titlestyle: 4,
                    closetype: 1
                },
                psgObj: {
                    name: '吉祥',
                    airName: '',
                    airCode: '',
                    card: ''
                }
            };
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                controller.clickBack(() => {
                    that.clickBackBtn();
                });
            });
        },
        methods: {
            // 点击返回按钮
            clickBackBtn() {
                controller.close({
                    flag: -1
                });
            },
            getTitleStyle(titleObj, isTtile) {
                this.isUseHeader = isTtile;
            },
            selectAir() {
                let that = this;
                if (!this.airlist) {
                    this.airlist = this.$createPicker({
                        title: '选择航司',
                        data: [StarAirs],
                        onSelect: (selectedVal, selectedIndex, selectedText) => {
                            that.psgObj.airName = selectedText;
                            that.psgObj.airCode = selectedVal;
                        }
                    })
                }
                this.airlist.show();
            }
        },
        components: {
            Header
        }
    };
</script>

<style lang="scss">
    @import "~common/styles/common/function.scss";
    @import "~common/styles/common/common.scss";
    @import '~common/styles/slice_sass/content.scss';
    .m-content{
        margin: rem(50) rem(30);
        background-color: #fff;
        @include border-radius(rem(6));
        @include box-shadow(0 rem(6) rem(10) 0 rgba(0,0,0,0.1));
        .form-btn{
            padding: rem(30);
        }
    }
    ul li:last-child::before{
        border-color: #f4f4f4;
    }
</style>
