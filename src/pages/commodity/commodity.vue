<template>
	<div class="commodity">
		<div class="search">
			<input type="text" placeholder="输入要查找的商品" name="" class="mauto db" @focus="getFocus" v-model="searchText">
		</div>
		<div style="width: 100%;height: 100%;position: fixed;z-index: 10;top: 0;left: 0;" class="cgf" v-show="searchText!=''||searchDiv">
			<div class="search relative csb">
				<input type="text" placeholder="输入要查找的商品" name="" class="mauto db" @focus="getFocus" v-model="searchText" style="width: 6.5rem;" v-show="searchText!=''||searchDiv">
				<img src="@/assets/imgs/search.png" style="position: absolute; top: 0.2rem; right: 0.9rem; z-index: 10; width: 0.7rem; padding: 0.1rem 0.2rem 0.1rem 0.1rem; box-sizing: border-box;" @click="searchVal"/>
				<span style="padding: 10px 5px; margin-right: .04rem; color: #fff;" @click="getBlur">取消</span>
			</div>
			<div class="mb20" v-for="(item, index) in typeList" :key="index" v-show="searchList.length==0">
				<div class="mtb_15 ml15">种类:{{item.type_name}}</div>
				<div v-show="item.typelist.length>0">
					<ul class="wrap w100 fsa plr_20 bz">
						<li class="p5_15 br cgg db mb10" v-for="(item, index) in item.typelist" :key="index">{{item.type_name}}</li>
					</ul>
				</div>
			</div>
			<div class="plr_10 fsb wrap pt10 bz" style="overflow-y: auto; height: 100vh;">
				<router-link class="mb20 w3_4h55" v-show="searchList.length>0" :to="{path:'commodityDetails' , query:{goods_id:item.goods_id}}" v-for="(item, index) of searchList" :key="index" tag="div">
					<img :src="item.img" style="width:3.4rem; height:3.4rem;">
					<div class="cgg2 p10">
						<p class="mb5 ellipsis">{{item.title}} </p>
						<p class="co fz12 mb10">￥{{item.member_price}}</p>
						<p class="fz12 mb3" v-if="item.agent_price!=0">代理价: <span class="c9">￥{{item.agent_price}}</span></p>
					</div>
				</router-link>
			</div>
		</div>
		<div class="banner" style="height:3rem;">
			<van-swipe :autoplay="3000" style="height:100%;">
			  	<van-swipe-item v-for="(item, index) in images" :key="index" >
			    	<img v-lazy="item.image" class="w100 h100" />
			    	<!-- <img src="@/assets/imgs/banner.jpg"  class="w100 db h100" /> -->
			  	</van-swipe-item>
			</van-swipe>
		</div>
		<div>
			<h1 class="center lh48 fz16"><img src="@/assets/imgs/exe-hot.png" class="mr10" style="width:.26rem;" alt="">产品推荐</h1>
			<div class="plr_10 csb wrap">
				<router-link class="b-r o-f mb10 w3_4h55" v-for="(item, index) in list" :key="index" :to="{path:'commodityDetails' , query:{goods_id:item.goods_id}}">
					<img :src="item.img" style="width:3.4rem; height:3.4rem;">
					<div class="cgg2 p10">
						<p class="mb5 ellipsis">{{item.title}} </p>
						<p class="co fz12 mb10">￥{{item.member_price}}</p>
						<p class="fz12 mb3" v-if="item.agent_price!=0">代理价: <span class="c9">￥{{item.agent_price}}</span></p>
						<p class="fz12 mb3">整箱: <span class="c9">￥{{item.member_box_price}}</span></p>
						<p class="fz12 mb3" v-if="item.agent_price!=0">整箱代理价: <span class="c9">￥{{item.agent_box_price}}</span></p>
					</div>
				</router-link>
			</div>
		</div>
		<div>
			<h1 class="center lh48 fz16 mb10"><img src="@/assets/imgs/eye.png" class="mr10" style="width:.31rem;" alt="">商品浏览</h1>
			<van-list
			  v-model="loading"
			  :finished="finished"
			  finished-text="没有更多了"
			  :offset="100"
			  @load="getListAllList"
			>
				<div class="plr_10 csb wrap">
					<router-link tag="div" v-for="(item,index) of allList" class="w3_4h55" :key="index" :to="{path:'commodityDetails' , query:{goods_id:item.goods_id}}">
							<img :src="item.img" style="width:3.4rem; height:3.4rem;">
						<div class="cgg2 p10">
							<p class="mb5 ellipsis">{{item.title}} </p>
							<p class="co fz12 mb10">￥{{item.member_price}}</p>
							<p class="fz12 mb3" v-if="item.agent_price!=0">代理价: <span class="c9">￥{{item.agent_price}}</span></p>
						</div>
					</router-link>
				</div>
			</van-list>
		</div>
		<router-link to="shoppingCar" style="display: block; width: 1.14rem; height: 1.14rem; position: fixed; bottom: .6rem; right: .3rem;">
			<img src="@/assets/imgs/shoppingCar.png" style="width: 1.14rem;">
		</router-link>
		<van-popup v-model="tipOff">
			<div class="cgf plr_15 tipRow br">
				<div class="lh50 center title bbeb mb10">您有尚未完成的订单<img src="@/assets/imgs/close.png" alt="" @click="tipOff=false" class="p10 absolute"></div>
				<div style="overflow-y: auto;height: 4.8rem;">
					<div class="csb mb10" v-for="(item,index) of unList.order_goods" :key="index">
						<img :src="item.img" alt="" style="width:1rem;height:1rem;" class="br5 mr10">
						<div class="cca2 flex1"  style="width:1rem;height:1rem;">
							<div>{{item.title}}</div>
							<div class="cy">￥{{item.price}}</div>	
						</div>
					</div>
				</div>
				<div class="w100 center lh40 h40 mb10" @click="go()">去查看</div>
			</div>
		</van-popup>
		
	</div>
</template>

<script>
	export default{
		name:"commodity",
		components:{
		},
		data(){
			return {
				finished : false,
				loading  : false,
				page     : 1,
				pagesize : 10,
				commodity: {},
				list:[],
				allList:[],
				typeList:[],
				searchList:[],
				unList:[],
				searchText:"",
				searchDiv: false,
				show: false,
				images: [],
				tipOff:false
			}
		},
		created(){
			let vis=this;
			this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
		    this.$http.post('/wxsite/Goods/api',{
		    	api_name: "goodsList",
		    	is_putaway:1,
		    	page:1,
		    	pagesize:10
		    }).then(res => {
				let rd=res.data;
				vis.$toast.clear();

				if(res.code==1){
					vis.list=rd;
				}else{
					this.$toast(res.msg);
				}
			})

			this.$http.post('/wxsite/Goods/api',{
		    	api_name: "unfinishedOrder",
		    }).then(res => {
				let rd=res.data;

				if(res.code==1){
					vis.unList=rd;
					this.tipOff=true;
				}else{
					this.tipOff=false;
				}
			})

			this.$http.post('/wxsite/Userspace/api',{
		    	api_name: "getBanneList",
		    	type: 2
		    }).then(res => {
				let rd=res.data;
				
				if(res.code==1){
					vis.images=rd;
				}else{
					this.$toast(res.msg);
				}
			})
		},
		methods:{
			closeSearchRow(){
				this.searchText="";
				this.searchDiv =false;
				this.searchList.length=0;
			},
			getFocus(){
				this.searchDiv=true;
				console.log("获取焦点")
			},
			getBlur(){
				this.closeSearchRow();
				console.log("失去焦点")
			},
			searchVal(){
				let vis = this;

				if(vis.searchText==""){
					vis.$toast("请输入要查找的商品!");
					return;
				}
				this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
				this.$http.post('/wxsite/goods/api',{
			    	api_name: "searchGoods",
			    	title: vis.searchText
			    }).then(res => {
					this.$toast.clear();

					if(res.code==1){
						let rd=res.data;
						vis.searchList=rd;
					}else{
						this.$toast(res.msg);
					}
				})
			},
			getListAllList(){
				let vis=this;
				this.$http.post('/wxsite/Goods/api',{
			    	api_name: "goodsList",
			    }).then(res => {
					let rd=res.data;

					if(res.code==1){
						vis.allList=[...vis.allList,...rd];
						if (rd.length<10) {
							vis.finished = true
						}
						vis.page++;
					}else{
						this.$toast(res.msg);
					}
					vis.loading = false;
				})
			},
			go(){
				this.$router.push({path:'orderStatu',query:{id:this.unList.id}})
			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.commodity{
		min-height: 100vh;
		/*background-color: #f9f9f9;*/
	}
	.search{
		height:1rem;
		@include box-siz();
		padding: .2rem 0;
		background: -webkit-linear-gradient(left,#4aa59a,#63d7c8); /* Safari 5.1-6.0 */
	    background: -o-linear-gradient(left,#4aa59a,#63d7c8); /* Opera 11.1-12.0 */ 
	    background: -moz-linear-gradient(left,#4aa59a,#63d7c8); /* Firefox 3.6-15 */
	    background: linear-gradient(left,#4aa59a,#63d7c8); /* 标准语法 */
		input{
			width: 90%;
			background-color: #fff;
			height: .6rem;
			padding-left: .3rem;
			@include box-siz();
			@include border-radius(20px);
			line-height: .6rem;
		}
	}
	.w3_4h55{
		width:3.4rem;
		height: 5.45rem;
	}
	.tipRow{
		width:5.6rem;
		height: 7.1rem;
		.title img{
			width:.4rem;height:.4rem;
			right: 0;
			top: 0;
			z-index: 10;
		}
	}
	.lh40.h40{
		@include border-radius(.8rem);
		border:.02rem solid #4aa59a; color:#4aa59a;
	}
</style>