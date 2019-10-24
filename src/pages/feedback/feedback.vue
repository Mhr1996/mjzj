<template>
  <div class="feedback oh">
    <div class="m12 br oh">
      <textarea class="w100 cgf p10" style="height:2rem;" placeholder="请输入您的建议或意见，我们会尽快回复您！"
                v-model="feedback"></textarea>
    </div>
    <button class="submitBtn2" @click="submit">提交</button>
  </div>
</template>

<script>
    export default {
        name: "feedback",
        components: {},
        data() {
            return {
                feedback: ''
            }
        },
        created() {

        },
        methods: {
            submit() {
                if (!this.feedback) {
                    this.$toast('请输入反馈内容');
                    return
                }

                this.$toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '提交中...'
                });


                this.$http.post('/wxsite/User/api', {
                    api_name: "feedback",
                    content: this.feedback
                }).then(res => {
                    this.$toast.clear();

                    if (res.code === 1) {
                        this.$toast.success('提交成功');
                        setTimeout(() => {
                            this.$router.push({
                                path: '/mySpace'
                            })
                        }, 800);


                    } else {
                        this.$toast(res.msg)
                    }

                })
            }
        }
    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .feedback {
    min-height: 100vh;
    background-color: #f9f9f9;

    .br {
      margin-bottom: 1.2rem;
    }


  }


</style>
