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
    .rulesInfo{
        width: rem(686);
        .tit{
            width: 100%;
            height: rem(108);
            // border-bottom: 1px #EBECEE solid;
            @include bd-bottom(#EBECEE);
            .style-ios & {
                @include bd-bottom-ios(#EBECEE);
            }

           .tit-time{
               font-size: rem(26);
               width: 50%;
               height: rem(108);
               line-height: rem(108);
               color: #25292F;
            } 
            .tit-ser{
               width: 25%;
               height: rem(108);
               line-height: rem(108);
               color: #25292F;
               font-size: rem(26);
            }
            .tit-sta{
               width: 25%;
               height: rem(108);
               text-align: right;
               line-height: rem(108);
               color: #25292F;
               font-size: rem(26);
            }
        }
        div{
            .time{
                color: #878E99;
                font-size: rem(24);
                float: left;
                width: 50%;
                margin-top: rem(30);
            }
            .ser{
                color: #878E99;
                font-size: rem(24);
                float: left;
                width: 25%;
                margin-top: rem(30);
            }
            .sta{
                color: #878E99;
                font-size: rem(24);
                float: left;
                width: 25%;
                text-align: right;
                margin-top: rem(30);
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
                            <div class="item-title flex-1">{{item.serviceName}}</div>
                            <div class="item-state" :class="{'item-disabled': item.recordStatus == ServiceState.CANCEL}">{{item.applyStatusName}}</div>
                        </div>
                        <div class="item-main">
                            <div class="item-info flexbox">
                                <div class="span">{{item.flightDate}} {{item.weekDay}}</div>
                                <div class="span" v-if="item.flightNo">{{item.flightNo}}</div>
                                <div class="span">{{item.departureStationName}}-{{item.destinationStationName}}</div>
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

                        <div class="item-btn" v-if="item.recordStatus != ServiceState.CANCEL">
                            <div class="item-seebtn" @click.stop="clickRulesBtn(item)" v-if="item.recordStatus != ServiceState.CANCEL">查看服务进度</div>
                            <div class="item-cancelbtn" @click.stop="showModel(item.id)" v-if="item.recordStatus == ServiceState.APPLY || item.recordStatus == ServiceState.SUCCESS  || item.recordStatus == '3'">取消申请</div>
                        </div>
                    </div>
                </div>
                <div class="notItem" v-if="Datas.length == 0">
                    <img class="center-block" src="./img/notItem.png" alt="">
                    <p>您尚未申请过特殊旅客服务</p>
                </div>
            </div>
        </div>
        

        <RuleSlot :rulesTitle='rulesTitle'  @clickCloseBtn='closeRulesPage' v-show='canShowRules' :isShow='canShowRules'>
             <div class="rulesInfo" slot="ruleInfo">
                    <div class="tit flexbox">
                        <div class="tit-time">时间</div>
                        <div class="tit-ser">服务</div>
                        <div class="tit-sta">状态</div>
                    </div>
                    <div>
                        <div class="time">{{ progress[0].applyTime }}</div>
                        <div class="ser">{{ progress[0].applyService }}</div>
                        <div class="sta">{{ progress[0].applyServiceSuccess }}</div>

                        <div class="time">{{ progress[0].checkInTime }}</div>
                        <div class="ser">{{ progress[0].speServiceGuaranteeOne }}</div>
                        <div class="sta">{{ progress[0].checkedIn }}</div>

                        <div class="time">{{ progress[0].groundSupportStartTime }}</div>
                        <div class="ser">{{ progress[0].speServiceGuaranteeTwo }}</div>
                        <div class="sta">{{ progress[0].speServiceStart }}</div>

                        <div class="time">{{ progress[0].groundSupportEndTime }}</div>
                        <div class="ser">{{ progress[0].speServiceGuaranteeThree }}</div>
                        <div class="sta">{{ progress[0].speServiceEnd }}</div>

                        <div class="time">{{ progress[0].boardingTime }}</div>
                        <div class="ser">{{ progress[0].speServiceGuaranteeFour }}</div>
                        <div class="sta">{{ progress[0].boarded }}</div>

                        <div class="time">{{ progress[0].arrivalTime }}</div>
                        <div class="ser">{{ progress[0].speServiceGuaranteeFive }}</div>
                        <div class="sta">{{ progress[0].arrived }}</div>
                    </div>
                    
             </div>
        </RuleSlot>
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
        ServiceState,
        ResultCode,
        ServiceCode,
        Verify
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
                    title: '我的申请',
                    titlestyle: 4,
                },
                memberInfo: null,
                pageData: {},
                itemLength: false,
                Datas: [],
                ServiceState: ServiceState,
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
            // 关闭规则页面
            closeRulesPage() {
                this.canShowRules = false;
                controller.showBar(1)
            },
            // 点击规则按钮
            clickRulesBtn(item) {
                console.log(item.schedule)
                this.rulesTitle = item.serviceName + "进度";
                this.canShowRules = true;                
                for (let key in item.schedule) {
                    this.progress[key] = item.schedule[key];
                }
                console.log(this.progress)
                console.log(this.progress[0])
                controller.hiddenBar(1)
            },
            // 点击返回按钮
            clickBackBtn() {
                let pathObj = page.passengers.care;
                controller.close({
                    pageUrl: '/' + pathObj.pageUrl
                });
            },
            cancel(id) {
                const that = this;
                const url = requesturl.PASSENGERS.CANCELAPPLY
                let datas = {
                    "request": {
                        "ffpCardNo": that.memberInfo.memberID,
                        "ffpId": that.memberInfo.id,
                        "loginKeyInfo": that.memberInfo.loginKeyInfo,
                        "id": id
                    }
                }
                controller.getJSON({
                    method: 'POST',
                    url: url,
                    params: datas
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
                const url = requesturl.PASSENGERS.MYAPPLYLIST
                let datas = {
                    "request": {
                        "ffpCardNo": that.memberInfo.memberID,
                        "ffpId": that.memberInfo.id,
                        "loginKeyInfo": that.memberInfo.loginKeyInfo
                    }
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
                console.log(obj.speServiceType)
                let pageData = {
                    isDetailPage: true,
                    id: obj.id,
                    serviceType: obj.speServiceType
                }
                // 婴儿摇篮
                if (pageData.serviceType === ServiceCode.BSCT) {
                    controller.open({
                        winName: page.passengers.bassinet.winName,
                        path: page.passengers.bassinet.pageUrl,
                        data: pageData
                    })
                }
                // 无陪老人
                if (pageData.serviceType === ServiceCode.OLD) {
                    controller.open({
                        winName: page.passengers.oldman.winName,
                        path: page.passengers.oldman.pageUrl,
                        data: pageData
                    })
                }
                // 无陪青少年
                if (pageData.serviceType === ServiceCode.YP) {
                    controller.open({
                        winName: page.passengers.young.winName,
                        path: page.passengers.young.pageUrl,
                        data: pageData
                    })
                }
                // 无陪儿童
                if (pageData.serviceType === ServiceCode.UMNR) {
                    controller.open({
                        winName: page.passengers.child.winName,
                        path: page.passengers.child.pageUrl,
                        data: pageData
                    })
                }
                // 机上轮椅、登机轮椅、地面轮椅
                if (pageData.serviceType === ServiceCode.WCHC ||
                    pageData.serviceType === ServiceCode.WCHS ||
                    pageData.serviceType === ServiceCode.WCHR) {
                    controller.open({
                        winName: page.passengers.wchc.winName,
                        path: page.passengers.wchc.pageUrl,
                        data: pageData
                    })
                }
                // 孕妇旅客
                if (pageData.serviceType === ServiceCode.PRGN) {
                    controller.open({
                        winName: page.passengers.prgnPeople.winName,
                        path: page.passengers.prgnPeople.pageUrl,
                        data: pageData
                    })
                }
                // 哺乳旅客
                if (pageData.serviceType === ServiceCode.LCTN) {
                    controller.open({
                        winName: page.passengers.lctnPeople.winName,
                        path: page.passengers.lctnPeople.pageUrl,
                        data: pageData
                    })
                }
                // 盲人旅客
                if (pageData.serviceType === ServiceCode.BLND) {
                    controller.open({
                        winName: page.passengers.blindPeople.winName,
                        path: page.passengers.blindPeople.pageUrl,
                        data: pageData
                    })
                }
                // 聋哑旅客
                if (pageData.serviceType === ServiceCode.DEAF) {
                    controller.open({
                        winName: page.passengers.deafPeople.winName,
                        path: page.passengers.deafPeople.pageUrl,
                        data: pageData
                    })
                }
                // 担架旅客
                if (pageData.serviceType === ServiceCode.STCR) {
                    controller.open({
                        winName: page.passengers.stretcher.winName,
                        path: page.passengers.stretcher.pageUrl,
                        data: pageData
                    })
                }


                //用氧旅客
                if (pageData.serviceType === ServiceCode.USEO) {
                    controller.open({
                        winName: page.passengers.useoxyPeople.winName,
                        path: page.passengers.useoxyPeople.pageUrl,
                        data: pageData
                    })
                }
                //患病旅客
                if (pageData.serviceType === ServiceCode.MEDA) {
                    controller.open({
                        winName: page.passengers.sickenPeople.winName,
                        path: page.passengers.sickenPeople.pageUrl,
                        data: pageData
                    })
                }
                //电动轮椅旅客
                if (pageData.serviceType === ServiceCode.EWC) {
                    controller.open({
                        winName: page.passengers.EWConPeople.winName,
                        path: page.passengers.EWConPeople.pageUrl,
                        data: pageData
                    })
                }
                //残疾人团队旅客
                if (pageData.serviceType === ServiceCode.DIST) {
                    controller.open({
                        winName: page.passengers.disTeamPeople.winName,
                        path: page.passengers.disTeamPeople.pageUrl,
                        data: pageData
                    })
                }
                //残障旅客
                if (pageData.serviceType === ServiceCode.DPNA) {
                    controller.open({
                        winName: page.passengers.disPeople.winName,
                        path: page.passengers.disPeople.pageUrl,
                        data: pageData
                    })
                }

                //服务犬旅客
                if (pageData.serviceType === ServiceCode.PETC) {
                    controller.open({
                        winName: page.passengers.serDogPeople.winName,
                        path: page.passengers.serDogPeople.pageUrl,
                        data: pageData
                    })
                }

                //活体器官及血液制品运输
                if (pageData.serviceType === ServiceCode.TRAN) {
                    controller.open({
                        winName: page.passengers.organTra.winName,
                        path: page.passengers.organTra.pageUrl,
                        data: pageData
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '../../../common/styles/slice_sass/applyList.scss';
</style>
