<template>
    <div id="app" v-cloak>
        <Header @clickHeader='clickBackBtn' @h5TitleStyle="getTitleStyle" :setTitleStyle="setTitleStyle"></Header>
        <div class="main mainNotBottom" :class='{mainNotTop: !isUseHeader}'>
            <div class="payment_state" :class="{pay_success: !result, pay_fail: result}">
                <p class="title">{{ resultData.result }}</p>
                <p class="txt">{{ resultData.txt }}</p>
                <img :src="resultData.imgUrl" alt="" class="state_img" />
            </div>
            <footer class="footer">
                <button class="g-btn" @click="checkOrder">查看订单</button>
            </footer>
            <div class="pay-tip">下单成功后，请至【我的订单】—【权益/服务】中查看</div>
        </div>
    </div>
</template>

<script>
    import '../../../common/tools/rem'
    import '../../../common/styles/common/common.scss'
    import Header from 'components/header.vue'
    import { controller } from 'common/logic/controller.js'
    import Page from 'common/deploy/page.js'
    const payImg = {
        0: require('./img/pay_suc.png'),
        1: require('./img/pay_fail.png'),
        2: require('./img/pay_timeout.png'),
    }

    export default {
        data() {
            return {
                // 头部信息
                isUseHeader: false,
                setTitleStyle: {
                    isUseH5: true,
                    title: '支付结果',
                    titlestyle: 3,
                    titleClass: {}
                },
                memberInfo: null,
                pageData: {},
                result: '',
                resultData: {},
                payImgUrl: payImg
            }
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;

                console.log(that.pageData);
                that.initPage();
            })
        },
        components: {
            Header
        },
        methods: {
            // H5头部回调
            getTitleStyle(titleObj, isTtile) {
                console.log('isTitle:'+ isTtile);
                this.isUseHeader = isTtile;
            },
            clickBackBtn() {
                controller.close();
            },
            initPage() {
                this.result = this.pageData.type
                this.resultData = this.pageData.resultData
                this.resultData.imgUrl = this.payImgUrl[this.result]
                if(this.result) {
                    this.setTitleStyle.titleClass = {
                        resultFail: true
                    }
                } else {
                    this.setTitleStyle.titleClass = {
                        resultSuc: true
                    }
                }
            },
            checkOrder() {
                let orderNo = this.pageData.orderNo;
                let channelOrderNo = this.pageData.channelOrderNo;

                let pathObj = Page.my.interestOrderDetail;
                controller.open({
                    winName: pathObj.winName, 
                    path: pathObj.pageUrl,
                    data: {isDetailPage: true, orderNo: orderNo, channelOrderNo: channelOrderNo, originPage: 'sucApply'},
                    closeLastPage: true
                });
            }
        }
    }
</script>

<style lang="scss">
    @import '../../../common/styles/slice_sass/payment.scss';
    header.g-header{
        .f-fx{
            box-shadow: none;
        }
        .resultSuc {
            background: #d73558;
        }
        .resultFail {
            background: #888080;
        }
    }

    .pay_success {
        background: linear-gradient(180deg, #D73558, #C43364);
    }

    .pay_fail {
        background: linear-gradient(180deg, #888080, #7F7878)
    }

    .txt {
        margin-top: rem(22);
        margin-left: rem(40);
    }
    .pay-tip {
        margin-top: rem(40);
        font-size: rem(24);
        line-height: rem(33);
        color: #848484;
        text-align: center;
    }
</style>
