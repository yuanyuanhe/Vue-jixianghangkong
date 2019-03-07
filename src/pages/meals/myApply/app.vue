<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header> 
            <div class="main">
                <div class="container">
                <!-- 可改期航班 -->
                    <div class="legBoxs" v-show="objData.length>0">
                        <div class="legItem" v-for="(item) in objData" :key="item.id">
                            <div class="ow-main">
                                <div class="ow-hd">                             
                                    <div class="hdBox">
                                        <span>{{item.flightDate}}</span>
                                        <span>{{getWeek(item.flightDate)}}</span>|
                                        <span>{{item.flightNo}}</span>|
                                        <span>{{item.planeType.indexOf('A')==-1?item.planeType:item.planeType.slice(0,4) | acType}}</span>
                                    </div>
                                </div>
                                <div class="ow-bd">
                                <!--  <div class="bdDay">+1天</div> -->
                                    <div class="bdBox flexbox">
                                        <div class="bdBoxItem bdBoxItem1 flex-1">
                                            <div class="bdBox-date">{{item.takeOffTime ? item.takeOffTime.slice(11,16) :'--:--'}}</div>
                                            <div class="bdBox-txt">{{item.departureStationName?item.departureStationName:'--'}}</div>
                                        </div>
                                        <div class="bdBoxItem flex-1">
                                            <div class="bdBox-time">{{item.planArrTime?  dealFlyTime(item.flightTime):''}}</div>
                                            <div class="bdBox-img"></div>
                                            <!--  <div class="bdBox-stop">经停南京</div>  -->
                                        </div>
                                        <div class="bdBoxItem bdBoxItem2 flex-1">
                                            <div class="bdBox-date">{{item.planArrTime?item.planArrTime.slice(11,16):'--:--'}}</div>
                                            <div class="bdBox-txt">{{item.arrivalStationName?item.arrivalStationName:'--'}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="hdBox btBox">
                                    <span class="sp1">乘机人</span>
                                    <span class="sp_name">{{item.passName}}</span>
                                </div>
                            <div class="hdBox btBox">
                                <span  class="sp1">申请餐食</span>
                                <span class="sp_name">{{item.idvmMealName}}</span>
                            </div>
                            <div class="se_meals" v-if="item.dealStatus=='2' ">已取消</div>
                            </div>
                            <div class="btns" v-if="item.dealStatus !='2' || (item.timeOutYn=='0'&& item.dealStatus !='2') ">
                                <p class="del" @click.stop="delMeals(item.id,item)">取消订单</p>
                                <p class="chg" @click="changeMeals(item)">更改餐食</p>
                            </div>
                        </div>
                    </div> 
                    <div v-show="canShowImg" class="Imgs">
                        <img src="./img/err.png"/>
                        <p>你还未申请个性化餐食哦</p>
                    </div>   
            </div>
        </div>
  </div>
</template>
<script>
  import "common/tools/rem"
  import Header from "components/header.vue"
  import {controller} from "common/logic/controller"
  import Page from 'common/deploy/page'
  import requesturl from 'common/deploy/requesturl'
  import {vilidation} from 'common/logic/utils'
  import { RegEnum, Verify, ResultCode, ServiceState} from 'common/logic/enum';
  export default{
         data(){            
            return { 
                 titleStyle:{
                    title: '我的申请',
                    titlestyle: 4,
                },
                objData:[],
                canShowImg:false,
                ResultCode: ResultCode,
                ServiceState: ServiceState,
            }    
        },
        created() {
            var that = this;            
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data;
                that.getDetailInfor() 
                 controller.clickBack(() => {
                    that.clickBackBtn()
                })             
            })
       },
      
        methods:{
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
             //处理周几
             getWeek(week){
                var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];  
                var myDate = new Date(Date.parse(week)); 
                return  weekDay[myDate.getDay()];
            },
               //我的申请请求
            getDetailInfor(){
                  const that=this
                controller.getJSON({
                        method : 'POST',
                        url:requesturl.MEALS.MYAPPLY,
                        params: that.createParams(),
                     })
                    .then(that.sucCallback)
                    .catch(that.errCallback)      
                },
            //我的申请发送字段
            createParams(){
                return {
                      "request":{
                          "ffpCardNo": this.memberInfo.memberID,
                          "ffpId": this.memberInfo.id,
                          "loginKeyInfo": this.memberInfo.loginKeyInfo, 
                        }
                }
            },
            //我的申请成功回调
            sucCallback(res){
                console.log(res)
                console.log(res.objData)
                if(res.resultCode==ResultCode.SUCCESS && res.objData.length>0){
                     this.objData=res.objData
                     this.canShowImg=false
                }else if(res.resultCode=='10002'){
                  this.canShowImg=true
                   this.objData=[]
                }else{
                   controller.toast({str:res.resultInfo}); 
                }
                           
        },       
            //我的申请失败回调
             errCallback(data) {
                controller.toast({str: Verify.BACK_ERR.toastNet, times: 2000});
            },
            //取消订单
            delMeals(id,item){
                console.log(id)
                const that=this
                controller.confirm({
                    title:'',
                    message: '确定取消申请该餐食吗？',
                    buttons: ['取消', '确定'],
                    onConfirm() {
                        that.candel(id,item)                     
                    }
                })               
            },
            //取消订单请求
            candel(id,item){
                  const that=this
                  console.log(id)
                  that.applyId=id
                  that.item=item
                controller.getJSON({
                        method : 'POST',
                        url:requesturl.MEALS.CANCEL,
                        params: that.createParams_1(),  
                     })
                    .then(that.sucCallback_1)
                    .catch(that.errCallback_1)  
            },
            //取消发送字段
            createParams_1(){
               return {
                      "request":{
                          "id": this.applyId,//申请编号
                          "ffpId": this.memberInfo.id,//用户编号
                           "ffpCardNo": this.memberInfo.memberID,//用户卡号
                          "loginKeyInfo": this.memberInfo.loginKeyInfo,//用户验证信息 
                          "arrivalStation":this.item.arrivalStation,
                          "departureStation":this.item.departureStation,
                          "flightDate":this.item.flightDate,
                          "flightNo":this.item.flightNo

                        }
                }
            },
            //取消订单成功回调
            sucCallback_1(res){
                console.log(res)
                 if (res.resultCode ==this.ResultCode.SUCCESS) {
                     controller.toast({
                            str: '取消成功！'
                        })
                        this.getDetailInfor()
                    }
            },
             //取消订单失败回调
             errCallback_1(data) {
                controller.toast({str: Verify.BACK_ERR.toastNet, times: 2000});
            },
            //更改餐食
            changeMeals(item){            
                 let subUrl=Page.meals.changeMeals
                        controller.open({
                            winName:subUrl.winName,
                            path:subUrl.pageUrl,
                            data:{
                                Object:item,                               
                            },
                        })                             
            },
           
          // 点击返回按钮
            clickBackBtn() {  
                 let subUrl=Page.meals.personalized
                controller.popWindowName({
                            winName:subUrl.winName,                  
                  })             
                        
            },
            submitApply(){
                let subUrl=Page.meals.applySuccess
                controller.open({
                   winName:subUrl.winName,
                   path:subUrl.pageUrl
                });
            }
        },
       
        components: {
            Header
        },
         filters: {
            acType:function(value){
                 if(value.indexOf('787')!=-1 || value.indexOf('789')!=-1){
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
    .legItem {
        position: relative;
        margin-bottom:rem(20);
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
        .btns{
                color:#3A3D50;
                float:right;
                padding-right:rem(30);
                padding-bottom:rem(30);
               .del{
                 float:left;
                 text-align: center;
                 width:rem(130);
                 height:rem(58);
                 font-size: rem(26);
                 line-height:rem(60);
                 margin-right:rem(20);
                  @include border(#ccc);
                   .style-ios &{
                     @include border-ios(#ccc);
                 }
               }
               .chg{
                 float:right;
                 text-align: center;
                 width:rem(130);
                 height:rem(58);
                 font-size:rem(26);
                 line-height:rem(60);
                  @include border(#ccc);
                 .style-ios &{
                    @include border-ios(#ccc);
                 }
               }
               
            }
        .se_meals{
            width:rem(100);
            height:rem(30);
            background:#FBEFD8;
            font-size:rem(20);
            font-weight:bold;
            color:#CB9D6D;
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
                color:#3A3D50;
                display: inline-block;
                width:rem(126);
            }
            .sp_name{
                color:#848484;
            }
        }
    }
    .prompt .p-heade{
        height:0;
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
</style>
