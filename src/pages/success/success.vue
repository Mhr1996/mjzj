<template>

  <!--  处理结果/提交成功-->

  <div class="success">
    <img src="@/assets/imgs/ic_success.png">

    <div>
      <p class="status">提交成功</p>
      <p style="color: #666666;font-size: .24rem">恭喜您成功提交，请联系店主办理！</p>
    </div>
  </div>
</template>

<script>
    export default {
        name: "success",
        data() {
            return {}
        },
        methods: {},

        created() {
          setTimeout(()=>{
            this.$router.push({
              path: 'mySpace'
            })
          },3600)
        },

        beforeRouteEnter(to, from, next) {
            console.log(to);
            if (to.query.isOrder == 1) {
                document.title = '处理结果';
            }
            next()
        }
    }
</script>

<style scoped lang="scss">
  .success {
    padding-top: 1.3rem;
    width: 100%;
    height: 100vh;
    background: #ffffff;
    text-align: center;

    img {
      width: 1.6rem;
      height: 1.7rem;
      margin-bottom: .4rem;
    }

    .status {
      color: #000000;
      font-size: .3rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
    }
  }
</style>
