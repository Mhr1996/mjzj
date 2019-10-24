<template>
	<div class="choice">
		<div class="banner" style="height:3.69rem;">
			<van-swipe :autoplay="3000" style="height:100%;" :show-indicators="false">
			  	<van-swipe-item v-for="(item, index) in images" :key="index" >
			    	<img v-lazy="item.image" class="w100 h100" />
			    	<div class="devid">设备编号:{{macno}}</div>
			  	</van-swipe-item>
			</van-swipe>
		</div>
		<div class="flex cgf p3_6 lh80 mb10">
			<div class="mr10">请选择美容师</div>
			<select class="flex1 center brde br mt8 pl10 bz c6" v-model="selectBid" style="height: .5rem;line-height: .5rem;border-radius: .10rem;
      -ms-border-radius: .10rem; -moz-border-radius: .10rem; -webkit-border-radius: .10rem; border-color:#a4d2c8;">
				<option v-for="(item,index) in beautician" :value="item.beautician_id" :key="index">{{item.user_name}}</option>
			</select>
		</div>
		<div style="" class="selectTime">请选择时间</div>
		<div class="relative">
			<img src="@/assets/imgs/time2.png" style="width: 6.72rem; display: block; margin: 0 auto;">
			<div class="optionTime">
				<div class="timeBlock" :class="{'active': item.checked}" @click="selectProduct(item)" v-for="(item,index) of timeList">{{item.min}}min</div>
			</div>
			<!-- <div class="timeBlock" :class="{'active': item.checked}"  style="left:.45rem;">{{timeList[0].time}}min</div>
			<div class="timeBlock" style="left:2.75rem;">{{timeList[1].time}}min</div>
			<div class="timeBlock" style="left:5rem;">{{timeList[2].time}}min</div> -->
		</div>
		<div class="submitBtn2" style="margin-top: 2rem;" @click="submit">确定</div>
	</div>
</template>

<script>
	export default{
		name:"choice",
		components:{
		},
		data(){
			return {
				selectBid:'',
				timeList:[],
				macno:"",
				images: [],
				beautician:[]
			}
		},
		created(){
			let vis=this;
			this.$http.post('/Wxsite/Site/api',{
		    	api_name: "orderIng",
		    	macno:vis.$route.query.macno
		    }).then(res => {
				let rd=res.data;
				
				if(res.code==1){
					vis.$toast({
			            duration: 0,       // 持续展示 toast
			            forbidClick: true, // 禁用背景点击
			            message: '已存在使用中的订单，即将跳转!'
			        });
			        setTimeout(()=>{
			        	vis.$toast.clear();
			        	vis.$router.push({ path: "onState",query:{order_no:rd.order_no,time:rd.long_time}});
			        },3000)
				}else{
					vis.$http.post('/Wxsite/Site/api',{
				    	api_name: "deviceCalculate",
				    	manco:vis.$route.query.macno
				    }).then(res => {
						let rd=res.data;
						
						if(res.code==1){
							vis.getBeautician();
							vis.macno=rd.manco;
							vis.timeList=rd.item;

							vis.timeList.forEach((item, index) => {
								if(typeof item.checked == 'undefined') {
									vis.$set(item, 'checked', false);
								}
								if(index==0){
									vis.$set(item, 'checked', true);
								}
							})
							console.log(vis.timeList)
						}else{
							vis.$toast({
					            duration: 0,       // 持续展示 toast
					            forbidClick: true, // 禁用背景点击
					            message: res.msg
					        });
							setTimeout(()=>{
								vis.$toast.clear();
								vis.$router.push({
									path: 'nearby'
								})
							},3000)
						}
					})

				    vis.$http.post('/wxsite/Userspace/api',{
				    	api_name: "getBanneList",
				    	type: 1
				    }).then(res => {
						let rd=res.data;
						
						if(res.code==1){
							vis.images=rd;
						}else{
							vis.$toast(res.msg);
						}
					})
				}

			})
			
		},
		methods:{
			getBeautician(){
				let vis=this;
				this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
			    this.$http.post('/Wxsite/Site/api',{
			    	api_name: "beautician",
			    	manco:vis.$route.query.macno
			    }).then(res => {
					vis.$toast.clear();
					let rd=res.data;
					
					if(res.code==1){
						vis.beautician=rd;
						vis.selectBid=rd[0].beautician_id;
					}else{
						vis.$toast(res.msg);
					}
				})
			},
			selectProduct(item) {
				this.timeList.forEach((item, index) => {
					item.checked=false;
				})
				item.checked=true;
			},
			submit(){
				let vis=this,si=null;

				this.timeList.forEach((item, index) => {
					if(item.checked==true){
						this.$set(item, 'checked', true);
						si=item;
					}
				})
				
				this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
			    this.$http.post('/Wxsite/Site/api',{
			    	api_name: "confirm",
			    	beautician_id:vis.selectBid,
			    	device_set_id:si.device_set_id,
			    	macno: vis.$route.query.macno
			    }).then(res => {
					this.$toast.clear();
					let rd=res.data;
					
					if(res.code==1){
						console.log("come on")
						vis.$router.push({ path: "confirmOrder",query:{
							macno: vis.$route.query.macno,
							device_set_id: si.device_set_id,
							beautician_id: vis.selectBid,
							time: rd.min,
							charge: rd.money
						}})
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
	.choice{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
	.devid{
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 10;
		width: 100%;
		height: .4rem;
		color: #fff;
		padding-left: .25rem;
		line-height: .4rem;
		font-size: .24rem;
		background-color: rgba(0, 0, 0, 0.45);
		@include box-siz();
	}
	.optionTime{
		width: 100%; display: flex; justify-content: space-between; position: absolute; top: 0; padding: 0 .45rem; box-sizing: border-box;
	}
	.timeBlock{
		width: 2rem;
		height: 2rem;
		text-align: center;
		line-height: 2rem;
		font-weight: bold;
		color: #bebebe;
	}
	.timeBlock.active{
		color: #f86b2b;
	}
	.selectTime{
		width: 2.44rem; 
		height: .45rem; 
		border-radius: .25rem;margin:0 auto;
		text-align:center;
		line-height: .45rem;
		color: #fff;
		margin-bottom: .2rem;
		background: -webkit-linear-gradient(left,#4aa69b,#63d6c9); /* Safari 5.1-6.0 */
	    background: -o-linear-gradient(left,#4aa69b,#63d6c9); /* Opera 11.1-12.0 */ 
	    background: -moz-linear-gradient(left,#4aa69b,#63d6c9); /* Firefox 3.6-15 */
	    background: linear-gradient(left,#4aa69b,#63d6c9); /* 标准语法 */
	}
</style>