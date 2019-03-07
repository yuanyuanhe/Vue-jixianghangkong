<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header>
        <div class="main mainHasBottom" >
            <div class="hint" v-if='isDetailPage'>{{psgInfo.serviceStateName}}</div>
            <div class="container">
                <!-- 乘机人信息 -->
                <div class="post-wrapper">
                    <div class="writeInformation-title">乘机人信息</div>
                    <ul>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>乘客姓名</span>
                                </div>
                                <input type="text" v-model="pageData.passName"  class="all-input-style flex-1" readonly>
                            </label>
                        </li>
                        <li>
                            <div class="flexbox"> 
                                <div class="all-inputBox">
                                    <span>证件信息</span>
                                </div>                              
                                <div class="all-inputBox u_box">
                                    <span class="flex-1">{{pageData.passIdcardType | passIdcardType}}</span>
                                </div>
                                <input 
                                type="text" 
                                v-model.trim="pageData.passIdcard" 
                                :readonly='isDetailPage'                              
                                class="all-input-style flex-1">
                            </div>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>手机号码</span>
                                </div>
                                <input type="text" v-model="pageData.phoneNum" placeholder="请输入手机号" class="all-input-style flex-1" readonly>
                            </label>
                        </li>
                        <li v-if="pageData.pcompensation=='银行卡'">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>银行卡信息</span>
                                </div>
                                <span class="all-input-style flex-1">{{pageData.information}}</span>
                               <!--  <input type="text" v-model="pageData.information" readonly class="all-input-style flex-1"> -->

                            </label>
                        </li>
                        <li v-if="pageData.pcompensation=='银行卡'">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>银行卡卡号</span>
                                </div>
                                <input type="text" v-model="pageData.cardNumber"  class="all-input-style flex-1" readonly>
                            </label>
                        </li>
                         <li v-if="pageData.pcompensation=='支付宝'">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>支付宝账号</span>
                                </div>
                                <input type="text" v-model="pageData.cardNumber"  class="all-input-style flex-1" readonly>
                            </label>
                        </li>
                    </ul>
                </div>
                <!-- 航班信息 -->
                <div class="post-wrapper">
                    <div class="writeInformation-title">航班信息</div>
                    <ul>
                        <li v-if="!isDetailPage || psgInfo.ticketNo">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>票号</span>
                                </div>
                                <input type="text" v-model="pageData.ticketNo"  class="all-input-style flex-1" readonly>
                            </label>
                        </li>
                        <li v-if="!isDetailPage || psgInfo.flightNo">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>航班号</span>
                                </div>
                                <input type="text" v-model="pageData.flightNo"  class="all-input-style flex-1" readonly>
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>出行日期</span>
                                </div>
                                <input type="text"  v-model="pageData.flightDate" readonly  class="all-input-style flex-1" >
                               
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>出发站</span>
                                </div>
                                <input type="text" v-model="pageData.depCityName" class="all-input-style flex-1" readonly >
                               
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>到达站</span>
                                </div>
                                <input type="text" v-model="pageData.arrCityName" class="all-input-style flex-1" readonly>                               
                            </label>
                        </li>
                    </ul>
                </div>
                
                 <!--补偿信息 -->
                <div class="post-wrapper">
                    <div class="writeInformation-title">补偿信息</div>
                    <ul>
                        <li v-if="!isDetailPage || psgInfo.ticketNo">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>补偿原因</span>
                                </div>
                                 <span class="all-input-style flex-1" >{{pageData.compensateCause | compensateCause}}</span>
                                <!-- <input type="text" v-model="pageData.compensateCause" class="all-input-style flex-1" readonly> -->
                            </label>
                        </li>
                        <li v-if="!isDetailPage || psgInfo.flightNo">
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>补偿规则</span>
                                </div>
                                <span class="all-input-style flex-1" >{{pageData.compensateRule}}</span>
                                <!-- <input type="text" v-model="psgInfo.rule" placeholder="延误4小时" class="all-input-style flex-1" :readonly='isDetailPage'> -->
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>补偿方式</span>
                                </div>
                                <span class="all-input-style flex-1">{{pageData.pcompensation}}</span>
                               <!--  <input type="text"  v-model="psgInfo.mode" class="all-input-style flex-1"> -->
                                
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>补偿内容</span>
                                </div>
                                <span class="all-input-style flex-1">{{pageData.compensateContent |compensateContent}}</span>
                               <!--  <input type="text"  class="all-input-style flex-1"  v-model="psgInfo.content"> -->
                            </label>
                        </li>
                        <li>
                            <label class="flexbox">
                                <div class="all-inputBox">
                                    <span>补偿金额</span>
                                </div>
                                <input type="text"  class="all-input-style flex-1" v-model="pageData.compensateAmount" readonly>
                               
                            </label>
                        </li>
                    </ul>
                </div>
               <div class="serviceRules" v-if='!isDetailPage'>
                    <label for="voucher-slect" class="select-checkbox flexbox">
                        <!-- <input type="checkbox" v-model="checkInput" class="label-checkbox" id="voucher-slect">
                        <span class="select-btn"></span> -->
                        <div class="ruleTxt">
                            点击同意即代表已阅读
                            <a href="javascript:;" @click='clickRulesBtn'>旅客须知</a>
                        </div>
                    </label>
            </div>
        </div>
             
        </div>
        <Footer v-if='!isDetailPage'>
            <!-- 灰色 g-disabled 橙色 g-btn-->
            <div slot="sureBtn" class="box">
             <button class="b1"  @click="showDisagree" :class="submitBtnCls"><span>不同意</span></button>
             <button class="b2"  @click="showAgree" :class="submitBtnCls"><span>同意</span></button>
          </div>
        </Footer>            
         <RuleSlot :rulesTitle='rulesTitle' @clickCloseBtn='closeRulesPage' v-show='canShowRules' :isShow='canShowRules'>
            <div class="rulesInfo" slot="ruleInfo">
                <h4>
                    兹有我收到上海吉祥航空公司北京航站(办事处)所支付给我的上述赔偿款项。对于本次航班延误（备降、取消）造成的损失，我今后不再向吉祥航空公司及吉祥航空公司航班衔接的承运人及其代理人等提出任何索赔要求。
                </h4>
                <p>Disclaimer of liability <br/>
                    I have received the above-mentioned payments from Terminal (Office) Beijing , Shanghai Juneyao Airlines as the compensation. For the losses caused by the flight delay (preparation, cancellation), I will no longer make any claim again for a compensation from Shanghai Juneyao Airlines,its flight-connecting carriers and agents henceforth.
                </p>
                
            </div>
        </RuleSlot>
    </div>
</template>

<script>
    import 'common/tools/rem'
    import 'common/styles/common/common.scss'
    import 'common/styles/slice_sass/content.scss'
    import Header from 'components/header.vue'
    import Footer from 'components/footer.vue'
    import Page from 'common/deploy/page.js'
    import {controller} from 'common/logic/controller'
    import requesturl from 'common/deploy/requesturl'
    import RuleSlot from 'components/ruleSlot.vue'   
    import service from 'common/service/data'
    import {vilidation,dateFormat,juneyaoair} from 'common/logic/utils'
    import {RegEnum, Verify, ResultCode} from 'common/logic/enum'
  
    export default {
        data() {
            return {
                titleStyle:{
                    title: '申请反馈',
                    titlestyle: 4
                }, 
                 rulesTitle: '旅客须知',       
                memberInfo: null,
                pageData: {},
                isDetailPage: false,
                canClickBtn :false,
                juneyaoair: juneyaoair,               
                canShowRules: false,
                ResultCode:ResultCode,
                psgInfo:{
                        bankInformation:'',
                        compensateWay:'',
                }
            }
        },
        components: {
            Header,
            Footer,         
            RuleSlot
        },
         created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data.pageData;              
                console.log(that.pageData)            
                if(that.pageData.information=="上海银行"){
                   that.psgInfo.bankInformation="1"
                }else if(that.pageData.information=="华瑞银行"){
                    that.psgInfo.bankInformation="2"
                }
                if(that.pageData.pcompensation=="银行卡"){
                    that.psgInfo.compensateWay='1'
                }else if(that.pageData.pcompensation=="支付宝"){
                    that.psgInfo.compensateWay='2'
                }
                 controller.clickBack(() => {
                    that.clickBackBtn()
                })
            })
       },
        methods: {         
            showAgree() {
                console.log(1)
                  const that = this
                if(that.canClickBtn && that.valify()){ 
                     controller.getJSON({
                        method: 'POST',
                        url:requesturl.ABNORMALFLIGHT.FEEDBACKINFORMATION,
                        params: that.createParams(),
                      
                    
                    })
                    .then(that.sucCallback)
                   .catch(that.errCallback)
               
                }         
            },
            showDisagree() {
                controller.alert({
                    title: '提示',
                    content: `您未接受补偿方案，请致电<a href="tel:95520">95520</a>详询。`,
                    alertBtn: '返回',
                    onConfirm: () => {//返回
                       controller.close({
                             flag:-1
                             });
                    }
                })
            },
            //发送请求字段
            createParams(){
                   return{
                       "request": {                           
                               "ffpCardNo":this.memberInfo.memberID,
                               "ffpId":this.memberInfo.id,
                               "loginKeyInfo":this.memberInfo.loginKeyInfo,
                                "id":this.pageData.id,            //id                                     
                                "phoneNum":this.pageData.phoneNum,           //手机号                             
                                "receiptWay":this.psgInfo.compensateWay,             //补偿方式  银行卡
                                "receiptAccountBank":this.psgInfo.bankInformation,             //收款银行方式                            
                                "receiptAccount":this.pageData.cardNumber,           // 收款账号           
                           }
                        } 
                   },                   
            // 关闭规则页面
            closeRulesPage() {
                this.canShowRules = false;
                controller.showBar(1)
            },
            // 点击规则按钮
            clickRulesBtn() {
                this.canShowRules = true;
                controller.hiddenBar(1)
            },
            // 点击返回按钮
            clickBackBtn() {
               controller.close({
                             flag:-1
                             });
            },
            //请求失败回调
            errCallback(data) {
                controller.toast({str: Verify.BACK_ERR.toastNet});
            },
           //请求成功回调
          sucCallback(data){  
               console.log(data)
               if(data.resultCode==ResultCode.SUCCESS){                 
                controller.alert({
                    title: '提示',
                    content: '您在线申请的补偿已审核通过</br>请注意账户金额变动',
                    alertBtn: '返回',
                    onConfirm: () => {//返回
                        controller.close({
                             flag:-1
                             });
                    }
                })
               }
             
          },
            // 验证信息
            valify(){
                  // 验证乘机人姓名
                if(this.pageData.passName.length > 25){
                    controller.toast({str: Verify.BACK_ERR.toastNameLen});
                    return false;
                }
                if(!this.vertificate(this.pageData.passName, RegEnum.NAME_ALL, 2000)) {
                    return false;
                }       
                   // 验证身份证件号
                if(this.pageData.passIdcardType == 'NI' && !this.vertificate(this.pageData.passIdcard, RegEnum.ID_CARD, 2000)) {
                    return false;
                }
                //验证护照
                 if(this.pageData.passIdcardType == 'PSPT' && !this.vertificate(this.pageData.passIdcard, RegEnum.PASSPORT, 2000)) {
                    return false;
                }
               // 验证手机号
                if(!this.vertificate(this.pageData.phoneNum, RegEnum.MOBILE, 2000)) {
                    return false;
                }
                // 航班信息验证
                // 验证票号
                if (this.pageData.ticketNo) {
                    if(!this.vertificate(this.pageData.ticketNo,RegEnum.TICKET_NO, 2000)){
                        return false;
                    }
                }
                //航班号
                if(!!this.pageData.flightNo){
                    if (!this.vertificate(this.pageData.flightNo, RegEnum.FLIGHT_NO, 2000)) {
                        return false;
                    }
                }
               //航班日期 
                if (!this.vertificate(this.pageData.flightDate, RegEnum.DATE_CH, 2000)) {
                    return false;
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
            maxStartDate() {
                return new Date(new Date().setMonth(new Date().getMonth() + 6))
            },
        },
        computed: {
            submitBtnCls() {
                if (
                    this.pageData.passName && this.pageData.passIdcardType && this.pageData.passIdcard && 
                    this.pageData.phoneNum &&  this.pageData.ticketNo && this.pageData.flightNo && this.pageData.flightDate && 
                    this.pageData.depCityName && this.pageData.arrCityName && this.pageData.compensateCause &&
                    this.pageData.compensateRule &&this.pageData.pcompensation && this.pageData.compensateContent && 
                    this.pageData.compensateAmount
                    ) {
                        if((this.pageData.information && this.pageData.cardNumber) || this.pageData.cardNumber){
                                  this.canClickBtn = true; 
                        }else{
                             this.canClickBtn = false; 
                        }
              
                } else {
                    this.canClickBtn = false;                 
                }
            }
        },
        filters: {
            passIdcardType:function(value){
                let str=""
               switch(value){
                   case "NI":str="身份证";break;
                   case "PSPT":str="护照";break;
               }
               return str;
            },
            compensateCause:function(value){
                 let str=""
               switch(value){
                   case "1":str="航班延误";break;
                   case "2":str="航班取消";break;
                   case "3":str="航班备降";break;
               }
               return str;
            },
            compensateContent:function(value){
                 let str=""
               switch(value){
                   case "1":str="现金";break;
                   case "2":str="积分";break;
                   case "3":str="服务性补偿";break;
               }
               return str;
            },
        }
    }
</script>
<style lang="scss" scope>  
  @import "~common/styles/common/_mixin.scss";
  @import "~common/styles/common/function.scss";

.rule-head{
        margin: rem(106) 0 rem(70);
        @include textAlign(center);
        font-size: rem(40);
        font-weight:bold;
        color:#25292F;
    }
.rule-main{
  position: absolute;
  top:rem(216);
  bottom:rem(2);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding: rem(30) rem(20) rem(30) rem(40);
  h4{
    font-size:rem(28);
    font-weight:400;
    color:#3A3D50;
    line-height:rem(45);
  }
  
  p{
    font-size:rem(28);
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:#3A3D50;
    margin-top:rem(40);
    line-height:rem(40);
  }
 
}

    .cube-popup-content {
        .cube-dialog-main {
            .cube-dialog-content-def {
                 p {
                    color: #3A3D50;
                    line-height: rem(50);
                    a{
                        color:#CB9D6D;
                    }
                }
            }
        }
    }
 .container{
    padding:rem(20) rem(30) 0;
    .post-wrapper li .u_box{
        color:#3A3D50;
        font-weight: 400;
        min-width:0;
        font-size:rem(28);
        span{
            padding-right:rem(10);
           
        }

    }
   .post-wrapper{
       li{
           input{
                color:#3A3D50;
                font-weight:400;
           }
           .flex-1{
                color:#3A3D50;
                font-weight:400;
           }
       }
       
   }
}
.serviceRules{
    .ruleTxt{      
        margin:0 auto rem(83);
        font-size:rem(24);
        text-align: center;
        a{
             color:#CB9D6D;
             text-decoration:underline;  
        }
    }
}
.box{
        font-size:rem(32);
         display:flex;
         height:100%;     
        .b1{            
                color:#3A3D50;
                background:#fff;      
               
                flex:1;
                span{
                    display:inline-block;
                    width:100%;
                   border-right:rem(1) solid #e6e6e6;
                }
            }
        .b2{ 
            flex:1;                     
            color:#CB9D6D;
            background:#fff;      
        }
    }
   footer.g-footer{
       z-index:0;
   }
</style>

