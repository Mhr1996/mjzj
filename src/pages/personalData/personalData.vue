<template>
  <div class="personalData">
    <div class="csb plr_20 lh50 cgf rj bbef">
      <span>头像</span>
      <img :src="userInfo.head_img" class="br50" style="width: .68rem;height: .68rem;"/>
    </div>
    <router-link class="pt20 pb10 plr_15 lh18 cgf mtb_10 rj" to="addressAlias" tag="div">
      <div>收货地址</div>
      <div class="c9">{{userInfo.address}}</div>
    </router-link>
    <div class="csb plr_20 lh50 cgf bbef">
      <span>用户昵称</span>
      <span class="c9">{{userInfo.nickname}}</span>
    </div>
     <div class="csb plr_20 lh50 cgf bbef rj" v-show="agent_level!=''">
      <span>代理姓名</span>
      <span class="c9">{{userInfo.username}}</span>
    </div>
    <div class="csb plr_20 lh50 cgf bbef rj" @click="go('/unbinding')" v-show="agent_level!=''">
      <span>代理手机号码</span>
      <span class="c9">{{userInfo.mobile}}</span>
    </div>
    <div class="csb plr_20 lh50 cgf bbef">
      <span>推荐人手机号码</span>
      <span class="c9">{{userInfo.invite_mobile}}</span>
    </div>
    <div class="csb plr_20 lh50 cgf bbef rj" @click="go('/bankCar')">
      <span>银行卡信息</span>
      <span class="c9">{{userInfo.bank_account}}</span>
    </div>
  </div>
</template>

<script>
    export default {
        name: "personalData",
        components: {},
        data() {
            return {
                userInfo: {},
                agent_level:''
            }
        },
        methods: {

            //    获取个人信息
            getUserInfo() {
                this.$http.post('/wxsite/myspace/api', {
                    api_name: 'userInfo'
                }).then(res => {
                    if (res.code === 1) {
                        this.userInfo = res.data;
                    } else {
                        this.$toast(res.msg);
                    }
                })
            },

            //    解绑

            unbinding() {
                this.$toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '解绑中...'
                });

                this.$http.post('/Wxsite/User/api', {
                    api_name: 'userShopUntying',
                    user_id: localStorage.user_id
                }).then(res => {
                    this.$toast.clear();
                    this.$toast(res.msg);
                })
            },

            go(path) {
                this.$router.push({
                    path: path,
                    query: {
                        id: this.userInfo.id,
                        mobile: this.userInfo.mobile
                    }
                })
            }


        },

        created() {

            this.getUserInfo();
            this.agent_level=this.$route.query.agent_level;
        },

    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .personalData {
    min-height: 100vh;
    background-color: #f9f9f9;
  }

  .unbinding {
    width: .76rem;
    @include border-radius();
    text-align: center;
    color: #fc846b;
    line-height: .48rem;
    border: 1px solid #fc846b;
  }

  .rj {
    background-image: url('~@/assets/imgs/right2.png');
    background-repeat: no-repeat;
    background-size: 6px 11px;
    background-position: 7.2rem;
  }
</style>
