<template>
 <div id="app">
     <Header @clickHeader='clickBackBtn' @clickSkip = "rightcallback"  :setTitleStyle="titleStyle"></Header>
     <div class="main">
         <div class="apply">
            <img src="./img/icon_successful.png"/>
            <span>更改成功</span>
         </div>
         <div class="container">
             <div class="post-wrapper">
                 <ul>
                     <li>
                         <label class="flexbox">
                            <div class="all-inputBox">
                                 <span>乘机人</span>
                            </div> 
                            <span class="all-input-style flex-1" >{{psgInfo.passengerName}}</span>
                                
                        </label>
                    </li> 
                    <li>
                        <label class="flexbox">
                            <div class="all-inputBox">
                                <span>申请餐食</span>
                            </div> 
                             <span class="all-input-style flex-1">{{psgInfo.idvmMealName}}</span>                      
                        </label>
                    </li> 
                </ul>
         </div>
     </div>
  </div>
</div>
</template>
<script>
    import "common/tools/rem";
    import Header from "components/header.vue";
    import {controller} from "common/logic/controller"
    import Page from 'common/deploy/page'
  /* import requesturl from 'common/deploy/requesturl' */
    export default{
        data(){
            return {
                 titleStyle: {
                    barStyle:0,
                    title: '更改结果',
                    titlestyle: 4,
                    navRightItem: 2,
                    navRightTitle: '我的申请',
                    isUseH5:true,                  
                },
                psgInfo:{}
                
            }
        },
        created() {
             var that = this;          
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;               
                that.item=data.data.item//数组航班列表
                console.log(that.item)
                that.psgInfo =data.data.psgInfo //对象姓名                     
                  controller.clickBack(() => {
                    that.clickBackBtn()
                }) 
                controller.navRightTitle(()=>{
                     that.rightcallback()
                })        
            })
          },
        methods:{
           // 点击返回按钮
            clickBackBtn() {                
                  const that=this
                 let subUrl=Page.meals.myApply
                controller.popWindowName({
                   winName:subUrl.winName,
                });    
            },
           
            //右侧文字
            rightcallback(data){
                controller.open({
                    winName:Page.meals.myApply.winName,
                    path:Page.meals.myApply.pageUrl
                }) 
            }
        },
        components: {
            Header
        }
    }
</script>
<style lang="scss" scope>
 @import "~common/styles/common/_mixin.scss";
  @import "~common/styles/common/function.scss";
  @import '~common/styles/common/common.scss';
body.style-ios{
    header.g-header {
             .f-fx {
                  .skip{
                      color:#3A3D50 !important;
                 }
             }
    }     
} 
header.g-header{
     .f-fx {
         &.white{
             .skip{
                color: #3A3D50 !important;
            }
         }
     }
}
.main{
 .apply{
    width:100%;
    height:rem(240);
    background:linear-gradient(180deg,rgba(215,53,88,1) 0%,rgba(196,51,100,1) 100%);
    color:#fff;
    img{
        width:rem(48);
        height:rem(48);
        margin:rem(66) rem(22) rem(66) rem(30);
        float:left;
    }
    span{    
        float:left;       
        font-size:rem(42);
        font-family:PingFangSC-Semibold;
        font-weight:600;
        padding:rem(60) 0;
    }
}
}

 .container{
     position: relative;
     top:rem(-80);
    padding:rem(20) rem(30) rem(83);
    .post-wrapper li .u_box{
        color:#ccc;
        font-weight: bold;
        min-width:0;
        font-size:rem(28);
        span{
            padding-right:rem(10);
           
        }

    }
   .post-wrapper{
       li{
           input{
                color:#848484;
                font-weight:400;
           }
           .flex-1{
                color:#848484;
                font-weight:400;
           }
       }
       
   }
}
</style>
