
<template>
    <div class="main mainHasBottom">
        <div class="container">
            <div class="legBox"  v-if="objList[0].datas.length > 0" >
                <div class="title">{{objList[0].mealCategory}}</div>
                <div class="list">
                    <ul>
                        <li v-for="(item,index) in objList[0].datas" :key="index">
                            <div :class="[activedIndex=='s1'+index ? 'btn' : '']"></div>
                                <img :src="item.idvmMealImage"  @click="query('s1'+index,item)"/>
                            <p>{{item.idvmMealName}}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="legBox"  v-if="objList[1].datas.length > 0" >
                <div class="title">{{objList[1].mealCategory}}</div>
                <div class="list">
                    <ul>
                        <li v-for="(item,index) in objList[1].datas" :key="index">
                            <div :class="[activedIndex=='s2'+index ? 'btn' : '']"></div>
                                <img :src="item.idvmMealImage"  @click="query('s2'+index,item)"/>
                            <p>{{item.idvmMealName}}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
 import "common/tools/rem"
    export default {     
      props: ['objList'],        
        data() {
            return {                
                activedIndex:-1,
            }
        },   
        methods:{
             query(index,item){                
                 this.activedIndex=index
                 this.$emit('msg',{activedIndex:this.activedIndex,item:item})
            },

        }, 
        created(){
            console.log(this.objList)
        },      
    }
</script>

<style lang="scss" scope>
    @import '~common/styles/common/function.scss';
     @import '~common/styles/common/common.scss';  
    ul li:last-child::before { 
     border-bottom: none; 
    }
  .legBox{
      background:#fff;
       @include box-shadow(0 rem(6) rem(10) 0 rgba(0,0,0,0.02));
      border-radius:rem(6);
      overflow: hidden;         
      margin-bottom: 0.3rem;
      .title{
         color:#3A3D50;
         height:rem(80);
        @include box-shadow(0 rem(2) 0 0 rgba(244,244,244,1));       
         line-height: rem(80);
         padding-left:rem(30);
        font-weight:bold;
      }
      .list{
          padding:rem(15);
          overflow: hidden;
          ul{
             overflow: hidden;
             li{
                 background:#F5F5F5 !important;                
                 float: left;
                 margin:rem(15);
                 position: relative;
                 width: rem(190);
                 height: rem(190);
                 text-align: center;
                .btn{                  
                        width:rem(32);
                        height:rem(32);
                        background: url('../changeMeals/img/select.png') no-repeat;
                        position: absolute;
                        background-size: 100% 100%;
                        top:rem(-10);
                        right:rem(-10);                  
                    }
                 img{
                     width:100%;
                     height:100%;
                 }
                 p{
                    text-align: center;
                    background: #fff;
                    opacity: 0.85;
                    max-width: rem(160);
                    font-size: rem(24);
                    position: absolute;
                    bottom:rem(20);
                    margin:auto;
                    left:0;
                    right:0;
                    line-height:rem(24);
                    padding:rem(10) 0;
                 }
             }
          }
      }     
  }
   
</style>