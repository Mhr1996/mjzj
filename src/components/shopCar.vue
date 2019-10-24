<template>
	<div>
		<div class="shopCar">
			<div class="shopcar_logo" @click="goShoppingCar">
				<img src="@/assets/imgs/car.png" />
				<div class="num">{{totalNum}}</div>
			</div>
			<div class="btn green" @click="addCar">
				加入购物车
			</div>
			<div class="btn orange" @click="buyNow">
				立即购买
			</div>
		</div>
		<van-popup v-model="show" position="bottom" :overlay="true" style="overflow: initial;">
			<div class="shopCar" style="bottom: -1rem;">
				<div class="shopcar_logo" @click="goShoppingCar">
					<img src="@/assets/imgs/car.png" />
					<div class="num">{{totalNum}}</div>
				</div>
				<div class="btn green" @click="addCar">
					加入购物车
				</div>
				<div class="btn orange" @click="buyNow">
					立即购买
				</div>
			</div>
			<div class="rise border-bottom">
				<div class="close"><img src="@/assets/imgs/close.png" @click="show=!show"/></div>
				<div class="content">
					<img :src="commodity.image" class="product">
					<div class="info">
						<div class="name">{{commodity.name}}</div>
						<div class="price">￥{{commodity.price}}</div>
					</div>
				</div>
				<div>
					<p class="m-b-20">数量</p>
					<div>
						<!-- <van-stepper v-model="value" integer :min="1":max="99":step="1"/> -->
						<div class="reduce handleBtn" @click="count(0)">-</div>
						<input class="handleBtn" type="" name="" v-model="value" readonly="readonly">
						<div class="add handleBtn" @click="count(1)">+</div>
					</div>
				</div>
			</div> 
		</van-popup>
	</div>
</template>

<script>
	export default{
		name:"shopCar",
		props:[
			"device_id",
			"commodity",
			"ContainNum",
			"totalNum"
		],
		data(){
			return{
				show:false,
				value:1
			}
		},
		methods:{
			goShoppingCar(){
				this.$router.push({name: 'shoppingCar', query: {device_id: this.device_id}});
			},
			/* 加减数量 */
			count(sus){
				if (Number(sus)) {
					if(this.commodity.product_num<=this.value+this.ContainNum){
						this.$toast("没有更多库存了");
						return;
					}
					this.value++;
				}else{
					this.value<=1?this.value=1:this.value--;
				}
			},
			/* 添加购物车 */
			addCar(){
				if(!this.show){
					this.show=true;
				}else if(this.commodity.product_num<this.value+this.ContainNum){
					this.$toast("没有更多库存了");
					if (this.commodity.product_num%this.ContainNum<this.commodity.product_num&&this.commodity.product_num%this.ContainNum!=0) {
						this.value=this.commodity.product_num%this.ContainNum;
						//不足时把最大数量加入到购物车，value变0
						this.$emit("addCarParent",this.value);
						this.value=1;
					}
					return;
				}else{
					this.$emit("addCarParent",this.value);
				}
			},
			/* 立即购买 */
			buyNow(){
				if(this.commodity.product_num<this.value+this.ContainNum){
					this.$toast("没有更多库存了");
					return;
				}else{
					this.$emit("buyNow",this.value);
				}
			}
		},
		created(){}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';

	.shopCar{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 31;
		background-color: #fff;
		div{
			float: left;
		}
		.btn{
			width: 40%;
			text-align: center;
			height: 1rem;
			line-height: 1rem;
		}
		.shopcar_logo{
			    width: 20%;
			    height: 1rem;
			    line-height: 1rem;
			    position: relative;
			img{
				width: .46rem;
			    position: absolute;
			    top: 50%;
			    left: 50%;
			    height: .44rem;
			    margin-top: -.22rem;
			    margin-left: -.23rem;
			}
			.num{
				position: absolute;
			    width: .34rem;
			    height: .34rem;
			    background-color: red;
			    border-radius: 50%;
			    line-height: .34rem;
			    color: #fff;
			    font-size: .24rem;
			    text-align: center;
			    top: 50%;
			    left: 50%;
			    margin-top: -.38rem;
			    margin-left: .1rem;
			}
		}
		.green{
			background-color:$this_g;
			color:#fff;
		}
		.orange{
			background-color:$this_y;
			color:#fff;
		}
	}
	.van-popup--bottom{
		margin-bottom:1rem;
		border-top-right-radius: .16rem;
		border-top-left-radius: .16rem;
	}
	.rise{
		padding: .42rem .24rem;
		overflow: hidden;
		.content{
			overflow: hidden;
			position: relative;
			margin-bottom: .5rem;
			img{
				width: 1.78rem;
			    height: 1.78rem;
			    float: left;
			    margin-right: .2rem;
			}
			.info{
				color: #333;
				height: 1.2rem;
				display: flex; 
				display: -webkit-flex; /* Safari */
				flex-direction: row-reverse;
				flex-wrap: wrap;
				justify-content: flex-end;
				line-height: .36rem;
			}
			.price{
				color: $this_y;
			    position: absolute;
			    bottom: .12rem;
			}
		}
	}
	.close{
	    height: .36rem;
	    margin-bottom: .5rem;
	    position: relative;
		img{
			width: .36rem;
    		height: .36rem;
    		position: absolute;
    		right: -.3rem;
    		top: -.3rem;
    		padding: .3rem;
    		z-index: 10;
		}
	}
	.m-b-20{
		margin-bottom: .2rem;
	}
	.van-stepper__plus{
		background-color: initial
	}

	.handleBtn{
		display:block;
		float:left;
		width:.6rem;
		height: .6rem;
		text-align:center;
		line-height:.6rem;
		border:0.02rem solid #dadada;
		margin-right: .08rem;
		@include border-radius;
	}
	input.handleBtn{
		width:1rem;
		-webkit-appearance: none;
	}
	input.handleBtn:focus{
	    border: 0.02rem solid $this_g;
	}
</style>