<template>
	<div class="storeInformation oh">
		<div class="m12 ccb cgf relative p15 bz" style="height:2rem; ">
			<p class="ellipsis">店铺名称：{{rd.shop_name}}</p>
			<p class="ellipsis">店铺地址：{{rd.address}}</p>
			<p>距离：{{rd.distance}}m</p>
			<div class="cca2 center p10" style="position: absolute;right: .1rem;bottom: .1rem;" @click="navigation">
				<img src="@/assets/imgs/dh.png" class="mb10" style="width: .5rem;height: .46rem;">
				<span class="cg">导航</span>
			</div>
		</div>
		<div class="submitBtn2" @click="reservationService">预约服务</div>
	</div>
</template>

<script>
	export default{
		name:"storeInformation",
		components:{
		},
		data(){
			return {
				rd:{}
			}
		},
		created(){
			let vis=this;
			vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
		    vis.$http.post('/wxsite/shop/api',{
		    	api_name: "shop_detail",
		    	shop_id: vis.$route.query.shop_id
		    }).then(res => {
				vis.$toast.clear();
				if(res.code==1){
					vis.rd=res.data;
					vis.rd.shop_id=vis.$route.query.shop_id; 
					vis.rd.distance=vis.$route.query.distance;
					vis.rd.address=vis.$route.query.address; 
					vis.rd.lat=vis.$route.query.lat;     
					vis.rd.lng=vis.$route.query.lng;     
					vis.rd.name=vis.$route.query.name; 
				}else{
					vis.$toast(res.msg);
				}
			})
		},
		methods:{
			navigation(){
	            let vis=this;
	            wx.openLocation({
	                latitude: vis.rd.lat*1, // 纬度，浮点数，范围为90 ~ -90
	                longitude: vis.rd.lng*1, // 经度，浮点数，范围为180 ~ -180。
	                name: vis.rd.name, // 位置名
	                address: vis.rd.address, // 地址详情说明
	                scale: 14// 地图缩放级别,整形值,范围从1~28。默认为最大
	            });
	        },
	        reservationService(){
	        	this.$router.push({path:'reservationService'  , query :{shop_id:this.rd.shop_id, start_time: this.rd.start_time,end_time: this.rd.end_time}})
	        }
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.storeInformation{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
</style>