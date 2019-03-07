<style lang="scss" scoped>
@import '~common/styles/common/function.scss';
    #app{
        background: #000000;
        position: relative;
        .img-layer{
            width: 100%;
            height: rem(87);
            background:#151518;
            opacity: .9;
            position: absolute;
            z-index: 999;
            left: 0;
            top: 0;
            .backBtn{
                width: rem(35);
                height: rem(35);
                float: left;
                margin-left: rem(50);
                margin-top: rem(27);
                img{
                    width: rem(21);
                    height: rem(35);
                }
            }
            .delBtn{
                width: rem(39);
                height: rem(39);
                float:right;
                margin-top: rem(25);
                margin-right: rem(41);
                img{
                    width: rem(39);
                    height: rem(39);
                }
            }
        }
        .img{
            position: absolute;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            img{
                align-items: center;
            }
        }
    }

    body.style-ios {
        .img-layer {
            padding-top: rem(40);
            height: rem(80);
        }
    }
</style>

<template>
    <div id="app">
        
            <div class="img-layer">
                <div class="backBtn" @click="backBtn">
                    <img src="../../../common/imgs/back.png" alt="">
                </div>
                <div class="delBtn" @click="backDelBtn" v-if="isDetail">
                    <img src="../../../common/imgs/delImgBtn.png" alt="">
                </div>
            </div>
            <div class="img flexbox">
                <img :src="imgUrl" alt="" :style="style">
                <!-- <img src="../../../common/imgs/back.png" alt=""> -->
            </div>
    
    </div>   
</template>

<script>
    import 'common/tools/rem'
    import 'common/styles/common/common.scss'
    import 'common/styles/slice_sass/content.scss'
    import Page from 'common/deploy/page'
    import controller from 'common/logic/controller'
    import requesturl from 'common/deploy/requesturl'
    export default {
        data() {
            return {
                imgUrl:"",
                style:"",
                isDetail:true
            }
        },
        components: {
            
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                // console.log(data)
                // controller.clickBack(() => {
                //     that.clickBackBtn();
                // })

                that.isDetail = data.data.isDetailPage;
                if(data.data.isDetailPage){
                    that.isDetail = false;
                }else{
                    that.isDetail = true
                }
                console.log(data.data.isDetailPage)

                let imgUrl = controller.getStorage("imgUrl");
                
                this.imgUrl = imgUrl;
                // console.log(imgUrl)

               

                controller.clearStorage("imgUrl");

                let img = new Image();
                img.src = this.imgUrl;
                if(img.width > img.height){
                    let height = img.width*0.75;
                    this.style = `width:100%;height:{height};`
                }else if(img.width <= img.height){
                    this.style = "width:100%;height:100%;"
                }
              
            })
        },
        computed: {
        },
        methods: {
            // 关闭规则页面
            closeRulesPage() {
                this.canShowRules = false;
            },
            // 点击规则按钮
            clickRulesBtn() {
                this.canShowRules = true;
            },
            backBtn(){
                controller.close(-1)
            },
            backDelBtn(){
                var that = this;
                controller.confirm({
                    title: '提示',
                    message: '您确定要删除这张照片么',
                    buttons: ['取消', '确定'],
                    onConfirm() {
                        controller.setStorage("imgarr",that.imgUrl)
                        controller.close(-1)
                    }
                })
                
            }
            
        }
    }
</script>
