<template>
    <div id="app">
      <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header>      
    <div class="main checkin-seat-main">
      <div class="container">
        <div class="ticket-information-wrapper">
           <div class="m-item">
            <!-- 日期、退改规则 -->
                <div class="u-head clearfix">
                    <div class="uh-lf">
                        <span>{{pageData.flightNo}}</span>                       
                    </div>
                    <div class="uh-rt">
                        <span>前面{{pageData.waitingPersonNum}}人候补</span>
                    </div>
                </div>
            <!-- 出发地、目的地、+1天 -->
            <div class="u-con">
               
                <div class="clearfix">
                <!-- 出发地 -->
                <div class="uc-lf">
                    <div class="s-time">{{pageData.depDateTime}}</div>
                    <div class="s-address">{{pageData.depAirportName+pageData.depAirportTerminal}}</div>
                </div>
                <!-- 行程时间、经停站 -->
                <div class="uc-ct">
                    <div class="s-totalTime">{{pageData.arrDateTime?dealFlyTime(pageData.flightTime):''}}</div>
                    <img src="./img/stopSite.png" alt="">
                    <div class="s-stopSite" v-if="pageData.isStop=='Y'">{{pageData.stopCityName?'经停'+pageData.stopCityName:' '}}</div>
                </div>
                <!-- 目的地 -->
                <div class="uc-rt">
                    <div class="s-time">{{pageData.arrDateTime?pageData.arrDateTime:'--:--'}}</div>
                    <div class="s-address">{{pageData.arrAirportName+pageData.arrAirportTerminal}}</div>
                </div>
                </div>
            </div>
            </div>
        
        </div>
        <!-- 新增乘机人、乘机人列表 -->
        <div class="addPeople">
            <!-- 新增乘机人 -->
            <div class="m-add">
                <div class="u-checked" @click="add" ></div>
                <div class="u-idCard" >新增乘机人</div>
            </div>
            <!-- 乘机人列表 -->
            <div class="list-box">
                <div class="m-list can-select-li" v-for="(item,index) in list" :key="index">
                   <div class="u-checked"  @click="del(index)"></div>
                    <div class="u-idCard">
                        <div class="s-userDetail">
                            <span class="s-userName">{{item.passengerName}}</span>
                            <span>{{item.passengerType |passengerType}}</span>
                        </div>
                        <div class="s-cardDetail">
                            <span>{{item.passengerIdcardType |passengerIdcardType}}</span>
                            <span class="s-userCard">{{item.passengerIdcard}}</span>
                        </div>
                    </div>
                    <div class="btn" @click="change(item,index)"></div>
                </div>
            </div>
        </div>

        <div class="contact-person">
                <ul>
                    <li>
                        <label for="contact-name">联系人</label>
                        <input type="text" placeholder="请填写姓名" id="contact-name" class="all-input-style" v-model="psgInfo.Contacts">
                        <span @click="mail">
                            <img src="./img/contact_person.png" alt="">
                        </span>
                    </li>
                    <li>
                        <label for="contact-phone">手机号</label>
                        <input type="text" placeholder="请填写手机号" id="contact-phone" class="all-input-style" v-model="psgInfo.keeperHandphone">
                        <span  v-show="psgInfo.keeperHandphone!=''" @click="clear('keeperHandphone',$event)">
                            <img src="./img/cancel.png" alt="">
                        </span>
                    </li>
                </ul>
            </div>     
      </div>      
    </div>               
       <Footer class="checkin-seat-ft">
           <div class="" slot="sureBtn">
           <div class="clause">点击确定即代表已阅读<a href="javascript:;" @click='clickRulesBtn'>候补旅客须知</a></div> 
          <button  :class="submitBtnCls"  @click='submitApply'>确定</button>  
       </div>    
    </Footer>
  
      <RuleSlot :rulesTitle='rulesTitle' @clickCloseBtn='closeRulesPage' v-show='canShowRules' :isShow='canShowRules'>
            <div class="rulesInfo" slot="ruleInfo">
                <h4>
                    根据上海吉祥航空股份有限公司相关规定，接收候补的时间为规定的国内航班离港时间前50分钟（国际航班离港时间前55分钟）。在候补过程中若遇到以下旅客，您的候补顺序可能会发生变化。
                </h4>
                <h4 class="text">候补旅客优先的顺序为：</h4>
                <p>
                    1. 重要旅客；<br/>
                    2. 执行国家紧急公务的旅客；<br/>
                    3. 持本公司卡的常旅客；<br/>
                    4. 票价无折扣或折扣少的旅客 <br/>
                    5. 有特别困难，急于成行的旅客；<br/> 
                    6. 持本公司宾客及公务优惠票的旅客；<br/> 
                    7. 持本公司职员优惠票、免票的旅客；<br/> 
                    8. 外航签转旅客。<br/>
                </p>
                <p class="p1">在同等级的情况下，按照候补申请时间排序。</p>
            </div>
        </RuleSlot>

   </div>
    
</template>

<script>
    import "common/tools/rem"
    import Header from "components/header.vue"
    import Footer from "components/footer.vue"
    import {controller} from 'common/logic/controller'
    import Page from "common/deploy/page";
    import RuleSlot from 'components/ruleSlot.vue'
   import requesturl from 'common/deploy/requesturl'
   import {vilidation} from 'common/logic/utils'
    import {RegEnum, Verify, ResultCode} from 'common/logic/enum'
    export default{
        data(){
         return{
             list:[],
             titleStyle:{
                    title: '候补申请',
                    titlestyle: 4
                },
            canShowRules: false,
            rulesTitle: '候补旅客须知',
            ResultCode:ResultCode,
            psgInfo:{
                Contacts:'',
                keeperHandphone:''
            },
            pageData:{},
            canClickBtn:false         
          }
        },
         created() {
             const that = this  
             controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data.item
                console.log(that.pageData)
                that.obj=data.data
                console.log(that.obj)
                that.cont=data.data.cont
                if( data.data.Info!=undefined){
                    that.psgInfo=data.data.Info
                    console.log(that.psgInfo)
                }
               
             if(that.obj.psgInfo!==undefined){
                
                that.objData=data.data.psgInfo
                this.list = that.objData
             } 
               controller.clickBack(() => {
                    that.clickBackBtn()
                })
                        
            })                     
       },
        methods:{
            //新增联系人跳转
             add(){              
                let addUrl = Page.alternate.alternateApply;
                const that=this
                controller.open({
                    winName: addUrl.winName,
                    path: addUrl.pageUrl,
                    data:{
                        item:that.pageData,
                        list: that.list,
                        Info:that.psgInfo
                    },
                });
            },
            //删除
            del(index){
                this.list.splice(index,1)
            },
            //修改
             change(item,index){
                 const that=this
                let addUrl = Page.alternate.alternateApply;
                controller.open({
                    winName: addUrl.winName,
                    path: addUrl.pageUrl,
                    data:{
                        item:that.pageData,
                        list: that.list,
                        listChange: Object.assign(item, {index: index}),
                        Info:that.psgInfo
                    },
                });
            },
            //删除手机号按钮
            clear(vModel,event){                
                let target = event.target;
                this.psgInfo[vModel] = '';
                target.previousElementSibling.focus();
           
            },
             // 处理飞行时长
                dealFlyTime(time) {
                    console.log(time)
                    let hour = parseInt(time / 1000 / 60 / 60);
                    let minute = parseInt((time - hour * 60 * 60 * 1000) / 1000 / 60);
                    if(hour==0){
                        return minute + 'm';
                    }
                    if(minute==0){
                        return hour + 'h'
                    }
                    return hour + 'h' + minute + 'm';
                },
            //通讯录
            mail(){
               controller.openContact((data)=>{
                    this.psgInfo.Contacts=data.name
                    this.psgInfo.keeperHandphone=data.phoneNumber
                   console.log(data)
               })     
            },
             // 点击返回按钮
            clickBackBtn() {                
                  let subUrl=Page.alternate.alternateQuery
                        controller.popWindowName({
                            winName:subUrl.winName,
                        })      
            },
             //提交数据
             submitApply(){ 
                 const that =this;
                 if(that.canClickBtn && that.startVerification()){     
                     controller.getJSON({
                        method: 'POST',
                        url: requesturl.ALTERNATE.NEWPASSENGER,
                        params: that.createParams(),
                    })
                    .then(that.sucCallback)
                   .catch(that.errCallback)              
                 }
             },
             //请求成功回调
             sucCallback(res){
                     const that=this
                     console.log(res)
                    if(res.resultCode==ResultCode.SUCCESS){  
                              controller.alert({
                                    title: '提示',
                                    content: '候补申请提交成功，'+that.pageData.flightNo+'前面候补人数'+res.objData+'人<br/>具体请留意短信通知',
                                    alertBtn: '返回',
                                    onConfirm: () => {//返回
                                        let subUrl=Page.alternate.alternateQuery
                                       /*   controller.open({
                                                winName: subUrl.winName,
                                                path: subUrl.pageUrl
                                            }); */
                                            controller.popWindowName({
                                                 winName:subUrl.winName,
                                                 data:1                  
                                            }) 
                                    }
                                })                   
                     }else{
                        controller.toast({str:res.resultInfo});
                     }
             },
              //请求失败回调
            errCallback(data) {
                controller.toast({str: Verify.BACK_ERR.toastNet});
            },
            //请求发送字段名
             createParams(){ 
                      return{                                                    
                            "request": {
                                "ffpCardNo":this.memberInfo.memberID,
                               "ffpId":this.memberInfo.id,
                               "loginKeyInfo":this.memberInfo.loginKeyInfo,
                                "flightDate":this.pageData.flightDate,//航班日期 
                                "flightNo":this.pageData.flightNo,//航班号                              
                                "memberLevel": this.memberInfo.memberLevelCode,//会员等级
                                "linkPersonContact":this.psgInfo.keeperHandphone,//联系人手机号                 
                                "departureAirport":this.pageData.depAirport,//起飞机场三字码
                                "arrivalAirport": this.pageData.arrAirport,//落地机场三字码
                                "passagerList":this.list,
                                "linkPersonName": this.psgInfo.Contacts,  //联系人姓名
                                "depAirportTerminal":this.pageData.depAirportTerminal,//航站楼三字码
                                "arrAirportTerminal":this.pageData.arrAirportTerminal,//到航站楼三字码
                                "depTime":this.pageData.depDateChinaTime,//到达时间
                                "arrTime":this.pageData.arrDateChinaTime//出发时间
                            },
                           /*  "timeStamp": 0,
                            "sign": "string"   */                                             
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
              // 开始验证信息
            startVerification() {
                // 验证乘机人姓名
                if(this.psgInfo.Contacts.length > 25){
                    controller.toast({str: Verify.BACK_ERR.toastNameLen});
                    return false;
                }
                if(!this.vertificate(this.psgInfo.Contacts, RegEnum.NAME_ALL, 2000)) {
                    return false;
                }
                // 验证手机号
                if(!this.vertificate(this.psgInfo.keeperHandphone, RegEnum.MOBILE, 2000)) {
                    return false;
                }
                //新增乘机人
                if(this.list.length==0) {
                   controller.toast({str: Verify.BACK_ERR.toastList});
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
       computed: {
            submitBtnCls() {
                if(this.list.length>0) {
                    this.canClickBtn = true;
                    return 'g-btn'
                } else {
                    this.canClickBtn = false;
                    return 'g-btn g-disabled'
                }
            }
        },
        components:{
            Header,Footer, RuleSlot
        },
        filters: {
            passengerType:function(value){
                let str=""
                switch(value){
                    case 'ADT':return str="成人";
                    case 'INF':return str="婴儿";
                    case 'CHD':return str="儿童"
                }
            },
            passengerIdcardType:function(value){
                let str=""
                switch(value){
                    case 'NI':return str="身份证";
                    case 'PSPT':return str="护照";
                }
            },
        }
    }
   
</script>
<style lang="scss" scope>  
    @import "~common/styles/common/_mixin.scss";
    @import "~common/styles/common/function.scss";
.cube-popup-content .cube-dialog-main .cube-dialog-content-def p {
        padding:0;
        color:#848484;
        line-height: rem(60);
    } 
.rule-head {
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
    font-size:rem(28) !important;
    font-weight:400;
    color:#3A3D50 !important;
   
  }
  .text{
       font-size:rem(28) !important;
      font-weight:400;
      color:#3A3D50 !important;
      margin-top:rem(28) !important;
      margin-bottom:rem(50) !important;
      }
  p{
    font-size:rem(24)!important;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:#848484 !important;
   
  }
  .p1{
      margin-top:rem(27) !important;
      }
}
.checkin-seat-main{
    bottom: rem(188);
}
.container{
   padding:rem(30) rem(30) 0; 
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
            float: left;
            color: #fff;

        span {
            display: inline-block;
            height: rem(28);
            line-height: rem(28);
            min-width:rem(108);
            text-align: center;
            margin-right: rem(8);
            @include linear-gradient($lg);
            @include border-radius(rem(6));
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
.addPeople{
    padding:rem(30) 0 rem(20);
    .m-add {
        height: rem(112);
        background: #fff;
        @include box-shadow('0px -1px 0px 0px rgba(244,244,244,1)');
        @include border-radius(rem(6));
        .u-checked {
            width: rem(42);
            height: rem(42);
            margin: rem(36) rem(31);
            float: left;
            @include bg('./img/add.png');
        }
        .u-idCard {
            height: 100%;
            line-height: rem(112);
            padding: 0;
            font-size: rem(28);
            color: #CB9D6D;
        }
    }
    .m-list {
        height: rem(112);
        background: #fff;
        @include box-shadow('0px -1px 0px 0px rgba(244,244,244,1)');
        @include border-radius(rem(6));
        .u-checked {
            width: rem(42);
            height: rem(42);
            margin: rem(36) rem(31);
            float: left;
            @include bg('./img/delect.png');
        }
        .u-idCard {
            padding: rem(21) 0;
            float: left;
            @include box-sizing(border-box);
            .s-userDetail {
                font-size: rem(28);
                line-height: rem(30);
                color: #CCCCCC;
                .s-userName {
                    color: #25292F;
                    font-weight: bold;
                }
            }
            .s-cardDetail {
                font-size: rem(22);
                color: #ADADAD;
                margin-top: rem(10);
            }
        }

            .btn {
                    float:right;
                    margin: rem(45) rem(30);
                    width: rem(24);
                    height:rem(24);
                    @include bg2("./img/right_arrow.png");
                }
    margin-top: rem(20);
    }
 

}

.contact-person{  
    overflow: hidden;
    padding-bottom:rem(180);
    ul{
         @include border-radius(rem(6));
        @include box-shadow(0 rem(6) rem(10) 0 rgba(0,0,0,0.02));
         background: #fff;
         li{
            padding: rem(42) rem(30) rem(42) rem(30.6);
            label{
                display: inline-block;
                line-height: rem(28);
                min-width: rem(126);
                margin-right:rem(40);
                height: rem(28);
                font-size: rem(28);
                font-weight: bold;
                color:#3A3D50;               
            } 
            .all-input-style{
                    font-size:rem(28);
                    color:#848484;
                    @include inputPlaceholder(#ccc);
                }
            span{
                float: right;
                margin-top: rem(-2);
                img{
                  width: rem(32);
                }
            }
    
        }
    }
  
}

   
    
 footer.g-footer {
     z-index:0;
 }
 .checkin-seat-ft{
    height: rem(188);
    .clause{
        padding-top: rem(30);
        text-align: center;
        color: #848484;
        font-size: rem(24);
        a{
             padding-left:rem(8); 
            color: #CB9D6D;
            text-decoration:underline; 
        }
    }
}
</style>


