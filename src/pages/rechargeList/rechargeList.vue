<template>
	<div class="rechargeList">
		<van-list
			  v-model="loading"
			  :finished="finished"
			  finished-text="没有更多了"
			  :offset="100"
			  @load="getList"
			>
			<div class="mtb_10" v-for="(item,index) of orderList" :key="index">
				<div class="flex-c mlr_12 b-r infoCard"  style="height: 1.5rem;border: solid 2px #4aa59a; margin-bottom:.02rem;border-bottom-right-radius: 0; border-bottom-left-radius: 0;">
					<div class="cca w15_h8">
						<div class="mb5 c9 fc" v-show="item.card_id==1">
							<img src="@/assets/imgs/bjk.png" style="width: .43rem;height: .31rem;" class="mr5">{{item.card_name}}
						</div>
						<div class="mb5 c9 fc jin_color" v-show="item.card_id==2">
							<img src="@/assets/imgs/j.png" style="width: .43rem;height: .31rem;" class="mr5">{{item.card_name}}
						</div>
						<div class="mb5 c9 fc zuan_color" v-show="item.card_id==3">
							<img src="@/assets/imgs/z.png" style="width: .43rem;height: .31rem;" class="mr5">{{item.card_name}}
						</div>
						<span class="c9" :class="{'zuan_color':item.card_id==3,'jin_color':item.card_id==2}">￥{{item.card_money}}</span>
					</div>
					<div class="flex1 cardInfo bz" style="padding-left: .75rem;padding-top: .40rem;">
						<ul class="activity cca2" style="height:.8rem;">
							<li v-for="(item2,index) of item.class_data" :key="index" v-if="index<2">{{item2.class_name}}</li>
						</ul>
					</div>
				</div>
				<div class="csb mlr_12 b-r cf plr_15 ptb_10" style="background-color:#4aa59a;border-top-right-radius: 0; border-top-left-radius: 0;">
					<div>{{item.ctime}}</div>
					<div>{{item.status==1 ? '待审核' : item.status==2 ? '已通过' : item.status==3 ? '未通过' : '待审核'}}</div>
				</div>
			</div>
		</van-list>
	</div>
</template>

<script>
	export default{
		name:"rechargeList",
		components:{
		},
		data(){
			return {
				finished : false,
				loading  : false,
				orderList: [],
				page     : 1,
				pagesize : 10
			}
		},
		created(){
			
		},
		methods:{
			getList(){
				let vis=this,hd=null;
				vis.$http.post("/wxsite/Userspace/api",{
					api_name:"orderLevelCardList"
					,page:vis.page
					,pagesize:vis.pagesize
				}).then(res => {
					if (res.code == 1) {
						vis.orderList=[...vis.orderList,...res.data];
						if (res.data.length<10) {
							vis.finished = true
						}
						vis.page++;
					}else{
						vis.$toast(res.msg);
					}
					vis.loading = false;
				})
			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.rechargeList{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
	.cardInfo{
		background: url('~@/assets/imgs/card4.png') no-repeat;
		background-size: .15rem;
		background-position: left center;
    	height: 100%;
	}
	.infoCard{
		background: url('~@/assets/imgs/card5.png') no-repeat;
		background-size: .7rem;
    	background-position: right .2rem top .1rem;
	}
	.activity{
		li{
			padding-left: .2rem;
			background: url('~@/assets/imgs/card6.png') no-repeat;
			background-size: .09rem;
    		background-position: center left;
		}
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
</style>