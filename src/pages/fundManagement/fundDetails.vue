<template>
	<div class="fundDetails pt10">
		<van-list
			  v-model="loading"
			  :finished="finished"
			  finished-text="没有更多了"
			  :offset="100"
			  @load="getList"
			>
			<div class="cgf br p12 mb10 mlr_15 totems" v-for="(item,index) of orderList" :key="index">
				<div class="csb" style="    height: .8rem;">
					<div class="cca2 h100">
						<span>{{
						item.type==1?'(提现(申请中))':
						item.type==2?'(提现(已完成))':
						item.type==3?'(提现(驳回))':
						item.type==4?'推荐人收益':
						item.type==5?'开机分成':''}}</span>
						<span class="c9">{{item.createat}}</span>
					</div>
					<span class="cca" :class="{ co:item.type==1,cg:item.type==3||item.type==4||item.type==5}">{{item.money}}元</span>
				</div>
			</div>
		</van-list>
		
		<!-- <div class="cgf br p12 mb10 mlr_15 totems">
			<div class="mb20 csb">
				<span>体现(已完成)</span>
			</div>
			<div class="csb">
				<span class="c9">2019-7-26 14:39:52</span><span class="co">200元</span>
			</div>
		</div>
		<div class="cgf br p12 mb10 mlr_15 totems">
			<div class="mb20 csb">
				<span>体现(已完成)</span>
			</div>
			<div class="csb">
				<span class="c9">2019-7-26 14:39:52</span><span class="co">200元</span>
			</div>
		</div> -->
	</div>
</template>

<script>
	export default{
		name:"fundDetails",
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
				vis.$http.post("/wxsite/myspace/api",{
					api_name: "moneyList"
					,page: vis.page
					,pagesize: vis.pagesize
				}).then(res => {
					if (res.code == 1) {
						let rd=res.data;
						for(let i=0;i<rd.length;i++){
							rd[i].createat=vis.$tool.handleDate(Number(rd[i].ctime*1000),'ss');
						}
						vis.orderList=[...vis.orderList,...rd];
						if (rd.length<10) {
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
	.fundDetails{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
	.totems{
		position:relative;
		&:after{
			position:absolute;
			content:'';
			width:.04rem;
			height: .24rem;
			background-color: #ff836e;
			left: 0;
			top: .3rem;
		}
	}
	.cg{
		color:#48c06f;
	}
</style>