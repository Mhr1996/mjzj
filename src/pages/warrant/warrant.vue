<template>
  <div class="warrant">
    <i :style="{ background: 'url(' + userInfo.head_img + ') no-repeat center','background-size': '100% 100%'}"></i>
    <div class="info">
      <img :src="userInfo.head_img" class="profile-photo" alt="头像">
      <div class="">
        <span>代理等级：</span>
        <span>{{authBook.title}}</span>
      </div>
      <div>
        <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span>
        <span>{{authBook.name}}</span>
      </div>
      <div>
        <span>手机号码：</span>
        <span>{{authBook.mobile}}</span>
      </div>
      <div v-if="false">
        <span>所属店铺：</span>
        <span>{{authBook.shop_id_name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "warrant",

        data() {
            return {
                userInfo: {},
                authBook: {}
            }
        },

        methods: {

            //获取我的授权书
            getAuth() {

                this.$http.post('/wxsite/Userspace/api', {
                    api_name: 'userAgentInformation'
                }).then(res => {

                    if (res.code === 1) {
                        this.authBook = res.data;
                    } else {
                        this.$toast(res.msg);
                    }

                })


            },

        },

        created() {
            this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            this.getAuth();
        }

    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .warrant {
    position: relative;
    width: 100%;
    height: 100vh;


    i {
      display: block;
      position: absolute;
      width: 100%;
      height: 100vh;
      left: 0;
      top: 0;
      filter: blur(40px);
    }

    .profile-photo {
      width: 2rem;
      height: 2rem;
      border-radius: .1rem;
      margin-bottom: .7rem;
    }

    .info {
      position: relative;
      text-align: center;
      padding: 1.25rem .94rem 0;


      > div {
        display: flex;
        align-items: center;
        width: 100%;
        height: .8rem;
        background: #ffffff;
        border-radius: .1rem;
        margin-bottom: .16rem;

        span {
          width: 2rem;
        }
      }

      * {
        font-size: .26rem;
      }
    }
  }
</style>
