
<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn"  :setTitleStyle="titleStyle"></Header>        
         <Slider :objList="objList" @msg="getmsg" v-if="flag"></Slider>
        <Footer>
            <button :class="submitBtnCls" slot="sureBtn" @click="submitApply">更改餐食</button>
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
  import { RegEnum, Verify, ResultCode, ServiceState,} from 'common/logic/enum';
  import Slider from "../components/slider.vue"
  console.log(Slider)
    export default{
         data(){            
            return { 
                 titleStyle:{
                    title: '更改餐食',
                    titlestyle: 4
                },
                isDetailPage:false,
                activedIndex:-1,          
                ResultCode: ResultCode,
                objList:[],
                
                //处理props异步的（拿不到数据） 
                flag:false
            }    
        },
        //通用请求
         created() {           
            var that = this;            
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.transData = data.data.Object;
                console.log( that.transData)
                that.getDetailInfor()              
            })
       },
        methods:{
            //子传符数据
            getmsg(data){
                console.log(data)
                console.log(data.activedIndex)
               this.activedIndex=data.activedIndex
               this.newObj=data.item
            },
            //更改菜单列表请求
            getDetailInfor(){
                  const that=this
            
                controller.getJSON({
                        method : 'POST',
                        url:requesturl.MEALS.CHOICEMEALS,
                        params: that.createParams(),                     
                     })
                    .then(that.sucCallback)
                    .catch(that.errCallback)  
                    
                },
                //更改菜单列表发送字段
            createParams(){
                 return {	
                    "request": {
                        "ffpCardNo": this.memberInfo.memberID,
                        "ffpId": this.memberInfo.id,
                        "loginKeyInfo": this.memberInfo.loginKeyInfo, 
                        "flightNo": this.transData.flightNo,//航班
                        "flightDate": this.transData.flightDate,//出发日期
                        "departureStation": this.transData.departureStation,//出发站
                        "cabinType": this.transData.cabinType  //仓位信息 现无  
                    }                      
               }
            },
            //更改菜单列表成功回调
            sucCallback(res){
                console.log('qqw',res)                        
              
                if(res.resultCode==ResultCode.SUCCESS){                                           
                          if(res.objData.length>0){
                              this.objList=this.formatBackDatas(res.objData) //本页餐食列表  
                                console.log( this.objList)    
                              this.flag=true 
                          }else{
                                controller.alert({
                                        title:'',
                                        content: '该航班目前无可更改的餐食<br/>请稍后重试或联系客服',
                                        alertBtn: '我知道了',
                                        onConfirm: () => {//返回
                                        let subUrl=Page.meals.myApply
                                            controller.popWindowName({
                                                winName:subUrl.winName                  
                                            });
                                        }
                                })
                                this.flag=false 
                          }             
                }else{                    
                    controller.toast({str:res.resultInfo});
                }
                              
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
            //更改菜单列表失败回调
             errCallback(data) {
                controller.toast({str: Verify.BACK_ERR.toastNet, times: 2000});
            },
          // 点击返回按钮
            clickBackBtn() {                
                  controller.close();            
            },
           
            //更改餐食请求
            submitApply(){
                let that=this
                 if( this.isDetailPage){
                    controller.getJSON({
                            method : 'POST',
                            url:requesturl.MEALS.CHANGE,
                            params: that.createParams_1(),
                        
                        })
                        .then(that.sucCallback_1)
                        .catch(that.errCallback_1)  
                 }
            },
            //更改餐食发送字段名
            createParams_1(){
                return {
                    "request":{
                          "id": this.transData.id,//申请编号
                          "ffpId": this.memberInfo.id,//用户编号
                           "ffpCardNo": this.memberInfo.memberID,//用户卡号
                          "loginKeyInfo": this.memberInfo.loginKeyInfo,//用户验证信息

                          "idvmMealCode":this.newObj.idvmMealCode,//个性化餐食编号n
                          "idvmMealImage":this.newObj.idvmMealImage,//个性化餐食图片
                          "idvmMealName":this.newObj.idvmMealName,//个性化餐食名称
                           "mealCategory":this.newObj.mealCategory,//个性化餐食类别

                          "accountContact":this.transData.accountContact,//联系方式
                          "passIdcard":this.transData.passIdcard,//乘机人证件号
                          "passName" :this.transData.passName,//乘机人姓名
                          "arrivalStation":this.transData.arrivalStation,//到达站三字码   n
                          "departureStation":this.transData.departureStation,//出发站三字码n
                          "flightDate":this.transData.flightDate,//航班日期n
                          "flightNo":this.transData.flightNo,//航班号n
                        }
                }
            },
            //更改餐食成功回调
            sucCallback_1(res){
                console.log(res)
                const that=this
                if (res.resultCode ==this.ResultCode.SUCCESS) {
                     let subUrl=Page.meals.changeSuccess
                        controller.open({
                            winName:subUrl.winName,
                            path:subUrl.pageUrl,
                            data:{
                                psgInfo:{
                                    passengerName:that.transData.passName,
                                    idvmMealName:that.newObj.idvmMealName
                                }
                            }
                        })   
                    }else{
                         controller.alert({
                         title:'提示',
                        content: '您的个性化餐食更改失败<br/> 请重试～',
                        alertBtn: '我知道了'
                  })
                    }
            },
             //更改餐食失败回调
             errCallback_2(data) {
                controller.toast({str: Verify.BACK_ERR.toastNet, times: 2000});
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

