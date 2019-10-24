<template>
  <div class="mySpace">
    <div class="bgBanner cf plr_75 relative" style="height: 4.28rem;">
      <div class="flex" @click="go('/personalData',{agent_level:userInfo.agent_level})">
        <img :src="userInfo.head_img" class="mr15 br50" style="width: 1.13rem;height: 1.13rem;">
        <div class="lh20" style="width: 100%;overflow: hidden;">
          <p class="fz12 ellipsis">{{userInfo.nickname}}</p>
          <div class="flex">
            <div class="c20a mr10 flex" v-if="userInfo.member_level">
              <img src="@/assets/imgs/ms3.png" class="mr5" style="width: 0.48rem; height: 0.36rem;">
              <span class="brand">{{userInfo.member_level}}</span>
            </div>
            <div class="c20a flex" v-if="userInfo.agent_level">
              <img src="@/assets/imgs/ms4.png" class="mr5" style="width: 0.48rem; height: 0.36rem;">
              <span class="brand">{{userInfo.agent_level}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="csa wrap integral fz13 mt20 bg" style="height: 2.6rem;position: absolute;left: .75rem;"></div>
      <div class="csa wrap integral fz13 mt20" style="height: 2.3rem;position: absolute;left: .75rem;z-index: 11;">
        <div class="bbff pt10 center">货款 {{userInfo.money}}</div>
        <router-link tag="div" :to="{path:'fundManagement',query:{flow_money:userInfo.flow_money}}" class="bbff pt10 center">流动资金 {{userInfo.flow_money}}</router-link>
        <div class="bbff pt10 center">积分 {{userInfo.score}}</div>
        <router-link class="pb15 center" tag="div" :to="{path:'myTeam'}">团队 {{userInfo.team_count}}</router-link>
        <div class="pb15 center">分成 {{userInfo.divide_money}}</div>
        <div class="pb15 center">奖金 {{userInfo.prize_money}}</div>
      </div>
      <div class="centerRow cp center" style="width: 100vw;position: absolute;bottom: 0;left: 0;z-index: 10;"></div>
    </div>
    
    <div class="cf invite mb30 wrap">
        <div class="fsa" style="width: 100%; padding: 0 0.85rem;margin-bottom: -1rem;">
          <img src="@/assets/imgs/d.png" style="width: .2rem;height: .2rem;">
          <img src="@/assets/imgs/d.png" style="width: .2rem;height: .2rem;">
          <img src="@/assets/imgs/d.png" style="width: .2rem;height: .2rem;">
        </div>
      <router-link :to="{path:'/follow',query:{isFollow:0,status:1}}" tag="div" class="ccc">
          <img src="@/assets/imgs/f1.png" style=" width: .37rem; margin-top: -.08rem;">
          <p class=" mt15">请好友体验</p>
      </router-link>
      <router-link :to="{path:'/follow',query:{isFollow:0,status:2}}" tag="div" class="ccc">
          <img src="@/assets/imgs/f2.png" style=" width: .42rem; margin-top: -.08rem;">
          <p class=" mt15">请好友办卡</p>
      </router-link>
      <router-link :to="{path:'/follow',query:{isFollow:0,status:3}}" tag="div" class="ccc">
          <img src="@/assets/imgs/f3.png" style=" width: .39rem; margin-top: -.08rem;">
          <p class=" mt15">请好友代理</p>
      </router-link>
      <router-link to="/registerAgent" tag="div" class="ccc">
          <img src="@/assets/imgs/f4.png" style=" width: .37rem; margin-top: -.08rem;">
          <p class=" mt15">申请代理 </p>
      </router-link>
    </div>
    <div class="item mt20">
      <ul class="flex wrap w100 center" style="align-items: flex-end;">
        <li v-for="(item,index) in links" :key="index" @click="go(item.path,item.query)">
          <div>
            <i :class="item.icon"></i>
          </div>
          <p class="fz12">{{item.text}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
    export default {
        name: "mySpace",
        components: {},
        data() {
            return {
                userInfo: {},  //用户信息
                //导航链接
                links: [
                    {
                        text: '我的卡项',
                        icon: 'card',
                        path: '/myCard'
                    },
                    {
                        text: '我的订单',
                        icon: 'my-order',
                        path: '/order'
                    },
                    {
                        text: '我的授权书',
                        icon: 'book',
                        path: '/warrant'
                    },
                    {
                        text: '会员订单',
                        icon: 'member-order',
                        path: '/memberOrder',
                        query: {
                            isMember: 1
                        }
                    },
                    {
                        text: '代理订单',
                        icon: 'agent-order',
                        path: '/agentBill',
                        query: {
                            isMember: 0
                        }
                    },
                    {
                        text: '代理管理',
                        icon: 'agent-manage',
                        path: '/agentManage'
                    },
                    {
                        text: '代理升级',
                        icon: 'agent-update',
                        path: '/agentUpgrade'
                    },
                    {
                        text: '资金管理',
                        icon: 'money',
                        path: '/fundManagement'
                    },
                    {
                        text: '我的收藏',
                        icon: 'collect',
                        path: '/myCollection'
                    },
                    {
                        text: '地址管理',
                        icon: 'address',
                        path: '/addressAlias'
                    },
                    {
                        text: '意见反馈',
                        icon: 'feedback',
                        path: '/feedback'
                    },
                    {
                        text: '关于我们',
                        icon: 'about',
                        path: '/about'
                    }
                ]
            }
        },

        methods: {

            // 路由跳转
            go(path, query) {
              if(path==''){
                this.$toast("正在开发中，敬请期待！");
              }else if(!this.userInfo.agent_level&&path=='/warrant'){
                this.$toast("未成为代理，无法查看!");
                return;
              }else{  
                  this.$router.push({
                    path,
                    query: path=='/fundManagement'?{flow_money:this.userInfo.flow_money}:query
                });
              }
                
            },

            //获取用户信息

            getUserInfo() {
              let vis=this;
                vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
                vis.$http.post('/wxsite/myspace/api', {
                    api_name: 'index'
                }).then(res => {
                  vis.$toast.clear();
                    if (res.code === 1) {
                        vis.userInfo = res.data;
                        sessionStorage.setItem('userInfo', JSON.stringify(res.data));
                    }
                })
            }


        },

        created() {
            this.getUserInfo();
        }
    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .mySpace {
    min-height: 100vh;
    /*background-color: #f9f9f9;*/
    overflow: hidden;
  }

  .fz10 {
    font-size: .2rem;
  }

  .shop, .time {
    position: relative;

    &:before {
      content: '';
      position: absolute;
      display: inline-block;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: .24rem;
      height: .24rem;
      background-size: 100% !important;
    }

  }

  .shop::before {
    background: url("../../assets/imgs/ms1.png") no-repeat center;
  }

  .time::before {
    background: url("../../assets/imgs/ms2.png") no-repeat center;
  }

  .c20a {
    color: #20aed5;
  }

  .item {
    ul {
      li {
        width: 25%;
        margin-bottom: .6rem;

        > div {
          height: .6rem;
        }

        i {
          display: inline-block;
          background-size: 100% !important;
        }


      }
    }

    img {
      margin-bottom: .08rem
    }

  }

  .bgBanner {
    background: url('~@/assets/imgs/b2.jpg');
    background-size: 100%;
    background-position: left top;
    padding-top: .5rem;

    img {
      flex-shrink: 0;
    }
  }

  .plr_75 {
    padding-left: .75rem;
    padding-right: .75rem;
  }

  .brand {
    background-color: #fffadc;
    font-size: .26rem;
    padding: 0 0.2rem 0 0.08rem;
    height: .36rem;
    line-height: .38rem;
    border-top-right-radius: .2rem;
    border-bottom-right-radius: .2rem;
  }
  
  .integral.bg{
    background: url('~@/assets/imgs/ms7.png') repeat-x;
    background-color: #31aea0;
    background-size: .26rem;
    background-position: top left;
  }
  .integral {
    width: 6rem;
    border-top-left-radius: .1rem;
    border-top-right-radius: .1rem;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      width: 0.02rem;
      height: 1.4rem;
      top: .44rem;
      left: 2rem;
      background-color: #fff;
      z-index: 10;
    }

    &:before {
      content: '';
      position: absolute;
      width: 0.02rem;
      height: 1.4rem;
      top: .44rem;
      left: 4rem;
      background-color: #fff;
      z-index: 10;
    }

    div {
      width: 2rem;
      height: .92rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .centerRow {
    background: url('~@/assets/imgs/ms24.png') repeat-x;
    background-position: left top;
    background-size: 100%;
    margin-top: -0.9rem;
    position: relative;
    height: 1.3rem;
    z-index: 11;
    line-height: .9rem;
  }

  .invite{
    width: 7rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height:2.3rem;
    margin: 0 auto;
    border-radius: .2rem;
    margin-top: -.6rem;
    z-index: 12;
    position: relative;
    .ccc{
      height: 1.73rem;
      width: 1.4rem;
      position: relative;
      background: url('~@/assets/imgs/ms5.png');
      background-size: 100% 100%;
      font-size:.23rem;
    }
  }

  .submitBtn2 {
    margin: .3rem auto;
  }

  .card {
    width: .45rem;
    height: .35rem;
    background: url("../../assets/imgs/ms8.png") no-repeat center;
  }

  .my-order {
    width: .39rem;
    height: .41rem;
    background: url("../../assets/imgs/ms9.png") no-repeat center;
  }

  .records {
    width: .41rem;
    height: .43rem;
    background: url("../../assets/imgs/ms10.png") no-repeat center;
  }

  .book {
    width: .43rem;
    height: .43rem;
    background: url("../../assets/imgs/ms11.png") no-repeat center;
  }

  .member-order {
    width: .37rem;
    height: .41rem;
    background: url("../../assets/imgs/ms12.png") no-repeat center;
  }

  .agent-order {
    width: .39rem;
    height: .45rem;
    background: url("../../assets/imgs/ms13.png") no-repeat center;
  }

  .agent-manage {
    width: .43rem;
    height: .43rem;
    background: url("../../assets/imgs/ms14.png") no-repeat center;
  }

  .agent-update {
    width: .34rem;
    height: .4rem;
    background: url("../../assets/imgs/ms15.png") no-repeat center;
  }

  .agent-search {
    width: .43rem;
    height: .43rem;
    background: url("../../assets/imgs/ms16.png") no-repeat center;
  }

  .money {
    width: .44rem;
    height: .39rem;
    background: url("../../assets/imgs/ms17.png") no-repeat center;
  }

  .collect {
    width: .4rem;
    height: .38rem;
    background: url("../../assets/imgs/ms18.png") no-repeat center;
  }

  .address {
    width: .38rem;
    height: .44rem;
    background: url("../../assets/imgs/ms19.png") no-repeat center;
  }

  .feedback {
    width: .34rem;
    height: .4rem;
    background: url("../../assets/imgs/ms20.png") no-repeat center;
  }

  .about {
    width: .37rem;
    height: .33rem;
    background: url("../../assets/imgs/ms21.png") no-repeat center;
  }

  .password {
    width: .32rem;
    height: .38rem;
    background: url("../../assets/imgs/ms22.png") no-repeat center;
  }


</style>
