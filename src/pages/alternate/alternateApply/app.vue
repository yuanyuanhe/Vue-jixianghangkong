<template>
    <div id="app">
        <Header @clickHeader="clickBackBtn" :setTitleStyle="titleStyle"></Header>
        <div class="main">
            <div class="content-wrap">
                <div class="infor-write-wrap">
                    <div class="every-line flexbox">
                        <div class="name">乘客类型</div>
                        <div class="input-content flex-1" @click="showList">
                            <span :style="{color:color}">{{psgInfo.passengerType | passengerType}}</span>
                           <!--  <input type="text" placeholder="请选择" v-model="psgInfo.passengerType" readonly/> -->
                        </div>
                        <div class="btn"></div>
                    </div>
                    <div class="every-line flexbox">
                        <div class="name">乘客姓名</div>
                        <div class="input-content flex-1">
                            <input type="text" placeholder="请填写姓名" v-model="psgInfo.passengerName">
                        </div>
                    </div>
                    <div class="every-line flexbox">
                        <div class="name" >证件类型</div>
                        <div class="input-content flex-1" @click="documentList">
                            <span :style="{color:active}">{{psgInfo.passengerIdcardType|passengerIdcardType}}</span>
                           <!--  <input type="text" placeholder="请选择" v-model="psgInfo.passengerIdcardType" readonly> -->
                        </div>
                        <div class="btn"></div>
                    </div>
                    <div class="every-line flexbox">
                        <div class="name">证件号码</div>
                        <div class="input-content flex-1" >
                            <input type="text" placeholder="乘机人证件号码" v-model="psgInfo.passengerIdcard">
                        </div>
                        <div class="btn1" @click="del('passengerIdcard', $event)" v-show="psgInfo.passengerIdcard!=''" ></div>
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
    import Footer from "components/footer.vue"
    import controller from 'common/logic/controller'
    import Page from "common/deploy/page";
    import {vilidation} from 'common/logic/utils'
   import {RegEnum,Verify} from 'common/logic/enum'
    export default {
        data() {
            return {                
                titleStyle: {
                    title: '乘机人信息',
                    titlestyle: 4,
                  
                },              
                canClickBtn:false,
                isDetailPage:false,
                psgInfo:{
                    "passengerType": "", //旅客类型
                    "passengerName":"", //旅客姓名
                    "passengerIdcard":"",//旅客证件号
                    "passengerIdcardType":"",
                },
                color:'#ccc',
                active:'#ccc'
            }
        },
         created() {
            var that = this;
           
            controller.ready().then(data => {
                that.memberInfo = data.memberInfo;
                that.pageData = data.data.item               
                that.Info=data.data.Info
                that.list=data.data.list                  
                if('listChange' in data.data){
                     that.psgInfo = data.data.listChange 
                      that.color="#3A3D50"
                      that.active="#3A3D50"
                    }
                 controller.clickBack(() => {
                    that.clickBackBtn()
                })          
            })
       },
        methods: {         
        //图标显示与否
          del(vModel, event) {             
                let target = event.target;
                this.psgInfo[vModel] = ''
                target.previousElementSibling.focus();
            },
            showList() {
                let that = this;               
                controller.showList({
                    maskClosable: false,
                    cancelTxt: '取消',
                    data: [{
                            content: '成人'
                        },
                        {
                            content: '儿童'
                        },
                        {
                            content: '婴儿'
                        }
                    ],
                    onSelect: (item, index) => {
                        
                        console.log(item, index);
                         if(item.content=="成人"){
                            that.psgInfo.passengerType="ADT"
                        }else if(item.content=="儿童"){
                            that.psgInfo.passengerType="CHD"
                        }else  if(item.content=="婴儿"){
                            that.psgInfo.passengerType="INF"
                        }
                         that.color="#3A3D50"
                    },
                    onCancel: () => {
                        console.log('onCancel');
                    }
                })
                
            },
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
                        console.log(item, index);
                        if(item.content=="身份证"){
                           that.psgInfo.passengerIdcardType="NI"
                        }else if(item.content=="护照"){
                           that.psgInfo.passengerIdcardType="PSPT"
                        }
                         this.active="#3A3D50"
                    },
                    onCancel: () => {
                        console.log('onCancel');
                    }
                })
            },
            clickBackBtn() {
                  const that=this               
                 controller.close();                   
            },
            //跳转
            submitApply() {
                const that = this;
                console.log(that.list)
            if(that.canClickBtn && that.startVerification()){
                let subUrl = Page.alternate.newPassenger;
                 'index' in that.psgInfo && that.psgInfo.index > -1
                 ? that.list[that.psgInfo.index] = Object.assign(that.psgInfo, {index: -999})
                 : that.list = that.list.concat([that.psgInfo])
                    controller.open({
                        winName:subUrl.winName,
                        path: subUrl.pageUrl,
                        data:{
                            psgInfo:that.list,
                            item:that.pageData,
                            Info:that.Info
                        },
                        closeLastPage:true
                    });
                }
                  
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
                // 验证身份证件号
                console.log(this.psgInfo.passengerIdcardType)
                if(this.psgInfo.passengerIdcardType=="NI" && !this.vertificate(this.psgInfo.passengerIdcard, RegEnum.ID_CARD, 2000)) {
                    return false;
                }
                //验证护照
               if(this.psgInfo.passengerIdcardType=="PSPT" && !this.vertificate(this.psgInfo.passengerIdcard, RegEnum.PASSPORT, 2000)) {
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
        computed:  {
             submitBtnCls() {
                if(this.psgInfo.passengerType && this.psgInfo.passengerName && this.psgInfo.passengerIdcard && this.psgInfo.passengerIdcardType) {
                    this.canClickBtn = true;
                    return 'g-btn'
                } else {
                    this.canClickBtn = false;
                    return 'g-btn g-disabled'
                }
            },
            isCanSearch() {
                 if(this.psgInfo.passengerIdcardType=="请选择" || this.psgInfo.passengerIdcardType=="请选择") {
                    return true;
                } else {
                    return false;
                }
            }
           
        },
        components: {
            Header,
            Footer
        },
        filters: {
            passengerType:function(value){
                    console.log(value)               
                let str=""
                switch(value){
                    case 'ADT':return str="成人";
                    case 'INF':return str="婴儿";
                    case 'CHD':return str="儿童";
                    default:return str="请选择";
                }
            },
            passengerIdcardType:function(value){
                let str=""
                switch(value){
                    case 'NI':return str="身份证";
                    case 'PSPT':return str="护照";
                    default:return str="请选择";
                }
            },
        }
    }
</script>

<style lang="scss" scope>
    @import "~common/styles/common/_mixin.scss";
    @import "~common/styles/common/function.scss";
    .content-wrap {
        padding: rem(30);
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
                    width: rem(166);
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
                    
                    input {
                        color:#3A3D50;
                        width: 100%;
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

    .submit-btn {
        width: rem(690);
        height: rem(88);
        color: #fff;
        font-size: rem(32);
        font-weight: bold;
    }
    footer.g-footer {
     z-index:0;
 }
 
</style>
