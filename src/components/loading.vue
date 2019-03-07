<template>
    <div class="loading" v-show="showLoad">
      <div class="img-wrap"></div>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          showLoad: false
        }
      }
    }
</script>

<style lang="scss">
  .loading{
      position: fixed;
      top: 0;
      left:0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      background-color: rgba(0,0,0,0.3);
      .img-wrap{
          position: absolute;
          top: 50%;
          width: 100%;
          height: 37px;
          transform: translate3d(0, -50%, 0);
          background: url("./imgs/loading.gif") no-repeat center;
          background-size: auto 100%;
      }
    }

</style>
