
<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn" @clickSkip ='myList' :setTitleStyle="setTitleStyle"></Header>
        <div class="main">
            <div class="container">
                <!-- 婴儿和儿童 -->
                <div class="post-wrapper careWrap">
                    <div class="writeInformation-title">婴儿和儿童及老人旅客</div>
                    <ul>
                        <li @click="openWritePage(Pages.passengers.bassinet.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_yaolan@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>婴儿摇篮</span>
                                    <div class="careInfo">年满14天但未满2周岁</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                        <li @click="openWritePage(Pages.passengers.child.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_ertong@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>无成人陪伴儿童</span>
                                    <div class="careInfo">年满5周岁但未满12周岁</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                        <li @click="openWritePage(Pages.passengers.young.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_qingnian@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>无成人陪伴青少年</span>
                                    <div class="careInfo">年满12周岁但未满18周岁</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                            <li @click="openWritePage(Pages.passengers.oldman.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_laoren@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>老人协助</span>
                                    <div class="careInfo">年满65周岁</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                    </ul>
                </div>
                <!-- 病残旅客 -->
                <div class="post-wrapper careWrap">
                    <div class="writeInformation-title">病残旅客</div>
                    <ul>
                        <li @click="openWritePage(Pages.passengers.wchc.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_lunyi@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>轮椅旅客</span>
                                    <div class="careInfo">包括地面轮椅、登机轮椅和机上轮椅</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                        <li @click="openWritePage(Pages.passengers.blindPeople.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_mangren@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>盲人旅客</span>
                                    <div class="careInfo">视力残疾无法自己行动的旅客</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                        <li @click="openWritePage(Pages.passengers.deafPeople.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_erduo@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>聋哑旅客</span>
                                    <div class="careInfo">因双耳听力缺陷而不能说话的旅客</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                        <li @click="openWritePage(Pages.passengers.stretcher.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_danjia@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>担架旅客</span>
                                    <div class="careInfo">在旅行过程中需要担架的旅客</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                        <li @click="openWritePage(Pages.passengers.useoxyPeople.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_yangqi@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>用氧旅客</span>
                                    <div class="careInfo">在乘坐航班时需要使用医用氧气的旅客</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                        <li @click="openWritePage(Pages.passengers.sickenPeople.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_huanbing@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>患病旅客</span>
                                    <div class="careInfo">指患有疾病、受伤并能够提供规定的医疗单位出具的适合乘机的诊断证明的旅客</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                        <li @click="openWritePage(Pages.passengers.EWConPeople.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_dianlun@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>电动轮椅旅客</span>
                                    <div class="careInfo">需要托运电动轮椅的旅客</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                        <li @click="openWritePage(Pages.passengers.disTeamPeople.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_tuanti@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>残疾人团队旅客</span>
                                    <div class="careInfo">指统一组织多人人数，航程、乘机日期和航班相同的具备乘机条件的残疾人</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                        <li @click="openWritePage(Pages.passengers.disPeople.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_canzhanglvke@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>残障旅客</span>
                                    <div class="careInfo">指无需轮椅服务残疾旅客及有智力或精神疾病类旅客</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                    </ul>
                </div>
                <!-- 孕妇、产妇旅客 -->
                <div class="post-wrapper careWrap">
                    <div class="writeInformation-title">孕妇、产妇旅客</div>
                    <ul>
                        <li @click="openWritePage(Pages.passengers.prgnPeople.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_yunfu@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>孕妇旅客</span>
                                    <div class="careInfo">怀孕不超过35周的旅客</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                        <li @click="openWritePage(Pages.passengers.lctnPeople.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_buru@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>哺乳旅客</span>
                                    <div class="careInfo">在机舱内有哺乳需求的旅客</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                    </ul>
                </div>
                <!-- 服务犬旅客 -->
                <div class="post-wrapper careWrap">
                    <div class="writeInformation-title">服务犬</div>
                    <ul>
                        <li @click="openWritePage(Pages.passengers.serDogPeople.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_fuwuquan@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>服务犬旅客</span>
                                    <div class="careInfo">指为残疾人生活和工作提供协助的特种犬，包括辅助犬、导听犬、导盲犬。</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                    </ul>
                </div>
                <!-- 活体器官及血液制品运输 -->
                <div class="post-wrapper careWrap">
                    <div class="writeInformation-title">活体器官及血液制品运输</div>
                    <ul>
                        <li @click="openWritePage(Pages.passengers.organTra.winName)">
                            <label class="flexbox">
                                <div class="img">
                                    <img src="../../../common/imgs/icon_huotiyunshu@3x.png" alt="">
                                </div>
                                <div class="all-inputBox flex-1">
                                    <span>活体器官及血液制品运输</span>
                                    <div class="careInfo">携带活体器官或血液制品运输</div>
                                </div>
                                <div class="btn"></div>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import 'common/tools/rem'
    import 'common/styles/common/common.scss'
    import 'common/styles/slice_sass/content.scss'
    import Header from 'components/header.vue'
    import Footer from 'components/footer.vue'
    import page from 'common/deploy/page'
    import controller from 'common/logic/controller'
    import { saveLoginInfo, getIsLogin } from 'common/logic/logic'
    import lsKey from 'common/deploy/localstorage'

    export default {
        data() {
            return {
                isUseHeader: false,
                memberInfo: null,
                pageData: {},
                Pages: page,
                setTitleStyle: {
                    // isUseH5: true,
                    // title: '关怀通道',
                    // titlestyle: 2,
                    // navRightItem: 2,
                    // rightTxt: '我的',
                    title: '关怀通道',
                    titlestyle: 4,
                    navRightItem:2,
                    navRightTitle:'我的',
                }
            }
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                controller.onshow(function() {
                    saveLoginInfo().then(memberInfo => {
                        that.memberInfo = memberInfo
                    })
                })
            })
            controller.navRightTitle(()=>{
                that.myList()
            })
        },
        computed: {
        },
        methods: {
            // 打开信息填写页
            openWritePage(pageName) {
                let pageInfo = page.passengers[pageName]; //要跳转到具体填写页的地址
                // 是否登录
				if (!getIsLogin(true,{
                    winName: pageInfo.winName,
                    path: pageInfo.pageUrl
                })) {
					return;
                }
                
                controller.open({
                    winName: pageInfo.winName,
                    path: pageInfo.pageUrl
                })
            },
            // 点击返回按钮
            clickBackBtn() {
                controller.close();
            },
            myList () { //我的列表
                // 是否登录
				if (!getIsLogin(true,{
                    winName: page.passengers.applyList.winName,
                    path: page.passengers.applyList.pageUrl,
                })) {
					return;
				}
                let that = this;
                controller.open({
                    winName: page.passengers.applyList.winName,
                    path: page.passengers.applyList.pageUrl,
                })
            }
        },
        components: {
            Header,
            Footer
        }
    }
</script>

<style lang="scss" scoped>
    @import '~common/styles/common/function.scss';
    .main{
        .container{
            .post-wrapper{
                &:nth-child(2){
                    li:nth-child(6){
                        height: rem(146)
                    }
                    li:nth-child(8){
                        height: rem(146)
                    }
                    li:nth-child(9){
                        height: rem(146);
                        margin-bottom: rem(0)
                    }
                }
                &:nth-child(4){
                    li{
                        height: rem(146);
                    }
                }
            }
        }
    }
</style>
