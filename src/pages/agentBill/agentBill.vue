<template>
  	<div class="agentBill oh bz">
	    <!--  tab切换  -->
	    <div class="mb10 mtb_10 cgf cg flex block mauto oh"style="height:.68rem;width: 3.85rem;line-height: .68rem;text-align: center;border-radius: 6.8rem;">
	      	<div :class="['w50 nav',current===index && 'active']" v-for="(nav,index) in tab" :key="index" @click="tabClick(index)">
	      		{{nav}}
	      	</div>
	    </div>
		<van-list
			  v-model="loading"
			  :finished="finished"
			  finished-text="没有更多了"
			  :offset="100"
			  @load="getList"
			>
		    <div class="mlr_12 mb10 cgf br" v-for="(item,index) in orderList" :key="index">
		      	<div class="bbde lh80 plr_15 fc relative" :class="(item.checked) ? 'active' :''" @click="selectProduct(item)">
		        	
		      	</div>
		      	 <div class="bbde lh80 plr_15 relative csb" :class="(item.checked) ? 'active' :''" @click="selectProduct(item)">
                    <div class="fc"><span class="icon mr15"></span>订单编号 <span class="c9">（{{current==0?item.order_sn:item.order_no}}）</span></div>
                    <span class="c9 fz12">{{item.type==1?'单件':'整箱'}}</span>
                </div>
		      	<div class="product_item bbde p15 flex" v-for="(goods,idx) in item.goods" :key="idx" @click="go(item.id)">
		        	<img class="product mr20 br" style="width:1.05rem;height:1.05rem;" :src="goods.img">
			        <div class="info cca2 w100">
			          	<div class="name csb"><span>{{goods.title}}</span></div>
			          	<div class="note csb"><span class="fz13 c6">代理价<span class="co2">￥{{goods.price || 0}}</span></span> <span>x{{goods.num}}</span></div>
			        </div>
		      	</div>
		      	<div class="subtotal lh80 tr plr_15">
		        	可获差价:<span class="priceMin co2">￥{{current==0 ? item.difference : item.money}}</span>
		      	</div>
		    </div>
		</van-list>
	    
	        <!--    底部操作-->
	    <div class="csb w100 cgf bz oh" id="bottom" v-if="orderList.length>0&& current==0">
	        <div class="flex1 csb h100 plr_15">
	            <div :class="['flex',checkAll && 'active']" style="align-items: center" @click="checkAllFlag">
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
        name: "agentBill",
        data() {
            return {
            	finished : false,
				loading  : false,
				orderList: [],
				page     : 1,
				pagesize : 10,
            	current: 0,
            	totalMoney: 0,
            	checkAll: false,
            	tab: ['待处理', '已处理']
            }
        },
        computed: {
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
        methods: {
            //切换订单状态
            tabClick(index) {
                this.current = index;
                this.orderList = [];
                this.page = 1;
				this.getList();
            },
            getList(){
				let vis=this,rd=[];
				vis.$http.post("/wxsite/goods/api",{
					api_name:vis.current==0 ? "agent_order" : "handle_order",
					page:vis.page
				}).then(res => {
					if (res.code == 1) {
						if(vis.current==0){
							rd=res.data.order;
						}else{
							rd=res.data;
						}
						rd.forEach((item, index) => {
							if(typeof item.checked == 'undefined') {
								this.$set(item, 'checked', false);
							}
						})
						vis.orderList=[...vis.orderList,...rd];
						if (rd.length<10) {
							vis.finished = true;
						}
						vis.page++;
					}else{
						vis.$toast(res.msg);
					}
					vis.loading = false;
				})
			},
			selectProduct(item) {
				if (typeof item.checked == 'undefined') {
					this.$set(item, 'checked', true)
				}else{
					item.checked = !item.checked
				}
				this.calcTotalMoney();
			},
			calcTotalMoney() {
				this.totalMoney = 0,this.checkNum=[];
				this.orderList.forEach((item, index) => {
					if(item.checked) {
						this.totalMoney += item.difference;
						this.checkNum=[...this.checkNum,item];
					}

					if (this.checkNum.length==this.orderList.length&&this.checkNum.length!=0) {
						this.checkAll = true;
					}else{
						this.checkAll = false;
					}
				})

				//全删则不走forEach
				this.orderList.length==0 ? this.checkAll = false : '';
			},
			checkAllFlag(item) {
				this.checkAll = !this.checkAll;
				if(this.orderList.length==0){
					this.$toast("购物车没有商品！");
					this.checkAll=false;
					return;
				}
				this.orderList.forEach((item, index) => {
					if(typeof item.checked == 'undefined') {
						this.$set(item, 'checked', this.checkAll);
					}else{
						item.checked = this.checkAll;
					}
				})
				this.calcTotalMoney();
			},
			//处理订单
            handelOrder() {
            	if(this.checkedList.join()==""){
                    this.$toast("请选择要处理的订单");
                    return;
                }

                this.$toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '处理中...'
                });
                this.checkedList.join()
                this.$http.post('/wxsite/goods/api', {
                    api_name: 'handleRecommendAgent',
                    id: this.checkedList.join(),
                    money: this.totalMoney
                }).then(res => {
                    this.loading = true;
                    this.$toast.clear();
                    if (res.code === 1) {
                        this.$router.push({path: '/success', query: {isOrder: 1, isSuccess: 1}})
                    } else {
                        //this.$router.push({path: '/success', query: {isOrder: 1, isSuccess: 0}});
                        this.$toast(res.msg);
                    }

                })
            },
            go(id) {
                this.$router.push({path: '/agentBillDetails', query: {id , type:this.current==0 ? 1 : 2}})
            }
        }
    }

</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .agentBill {
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
