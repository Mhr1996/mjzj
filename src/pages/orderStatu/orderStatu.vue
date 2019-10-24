<template>
  <div class="orderStatu" v-if="loading">
    <div class="bgCloor cf " style="align-items: initial;">
      <div class="flex pt20 pl15 ">
        <img src="@/assets/imgs/address2.png" style="width: .43rem;height: .51rem;" class="mr15 mt10">
        <div class="lh24">
          <p>{{order.consignee_name}} {{order.phone}}</p>
          <p>{{order.delivery_area}}</p>
        </div>
      </div>
    </div>
    <div class="mlr_12 mb10 cgf br relative" style="z-index:10;    margin-top: -.4rem;">
      <div class="bbeb lh80 csb plr_15 relative orderId">
        <span class="pl10">订单号:{{order.order_sn}}</span>
        <span class="cg">{{order.state==1?'待付款':order.state==2?'待发货':order.state==3?'待收货':order.state==4?'已完成':order.state==5?'退换货订单':'用户取消'}}</span>
      </div>
      <div class="product_item bbeb p15 flex" v-for="(goods,idx) in order.order_good" :key="idx">
        <img class="product mr20 br" style="width:1.05rem;height:1.05rem;" :src="goods.img">
        <div class="info cca2 w100">
          <div class="name csb">
            <span>{{goods.title}}</span>
            <span class="cy">￥{{goods.price}}</span>
          </div>
          <div class="note csb">
            <span class="fz13 c6"></span>
            <span>x{{goods.num}}</span>
          </div>
        </div>
      </div>
      <div class="subtotal lh80 tr plr_15">
        <span class="subtotal-info mr15">共{{order.total_num}}件商品</span> 合计:<span class="priceMin cy">￥{{order.total_price}}</span>
      </div>
    </div>
    <div class="mlr_12 br oh">
      <div class="csb lh80 plr_15 bbeb cgf ">
        <span>下单时间</span><span class="c9">{{order.ctime}}</span>
      </div>
      <div class="csb lh80 plr_15 cgf" v-if="order.expressage!=''">
        <span>物流单号</span><span class="c9">{{order.expressage}}</span>
      </div>
    </div>
    <div class="csb w100 cgf bz" v-if="order.state==1 || order.state==3 || order.state==2">
        <div>实付:<span class="co">￥{{order.total_price}}</span></div>
        <div>
            <button class="w100 cf cgy center" style="width:1.98rem;line-height:1rem;"  v-if="order.state==1 || order.state==2" @click="cancel">取消订单</button>
            <button class="w100 cf cgg3 center" style="width:1.98rem;line-height:1rem;" v-if="order.state==1 || order.state==3" @click="handelOrder(order.state)">确认{{order.state==1?'支付':'收货'}}</button>
        </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "orderStatu",
        components: {},
        data() {
            return {
                order: {},
                loading: false
            }
        },

        methods: {
            //    获取订单详情
            getOrderDetail(order_id) {
                this.$toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '数据加载中...'
                });

                this.$http.post('/wxsite/Userspace/api', {
                    api_name: 'goodsOrderFind',
                    order_id
                }).then(res => {
                    this.$toast.clear();
                    if (res.code === 1) {
                        this.loading = true;
                        this.order = res.data;
                    } else {
                        this.$toast(res.msg);
                    }
                })
            },

            //处理订单 
            handelOrder(status) {
                //待付款
                if (status == 1) {
                    this.check();
                }
                //待收货
                if (status == 3) {
                    this.$toast.loading({
                        duration: 0,       // 持续展示 toast
                        forbidClick: true, // 禁用背景点击
                        loadingType: 'spinner',
                        message: '确认收货中...'
                    });

                    this.$http.post('/wxsite/Userspace/api', {
                        api_name: 'receiveTime',
                        order_id: this.order.id
                    }).then(res => {

                        if (res.code === 1) {
                            this.$toast.success('确认成功');
                            this.getOrderDetail(this.order.id);
                        } else {
                            this.$toast();
                        }
                    })
                }
            },
            cancel(order_id){
                let vis=this;
                vis.$dialog.confirm({
                    title: '提示',
                    message: '确定取消当前订单吗？'
                }).then(() => {
                    vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
                    vis.$http.post('/wxsite/Userspace/api',{
                        api_name: "cancelGoodOrder",
                        order_id:vis.order.id
                    }).then(res => {
                        vis.$toast.clear();
                        let rd=res.data;

                        if(res.code==1){
                            vis.$toast("取消成功!");
                            setTimeout(()=>{
                                window.location.reload();
                            },2000)
                        }else{
                            vis.$toast(res.msg);
                        }
                    })
                }).catch(() => {
                  // on cancel
                });
            },
            check(){
                let vis=this;
                this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
                this.$http.post('/wxsite/Userspace/api',{
                    api_name: "setPayState",
                    order_id: vis.order.id
                }).then(res => {
                    let rd=res.data;

                    if (res.code==1) {
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', {
                                appId: rd.wxPay.appId,     //公众号名称，由商户传入     
                                timeStamp: rd.wxPay.timeStamp,         //时间戳，自1970年以来的秒数     
                                nonceStr: rd.wxPay.nonceStr, //随机串     
                                package: rd.wxPay.package,     
                                signType: rd.wxPay.signType,         //微信签名方式：     
                                paySign: rd.wxPay.paySign //微信签名 
                            },
                            function(jso){
                                if(jso.err_msg == "get_brand_wcpay_request:ok"){
                                    vis.$toast({
                                        duration: 0,       // 持续展示 toast
                                        forbidClick: true, // 禁用背景点击
                                        message: '支付成功!'
                                    });
                                    setTimeout(()=>{
                                        vis.$toast.clear();
                                        this.getOrderDetail(this.$route.query.id);
                                    },2000)
                                }else{
                                    vis.$toast({
                                        duration: 0,       // 持续展示 toast
                                        forbidClick: true, // 禁用背景点击
                                        message: '支付失败!'
                                    });
                                    setTimeout(()=>{
                                        vis.$toast.clear();
                                        this.getOrderDetail(this.$route.query.id);
                                    },2000);
                                }
                            }
                        ); 
                    }else{
                        this.$toast(res.msg);
                        this.$toast.clear();
                    }
                })
            }
        },
        created() {
            this.getOrderDetail(this.$route.query.id);
        },
    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .orderStatu {
    min-height: 100vh;
    background-color: #f9f9f9;
  }

  .bgCloor {
    height: 2rem;
    background: -webkit-linear-gradient(top, #4aa59a, #58c1b4); /* Safari 5.1-6.0 */
    background: -o-linear-gradient(top, #4aa59a, #58c1b4); /* Opera 11.1-12.0 */
    background: -moz-linear-gradient(top, #4aa59a, #58c1b4); /* Firefox 3.6-15 */
    background: linear-gradient(top, #4aa59a, #58c1b4); /* 标准语法 */
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

  .orderId {
    &:after {
      position: absolute;
      content: '';
      width: .07rem;
      height: .28rem;
      background-color: #4aa59a;
      left: 0.3rem;
      top: .24rem;
      @include border-radius(.03rem);
    }
  }


  button:active {
    background: #FF614A;
  }

  .csb.w100{
    height:1rem;position:fixed;bottom:0;left:0;padding-left:.72rem;
  }
</style>
