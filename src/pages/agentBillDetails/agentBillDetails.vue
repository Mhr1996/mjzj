<template>
    <div class="agentBillDetails" v-if="loading">
        <div class="bgCloor cf relative" style="align-items: initial;">
            <div class="flex pt20 pl20 ">
                <img :src="rd.user.head_img" class="mr15 br50" style="width:1.22rem;height:1.22rem;">
                <div class="cca2" style="height:1.22rem;">
                    <p>{{rd.user.nickname}}</p>
                    <p class="p3_6 br" style="background-color: #4aa59a;"> {{rd.user.mobile}}</p>
                </div>
            </div>
            <div class="slou" v-if="type==2"><img src="@/assets/imgs/handled.png" class="mr5" style="height: .34rem;height: .34rem;margin-top: -.05rem;">已处理
            </div>
            <div class="slou" v-else><img src="@/assets/imgs/slou.png" class="mr5" style="height: .34rem;height: .34rem;margin-top: -.05rem;">待处理
            </div>
        </div>
        <div class="cgf relative addressRow ellipsis">
            <img src="@/assets/imgs/address3.png" class="mr15 mt10">{{rd.delivery_area}}
        </div>
        <div class="mlr_12 mb10 cgf br">
            <div class="bbeb lh80 plr_15 fc relative active">
                <span class="icon mr15"></span>订单编号 <span class="c9">（{{rd.order_sn}}）</span>
            </div>
            <div class="product_item bbeb p15 flex" v-for="(item,index) in rd.goods" :key="index">
                <img class="product mr20 br" style="width:1.05rem;height:1.05rem;" :src="item.img">
                <div class="info cca2 w100">
                    <div class="name csb"><span>{{item.title}}</span></div>
                    <div class="note csb">
                        <div>
                            <span class="fz13 c6 mr10">原价<span class="co2">￥{{item.price}}</span></span>
                            <span class="fz13 c6">代理价<span class="co2">￥{{item.money || 0}}</span></span>
                        </div>
                        <span>x{{item.num}}</span>
                    </div>
                </div>
            </div>
            <div class="subtotal lh80 tr plr_15">
                可获差价:<span class="priceMin co2">￥{{rd.difference}}</span>
            </div>
        </div>
        <div class="cgf mlr_12 oh br">
            <div class="csb plr_20 lh50 bbeb rj">
                <span>下单时间</span><span class="c9">{{rd.ctime}}</span>
            </div>
            <div class="csb plr_20 lh50 bbeb rj">
                <span>订单号码</span> <span class="c9">{{rd.order_sn}}</span>
            </div>
            <div class="csb plr_20 lh50 rj"  v-if="type!=1">
                <span>物流状态</span> <span class="c9">{{rd.state==1?'待付款':rd.state==2?'待发货':rd.state==3?'待收货':rd.state==4?'已完成':rd.state==5?'退货':'用户取消'}}</span>
            </div>
        </div>

        <div class="w100 cgf bz" style="height:1rem;position:fixed;bottom:0;left:0;padding-left:.72rem;" v-if="type==1">
            <button class="cf center" @click="handelOrder(rd.id)"
            style="width:1.98rem;background-color: #4aa59a;line-height:1rem;float: right;">处理
            </button>
        </div>

    </div>
</template>

<script>
    export default {
        name: "orderDetails",
        data() {
            return {
                rd: {},
                ctime:'',
                loading: false,
                type: this.$route.query.type
            }
        },

        methods: {

            //    获取订单详情
            getOrderDetail(id) {

                this.$toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '加载中...'
                });

                this.$http.post('/wxsite/goods/api', {
                    api_name: this.type==1 ? 'recommendAgentDetail' :  'handle_orderDetail',
                    id
                }).then(res => {
                    this.loading = true;
                    this.$toast.clear();
                    if (res.code === 1) {

                        this.rd = res.data;
                        this.rd.ctime=this.$tool.handleDate(Number(this.rd.ctime)*1000);
                    } else {
                        this.$toast(res.msg);
                    }

                })
            },

            //处理订单
            handelOrder(id) {
                let vis= this;
                vis.$toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '处理中...'
                });

                vis.$http.post('/wxsite/goods/api', {
                    api_name: 'handleRecommendAgent',
                    id,
                    money: vis.rd.difference
                }).then(res => {
                    vis.loading = true;
                    vis.$toast.clear();
                    if (res.code === 1) {
                        vis.$router.push({path: '/success', query: {isOrder: 1, isSuccess: 1}})
                    } else {
                        vis.$toast(res.msg);
                    }

                })
            },


        },

        created() {

            this.getOrderDetail(this.$route.query.id);

        },
    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .agentBillDetails {
    min-height: 100vh;
    background-color: #f9f9f9;
  }

  .bgCloor {
    height: 2rem;
    background: linear-gradient(top, #4aa59a, #58c1b4);
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

  .icon {
    display: block;
    width: .29rem;
    height: .29rem;
    margin-right: .20rem;
    background: url('~@/assets/imgs/circular1.png') no-repeat;
    background-size: 100%;
  }

  .active .icon {
    background: url('~@/assets/imgs/circular.png') no-repeat;
    background-size: 100%;
  }

  .slou {
    position: absolute;
    right: .39rem;
    z-index: 10;
    top: .43rem;
  }

  .addressRow {
    width: 5rem;
    height: 1rem;
    z-index: 10;
    line-height: 1rem;
    margin: 0 auto .4rem;
    @include border-radius(1rem);

    img {
      width: .43rem;
      height: .51rem;
      margin: 0 .2rem;
      margin-left: .33rem;
    }


  }
</style>
