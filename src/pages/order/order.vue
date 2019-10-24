<template>
  <div class="order">
    <div class="item">

      <ul class="flex wrap w100 center cf">
        <li :class="['ccc',current===index && 'active']" v-for="(item,index) in orderStatus" :key="index"
            @click="tabChange(index)">
          <i :class="item.icon"></i>
          <p>{{item.text}}</p>
        </li>

      </ul>

    </div>
    <div class="pt10">
      <loadMore @loadmore="getOrderList(page,currentStatus)"
                :is-show-mod="true"
                :has-more="isHasMore"
                :is-loading="isLoading"
                :threshold="200">
                <div class="mlr_12 mb10 cgf br" @click="goOrderDetail(item.id)" v-for="(item,index) in orderList"
                :key="index">
                  <div class="bbde lh80 csb plr_15 relative orderId">
                    <span class="pl10">订单号:{{item.order_sn}}</span>
                    <span :class="{'c3':item.state==4,cg:item.state!=4}"> {{item.state==1?'待付款':item.state==2?'待发货':item.state==3?'待收货':item.state==4?'已完成':'退货'}}</span>
                  </div>
                  <div class="product_item bbde p15 flex" v-for="(goods,idx) in item.order_good" :key="idx">
                    <img class="product mr20 br5" style="width:1.05rem;height:1.05rem;" :src="goods.img">
                    <div class="info cca2 w100">
                      <div class="name csb"><span>{{goods.title}}</span> <span class="cy">￥{{goods.price}}</span></div>
                      <div class="note csb"><span class="fz13 c6"></span> <span>x{{goods.num}}</span></div>
                    </div>
                  </div>

                  <div class="subtotal lh80 tr plr_15">
                    <span class="subtotal-info mr15">共{{item.total_num}}件商品</span> 合计:<span class="priceMin cy">￥{{item.total_price}}</span>
                  </div>
                </div>
      </loadMore>
    </div>

    <no-data v-if="noData"></no-data>

  </div>
</template>

<script>

    import loadMore from '@/components/loadMore.vue'
    import noData from '@/components/noData.vue'

    export default {
        name: "order",
        components: {
            loadMore,
            noData
        },
        data() {
            return {
                page: 1,
                current: 0,
                currentStatus: 0,  //选中的订单状态
                isHasMore: true,    //是否还有更多数据
                isLoading: false,   //是否加载中
                noData: false,
                orderList: [],
                orderStatus: [
                    {
                        text: '全部',
                        icon: 'all'
                    },
                    {
                        text: '待支付',
                        icon: 'wait-pay'
                    },
                    {
                        text: '待发货',
                        icon: 'wait-deliver'
                    },
                    {
                        text: '待收货',
                        icon: 'wait-receive'
                    },
                    {
                        text: '已完成',
                        icon: 'completed'
                    },
                ]

            }
        },

        methods: {

            //切换订单状态
            tabChange(index) {
                this.current = index;
                this.currentStatus = index;
                this.noData = false;
                this.orderList = [];
                this.getOrderList(1, this.currentStatus);

            },

            /**
             * 获取订单列表
             * @param page  页码
             * @param state  状态 1,待付款;2,待发货;3,待收货;4:已完成;5:退换货订单  0全部
             */
            getOrderList(page, state) {
                this.isLoading = true;
                this.$http.post('/wxsite/Userspace/api', {
                    'api_name': 'goodsOrderList',
                    'page': page,
                    'pagesize': 10,
                    state
                }).then(res => {
                    this.isLoading = false;
                    if (res.code === 1) {
                        let data = res.data;
                        if (data.length === 0 && page == 1 && this.orderList.length === 0) {
                            // this.$toast('暂无数据');
                            this.noData = true;
                            return false
                        } else if (data.length === 0) {
                            this.$toast('没有更多数据~');
                            this.isHasMore = false;
                            return false
                        }
                        this.orderList.push(...data);
                        this.page++;
                    }
                }).catch(() => {
                    this.isLoading = false;
                    this.isHasMore = false;
                })
            },

            //跳转至订单详情
            goOrderDetail(id) {
                this.$router.push({
                    path: '/orderStatu',
                    query: {
                        id
                    }
                })
            }

        },
        created() {
            this.getOrderList(1, 0);
        },
    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .order {
    min-height: 100vh;
    background-color: #f9f9f9;
  }

  .item {

    background: -webkit-linear-gradient(bottom,#4aa59a,#63d7c9); /* Safari 5.1-6.0 */
    background: -o-linear-gradient(bottom,#4aa59a,#63d7c9); /* Opera 11.1-12.0 */ 
    background: -moz-linear-gradient(bottom,#4aa59a,#63d7c9); /* Firefox 3.6-15 */
    background: linear-gradient(bottom,#4aa59a,#63d7c9); /* 标准语法 */

    ul {
      li {
        position: relative;
        width: 20%;
        padding: .88rem 0 .22rem;

        i {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          background-size: 100% !important;
        }

        p {
          font-size: .24rem;
        }
      }

      .active {
        &:before {
          content: '';
          position: absolute;
          width: 1rem;
          height: .04rem;
          background: #ffffff;
          left: 50%;
          transform: translateX(-50%);
          bottom: 2px;
        }
      }
    }

    /*img {*/
    /*  margin-bottom: .1rem*/
    /*}*/

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


  .all {
    width: .43rem;
    height: .39rem;
    top: .36rem;
    background: url("../../assets/imgs/o1.png") no-repeat center;
  }

  .wait-pay {
    width: .39rem;
    height: .38rem;
    top: .36rem;
    background: url("../../assets/imgs/o2.png") no-repeat center;
  }

  .wait-deliver {
    width: .35rem;
    height: .29rem;
    top: .43rem;
    background: url("../../assets/imgs/o3.png") no-repeat center;
  }

  .wait-receive {
    width: .36rem;
    height: .31rem;
    top: .43rem;
    background: url("../../assets/imgs/o4.png") no-repeat center;
  }

  .completed {
    width: .33rem;
    height: .33rem;
    top: .42rem;
    background: url("../../assets/imgs/o5.png") no-repeat center;
  }

</style>
