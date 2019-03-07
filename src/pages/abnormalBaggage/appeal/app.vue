<style lang="scss" scoped>
    @import '~common/styles/common/function.scss';
    @import '~common/styles/common/mixin';
    .item-wrapper{
        .m-item{
            .item-main{
                .item-passenger{
                    margin-top: rem(22);
                }
                .item-foot{
                    padding: rem(0);
                    margin-top: rem(0);
                    .item-time{
                        height: rem(24);
                        line-height: rem(24)
                    }
                }
            }
            .item-btn{
                width: 100%;
                height: rem(110);
                .item-cancelbtn{
                    float: right;
                    width: rem(136);
                    height: rem(50);
                    line-height: rem(50);
                    margin-top: rem(30);
                    margin-right: rem(20);
                    font-size: rem(26);
                    color: #3A3D50;
                    @include textAlign(center);
                    @include border(#EBECEE, rem(6));
                    .style-ios & {
                        @include border-ios(#EBECEE, rem(6));
                    }
                }
                .item-seebtn{
                    float: right;
                    width: rem(188);
                    height: rem(50);
                    line-height: rem(50);
                    margin-top: rem(30);
                    margin-right: rem(29);
                    font-size: rem(26);
                    color: #CB9D6D;
                    @include textAlign(center);
                    @include border(#CB9D6D, rem(6));
                    .style-ios & {
                        @include border-ios(#CB9D6D, rem(6));
                    }
                }
            }

        }
    }
</style>

<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header>
        <div class="main">
            <div class="container">
                <div class="item-wrapper" ref="itemWrapper" v-cloak>
                    <!-- 订单列表 -->
                    <div class="m-item" v-for="item in Datas" @click="pageJump(item)" :key="item.id">
                        <div class="item-head flexbox">
                            <div class="item-title flex-1" v-if="item.luggageProType ==  BagClaim.LOSS">遗失行李申诉</div>
                            <div class="item-title flex-1" v-if="item.luggageProType ==  BagClaim.WORN">破损行李申诉</div>


                            <div class="item-state" v-if="item.compStatus ==  AppealState.APPLY">已申请</div>

                            <div class="item-state" v-if="item.compStatus ==  AppealState.SUCCESS">已受理</div>

                            <div class="item-state" v-if="item.compStatus ==  AppealState.CHECKING">已结案</div>

                            <div class="item-state item-disabled" v-if="item.compStatus ==  AppealState.CANCEL">已取消</div>
                        </div>
                        <div class="item-main">
                            <div class="item-info flexbox">
                                <div class="span">{{item.flightDate}} {{item.weekDay}}</div>
                                <div class="span" v-if="item.flightNo">{{item.flightNo}}</div>
                                <div class="span">{{item.depatureStationName}}-{{item.arrivalStationName}}</div>
                            </div>
                            <div class="item-passenger">
                                乘机人
                                <span>{{item.passName}}</span>
                            </div>
                            <div class="item-foot flexbox">
                                <div class="item-time flex-1">
                                    申请时间
                                    <span>{{item.applyTime}}</span>
                                </div>
                            </div>
                        </div>

                        <div class="item-btn" v-if="item.compStatus != AppealState.CANCEL || item.compStatus == AppealState.CHECKING">
                            <div class="item-cancelbtn" @click.stop="showModel(item.id)" v-if="item.compStatus == AppealState.APPLY || item.compStatus == AppealState.SUCCESS">取消申请</div>
                        </div>
                    </div>
                </div>
                <div class="notItem" v-if="Datas.length == 0">
                    <img class="center-block" src="./img/notItem.png" alt="">
                    <p>您尚未申请过异常行李申诉服务</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import 'common/tools/rem'
    import 'common/styles/common/common.scss'
    import Header from 'components/header.vue'
    import Footer from 'components/footer.vue'
    import RuleSlot from 'components/ruleSlot.vue'
    import page from 'common/deploy/page'
    import controller from 'common/logic/controller'
    import requesturl from 'common/deploy/requesturl'

    import {
        AppealState,
        ResultCode,
        ServiceCode,
        Verify,
        BagClaim
    } from 'common/logic/enum'

    export default {
        components: {
            Header,
            Footer,
            RuleSlot
        },
        data() {
            return {
                isUseHeader: false, 
                titleStyle:{
                    title: '我的申诉',
                    titlestyle: 4,
                },
                memberInfo: null,
                pageData: {},
                itemLength: false,
                Datas: [],
                AppealState: AppealState,
                BagClaim:BagClaim,
                ResultCode: ResultCode,
                rulesTitle:"",
                canShowRules: false,
                canshowbar:true,
                progress:[{
                    applyTime:"",
                    checkInTime:"",
                    groundSupportStartTime:"",
                    groundSupportEndTime:"",
                    applyService:"",
                    speServiceGuaranteeOne:"",
                    speServiceGuaranteeTwo:"",
                    speServiceGuaranteeThree:"",
                    applyServiceSuccess:"",
                    speServiceStart:"",
                    speServicing:"",
                    speServiceEnd:""
                }]
            }
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                that.getDatas();
                console.log(that.pageData)
                controller.clickBack(() => {
                    that.clickBackBtn()
                })
                // controller.setTitle(that.$filters.formatPsgTitle(that.titleStyle.title, that.isDetailPage), that.titleStyle);
            })
        },
        computed: {
        },
        methods: {
            // // 初始化页面
            // initPage() {
            //     let href = window.location.href;
            //     if(href.toLowerCase().indexOf('title') === -1) {
            //         this.isUseHeader = true;
            //     }
            // },
            // 点击返回按钮
            clickBackBtn() {
                let pathObj = page.abnormalBaggage.abnorBag;
                // controller.close({
                //     pageUrl: '/' + pathObj.pageUrl
                // });
                controller.open({
                    winName: pathObj.winName,
                    path: pathObj.pageUrl,
                });
            },
            cancel(id) {
                const that = this;
                const url = requesturl.ABNORMALBAG.APPLYCANCEL
                let datas = {
                        "ffpCardNo": that.memberInfo.memberID,
                        "ffpId": that.memberInfo.id,
                        "loginKeyInfo": that.memberInfo.loginKeyInfo,
                        "statementId": id
                }
                controller.getJSON({
                    method: 'POST',
                    url: url,
                    params: datas,
                })
                .then((data) => {
                    console.log(data)
                    if (data.resultCode == that.ResultCode.SUCCESS) {
                        controller.toast({
                            str: '取消成功！'
                        })
                        that.getDatas();
                    }
                })
            },
            // 显示弹框
            showModel(id) {
                let that = this;
                controller.confirm({
                    title: '提示',
                    message: '确定要取消此服务申请吗？',
                    buttons: ['考虑一下', '确定'],
                    onConfirm() {
                        that.cancel(id);
                    }
                })
            },
            getDatas() {
                const that = this;
                const url = requesturl.ABNORMALBAG.APPLYLIST
                let datas = {
                        "ffpCardNo": that.memberInfo.memberID,
                        "ffpId": that.memberInfo.id,
                        "loginKeyInfo": that.memberInfo.loginKeyInfo
                }
                controller.getJSON({
                    method: 'POST',
                    url: url,
                    params: datas,
                })
                .then((data) => {
                    console.log(data)
                    if (data.resultCode == that.ResultCode.SUCCESS) {
                        that.Datas = data.objData;
                    } else {
                        controller.toast({str: data.resultInfo});
                    }
                })
                .catch(that.errCallback)
            },
            errCallback(data) {
                controller.toast({str: Verify.BACK_ERR.toastDetailsFail});
            },
            pageJump(obj) {
                let pageData = {
                    isDetailPage: true,
                    id: obj.id,
                    serviceType: obj.speServiceType
                }
                // 跳转到详情页面
                // if (pageData.serviceType === ServiceCode.BSCT) {
                    controller.open({
                        winName: page.abnormalBaggage.detailabnor.winName,
                        path: page.abnormalBaggage.detailabnor.pageUrl,
                        data: pageData
                    })
                // }
            }
        }
    }
</script>

<style lang="scss">
    @import '../../../common/styles/slice_sass/applyList.scss';
</style>
