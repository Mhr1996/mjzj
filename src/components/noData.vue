<template>
  <div class="no-data">
    <img src="@/assets/imgs/no-data.png" alt="">
    <p>暂无数据~</p>
  </div>
</template>

<script>
    export default {
        name: "noData"
    }
</script>

<style scoped lang="scss">
  .no-data {
    padding-top: 1rem;
    text-align: center;

    img {
      width: 3.06rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: .24rem;
    }
  }
</style>
