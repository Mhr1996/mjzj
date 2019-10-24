<template>
  <div class="agentDetail">
    <div class="bgCloor cf csb" style="align-items: initial;">
      <div class="br relative cf p15 mauto block mt15"
           style="width: 5.67rem;border:0.02rem solid #fff;    z-index: 11;">
        <div class="mb10">{{agent.name}}</div>
        <div class="mb10">代理编号：{{agent.number}}</div>
        <div class="mb10">手机号码：{{agent.mobile}}</div>
        <div class="mb10">代理类型：{{agent.title}}</div>
        <div class="mb10">地 址：{{agent.address}}</div>
        <img :src="agent.head_img" class="br50"
             style="width: 1.38rem;height: 1.38rem;position: absolute;top: .2rem;right: .2rem;"/>
      </div>
    </div>
    <div class="p12 mlr_12 b-r mt80 relative" style="border: solid 2px #707070;" v-if="agent.goods_order_money&&agent.goods_order_money.length>0">
      <div class="center mb20 mt12">下单金额</div>
      <div class="yearBtn">{{year}}</div>
      <div class="csb plr_12 cgd br5 ptb_6 plr_12 cf mb10" v-for="(item,index) in agent.goods_order_money" :key="index">
        <span>{{item.dat}}</span>
        <span>￥{{item.amount}}</span>
      </div>

    </div>
  </div>
</template>

<script>
    export default {
        name: "agentDetail",

        data() {
            return {
                agent: [],
                year:''
            }
        },

        methods: {

            getAgentDetail(id) {
                let vis=this;
                this.$toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '加载中...'
                });
                
                this.$http.post('/wxsite/Userspace/api', {
                    api_name: 'agentGroupFind',
                    agent_id: vis.$route.query.id
                }).then(res => {
                    vis.$toast.clear();
                    if (res.code === 1) {
                        vis.agent = res.data;
                    } else {
                        vis.$toast(res.msg);
                    }

                })
            }

        },
        created() {
          let dls=new Date();
          this.getAgentDetail(this.$route.query.id);
          this.year=dls.getFullYear();
        },
    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .agentDetail {
    min-height: 100vh;
    /*background-color: #f9f9f9;*/
  }

  .bgCloor {
    height: 3.4rem;
    background: -webkit-linear-gradient(top, #4aa49a, #58c1b4); /* Safari 5.1-6.0 */
    background: -o-linear-gradient(top, #4aa49a, #58c1b4); /* Opera 11.1-12.0 */
    background: -moz-linear-gradient(top, #4aa49a, #58c1b4); /* Firefox 3.6-15 */
    background: linear-gradient(top, #4aa49a, #58c1b4); /* 标准语法 */
    position: relative;

    &:before {
      content: '';
      position: absolute;
      background: url('~@/assets/imgs/b2.png') no-repeat;
      width: 100%;
      height: .88rem;
      left: 0;
      z-index: 10;
      background-size: 100%;
      bottom: -.87rem;
    }
  }

  .yearBtn {
    position: absolute;
    right: .2rem;
    top: .2rem;
    line-height: .42rem;
    text-align: center;
    width: 1.3rem;
    height: .42rem;
    color: #ffff;
    background-color: #4aa59a;
    @include border-radius(.05rem);
  }
</style>
