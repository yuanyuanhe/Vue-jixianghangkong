<template>
    <div id="app">
        <Header @clickHeader='clickBackBtn' :setTitleStyle="setTitleStyle"></Header>
        <div class="main">
            <div class="payment_state payment_success">
                <p class="title">{{succTipText}}</p>
                <img src="./img/pic_pay.png" alt="" class="state_img" />
            </div>
            <div class="payment_success_prompt">
                <span class="text">您的需求已成功受理，如有其他疑问，可随时拨打“95520”<br>
                 由专属客服接待，我们将竭诚为您服务！</span>
            </div>
            <footer class="footer">
                <button class="g-btn" @click="checkDetail">查看详情</button>
            </footer>
        </div>
    </div>
</template>

<script>
    import '../../../common/tools/rem'
    import '../../../common/styles/common/common.scss'
    import Header from 'components/header.vue'
    import {SuccType } from 'common/logic/enum.js'
    import { controller } from 'common/logic/controller.js'
    import Page from 'common/deploy/page.js'
    export default {
        data() {
            return {
                memberInfo: null,
                pageData: {},
                title: '',
                succTipText: '',
                setTitleStyle: {
                    isUseH5: true,
                    title: '',
                    titlestyle: 2
                }
            }
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                console.log(data)
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                that.initPage();
            })
        },
        components: {
            Header
        },
        methods: {
            checkDetail() {
                console.log(this.pageData)
                let pageName = this.pageData.pageName;
                let id = this.pageData.id;
                let pathObj = Page.passengers[pageName];
                console.log(pageName)
                console.log(id)
                console.log(pathObj)
                controller.open({
                    winName: pathObj.winName, 
                    path: pathObj.pageUrl,
                    data: {isDetailPage: true, id: id, originPage: 'sucApply'},
                    closeLastPage: true
                });
            },
            clickBackBtn() {
                let carePage = Page.passengers.care;
                controller.close({pageUrl: '/' + carePage.pageUrl});
            },
            initPage() {
                this.setTitleStyle.title = this.pageData.title;
                this.succTipText = this.pageData.type === SuccType.ORDER_SUCC ? '预订成功！' : '申请成功！';
                if(!this.setTitleStyle.isUseH5){
                    controller.setTitle(this.succTipText);
                }
            }
        },
        computed: {
        }
    }
</script>

<style lang="scss">
    @import '../../../common/styles/slice_sass/payment.scss';
    header.g-header{
        .f-fx{
            background: #d73558;
            box-shadow: none;
        }
    }
</style>
