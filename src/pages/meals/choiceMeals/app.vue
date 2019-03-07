
<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn"  :setTitleStyle="titleStyle"></Header> 
        <Slider :objList="objList"  @msg="getmsg" v-if="flag"></Slider>      
        <Footer>
            <button :class="submitBtnCls" slot="sureBtn" @click="submitApply">提交申请</button>
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
  import { saveLoginInfo, getIsLogin } from 'common/logic/logic'
  import { ResultCode,Verify } from "common/logic/enum"
  import Slider from "../components/slider.vue"
    export default{
         data(){            
            return { 
                activedIndex:-1,
                isDetailPage:false,
                 titleStyle:{
                    title: '选择餐食',
                    titlestyle: 4,
                },
                objList:[],
                flag:false
            }    
        },
         //通用请求数据
        created() {
             var that = this;          
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data.newObj//航站对象
                console.log(that.pageData)
                that.item=data.data.item//航站列表
                console.log(data.data.list)
               that.objList=that.formatBackDatas(data.data.list) //本页餐食列表  
               that.flag=true
                console.log( that.objList[0].datas)   
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
        methods:{ 
             //子传符数据
            getmsg(data){
                console.log(data)
               this.activedIndex=data.activedIndex
               this.newObj=data.item
               console.log(this.newObj)
            },         
             // 处理后台返回的数据
            formatBackDatas(data) {
               let newData = [{
                   mealCategory: '头等舱餐食',
                   datas:[]
                },
                {
                   mealCategory: '特殊餐食',
                   datas:[]
                }];
               for(let [index, item] of data.entries()) {
                   if(item.mealCategory=="21"){
                     newData[0].datas.push(item)
                   }else{
                     newData[1].datas.push(item) 
                   }
               }
               return newData
            },
           clickBackBtn(){
               const that=this             
                let subUrl=Page.meals.choiceFlight
                controller.close({pageUrl: '/' + subUrl.pageUrl});
                
           },
           
            submitApply(){         
                let that = this;                              
              if( this.isDetailPage){
                  //判断是否登录   
                if(!getIsLogin(true)){
                  return
                }  
                 controller.getJSON({
                        method : 'POST',
                        url:requesturl.MEALS.APPLYMEALS,
                        params: that.createParams(),               
                   
                })
                .then(that.sucCallback)
                .catch(that.errCallback)
              
              }
                
            },
            sucCallback(res){
                 console.log(res)
                 const that =this
                if(res.resultCode==ResultCode.SUCCESS){
                 let subUrl=Page.meals.applySuccess
                    controller.open({
                    winName:subUrl.winName,
                    path:subUrl.pageUrl,
                    data:{
                        psgInfo:{
                            passengerName:that.pageData.passengerName,
                            idvmMealName:that.newObj.idvmMealName,
                        },
                    },
                    }); 
                 }else if(res.resultCode=='10004'){
                     controller.toast({str:res.resultInfo});
                 }else{
                     controller.alert({
                         title:'提示',
                        content: '您的个性化餐食申请失败<br/> 请重试～',
                        alertBtn: '我知道了'
                  })
                 }
            },
             //请求回调失败
             errCallback(data) {
                controller.toast({str: Verify.BACK_ERR.toastNet});
            },
             createParams() {
                 const that=this
                return {	
                    "request": {
                        "ffpCardNo": that.memberInfo.memberID,
                        "ffpId": that.memberInfo.id,
                        "loginKeyInfo": that.memberInfo.loginKeyInfo, 
                        "flightNo":that.pageData.flightNo,//航班号
                        "flightDate":that.pageData.depDate,//航班日期
                        "departureStation":that.pageData.depAirportCode,//出发航站楼三字码
                        "arrivalStation":that.pageData.arrAirportCode,//到达三字码
                        "passName":that.pageData.passengerName,//姓名
                        "passIdcard":that.pageData.ticketNo,//票号
                        "accountContact":that.memberInfo.memberTel,//联系方式
                        "idvmMealName":that.newObj.idvmMealName,//个性化餐食名称
                        "idvmMealImage":that.newObj.idvmMealImage,//个性化餐食图片
                        "cabinType":that.pageData.cabin,  
                        "idvmMealCode":that.newObj.idvmMealCode,//个性化餐食字典 
                        "mealCategory":that.newObj.mealCategory,//个性化餐食类别
                        "idNo":that.pageData.idNo 
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
                this.isDetailPage=true
                 return 'g-disabled'
               }                
            }          
        },
        components: {
            Header,
            Footer,
            Slider
        },
    }
</script>
<style lang="scss" scope>
    @import '~common/styles/common/common.scss';  
    ul li:last-child::before { 
     border-bottom: none; 
    }
   
</style>

