<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' @h5TitleStyle="getTitleStyle"></Header>
        <div class="main">
            <div class="main-wrap">
                <div class="every-rules">
                    <div class="title">1.购买规则</div>
                    <div class="content">
                        <p>适用客票：仅限购买吉祥航空承运国内航班的客票（票号为018开头）； </p>
                        <p class="margin-top">购买时间：航班预计起飞前50分钟前； </p>
                        <p class="margin-top">预留座位：因座位有先到先得的特性，可能无法保障您的座位选择，最终座位由工作人员根据航班实际情况安排。 </p>
                        <p class="margin-top">不支持轮椅旅客、担架旅客、无成人陪伴儿童旅客、婴儿旅客和预订婴儿摇篮的旅客、患病旅客购买。</p>
                    </div>
                </div>
                <div class="every-rules">
                    <div class="title">2.使用规则</div>
                    <div class="content">
                        <p>建议您无托运行李时请至少于航班起飞前40分钟（有托运行李请至少提前50分钟）到达机场指定柜台领取登机牌； </p>
                        <p class="margin-top">领取登机牌时请出示购票时使用的身份证件。</p>
                    </div>
                </div>
                <div class="every-rules">
                    <div class="title">3.退款规则</div>
                    <div class="content">登机牌所对应的客票发生非自愿变更、退票或签转时可申请退款，退款时请拔打客户服务热线95520办理，其他情况不可退款。</div>
                </div>
                <div class="every-rules">
                    <div class="title">4.产品声明</div>
                    <div class="content">本产品仅为您提供预留登机牌服务，不包含其他任何附加服务，请您合理安排出行时间。由于您个人原因而造成误机，吉祥航空不承担任何责任。</div>
                </div>
                <div class="every-rules">
                    <div class="title">5.开通场站</div>
                    <div class="content">
                        <table border="1" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>场站名称</th>
                                    <th>值班经理手机</th>
                                    <th>预留柜台信息</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>乌鲁木齐</td>
                                    <td>15245196738</td>
                                    <td>预留柜台信息信息信息信息</td>
                                </tr>
                                <tr>
                                    <td>乌鲁木齐</td>
                                    <td>15245196738</td>
                                    <td>预留柜台信息信息信息信息预留柜台信息信息信息信息</td>
                                </tr>
                                <tr>
                                    <td rowspan="3">乌鲁木齐</td>
                                    <td rowspan="3">15245196738</td>
                                    <td>预留柜台信息信息信息信息</td>
                                </tr>
                                <tr>
                                    <td>预留柜台信息信息信息信息</td>
                                </tr>
                                <tr>
                                    <td>预留柜台信息信息信息信息</td>
                                </tr>
                            </tbody>
                        </table>
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
                pageData: {}
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
                    pageUrl: '/' + Page.boardPass.index.pageUrl
                });
            },
            // H5头部回调
            getTitleStyle(titleObj, isTtile) {
                this.isUseHeader = isTtile;
            },
        }
    };
</script>

<style lang="scss">
    @import "~common/styles/common/common.scss";
    body {
        background: #fff !important;
    }

    .main-wrap {
        width: rem(750);
        margin: 0 auto;
        padding: 0 rem(30) rem(154);
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
                table {
                    border: 1px solid #ECECEC;
                    text-align: left;
                    th,
                    td {
                        padding: rem(14) rem(20);
                        font-size: rem(24);
                    }
                    th {
                        background: #FAFAFA;
                        color: #3A3D50;
                        &:nth-child(1) {
                            width: rem(160);
                        }
                        &:nth-child(2) {
                            width: rem(200);
                        }
                        &:nth-child(3) {
                            width: rem(330);
                        }
                    }
                    td {
                        color: #848484;
                    }
                }
            }
        }
    }
</style>
