<template>
  <div class="unbinding">
    <div class="mt15 ml10 mb10">当前手机号:{{oldPhone}}</div>
    <div class="csb plr_20 lh50 cgf bbef relative" style="height:1rem;">
      <input type="tel" maxlength="11" v-model="phone" placeholder="请输入新的手机号码">
      <validate @click="getCode"></validate>
    </div>
    <div class="csb plr_20 lh50 cgf bbef " style="height:1rem;">
      <input type="tel" maxlength="6" v-model="code" placeholder="请输入验证码">
    </div>
    <button class="submitBtn2 mt50 w70" @click="submit">确认</button>
  </div>
</template>

<script>
    import validate from '@/components/validate'

    export default {
        name: "unbinding",
        components: {
            validate
        },
        data() {
            return {
                phone: '',  //手机号
                code: '', //验证码
                oldPhone: '',  //之前绑定的手机号
                userId: '' //用户id
            }
        },
        created() {
            let {id, mobile} = this.$route.query;

            this.oldPhone = mobile;
            this.userId = id;


        },
        methods: {
            sendVer() {
                let self=this;
                this.$http.post("/Wxsite/User/api",{
                    api_name:"sendCode"
                    ,mobile :this.phone
                }).then(res => {
                    if (res.code == 1) {
                        self.$toast("发送成功，请注意查收");
                    }else{
                        self.$toast(res.msg);
                    }
                })
            },
            getCode(cb) {
                if (!this.phone) {
                    this.$toast('请输入手机号');
                    return
                }

                if (/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.phone)) {
                    cb(this.sendVer);
                } else {
                    this.$toast('请输入正确的手机号');
                }
            },

            submit() {
                let vis=this;
                if (!vis.phone) {
                    vis.$toast('请输入手机号');
                    return
                }

                if (!vis.code) {
                    vis.$toast('请输入验证码');
                    return
                }


                if (/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(vis.phone)) {

                    vis.$toast.loading({
                        duration: 0,
                        forbidClick: true,
                        loadingType: 'spinner',
                        message: '绑定中...'
                    });

                    vis.$http.post('/Wxsite/Site/api', {
                        api_name: 'userMobileSet',
                        mobile: vis.phone,
                        sms_code: vis.code
                    }).then(res => {
                        vis.$toast.clear();
                        if (res.code === 1) {
                            vis.phone = '';
                            vis.code = '';
                            vis.$toast.success('绑定成功');
                        } else {
                            vis.$toast(res.msg);
                        }

                    })


                } else {
                    vis.$toast('请输入正确的手机号');
                }

            }
        }
    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .unbinding {
    min-height: 100vh;
    background-color: #f9f9f9;
    overflow: hidden;
  }

  .verBtn {
    border: 1px solid;
    line-height: .5rem;
    top: .25rem;
    right: .3rem;
    font-size: 0.24rem;
  }
</style>
