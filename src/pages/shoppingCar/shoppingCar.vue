<template>
	<div class="shoppingCar">
		<div style="width:4.3rem;height:.7rem;line-height:.7rem;" class="mauto csb mt10">
			<div class="h100 w50 center cgf nav_left cg"  :class="{active:sP==1}" @click="switchPlan(true)">单件商品</div>
			<div class="h100 w50 center cgf nav_right cg" :class="{active:sP==2}" @click="switchPlan(false)">整箱商品</div>
		</div>
		<div class="mt10 mlr_10 csb cgf mb10 p10">
			<div class="allIn" :class="{'active':checkAll}"  @click="checkAllFlag()">
				<img src="@/assets/imgs/circular1.png" v-show="!checkAll" style="width: .29rem;height: .29rem;">
				<img src="@/assets/imgs/circular.png" v-show="checkAll" style="width: .29rem;height: .29rem;"> 
				全选
			</div>
			<span class="cg" @click="deleteItem">删除</span>
		</div>
		<div class="b-r oh mlr_10 pt10" v-show="product.length!=0" style="padding-bottom: 1rem;">
			<div class="product_item bbf5 bgf" v-for="(item,index) of product" :key="index">
				<input type="checkbox" name="shop_check" v-show="false"><label class="check_lab" :class="{'active': item.checked}" @click="selectProduct(item)"></label>
				<div class="mark">
					<img :src="item.image" class="product br5 oh">
					<div class="info cca">
						<div class="name w100">{{item.name}}</div>
						<div class="pro_price w100">￥{{item.price}}</div>
					</div>
				</div>
				<div class="sliceTeam csb">
					<span class="cut" @click="changeNumber(item, -1)"></span>
					<span class="cipherVal">{{item.num}}</span>
					<span class="add" @click="changeNumber(item, 1)"></span>
				</div>
			</div>
		</div>
		<div class="bottom flex-c">
			<div class="l bottom_info csb flex1">
				<span class="ml10">已选({{checkNum.length}})</span>
				<div class="mr10">合计<span class="totalPrice">{{totalMoney | money()}}</span></div>
			</div>
			<div class="r w-5" style="width: 2rem;">
				<div class="bill" @click="check">结算</div>
			</div>
		</div>
	</div>
</template>

<script>

	// sP==1 && item.agent_price != 0 ? item.agent_price :
	// sP==1 && item.agent_price == 0 ? item.price :
	// sP==2 && item.agent_price != 0 ? item.agent_pack :
	// sP==2 && item.agent_price == 0 ? item.pack_stock : ''
						
	export default{
		name:"shoppingCar",
		data(){
			return {
				product:{},
				totalMoney:0,
				checkNum:[],
				checkAll:false,
				sP:1
			}
		},
		components:{ },
		filters: {
		    money(value) {
		      	return '￥' + value.toFixed(2);
		    }
		},
		created(){
			/* 获取购物车列表 */
			this.product = JSON.parse(this.$tool.getSession("shopCart_piece")) || [];
		},
		methods:{
			switchPlan(type){
				let vis = this;
				this.checkNum=[]
				if(vis.checkAll==true){
					vis.checkAllFlag();
				}

				if(type){
					vis.sP=1
					vis.product = JSON.parse(vis.$tool.getSession("shopCart_piece")) || [];
				}else{
					vis.sP=2
					vis.product = JSON.parse(vis.$tool.getSession("shopCart_box")) || [];
				}
			},
			changeNumber(item, way) {
				let vis = this;
				if( way < 0) {
			        if(item.num == 1) {this.$toast("不能再减了"); return}

			        item.num--;
				}else{
					
					if(item.stock<=item.num&&vis.sP==1){
						item.num == item.stock;
						this.$toast("没有更多库存了");
						return;
					}
					if(item.pack_stock<=item.num&&vis.sP==2){
						item.num == item.pack_stock;
						this.$toast("没有更多库存了");
						return;
					}
					item.num++;
				}
				this.calcTotalMoney();
			},
			selectProduct(item) {
				if (typeof item.checked == 'undefined') {
					this.$set(item, 'checked', true)
				}else{
					item.checked = !item.checked
				}
				this.calcTotalMoney();
			},
			checkAllFlag(item) {
				this.checkAll = !this.checkAll;
				if(this.product.length==0){
					this.$toast("购物车没有商品！");
					this.checkAll=false;
					return;
				}
				this.product.forEach((item, index) => {
					if(typeof item.checked == 'undefined') {
						this.$set(item, 'checked', this.checkAll);
					}else{
						item.checked = this.checkAll;
					}
				})
				this.calcTotalMoney();
			},
			calcTotalMoney() {
				this.totalMoney = 0,this.checkNum=[];
				this.product.forEach((item, index) => {
					if(item.checked) {
						this.totalMoney += item.price*item.num;
						this.checkNum=[...this.checkNum,item];
					}

					if (this.checkNum.length==this.product.length&&this.checkNum.length!=0) {
						this.checkAll = true;
					}else{
						this.checkAll = false;
					}
				})

				//全删则不走forEach
				this.product.length==0 ? this.checkAll = false:'';
			},
			deleteItem(){
				let vis=this;
				if (this.checkNum.length==0) {
					this.$toast("您还没有选择商品哦！");
					return;
				}

				this.$dialog.confirm({
				  	title: '提示',
				  	message: '确认删除这'+this.checkNum.length+'款商品吗?'
				}).then(() => {
					let sPName=vis.sP==1?"shopCart_piece":"shopCart_box";
					let total=JSON.parse(this.$tool.getSession(sPName));
					this.checkNum.forEach((item,index) => {
						for(let i=total.length;i--;){
							if(item.id==total[i].id){
								total.splice(i,1);
							}
						}
					});

					this.$tool.setSession(sPName,total);
					this.product=total;
					this.calcTotalMoney();
				}).catch(() => {
					//关闭
				});
			},
			check(){
				let goods_id="",number="",vis=this;
				if (this.checkNum.length==0) {
					this.$toast("您还没有选择商品哦！");
					return;
				}

				this.checkNum.forEach((item,index) => {
					goods_id+=item.id+",";
					number+=item.num+",";
				});

				goods_id=goods_id.substr(0,goods_id.length-1);
				number=number.substr(0,number.length-1);
				this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
				this.$http.post('/wxsite/goods/api',{
					api_name: "confirmOrder",
		    		goods_id: goods_id,
		    		number: number,
		    		type: vis.sP
				}).then(res => {
					this.$toast.clear();
					let rd=res.data;

			    	if (res.code==1) {
			    		//成功删除购物车信息
			    		let sPName=vis.sP==1?"shopCart_piece":"shopCart_box";
						let total=JSON.parse(this.$tool.getSession(sPName));
			    		
						this.checkNum.forEach((item,index) => {
							for(let i=total.length;i--;){
								if(item.id==total[i].id){
									total.splice(i,1);
								}
							}
						});

						//购买后的列表存起来product 选中状态设为false
						this.$tool.setSession(sPName,total);
						this.product=total;
						this.$tool.setSession("finalOrderDate",rd);
						this.$router.push({name: "finalOrder"});
			    	}else{
			        	this.$toast(res.msg);
			    	}
				})
			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.shoppingCar{
		min-height: 100vh;
		background-color: #f9f9f9;
		overflow: hidden;
		.bottom{
			position: fixed;
			bottom: 0;
			width: 100%;
			left: 0;
			height: 1rem;
			z-index: 10;
    		background-color: #fff;
			.del,.bill{
				height: 1rem;
				font-size: .32rem;
				line-height: 1rem;
				text-align: center;
				font-weight: bold;
			}
			.bill{
				background-color: #4aa59a;
				color: #fff;
			}
			.del{
				background-color: #e5e5e5;
				color: #999999;
			}
			.w-5{
				width: 50%;
			}
		}
		.bottom_info{
			line-height: 1rem;
			position: relative;
		}
		.totalPrice{
			color: #ed971b;;
		}
	}
	.product_item{
		padding: .24rem;
		box-sizing: border-box;
		    height: 1.58rem;
		    position: relative;
		img.product{
			width: 1.03rem;
			height: 1.03rem;
			float: left;
			margin-right: .28rem;
		}
	}
	.mark{
		overflow: hidden;
		height: 1.03rem;
		.info{
			position: relative;
			height: 100%;
			.name{
				margin-bottom: .38rem;
				@include oneLines;
			}
			.note{
				font-size: .24rem;
				color: $g9;
				@include oneLines;
				width: 35%;
			}
			.pro_price{
				color: #f7ca49;
    			font-size: .24rem;
			}
		}
	}
	.check_lab{
		float: left;
		display: block;
		width: .29rem;
		height: .29rem;
		margin-right: .24rem;
    	margin-top: 0.32rem;
    	background: url('~@/assets/imgs/circular1.png') no-repeat;
		background-size: 100%;
	}
	.sliceTeam{
		position: absolute;
	    min-width: 1.7rem;
	    right: .25rem;
	    top: .8rem;
		.cut, .add{
			width: .4rem;
			height: .4rem;
		}
		.cut{
			background: url('~@/assets/imgs/del.png') no-repeat;
			background-size: 100%;
		}
		.add{
			background: url('~@/assets/imgs/add.png') no-repeat;
			background-size: 100%;
		}
		.cipherVal{
			display: inline-table;
			min-width: .6rem;
			text-align: center;
			color: $g9;
			white-space: nowrap;
			padding: 0 .1rem;
		}
	}
	label.active{
		background: url('~@/assets/imgs/circular.png') no-repeat;
		background-size: 100%;
		border:0px solid;
	}
	#total{
		display: none;
	}
	.total{
		float: left;
		display: block;
		width: .35rem;
		height: .35rem;
		margin-right: .24rem;
		margin-left: .24rem;
		border:1px solid #e5e5e5;
    	margin-top: 0.3rem;
    	box-sizing: border-box;
	}
	.nav_left{
		border-top-left-radius: .7rem;
		border-bottom-left-radius: .7rem;
	}
	.nav_right{
		border-top-right-radius: .7rem;
		border-bottom-right-radius: .7rem;
	}
	.cg.active{
		background-color: #4aa59a;
		color: #fff;
	}
</style>