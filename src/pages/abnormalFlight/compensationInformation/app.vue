<template>
  <div id="app">
     <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header>
     <div class="main mainHasBottom">
         <div class="g-tpPrompt">
            补偿原因：{{pageData.compensateCause | compensateCause}}
        </div>
        <div class="container">
            <div class="post-wrapper careWrap">
                <div class="writeInformation-title">航班信息</div>
                    <div class="ticket-information-wrapper">
                        <div class="m-item">
                                <!-- 日期、退改规则 -->
                            <div class="u-head clearfix">
                                <div class="uh-lf">
                                    <span>{{pageData.flightNo}}</span> | <span>{{pageData.flightDate}}</span>                       
                                </div>
                                <div class="uh-rt" v-if="pageData.days>0">
                                    <span>前面{{pageData.days}}人候补</span>
                                </div>
                            </div>
                                <!-- 出发地、目的地、+1天 -->
                            <div class="u-con">                            
                                <div class="clearfix">
                                    <!-- 出发地 -->
                                    <div class="uc-lf">
                                        <div class="s-time">{{pageData.depTime ? pageData.depTime.slice(11,16):'--:--'}}</div>
                                        <div class="s-address">{{pageData.departureAirportName + pageData.depAirportTerminal}}</div>
                                    </div>
                                    <!-- 行程时间、经停站 -->
                                    <div class="uc-ct">
                                        <div class="s-totalTime">{{pageData.arrTime?dealFlyTime(pageData.flightTime):''}}</div>
                                        <img src="./img/stopSite.png" alt="">
                                        <div class="s-stopSite" v-if="pageData.isStop=='Y'">{{pageData.stopCityName?'经停'+pageData.stopCityName:' '}}</div>
                                    </div>
                                    <!-- 目的地 -->
                                    <div class="uc-rt">
                                        <div class="s-time">{{pageData.arrTime ? pageData.arrTime.slice(11,16) : '--:--'}}</div>
                                        <div class="s-address">{{pageData.arrivalAirportName + pageData.arrAirportTerminal}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>        
                    </div>
            </div>


            <div class="post-wrapper careWrap">
                  <div class="writeInformation-title">基本信息</div>
                 <div class="content-wrap">
                    <div class="infor-write-wrap">
                        <div class="every-line flexbox" >
                            <div class="name">客票号</div>
                            <div class="input-content flex-1">
                                <input type="text"  v-model="pageData.ticketNo"  readonly>
                            </div>
                        </div>
                        <div class="every-line flexbox">
                            <div class="name">证件类型</div>
                            <!-- <div class="input-content flex-1" @click="documentList"> -->
                                 <div class="input-content flex-1">
                                 <span>{{pageData.passIdcardType | passIdcardType}}</span> 
                                 <!-- <input type="text" v-model="pageData.passIdcardType" readonly> -->
                            </div>
                           <!--   <div class="btn"></div> -->
                        </div>
                        <div class="every-line flexbox">
                            <div class="name">证件号码</div>
                            <div class="input-content flex-1">
                              <!--   <span>{{pageData.passIdcard}}</span> -->
                                 <input type="text" v-model="pageData.passIdcard" readonly>
                            </div>                           
                        </div>
                        <div class="every-line flexbox">
                            <div class="name">手机号码</div>
                            <div class="input-content flex-1">
                                <input type="text" v-model="pageData.phoneNum">
                            </div>
                            <div class="btn1" v-show="pageData.phoneNum!=null" @click="del('phoneNum',$event)"></div>
                        </div>                  
                    </div>                
                </div>                 
            </div>
            <div class="post-wrapper careWrap bottem">
                  <div class="writeInformation-title">补偿方式</div>
                 <div class="content-wrap">
                    <div class="infor-write-wrap">
                        
                        <div class="every-line flexbox">
                            <div class="name">补偿方式</div>
                            <div class="input-content flex-1" @click="compensationList">
                                <input type="text" placeholder="请选择" v-model="psgInfo.pcompensation" readonly>
                            </div>
                             <div class="btn"></div>
                        </div>
                         <div class="every-line flexbox" v-show="isDetailPage">
                            <div class="name">支付宝账号</div>
                            <div class="input-content flex-1">
                                <input type="text" placeholder="请填写" v-model="psgInfo.cardNumber">
                            </div>
                             <div class="btn1" v-show="psgInfo.cardNumber!=''" @click="delt('cardNumber',$event)" ></div>
                        </div>
                        <div class="every-line flexbox" v-show="bankInformation">
                            <div class="name">银行卡信息</div>
                            <div class="input-content flex-1" @click="bankCard">
                                <input type="text" placeholder="请选择" v-model="psgInfo.information" readonly>
                            </div>
                             <div class="btn"></div>
                        </div> 
                         <div class="every-line flexbox" v-show="psgInfo.information!=''">
                            <div class="name">银行卡卡号</div>
                            <div class="input-content flex-1">
                                <input type="text" placeholder="请填写" v-model="psgInfo.cardNumber">
                            </div>
                             <div class="btn1" v-show="psgInfo.cardNumber!=''" @click="delt('cardNumber',$event)"></div>
                        </div>          
                    </div>                
                </div>                 
            </div>
        </div>           
    </div>
        <Footer>           
            <button :class="submitBtnCls" slot="sureBtn" @click="submitApply">确定</button>           
        </Footer> 
        
    </div>
    
</template>
<script>
  import "common/tools/rem"
  import Header from "components/header.vue"
  import Footer from 'components/footer.vue'
  import controller from 'common/logic/controller'
  import Page from "common/deploy/page";
  import { RegEnum, Verify} from 'common/logic/enum'
  import { vilidation} from 'common/logic/utils'
  import requesturl from 'common/deploy/requesturl'
 export default{
     data(){
         return{
              isUseHeader: false,
             titleStyle:{
                    title: '不正常航班补偿申请',
                    titlestyle: 4,
                },
              isDetailPage:false,
              bankInformation:false,
              psgInfo:{
                  pcompensation:'',//补偿方式
                  information:'',//银行卡信息
                  cardNumber:'',//卡号
              },
              pageData:{},
         }
     },
        methods:{
            //选择类型
            documentList(){
                 let that = this;
                controller.showList({
                    maskClosable: false,
                    cancelTxt: '取消',
                    data: [{
                            content: '身份证'
                        },
                        {
                            content: '护照'
                        }
                    ],
                    onSelect: (item, index) => {
                        that.psgInfo.documentType = item.content
                    }
                })
            },
            compensationList(){
                let that = this;
                controller.showList({
                    maskClosable: false,
                    cancelTxt: '取消',
                    data: [{
                            content: '支付宝'
                        },
                        {
                            content: '银行卡'
                        }
                    ],
                    onSelect: (item, index) => {
                         that.psgInfo.pcompensation = item.content
                        if(that.psgInfo.pcompensation=='支付宝'){
                              that.isDetailPage=true
                              that.bankInformation=false 
                              that.psgInfo.information=''
                        }else if(that.psgInfo.pcompensation=='银行卡'){
                            that.isDetailPage=false
                            that.bankInformation=true 
                        }
                    },
                })               
            },
            bankCard(){
                 let that = this;
                controller.showList({
                    maskClosable: false,
                    cancelTxt: '取消',
                    data: [{
                            content: '上海银行'
                        },
                        {
                            content: '华瑞银行'
                        }
                    ],
                    onSelect: (item, index) => {
                        that.psgInfo.information = item.content
                    }
                })
            },
            submitApply (){
                const that=this
                if(this.canClickBtn && this.startVerification()){
                  let subUrl = Page.abnormalFlight.feedbackInformation;
                    controller.open({
                        winName:subUrl.winName,
                        path: subUrl.pageUrl,
                        data:{
                            pageData:Object.assign(that.pageData,that.psgInfo),
                        },
                         closeLastPage: true
                    });
                }                 
            },
         // 处理飞行时长
                dealFlyTime(time) {
                    if(time!=0){
                         let hour = parseInt(time / 1000 / 60 / 60);
                        let minute = parseInt((time - hour * 60 * 60 * 1000) / 1000 / 60);
                        if(hour==0){
                            return minute + 'm';
                        }
                        if(minute==0){
                            return hour + 'h'
                        }
                        return hour + 'h' + minute + 'm';
                    }else{
                        return ''
                    }
                    
                },
         
            // 点击返回按钮
            clickBackBtn() {                
                    controller.close()         
            },
            //手机号图标有无
           
            del(vModel, event) {            
                let target = event.target;
                console.log(vModel)
                this.pageData[vModel] = null;
                target.previousElementSibling.focus();
            },
             delt(vModel, event) {            
                let target = event.target;
                this.psgInfo[vModel] = '';
                target.previousElementSibling.focus();
            },
            // 开始验证信息
            startVerification() {           
                // 验证票号
                if(!this.pageData.ticketNo) {
                    if(!this.vertificate(this.pageData.ticketNo, RegEnum.TICKET_NO, 2000)) {
                        return false;
                    }
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
        
        },
        created() {
            var that = this;
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data.item;
                console.log(that.pageData)
                 controller.clickBack(() => {
                    that.clickBackBtn()
                })
            })
          },
       computed: {
             submitBtnCls() {
                if(this.pageData.ticketNo && this.pageData.passIdcardType && this.pageData.passIdcard && this.pageData.phoneNum && this.psgInfo.pcompensation) {
                    if(this.psgInfo.pcompensation){
                         if (this.psgInfo.cardNumber || (this.psgInfo.information && this.psgInfo.cardNumber)){
                            this.canClickBtn = true;
                        } else {
                            this.canClickBtn = false;
                        }
                       
                    }                
                    return 'g-btn'
                } else {
                    this.canClickBtn = false;
                    return 'g-btn g-disabled'
                }
            }
        },
        components:{
            Header,Footer
        },
        //过滤器
        filters: {         
            compensateCause: function (value) {
                let str=""
                switch(value){
                    case "1":str="航班延误";break;
                    case "2":str="航班取消";break;
                    case "3":str="航班备降";break;
                }
                return str;
            },
        passIdcardType: function (value) {
            let str=""
            switch(value){
                case "NI":str="身份证";break;
                case "PSPT":str="护照";break;
            }
            return str;
         }       
        }
    }
</script>
<style lang="scss" scope>  
    @import "~common/styles/common/_mixin.scss";
    @import "~common/styles/common/function.scss";
    .main{
        .g-tpPrompt {
            background: #FBEFD8;
            color: #CB9D6D;
            font-size: rem(24);
            height: rem(80);
            line-height: rem(80);
            text-align: center;
        }
        .container{
            padding:rem(10) rem(30) 0;
            .careWrap{
                .writeInformation-title{
                    padding:0 rem(30);           
                    font-size:rem(24);
                    font-family:PingFangSC-Regular;
                    font-weight:bold;
                    color:rgba(173,173,173,1);
                    line-height:24px;
                }
               .ticket-information-wrapper{                   
                    .m-item {  
                        padding: rem(30);
                        background: #fff;
                        @include border-radius(rem(6));
                        @include box-shadow(0 rem(6) rem(10) 0 rgba(0,0,0,0.02));
                        .u-head {
                            font-size: rem(24);
                            .uh-lf {
                                padding-bottom:rem(20);
                             float: left;
                             color:#ADADAD;
                             line-height:rem(24);
                            span {
                               padding-right:rem(8);                              
                            }
                        }
                        .uh-rt {
                            float: right;
                            color: #848484;
                            height: rem(35);
                            line-height: rem(38);
                        }
                    }
                    .u-bread {
                        p {
                        font-size: rem(24);
                        color: #ADADAD;
                        text-align: left;
                        margin-top: rem(10);
                        }
                    }
                    .u-con {
                        .uc-day {
                            height: rem(22);
                            width: 100%;
                            text-align: right;
                            font-size: rem(22);
                            color: #3A3D50;
                        }
                        .uc-lf, .uc-rt {
                            .s-time {
                                font-size: rem(42);
                                color: #3A3D50;
                                font-weight: 400;
                            }
                            .s-address { 
                                font-family:PingFangSC-Regular;
                                font-weight:400;
                                font-size: rem(24);
                                color: rgba(132,132,132,1);
                            }
                        }
                        .uc-lf {
                        float: left;
                        width: 33.33%;
                        text-align: left;
                        }
                        .uc-ct {
                            float: left;
                            width: 33.33%;
                            margin-top: rem(6);
                            text-align: center;
                            .s-totalTime {
                                height: rem(26);
                                font-size: rem(22);
                                color: #ADADAD;
                            }
                            img {
                                height: rem(18);
                                display: block;
                                margin: 0 auto;
                            }
                            .s-stopSite {
                                font-family:PingFangSC-Regular;
                                font-weight:400;
                                height: rem(20);
                                font-size: rem(20);
                                color: rgba(203,157,109,1);
                            }
                        }
                        .uc-rt {
                        float: right;
                        width: 33.33%;
                        text-align: right;
                        }
                    }
                }
               }
               .content-wrap {                        
                    .infor-write-wrap {
                        background-color: #fff;
                        @include border-radius(rem(6));
                        box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.02);
                        .every-line {
                            height: rem(112);
                            padding: 0 rem(30);
                            font-size: rem(28);
                            box-shadow: 0px -1px 0px 0px rgba(244, 244, 244, 1);
                            .name {
                                line-height: rem(112);
                                min-width: rem(166);
                                margin-right:rem(40);
                                color: #3A3D50;
                                font-weight: bold;
                            }
                            .text-content {
                                line-height: rem(112);
                                color: #3a3d50;
                            }
                            .btn {
                                width: rem(24);
                                @include bg2("./img/right_arrow.png");
                            }
                            .btn1 {
                                width: rem(28);
                                @include bg2("./img/cancel.png");
                            }
                            .input-content {
                                position: relative;
                                line-height: rem(112); 
                                color:#3a3d50;                               
                                input {                                   
                                    width: 100%;
                                    height: rem(40);
                                    @include inputPlaceholder(#ccc);
                                }
                            }
                        }
                    }
                    .member-rules-txt {
                        margin-top: rem(60);
                        color: #848484;
                        font-size: rem(24);
                        line-height: rem(28);
                        text-align: center;
                        .btn {
                            text-decoration: underline;
                        }
                    }
                }                              
            }
        }     
    }
    footer.g-footer{
        z-index:0;
    }
  .bottem{
      margin-bottom:rem(80);
  }
</style>