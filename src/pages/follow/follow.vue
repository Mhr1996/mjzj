<template>
  <div :class="['share',isFollow ?'follow':'invite']">
    <div class="title">
      {{title}}
    </div>
    <img :src="QRCodeImg" v-if="QRCodeImg">
    <div style="position: fixed; top: 9.2rem; width: 100%; text-align: center; color: #fff;" v-if="isFollow">长按识二维码
    </div>
  </div>
</template>

<script>
    export default {
        name: "follow",
        components: {},
        data() {
            return {

                isFollow: false,
                title: '',
                QRCodeImg: ''  //二维码图片

            }
        },

        methods: {

            /**
             * 邀请好友
             * @param api 体验 getExperienceBanner,办卡 getCardBanner,  代理 getAgentBanner
             */
            inviteFriends(api) {

                this.$toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '加载中...'
                });

                this.$http.post('/wxsite/myspace/api', {
                    api_name: api
                }).then(res => {
                    this.$toast.clear();
                    if (res.code === 1) {
                        this.QRCodeImg = res.data.url
                    }
                })
            }


        },
        created() {

            let {isFollow, status} = this.$route.query;
            status = +status;

            if (isFollow == 1) {
                this.isFollow = true;
                this.title = '关注公众号';
            } else {
                this.isFollow = false;
                this.title = '请好友扫描下方二维码';
            }


            switch (status) {
                case 1:
                    document.title = '请好友体验';
                    this.inviteFriends('getExperience');
                    break;
                case 2:
                    document.title = '请好友办卡';
                    this.inviteFriends('getCard');
                    break;
                case 3:
                    document.title = '请好友代理';
                    this.inviteFriends('getAgent');
                    break;
            }


        },


    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .share {
    position: relative;
    width: 100%;
    height: 100vh;
    background-size: 100% 100% !important;

    .title {
      position: absolute;
      top: 20vh;
      left: 0;
      width: 100%;
      font-size: .26rem;
      text-align: center;
      z-index: 10;
    }

    img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 30vh;
      width: 3.4rem;
      height: 3.4rem;

    }

  }

  .follow {
    background: url('~@/assets/imgs/one.jpg') no-repeat center;
  }

  .invite {
    background: url('~@/assets/imgs/more.jpg') no-repeat center;
  }
</style>
