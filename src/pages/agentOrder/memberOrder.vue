<template>
  <div class="memberOrder oh bz">

    <!--  tab切换  -->
    <div class="mb10 mtb_10 cgf cg flex block mauto oh"
         style="height:.68rem;width: 3.85rem;line-height: .68rem;text-align: center;border-radius: 6.8rem;">
      <div :class="['w50 nav',current===index && 'active']" v-for="(nav,index) in tab" :key="index"
           @click="tabClick(index)">{{nav}}
      </div>
    </div>

    <!--  订单列表  -->
    <div class="mlr_12 mb10 cgf br" v-for="(item,index) in orderList" :key="index"
    >
      <div class="bbde lh80 plr_15 fc relative" :class="(item.checked || !isHandel) ? 'active' :''"
           @click="choiceOrder(index)">
        <span class="icon mr15"></span>订单编号 <span class="c9">（{{current==0?item.order_sn:item.order_no}}）</span>
      </div>
      <div class="product_item bbde p15 flex" v-for="(goods,idx) in item.goods" :key="idx" @click="go(item.id)">
        <img class="product mr20 br" style="width:1.05rem;height:1.05rem;" :src="goods.img">
        <div class="info cca2 w100">
          <div class="name csb"><span>{{goods.title}}</span></div>
          <div class="note csb"><span class="fz13 c6">代理价<span class="co2">￥{{goods.price || 0}}</span></span> <span>x{{goods.num}}</span>
          </div>
        </div>
      </div>
      <div class="subtotal lh80 tr plr_15">
        可获差价:<span class="priceMin co2">￥{{item.money || 0}}</span>
      </div>
    </div>

    <no-data v-if="noData"></no-data>
        <!--    底部操作-->
        <div class="csb w100 cgf bz oh" id="bottom" v-if="isHandel &&  orderList.length>0">
            <div class="flex1 csb h100 plr_15">
                <div :class="['flex',isSelectAll && 'active']" style="align-items: center" @click="seletAll">
                  <i class="icon"></i>
                  全选
                </div>
                <div>可获差价 <span class="co">￥{{totalMoney || 0}}</span></div>
            </div>
            <button class="w100 cf center" style="width:1.98rem;background-color: #4aa59a;line-height:1rem;" @click="handelOrder">处理</button>
        </div>
    </div>
</template>

<script>
    import noData from '@/components/noData.vue'


    export default {
        name: "memberOrder",
        components: {
            noData
        },
        data() {
            return {
                current: 0,
                noData: false,
                tab: ['待处理', '已处理'],
                isHandel: true, //是否已处理
                orderList: [],
                isAll: false,


            }
        },
        methods: {
            //切换订单状态
            tabClick(index) {
                this.current = index;
                this.orderList = [];
                this.noData = false;

                if (index === 0) {
                    this.isHandel = true;
                    this.getOrder('agent_order')

                } else {
                    this.isHandel = false;
                    this.getOrder('handle_order');
                }

            },

            /**
             *  获取会员订单
             * @param is_handle 是否已处理 1.已处理 0.未处理
             * @param api_name 接口名 会员订单 recommendOrder 代理订单recommendAgent
             */
            getOrder( api_name) {
                let data=[];
                this.$toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '加载中...'
                });

                this.$http.post('/wxsite/goods/api', {
                    api_name
                }).then(res => {
                    this.$toast.clear();
                    if (res.code === 1) {
                        if(api_name=="agent_order"){
                            this.difference_order=res.data.difference_order;
                            data = res.data.order;
                        }else{
                            this.difference_order=0;
                            data = res.data;
                        }
                        
                        

                        if (data.length > 0) {
                            // this.orderList = res.data;
                            data.forEach(item => {
                                item.checked = false;
                            });
                            // this.orderList = data;

                            this.orderList.push(...data);

                        } else {
                            // this.$toast('暂无数据')
                            this.noData = true;

                        }

                    }
                })

            },

            choiceOrder(index) {
                if (this.isHandel) {
                    this.orderList[index]['checked'] = !this.orderList[index]['checked'];
                }
            },

            //全选
            seletAll() {
                this.isAll = !this.isAll;

                if (this.isAll) {
                    this.orderList.forEach(item => {
                        item.checked = true;
                    })
                } else {
                    this.orderList.forEach(item => {
                        item.checked = false;
                    })
                }
            },

            //处理订单
            handelOrder() {
                this.$toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '处理中...'
                });
                this.checkedList.join()
                this.$http.post('/wxsite/goods/api', {
                    api_name: 'handleRecommendAgent',
                    id: this.checkedList.join()
                }).then(res => {
                    this.loading = true;
                    this.$toast.clear();
                    if (res.code === 1) {
                        this.$router.push({path: '/success', query: {isOrder: 1, isSuccess: 1}})

                    } else {
                        this.$router.push({path: '/success', query: {isOrder: 1, isSuccess: 0}});
                        this.$toast(res.msg);
                    }

                })
            },

            go(id) {
                this.$router.push({path: '/orderDetails', query: {id}})
            }
        },

        computed: {
            totalMoney() {
                let selectOrder = this.orderList.filter(item => item.checked);
                let total = 0;
                if (selectOrder.length > 0) {
                    total= this.difference_order
                }
                return total
            },
            isSelectAll() {
                if (this.checkedList.length === this.orderList.length && this.orderList.length > 0) {
                    return true
                } else {
                    return false
                }
            },
            checkedList() {
                if (this.orderList.length > 0) {
                    let selectOrder = this.orderList.filter(item => item.checked);
                    let temp = [];
                    if (selectOrder.length > 0) {
                        selectOrder.forEach(item => {
                            temp.push(item.id);
                        })
                    }
                    return temp
                } else {
                    return []
                }
            }
        },
        created() {this.getOrder('agent_order');}
    }

</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .memberOrder {
    padding-bottom: 1.6rem;
    min-height: 100vh;
    background-color: #f9f9f9;
  }

  .nav.active {
    color: #fff;
    background-color: #4aa59a;
  }

  #bottom {
    height: 1rem;
    position: fixed;
    bottom: .26rem;
    width: 7rem;
    left: 50%;
    margin-left: -3.5rem;
    border-top-left-radius: .2rem;
    border-top-right-radius: .2rem;
    border-bottom-left-radius: .1rem;
    border-bottom-right-radius: .1rem;
  }

  .icon {
    display: block;
    width: .3rem;
    height: .3rem;
    margin-right: .20rem;
    background: url('~@/assets/imgs/circular1.png') no-repeat;
    background-size: 100%;
  }

  .active .icon {
    background: url('~@/assets/imgs/circular.png') no-repeat;
    background-size: 100%;
  }
</style>
