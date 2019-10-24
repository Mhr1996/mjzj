<template>
	<div class="commodityDetails">
		<div class="cgf mb10">
			<img :src="commodity.img" style="height:3rem;width:100%;">
			<div class="p10">
				<p class="mb10">{{commodity.title}}</p>
				<div class="csb">
					<div>单件：<span  style="color: #f2ab3b;">￥{{commodity.agent_price!=0?commodity.agent_price:commodity.member_price}}</span></div>
					<div>整箱：<span  style="color: #f2ab3b;">￥{{commodity.agent_price!=0?commodity.agent_box_price:commodity.member_box_price}}</span></div>
				</div>
			</div>
		</div>
		<div class="cgf">
			<ul class="fsa">
				<li @click="switchBox=true" :class="{active:switchBox}" class="w50 h100 p10 center bz">商品详情</li>
				<li @click="switchBox=false" :class="{active:!switchBox}" class="w50 h100 p10 center bz">常见问题</li>
			</ul>
			<div class="details bz" style="padding: .24rem;padding-bottom: 0.88rem;" v-html="commodity.content" v-show="switchBox"></div>
			<div class="details bz" style="padding: .24rem;padding-bottom: 0.88rem;" v-html="commodity.issue" v-show="!switchBox"></div>
		</div>
		<div class="bottom w100 cgf csb" style="position:fixed;bottom: 0;left: 0;height: .88rem;">
			<div class="flex-c" style="width: 2rem;">
				<div class="cca fz12 c9" @click="collect">
					<img src="@/assets/imgs/start.png" style="width: .36rem;height: .36rem;margin-bottom: .06rem" v-show="commodity.status==1">
					<img src="@/assets/imgs/start2.png" style="width: .36rem;height: .36rem;margin-bottom: .06rem" v-show="commodity.status==0">
					收藏
				</div>
				<router-link to="shoppingCar" class="cca fz12 c9" style="margin-left: .4rem;" tag="div">
					<img src="@/assets/imgs/shopping.png" style="width: .41rem;height: .37rem;margin-bottom: .06rem">
					购物车
				</router-link>
			</div>
			<div class="h100 cf fz15 center" style="width: 2.38rem;background-color: #4aa59a;line-height: .88rem; " @click="showPopup">加入购物车</div>
		</div>
		<van-popup 
			v-model="boxshow"
		  	position="bottom"
		  	class="relation p15 bz cca2" style="height: 3rem;padding-bottom: 1.1rem;">
		  	<div class="csb">
		  		<div>单件购买</div>
		  		<div class="csb" style="width:2rem;">
		  			<div class="cut" @click="changeNumber(true, -1)"></div>
					<div class="cipherVal">{{plan1_num}}</div>
					<div class="add" @click="changeNumber(true, 1)"></div>
		  		</div>
		  	</div>
		  	<div class="csb">
		  		<div>整箱购买</div>
		  		<div class="csb" style="width:2rem;">
		  			<span class="cut" @click="changeNumber(false, -1)"></span>
					<span class="cipherVal">{{plan2_num}}</span>
					<span class="add" @click="changeNumber(false, 1)"></span>
		  		</div>
		  	</div>
		  	<div class="w100 h40 lh40 cf center fz18 pb" style="background-color:#4aa59a;" @click="addCarParent">确定</div>
		</van-popup>
	</div>
</template>

<script>
	export default{
		name:"commodityDetails",
		components:{
		},
		data(){
			return {
				commodity:[],
				switchBox:true,
				boxshow: false,
				plan1_num:0,
				plan2_num:0
			}
		},
		created(){
			let vis = this;
			this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
		    this.$http.post('/wxsite/goods/api',{
		    	api_name: "getGoodsDetails",
		    	goods_id: vis.$route.query.goods_id
		    }).then(res => {
				vis.$toast.clear();

				if(res.code==1){
					let rd=res.data;
					vis.commodity=rd;
					setTimeout(()=>{
						var obj = document.getElementsByClassName('details');
						for(let d = 0; d < obj.length; d++){
							let imgs = obj[d].getElementsByTagName('img');
		                    for (let i = 0; i < imgs.length; i++) {
		                    	console.log("进入")
		                    	console.log(imgs[i])
		                        imgs[i].style.maxWidth = '100%';
		                    }
						}
					},300);
				}else{
					this.$toast(res.msg);
				}
			})
		},
		methods:{
		    showPopup() {
		      this.boxshow = true;
		    },
			/*
				购物车添加
			*/
			addCarParent(value){

				let tl_=this.$tool 
				,total=[] 
				,identical=true //购物车是否有当前商品
				,mc=this.commodity
				,planName=''
				,vis=this
				,initJson=(data,value)=>{
					let priceJ= vis.plan2_num==0 && data.agent_price != 0 ? data.agent_price :
								vis.plan2_num==0 && data.agent_price == 0 ? data.member_price :
								vis.plan1_num==0 && data.agent_price != 0 ? data.agent_box_price :
								vis.plan1_num==0 && data.agent_price == 0 ? data.member_box_price : '';
					return {
						image: data.img,
						name: data.title,
						num: value,
						price: priceJ,
						agent_price: data.agent_price,
						pack_stock:data.member_box_price,
						agent_pack:data.agent_box_price,
						id: data.goods_id,
						stock: data.stock //库存
					}
				};
				if(vis.plan1_num==0&&vis.plan2_num==0){
					vis.$toast("请选择购买数量!");
					return;
				}

				if(vis.plan1_num>0){
					planName="shopCart_piece";
				}else{
					planName="shopCart_box";
				}

				if(tl_.getSession(planName)){
					total=JSON.parse(tl_.getSession(planName));
					
					for(let i=total.length;i--;){
						if(total[i].id==mc.goods_id){//购物车已经有当前商品
							total[i]=initJson(mc,(planName=="shopCart_piece"?vis.plan1_num:vis.plan2_num)+total[i].num);
							identical=false;
						}
					}

					if(identical){//购物车没有当前商品 新增
						total[total.length]=initJson(mc,(planName=="shopCart_piece"?vis.plan1_num:vis.plan2_num));
					}

					tl_.setSession(planName,total);
				}else{
					total[0]=initJson(mc,(planName=="shopCart_piece"?vis.plan1_num:vis.plan2_num));
					tl_.setSession(planName,total);
				}
				vis.boxshow=false;
				vis.plan1_num=0;
				vis.plan2_num=0;
				this.$toast("添加成功");
			},
			collect(){
				let vis = this ,api_name="doSetFavor";
				this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
				if(vis.commodity.status==1){api_name="doCancelFavor"};
			    this.$http.post('/wxsite/goods/api',{
			    	api_name: api_name,
			    	goods_id: vis.$route.query.goods_id
			    }).then(res => {
					vis.$toast.clear();
					if(res.code==1){
						if(api_name=="doSetFavor"){
							vis.$toast("收藏成功");
							vis.commodity.status=1;
						}else{
							vis.$toast("已取消收藏");
							vis.commodity.status=0;
						}
					}else{
						this.$toast(res.msg);
					}
				})
			},
			changeNumber(type,handel){
				let vis=this;
				if(type){
					if(vis.commodity.stock==0){
						vis.$toast("没有库存了!");
							return;
					}

					vis.plan2_num=0;
					if(handel>0){
						if(vis.plan1_num>=vis.commodity.stock){
							vis.$toast("没有那么多库存了!");
							return;
						}
						vis.plan1_num++;
					}else{
						if(vis.plan1_num<=1){
							vis.$toast("数量不能少于1");
							vis.plan1_num=1;
							return;
						}
						vis.plan1_num--;
					}
				}else{
					if(vis.commodity.pack_stock==0){
						vis.$toast("没有库存了!");
							return;
					}

					vis.plan1_num=0;
					if(handel>0){
						if(vis.plan2_num>=vis.commodity.pack_stock){
							vis.$toast("没有那么多库存了!");
							return;
						}
						vis.plan2_num++;
					}else{
						if(vis.plan2_num<=1){
							vis.$toast("数量不能少于1");
							vis.plan2_num=1;
							return;
						}
						vis.plan2_num--;
					}
				}
			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.commodityDetails{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
	li.active{
		color: #1d9889;
	}
	.details{
		img{
			max-width:100%;
		}
	}
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
</style>