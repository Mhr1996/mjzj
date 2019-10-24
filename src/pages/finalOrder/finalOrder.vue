<template>
	<div class="finalOrder">
		<router-link class="item cgf p12 mb10" :to="{path:'addressAlias',query:{finalOrder:1}}" tag="div" v-if="list!=null&&list.address_data!=null">
			<div style="padding: .12rem 0 .24rem .78rem;" class="fz12 selectAddress">
				<p class="mb12">收货人：{{list.address_data.fullname}}</p>
				<p>收货地址：{{list.address_data.address}}{{list.address_data.location}}</p>
			</div>
		</router-link>
		<router-link class="cgf p12 mb10" :to="{path:'addressAlias',query:{finalOrder:1}}" tag="div" v-if="list.address_data==null">
			添加地址信息
		</router-link>
		<div class="b-r oh bgf mlr_10" v-if="list!=null">
			<div class="product_item bbf5" v-for="(item,index) of list.order_data" :key="index">
				<div class="mark">
					<img :src="item.img" class="product br">
					<div class="info cca">
						<div class="name w100 csb"><span>{{item.title}}</span><span class="pro_price">￥{{item.agent_price}}
						<!-- list.type==1 && item.agent_price != 0 ? item.agent_price :
							list.type==1 && item.agent_price == 0 ? item.price :
							list.type==2 && item.agent_price != 0 ? item.agent_pack :
							list.type==2 && item.agent_price == 0 ? item.pack : '' --></span></div>
						<span class="cipherVal w100 tr">数量：{{item.number}}</span>
					</div>
					
				</div>
			</div>
		</div>
		<div class="b-r oh bgf mlr_10 mt20 mb20" v-if="list!=null">
			<!-- <div class="csb lh50 cgf plr_10 bbeb">
				<span>运费</span><span class="color_price">￥4.00</span>
			</div> -->
			<div class="csb lh50 cgf plr_10">
				<span>共{{list.total_num}}件商品</span><div>小计:<span class="color_price">￥{{list.total_price}}</span></div>
			</div>
		</div>
		<div class="b-r oh bgf mlr_10 mt20" v-if="list!=null">
			<div class="csb lh50 cgf plr_10 csb" @click="choicePay(item)" v-for="(item,index) of payType" :key="index" :class="{'active': item.checked}">
				<div class="flex ac">
					<img :src="item.img" alt="" class="mr10" style="width:.4rem;height:.4rem;"><span>{{item.name}}</span>
				</div>
				<div><span class="icon mr15"></span></div>
			</div>
		</div>
		<div class="bottom flex-c" v-if="list!=null">
			<div class="l bottom_info flex1 pl30">
				<div class="mr10">合计：<span class="totalPrice">￥{{list.total_price}}</span></div>
			</div>
			<div class="r w-5" style="width: 2rem;">
				<div class="bill" @click="check">提交订单</div>
			</div>
		</div>
		<div v-if="urlFo!=''" class="alipayRow">
			请复制链接到浏览器中打开
			<input type="text" v-model="urlFo" class="w80 plr_15 lh48 brde mt20">
			<!-- <button class="submitBtn2" @click="copy">复制链接</button> -->
		</div>
	</div>
</template>

<script>
	export default{
		name:"finalOrder",
		components:{},
		filters: {
		    money(value) {
		      	return '￥' + value.toFixed(2);
		    }
		},
		data(){
			return {
				list:null,
				payType:[
					{
						id:2,name:"微信",checked:true,img:require("@/assets/imgs/wx.png")
					},
					// {
					// 	id:1,name:"支付宝",checked:false,img:require("@/assets/imgs/pay1.png")
					// },
					{
						id:3,name:"流动资金支付",checked:false,img:require("@/assets/imgs/pay2.png")
					},
					{
						id:4,name:"货款支付",checked:false,img:require("@/assets/imgs/pay3.png")
					}
				],
				urlFo:''
			}
		},
		created(){
			/* 获取购物车列表 */
			if(this.$tool.getSession("shopCart_piece")&&this.$tool.getSession("finalOrderDate")||this.$tool.getSession("shopCart_box")&&this.$tool.getSession("finalOrderDate")){ //获取当前商品session
				this.list = JSON.parse(this.$tool.getSession("finalOrderDate"));
				if(this.list==null&&this.list.address_data==null){
					vis.$toast({
	                    duration: 0,       // 持续展示 toast
	                    forbidClick: true, // 禁用背景点击
	                    message: '没有地址信息，前往添加地址!'
	                });
					setTimeout(()=>{
						vis.$toast.clear();
						vis.$router.replace({name: "addressAlias",query:{finalOrder:1}});
					},2000)
				}
			}else{
				let vis=this;
				this.$toast({
		            duration: 0,       // 持续展示 toast
		            forbidClick: true, // 禁用背景点击
		            message: '没有订单信息，无法买单！'
		        });
				setTimeout(()=>{
					vis.$router.replace({name: "commodity"});
				},2000)
				return;
			}
		},
		methods:{
			copy(){
				let vis=this,save=null;
				save = function (e){
		　　　　　　e.clipboardData.setData('text/plain',vis.urlFo);//下面会说到clipboardData对象
		　　　　　　e.preventDefault();//阻止默认行为
		　　　　}
		　　　　document.addEventListener('copy',save);
		　　　　document.execCommand("copy");//使文档处于可编辑状态，否则无效
				this.$toast("复制成功")
			},
			choicePay(item){
				this.payType.forEach((item, index) => {
					item.checked=false;
				})
				item.checked=true;
			},
			check(){
				let goods_id="",number="",vis=this,pay_type=2;
				if(vis.list.address_data==null||!vis.list.address_data.address_id){
					vis.$toast("请添加地址信息!");
					return;
				}
				vis.payType.forEach((item,index) => {
					if(item.checked){
						pay_type=item.id;
					}
				});

				this.list.order_data.forEach((item,index) => {
					goods_id+=item.goods_id+",";
					number+=item.number+",";
				});

				goods_id=goods_id.substr(0,goods_id.length-1);
				number=number.substr(0,number.length-1);

				if(pay_type==1){
					// vis.$router.push({
					// 	path:"alipay",
					// 	query:{
					// 		goods_id: goods_id,
					// 		number :number,
					// 		address_id: vis.list.address_data.address_id,
					// 		type: vis.list.type,
					// 		token: localStorage.getItem('token')
					// 	}
					// })
					window.location.href="http://mjzj.maiguo01.com/h5/#/alipay?goods_id="+goods_id+"&number="+number+"&address_id="+vis.list.address_data.address_id+"&type="+vis.list.type+"&token="+localStorage.getItem('token');
					// let urlFo="http://mjzj.maiguo01.com/h5/#/alipay?goods_id="+goods_id+"&number="+number+"&address_id="+vis.list.address_data.address_id+"&type="+vis.list.type+"&token="+localStorage.getItem('token');
					// vis.urlFo=urlFo;
					return;
				};


				this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
				this.$http.post('/wxsite/goods/api',{
					api_name: "submitOrder",
		    		goods_id: goods_id,
		    		number: number,
		    		address_id: vis.list.address_data.address_id,
		    		type: vis.list.type,
		    		pay_type
				}).then(res => {
					let rd=res.data;

			    	if (res.code==1) {
			    		switch(pay_type){
			    			case 2:
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
							                    message: '提交成功,将前往我的订单查看!'
							                });
											setTimeout(()=>{
												vis.$toast.clear();
												vis.$router.replace({name: "order"});
											},2000)
										}else{
											vis.$toast({
							                    duration: 0,       // 持续展示 toast
							                    forbidClick: true, // 禁用背景点击
							                    message: '支付失败，可在我的订单继续支付!'
							                });
											setTimeout(()=>{
												vis.$toast.clear();
												vis.$router.replace({name: "order"});
											},2000);
										}
									}
								); 
								break;
			    			default:
			    				vis.$toast({
				                    duration: 0,       // 持续展示 toast
				                    forbidClick: true, // 禁用背景点击
				                    message: res.msg
				                });
								setTimeout(()=>{
									vis.$toast.clear();
									vis.$router.replace({name: "order"});
								},2000)
			    		}
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
	.finalOrder{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
	.item{
		background: url('~@/assets/imgs/address.png') no-repeat;
		background-size: .42rem;
		background-position: .3rem .4rem;
		background-color: #fff;
		position: relative;
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
		position:relative;
		.info{
			position: relative;
			height: 100%;
			.name{
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

		.cipherVal{
			display: inline-table;
			min-width: .6rem;
			white-space: nowrap;
			padding: 0 .1rem;
		}
	}
	.color_price{
		color: #f7ca49;
	}
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
	.selectAddress{
		background: url('~@/assets/imgs/right.png') no-repeat;
		background-size: .23rem;
    	background-position: right;
	}
	.icon{
		display: block;
		width: .29rem;
		height: .29rem;
		margin-right: .20rem;
    	background: url('~@/assets/imgs/circular1.png') no-repeat;
		background-size: 100%;
	}
	.active .icon{
		background: url('~@/assets/imgs/circular.png') no-repeat;
		background-size: 100%;
	}
	.alipayRow{
		position: fixed;
    z-index: 100;
    background-color: #fff;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    text-align: center;
    padding-top: 40%;
	}
</style>