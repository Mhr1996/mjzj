<template>
    <button class="verBtn" :class="{active:!stop}" @click="clickHandler">{{ stop ? '获取验证码' : `${mytimer}秒后重新获取` }}</button>
</template>

<script>

export default {
    name: 'getvalidate',
    props: {
       timer: {
            default: 60
       }
    },
    data () {
        return {
            stop : true,
            mytimer: this.timer,
            Interval: null,
        }
    },
    methods: {
       clickHandler (e) {
            if (this.stop) { 
                // 调用外部绑定的倒计时，并且给它开关
                this.$emit('click', this.startTimer);
            }
       },
       update () {
           if (this.mytimer <= 1) {
              // 重置计数
              this.mytimer = this.timer
              // 清除计时器
              clearInterval(this.Interval)
              // 允许启动倒计时
              this.stop = true
           } else {
              // 倒计时
              this.mytimer--;
           }
       },
       startTimer (callback) {
            // 开始循环执行update函数
            this.Interval = setInterval(this.update, 1000)
            // 禁止启动倒计时
            this.stop = false;
            callback!=null?callback():"";
       }
    }
};

</script>

<style lang="scss" scoped>
.verBtn{
      &:active{
        font-size: .24rem;
      }
      background-color: initial;
      color: #4AA59A;
      width: 1.8rem;
      line-height: .70rem;
      text-align:center;
      border-radius: .1rem;
      position: absolute;
      right: 0;
      top: .06rem;
  }
</style>