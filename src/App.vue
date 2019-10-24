<template>
  <div id="app">
    <router-view/>  
  </div>
</template>

<script>
    import {getWx} from './assets/js/wxJsSdk'


    document.addEventListener('touchstart', function () {
    }, false);

    export default {
        beforeCreate() {
            // getWx()
        }
    }
</script>

<style lang="scss">
  @import "assets/css/common";

  div.van-toast--default {
    min-width: 90px;
    width: auto;
  }

  .gold {
    color: #F0A132;

    i {
      width: .44rem;
      height: .32rem;
      background: url("~@/assets/imgs/j.png") no-repeat center;
      background-size: 100%;

    }

    .price {
      color: #FFB03E;
    }
  }

  .silver {
    color: #999999;

    i {
      width: .44rem;
      height: .32rem;
      background: url("~@/assets/imgs/bjk.png") no-repeat center;
      background-size: 100%;

    }

    .price {
      color: #A7A7A7;
    }
  }

  .diamond {
    color: #B347CD;

    i {
      width: .4rem;
      height: .32rem;
      background: url("~@/assets/imgs/z.png") no-repeat center;
      background-size: 100%;
    }

    .price {
      color: #B347CD;
    }
  }


</style>


