<template>
  <div id="app">
       <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header> 
         <div class="main checkin-seat-main">
            <div class="container">
                <!-- 可改期航班 -->
                <div class="legBoxe">
                    <div class="legItem" v-show="objData.length>0" v-for="(item,index) in objData" :key="index" >
                        <div class="ow-main">
                            <div class="ow-hd">
                                <div class="hdBox">
                                    <span>{{item.depDate}}</span>
                                    <span>{{getWeek(item.depDate)}}</span>|
                                    <span>{{item.flightNo}}</span>|
                                    <span>{{item.planType.indexOf('A')==-1?item.planType:item.planType.slice(0,3) | planType}}</span>
                                </div>
                            </div>
                            <div class="ow-bd">
                               <!--  <div class="bdDay">+1天</div> -->
                                <div class="bdBox flexbox">
                                    <div class="bdBoxItem bdBoxItem1 flex-1">
                                        <div class="bdBox-date">{{item.depTime ? getTime(item.depTime):'--:--'}}</div>
                                        <div class="bdBox-txt">{{item.depAirPortName + item.depAirportTerminal}}</div>
                                    </div>
                                    <div class="bdBoxItem flex-1">
                                        <div class="bdBox-time">{{item.arrayTime ? dealFlyTime(item.flightTime) : ''}}</div>
                                        <div class="bdBox-img"></div>
                                       <!--  <div class="bdBox-stop">经停南京</div> -->
                                    </div>
                                    <div class="bdBoxItem bdBoxItem2 flex-1">
                                        <div class="bdBox-date">{{item.arrayTime ? getTime(item.arrayTime) : '--:--' }}</div>
                                        <div class="bdBox-txt">{{item.arrAirPortName + item.arrAirportTerminal}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="hdBox btBox">
                                    <span class="sp1">乘机人</span>
                                    <span class="sp_name">{{item.passengerName}}</span>
                            </div>
                            <div class="hdBox btBox" v-show="item.submitYn=='1'">
                                    <span class="sp1">申请餐食</span>
                                    <span class="sp_name">{{item.appluFoodName}}</span>
                            </div>
                             <div class="se_meals" v-show="item.submitYn=='1'">已选餐</div>
                        </div>
                        <div class="showe">
                               <div v-show="item.submitYn!='1'" class="select-btn" :class="[activedIndex == index ? 'active' : 'select-btn']" @click=switchStyle(index,item)></div>
                        </div>
                       
                    </div>         
                </div> 
                 <div v-show="objData.length==0" class="Imgs">
                   <img src="./img/err.png"/>
                   <p>目前没有可选择的航班</p>
                 </div> 
                   

            </div>
            
        </div>
        <Footer class="checkin-seat-ft">
            <div class="" slot="sureBtn"> 
                <div class="clause">申请即表示您已查看且同意<a href="javascript:;" @click="buyRules">《服务条款》</a>和<a href="javascript:;" @click="buyRules">《隐私条款》</a></div>
                <button :class="submitBtnCls"  @click="submitApply">确认申请</button>
            </div>
       </Footer>
  </div>
</template>
<script>
  import "common/tools/rem"
  import Header from "components/header.vue"
  import Footer from "components/footer.vue"
  import {controller} from "common/logic/controller"
  import Page from 'common/deploy/page'
  import requesturl from 'common/deploy/requesturl'
  import { ResultCode } from "common/logic/enum";
  export default{
         data(){            
            return { 
               activedIndex:-1,
                 titleStyle:{
                    title: '选择航班',
                    titlestyle: 4
                },
                isDetailPage:false,
                objData:[],
                subApply:{},
                ResultCode:ResultCode
            }    
        },
     //通用请求数据
        created() {
             var that = this;          
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;              
                if(data.data.item){
                  that.objData = data.data.item  
                }  
                console.log(that.objData)
               controller.clickBack(() => {
                    that.clickBackBtn()
                })
               
            })
          },
        methods:{
            //处理周几
             getWeek(week){
                var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];  
                var myDate = new Date(Date.parse(week)); 
                return  weekDay[myDate.getDay()];
            },
            //处理时间
            getTime(str){               
                return str.slice(11,16)                              
            },
            // 处理飞行时长
                dealFlyTime(time) {
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
            switchStyle(index,item){
                 this.activedIndex = index
                 this.subApply=item
            },
           // 点击返回按钮
            clickBackBtn() {                
                   const that=this
                let appayUrl = Page.meals.personalized; 
                 controller.close({pageUrl: '/' + appayUrl.pageUrl});
            },
              //服务条款
            buyRules(){
                let subUrl = Page.meals.buyRules;
                const that=this
                 controller.open({
                        winName:subUrl.winName,
                        path: subUrl.pageUrl,
                        animateType:1,
                         data:{
                            closetype:1
                        }
                    });
            },
             // H5头部回调
            //跳转
            submitApply(){
                 const that=this
              if(this.isDetailPage){  
                  controller.getJSON({
                        method : 'POST',
                        url:requesturl.MEALS.CHOICEMEALS,
                        params: that.createParams_1(),
               
                })
                .then(that.sucCallback_1)
                .catch(that.errCallback_1)
              }             
            },
             //请求成功回调
            sucCallback_1(res){
                console.log(res)  
                const that = this
                if(res.resultCode==ResultCode.SUCCESS){    
                    if(res.objData.length>0){
                          let subUrl=Page.meals.choiceMeals
                            controller.open({
                            winName:subUrl.winName,
                            path:subUrl.pageUrl,
                            data:{
                                list:res.objData,//餐食列表
                                item:that.objData,//航站列表
                                newObj:that.subApply,//对象
                            },
                            });
                    }else{
                        controller.alert({
                            title:'',
                            content: '该航班目前无可申请的餐食<br/>请稍后重试或联系客服',
                            alertBtn: '我知道了'
                       })
                    }                                      
                }else{
                    controller.toast({str:res.resultInfo}); 
                }             
              
            },
             //请求回调失败
             errCallback_1(data) {
                controller.toast({str: Verify.BACK_ERR.toastNet});
            },
                 //请求发送字段名
          createParams_1() {
                return {	
                    "request": {
                        "flightNo":this.subApply.flightNo,
                        "flightDate":this.subApply.depDate,
                        "departureStation":this.subApply.depAirportCode,
                        "cabinType":this.subApply.cabin,
                        "idNo":this.subApply.idNo      
                    }                      
               }
            },
        },
         computed:  {
             submitBtnCls() {   
                 if(this.activedIndex!=-1){
                     this.isDetailPage=true
                     return 'g-btn'
                 }else{
                     this.isDetailPage=false
                     return 'g-disabled'
                 }         
                /*  return 'g-btn g-disabled' */
            },

        },
        components: {
            Header,
            Footer
        },
        filters: {
            planType:function(value){             
                 if(value.indexOf('787')!=-1 ||value.indexOf('789')!=-1){
                     value="波音"+value+'(大)'
                 }else{
                    value="空客A"+value+'(中)' 
                 }
                 return value
            }
        }
    }
</script>
<style lang="scss" scope>
    @import '~common/styles/common/common.scss';  
    header.g-header .f-fx{
       box-shadow:none;
  }  
  .checkin-seat-main{
    bottom: rem(188);
} 
  .container{
      text-align: center;
      padding-bottom:rem(180);
      position: relative;
      .txt{
          
          font-size:rem(24);
          font-weight:bold;
          color:#848484;
          position:fixed;
          left:0;
          right:0;
          bottom:rem(180);
          text-align:center;
          b{
              color:#CB9D6D;
             
          }
      }
  } 
    .legItem {
        position: relative;
        display: flex;
        .ow-hd {
            text-align: left;
            .hdBox {
                color:#848484;
                & > span {
                    font-size: rem(24);
                    color: #848484;
                    padding-right: rem(8);
                    @include bd-right(#fff);
                    &:last-child {
                        @include bd-right(#fff);
                    }
                    .style-ios & {
                        @include bd-right(#fff);
                        &:last-child {
                            @include bd-right(#fff);
                        }
                    }
              }
            }
        }
        .ow-main {
            padding-right: rem(80);
            flex: 1;
        }
        .se_meals{
            width:rem(100);
            height:rem(30);
            background:#FBEFD8;
            font-size:rem(20);
            font-weight:bold;
            color:#CB9D6D;
            padding:rem(5) rem(20);
            text-align: center;
            letter-spacing:rem(3);
            border-radius:rem(100) 0 0 rem(100);
           position: absolute;
           line-height:rem(30);
           right:0;
           top:rem(27);
        }
        .btBox{
            margin-top:rem(30);
            text-align: left;
            font-size:rem(24);
            .sp1{
               width:rem(126);
               display:inline-block;
            color:#3A3D50;
            }
            .sp_name{
                color:#848484;
            }
        }
        .showe{
             width:rem(40);
             margin-right:rem(30);
            .select-btn {
                width:rem(40);
                margin-right:rem(30);
                height:rem(40);
                margin-top:rem(100);
                @include bg2("./img/not_select.png");
                &.active {
                    @include bg2("./img/select.png");
                }
                .style-ios & {
                     width:rem(40);
                     margin-right:rem(30);
                     height:rem(40);
                      margin-top:rem(100);
                     @include bg2("./img/not_select.png");
                    &.active {
                        @include bg2("./img/select.png");
                    }
                }
            }
        }
        
    }
    .cube-popup-content .cube-dialog-main .cube-dialog-content-def p{
        line-height: rem(60);
        letter-spacing:rem(2);
    }
     .Imgs{
       width:100%;
       text-align: center; 
       margin-top:rem(333);   
       img{
          display:block;
          width:43%;
          height:43%;
          margin:0 auto;
       }
       p{
           margin-top:rem(20);
            font-size:rem(24);
            font-weight:bold;
            color:rgba(132,132,132,1);
            line-height:rem(22);
            text-align: center;  
       }
       
    }
  .checkin-seat-ft{
    height: rem(188);
    .clause{
        padding-top: rem(30);
        text-align: center;
        color: #848484;
        font-size: rem(24);
       width:rem(710);
        a{
            color: #CB9D6D;
        }
    }
}
</style>
