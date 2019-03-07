
<template>
    <div id="app">
       <Header @clickHeader='clickBackBtn' @clickSkip = "rightcallback" :setTitleStyle="titleStyle"></Header>
     <div class="main myfix"  >             
        <div class="m-wp">   
            <div class="banner">
                <img src="./img/pic_food.png"/>
            </div> 
            <div class="leg">         
                <div class="m-box" >
                    <div class="m-form">
                        <div class="inputAnime flexbox">
                            <label>{{ labelInfo.ticketNo }}</label>
                            <input class="flex-1" v-model="psgInfo.ticketNo" type="text" @focus="focus(labelInfo.ticketNo, $event)" @blur="blur('ticketNo', $event)">
                            <div class="del" @click="del('ticketNo', $event)" v-show="psgInfo.ticketNo!= ''"></div>
                        </div>
                        <div class="inputAnime flexbox">
                            <label>{{ labelInfo.passengerName }}</label>
                            <input class="flex-1" v-model="psgInfo.passengerName" type="text" @focus="focus('乘机人姓名', $event)" @blur="blur('passengerName', $event)" >
                            <div class="del" @click="del('passengerName', $event)" v-show="psgInfo.passengerName != ''"></div>
                        </div>
                        <div class="form-btn">
                            <button :class="submitBtnCls" @click="checkFlight">查询航班</button>
                        </div>
                    </div>
                    
                </div>
                 <div class="m-box flex1" @click="buyRules">
                    <p>服务条款&隐私条款</p>
                    <div class="btn">
                        <img src="./img/right_arrow.png"/>
                    </div>
                </div>
            </div>

            </div>
        </div>
    </div>
</template>

<script>
    import "common/tools/rem"
    import Header from "components/header.vue"
    import { controller} from "common/logic/controller"
    import { saveLoginInfo, getIsLogin } from 'common/logic/logic'
    import Page from 'common/deploy/page'
    import requesturl from 'common/deploy/requesturl'
    import {vilidation} from 'common/logic/utils'
    import { RegEnum, Verify, ResultCode} from 'common/logic/enum';
    export default {
        data() {
            return {
                // 头部信息
                 titleStyle: {
                    isUseH5:true,
                    title: '个性化餐食',
                    titlestyle: 3,
                    navRightItem: 2,
                    navRightTitle: '我的申请',                  
                },            
                  
                psgInfo:{                  
                    ticketNo: '',  // 票号                  
                    passengerName: '', // 乘机人姓名
                },
               /*  pageData: {}, */
               
                // label 内容
                labelInfo: {
                    ticketNo: '乘机所持证件号/票号',
                    passengerName: '乘机人姓名，如吉祥，或JI/XIANG'
                }
            }
        },
        components: {
            Header
        },
        //通用请求数据
        created() {
             var that = this;          
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data   
                controller.navRightTitle(()=>{
                    that.rightcallback()
                })  
                 controller.clickBack(() => {
                    that.clickBackBtn()
                }) 
                 controller.onshow(function(){
                    saveLoginInfo().then(memberInfo => {
                        that.memberInfo = memberInfo
                    })
                })       
            })
          
          },
        methods: {
             //右面的文字
            rightcallback(data){
                 const that=this 
                 //判断是否登录
                    if (!getIsLogin(true)) {
                        return;
                    }
                    controller.open({
                        winName: Page.meals.myApply.winName,
                        path: Page.meals.myApply.pageUrl,
                    })                
            },            
            //服务条款
            buyRules(){
                let subUrl = Page.meals.buyRules;
                 controller.open({
                        winName:subUrl.winName,
                        path: subUrl.pageUrl,
                        data:{
                             closetype:0
                        }
                    });
            },
           
             // 点击返回按钮
            clickBackBtn() {
                controller.close({
                    flag: -3
                });
            },
            // input框动画
            focus(txt, event) {
                let target = event.target;
                target.previousElementSibling.innerHTML = txt;
                target.previousElementSibling.classList.add('offset');
                 
            },
            blur(vModel, event) {
                let target = event.target;
                if(this.psgInfo[vModel] == ''){
                    target.previousElementSibling.innerHTML = this.labelInfo[vModel];
                    target.previousElementSibling.classList.remove('offset');
            
                }
            },
            del(vModel, event) {
                let target = event.target;
                this.psgInfo[vModel] = '';
                target.previousElementSibling.focus();
            },
             // 开始验证信息
            startVerification() {
                const that=this
                // 验证乘机人姓名
                if(this.psgInfo.passengerName.length > 25){
                    controller.toast({str: Verify.BACK_ERR.toastNameLen});
                    return false;
                }
                if(!this.vertificate(this.psgInfo.passengerName, RegEnum.NAME_ALL, 2000)) {
                    return false;
                }             
                 // 验证票号
                if (this.psgInfo.ticketNo) {
                    if(!this.vertificate(this.psgInfo.ticketNo,RegEnum.EN_NUMBER, 2000)){
                        return false;
                    }
                }
                return true;
            },
             // 通用的验证方法
            vertificate(content, reg, time) {
                let verificateResult = vilidation(content, reg);
                if(typeof verificateResult === 'string') {  
                    controller.toast({str: verificateResult, times: time});
                    return false;
                }
                return true;
            },
            // 查询航班
            checkFlight() {  
                let that = this
                if( this.isDetailPage && this.startVerification()){
                        controller.getJSON({
                            method : 'POST',
                            url:requesturl.MEALS.QUERYFLIGHT,
                            params: that.createParams(),  
                                              
                        })
                        .then(that.sucCallback)
                        .catch(that.errCallback)   
                    
                }              
            },
             //请求成功回调
            sucCallback(res){
                console.log(res)       
                if(res.resultCode==ResultCode.SUCCESS){
                let subUrl = Page.meals.choiceFlight          
                    controller.open({
                        winName:subUrl.winName,
                        path:subUrl.pageUrl,
                        data:{
                            item:res.objData
                        },
                  
                     })                 
                }else{
                    if(res.resultInfo){
                       controller.toast({str:res.resultInfo});
                    }else{
                         controller.toast({str:'未查询到航班信息'});
                    }
                   
                }
            },
         //请求回调失败
             errCallback(data) {
                controller.toast({str: Verify.BACK_ERR.toastNet});
            },
              //请求发送字段名
          createParams() {
                return {	
                    "request": {
                         "ticketNo":this.psgInfo.ticketNo,
                        "passName":this.psgInfo.passengerName                  
                        /* "ticketNo":"0182355120923",
                        "passName":"施跃"  
                        高露洁 362425199302200045
                        */                                    
                    }                      
               }
            },
        },
        computed:  {
             submitBtnCls() {   
                 if(this.psgInfo.passengerName && this.psgInfo.ticketNo ){
                     this.isDetailPage=true                    
                     return 'cu-btn'
                 }else{
                     this.isDetailPage=false
                     return 'cu-btn-disabled'
                 }         
                /*  return 'g-btn g-disabled' */
            },

        },
    };
</script>
<style lang="scss" scope>
    @import '~common/styles/common/common.scss';
.main{
   background:#25292F;
}
.myfix{
     position: fixed;
    width: 100%;
    height: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;

}
.style-ios .myfix{
     position: fixed;
    width: 100%;
    height: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;

}
.m-wp {
    .banner{
        height:rem(480);
        background: url('./img/bg_1.png') no-repeat;          
        background-size:100% rem(480);
        width: 100%;
        img{
        width:rem(430);
        height: rem(430); 
        display:block;
         margin:0 auto;
        padding: rem(151) 0 0; 
        }
        margin-bottom:rem(198);
    }
    .leg{
        padding:0 rem(30);
    .m-box {
        background-color: #fff;
        border-radius: rem(6);
        &.mt20 {
            margin-top: rem(20);
        }
        .m-form {
            padding: rem(20) rem(30);
            .form-btn {
                margin-top: rem(30);
                margin-bottom: rem(10);
            }
        }
    }
    .flex1{
        margin-top:rem(20);
        padding:0 rem(30);
        overflow: hidden;
        p{
            float:left;
            font-size:rem(28);
            color:#3A3D50;
            padding:rem(42) 0;
            font-weight: bold;
        }
        .btn{
            float:right;
            width:rem(24);
            height:rem(24);
            padding:rem(49) 0;
            img{
              width:rem(24);
              height:rem(24);
            }
        }
    }
  }
}
.inputAnime {
    &::before {
        border-top: none;
        top: auto;
    }
    @include bd-bottom(#EBECEE);
    .style-ios & {
        &::before {
            border-top: none;
            top: auto;
        }
        @include bd-bottom-ios(#EBECEE);
    }
    &:first-child {
        &::before {
            // border-top: none;
            top: auto;
        }
        .style-ios & {
            &::before {
                // border-top: none;
                top: auto;
            }
        }
    }
}

</style>
