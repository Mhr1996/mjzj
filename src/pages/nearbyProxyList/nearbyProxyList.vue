<template>
	<div class="nearbyProxyList pt10 bz">
		<van-list
			  v-model="loading"
			  :finished="finished"
			  finished-text="没有更多了"
			  :offset="100"
			  @load="getList"
			>
			<div class="cgf br p12 mb10 mlr_15 totems cgf" v-for="(item,index) of orderList" :key="index" @click="go(item)">
				<div class="h100 cca2" style="height: 1.1rem;">
					<span>代理名称:{{item.name}}</span>
					<div class="c9 csb"><span>距离你：{{item.distance}}m</span><div>代理手机号：<span class="cg">{{item.mobile}}</span></div></div>
				</div>
			</div>
		</van-list>
	</div>
</template>

<script>
	export default{
		name:"nearbyProxyList",
		components:{
		},
		data(){
			return {
				lat:'',
				lng:'',
				finished : false,
				loading  : false,
				orderList: [],
				page     : 1,
				pagesize : 10
			}
		},
		created(){
			this.lat=this.$route.query.lat;
			this.lng=this.$route.query.lng;
		},
		methods:{
			getList(){
				let vis=this,hd=null;
				vis.$http.post("/wxsite/agent/api",{
					api_name:"near_agent",
					lat:vis.lat,
                	lng:vis.lng,
                	page:vis.page
				}).then(res => {
					if (res.code == 1) {
						let rd=res.data;
						let center = new qq.maps.LatLng(vis.lat,vis.lng);
						for(let i=0;i<rd.length;i++){
							if(rd[i].lat!=""&&rd[i].lng!=""){
								let marker_loc = new qq.maps.LatLng(rd[i].lat,rd[i].lng);
	                        	rd[i].distance=Math.floor(qq.maps.geometry.spherical.computeDistanceBetween(center, marker_loc));
							}
	                    }
						vis.orderList=[...vis.orderList,...rd];
						if (rd.length<10) {
							vis.finished = true
						}
						vis.page++;
					}else{
						vis.$toast(res.msg);
						vis.finished = true;
					}
					vis.loading = false;
				})
			},
			go(item){
				this.$router.push({
					path:'registerAgent',
					query:{
						agent_id:item.agent_id,
						mobile:item.mobile
					}
				})
			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.nearbyProxyList{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
	.totems{
		position:relative;
		&:after{
			position:absolute;
			content:'';
			width:.05rem;
			height: .24rem;
			background-color: #4ba59b;
			left: 0;
			top: .4rem;
		}
	}
</style>