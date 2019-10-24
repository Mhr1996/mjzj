<template>
	<div class="discountPackage">
		<div class="banner" style="height:3.69rem;">
			<van-swipe :autoplay="3000" style="height:100%;">
			  	<van-swipe-item v-for="(item, index) in images" :key="index" >
			    	<img v-lazy="item.image" />
			  	</van-swipe-item>
			</van-swipe>
		</div>
		<div class="mt20 ml15 mb15">请选充值卡类型</div>
		<div class="flex ac jc mb10 mlr_10 br ptb_10" style="border: solid 4px #4aa59a;" :class="{'active': item.checked}" v-for="(item,index) of calculateList" @click="selectProduct(item)">
			<img src="@/assets/imgs/circular1.png" alt="" class="plr_10 off" style="width:.21rem;height:.21rem;">
			<img src="@/assets/imgs/circular.png" alt="" class="plr_10 on" style="width:.21rem;height:.21rem;">
			<div>
				<div class="mb5 c9 fc w14" v-show="item.card_id==1">
					<img src="@/assets/imgs/bjk.png" class="mr5 img_card">{{item.card_name}}
				</div>
				<div class="mb5 c9 fc w14 jin_color" v-show="item.card_id==2">
					<img src="@/assets/imgs/j.png" class="mr5 img_card">{{item.card_name}}
				</div>
				<div class="mb5 c9 fc w14 zuan_color" v-show="item.card_id==3">
					<img src="@/assets/imgs/z.png" class="mr5 img_card">{{item.card_name}}
				</div>
				<span class="c9" :class="{'zuan_color':item.card_id==3,'jin_color':item.card_id==2}">￥{{item.money}}</span>
			</div>
			<div class="flex1 flex ac jc semicircle ml5">
				<div class="num cg">共{{item.use_num}}次</div>
				<ul class="activity cca2 cebter">
					<li v-for="(item2,index) of item.class" :key="index" class="ellipsis mauto mtb_5">{{item2.class_number}}次{{item2.class_name}}</li>
				</ul>
				<img src="@/assets/imgs/card5.png" alt="" style="width: 1.1rem;">
			</div>
		</div>
		<div class="submitBtn2" @click="onBridgeReady">确定</div>
		<div class="fc" style="position:fixed;top: 0;left: 0;width: 100%;background-color: #fff;  flex-direction: column;height: 100%;" v-show="success">
			<img src="@/assets/imgs/success.png" style="width: 1.6rem;height: 1.69rem;margin-top: 2rem;" />
			<p class="mt30">提交成功</p>
			<p class="c6 fz13" style="margin-top: 1.74rem;">恭喜您成功提交，请联系店主办理！</p>
		</div>
	</div>
</template>

<script>
	export default{
		name:"discountPackage",
		components:{
		},
		data(){
			return {
				success:false,
				images: [],
				calculateList:[]
			}
		},
		created(){
			let vis=this;
			vis.getrecharge();

			vis.$http.post('/wxsite/Userspace/api',{
		    	api_name: "getBanneList",
		    	type: 3
		    }).then(res => {
				vis.$toast.clear();
				let rd=res.data;
				
				if(res.code==1){
					vis.images=rd;
				}else{
					vis.$toast(res.msg);
				}
			})
		},
		methods:{
			onBridgeReady(){
				let vis=this ,card_id="";
				this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});

				this.calculateList.forEach((item, index) => {
					if(item.checked==true){
						this.$set(item, 'checked', true);
						card_id=item.card_id;
					}
				})
				
			    this.$http.post('/wxsite/Userspace/api',{
			    	api_name:"orderLevelCard",
			    	card_id:card_id
			    }).then(res => {
					let rd=res.data;
			    	if (res.code==1) {
						vis.$toast.clear();
						vis.$router.push({path:'success'})
			    	}else{
			        	this.$toast(res.msg);
			    	}
				})
			},
			getrecharge(){
				this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
			    this.$http.post('/wxsite/Userspace/api',{
			    	api_name: "levelCardList"
			    }).then(res => {
					this.$toast.clear();
					let rd=res.data;
					if(res.code==1){
						this.calculateList=rd.level_card;
						this.calculateList.forEach((item, index) => {
							if(typeof item.checked == 'undefined') {
								this.$set(item, 'checked', false);
							}
							if(index==0){
								this.$set(item, 'checked', true);
							}
						})
					}else{
						this.$toast(res.msg);
					}
				})
			},
			selectProduct(item) {
				this.calculateList.forEach((item, index) => {
					item.checked=false;
				})
				item.checked=true;
			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.discountPackage{
		min-height: 100vh;
		/*background-color: #f9f9f9;*/
	}
	.cardInfo{
		background: url('~@/assets/imgs/card4.png') no-repeat;
		background-size: .15rem;
		background-position: left center;
    	height: 100%;
	}
	.infoCard{
		
	}
	.activity{
		li{
			padding-left: .2rem;
			background: url('~@/assets/imgs/card6.png') no-repeat;
			background-size: .09rem;
    		background-position: center left;
    		width: 2.3rem;
		}
	}
	.icon{
		width: .29rem;
		height: .29rem;
		left:.1rem;
		top: .58rem;
		background: url('~@/assets/imgs/circular1.png') no-repeat;
		background-size: 100%;
	}
	.active .icon{
		background: url('~@/assets/imgs/circular.png') no-repeat;
		background-size: 100%;
	}
	.jin_color{
		color: #ffb03e;
	}
	.zuan_color{
		color: #000;
	}
	.w15_h8{
		width: 2.15rem;height: .8rem;
	}
	.img_card{
		width: .43rem;height: .31rem;
		width: .43rem;height: .31rem;
		width: .43rem;height: .31rem;
	}
	.serviceNum{
		position: absolute;
	    left: 0;
	    top: 32px;
	    width: 1.4rem;
	    text-align: center;
	}
	.num{
		width: 1.1rem;
	    text-align: center;
	    padding-left: .1rem;
	}
	.w14{
		width: 1.4rem;
	}
	.semicircle{
		background: url('~@/assets/imgs/card4.png') repeat-y;
		background-size: .12rem;
	}
	.on{
		display:none;
	}
	.active{
		.off{
			display:none;
		}
		.on{
			display:block;
		}
	}
</style>