<template>
	<div class="onState">
		<div>
			<div class="timeInfo cf" style="position: fixed; top: 0.65rem; left: .9rem; z-index: 10;">套餐时长{{$route.query.time}}分钟</div>
			<div class="state" style="position: fixed; top: 2.98rem; left: 3.4rem; z-index: 10;">{{list.status==1?'使用中...':'暂停中...'}}</div>
			<div class="time cp" style="font-size:.48rem;width:100%;text-align: center;position: fixed; top: 6.8rem;">{{conversion}}</div>
			<div style="position: fixed;bottom: .2rem;left: 0;justify-content: center;" class="w100 center flex jc ac">联系客服:<div class="cp" @click="goTel(list.tel)">{{list.tel}}</div></div>
		</div>
	</div>
</template>

<script>
	export default{
		name:"onState",
		components:{
		},
		data(){
			return {
				setTime:'',
				conversion:'',
				list:[]
			}
		},
		created(){
			let vis=this;
			this.downTime();
			vis.secondTime=setInterval(()=>{
				if(vis.setTime!=""&&vis.setTime>0&&vis.list.status==1){
					vis.conversion=vis.formatSeconds(vis.setTime);
					vis.setTime=Number(vis.setTime)-1;
				}
			},1000);
			
			vis.tenTime=setInterval(()=>{
				this.downTime();	
			},5000);
		},
		methods:{
			downTime(){
				let vis=this;
				this.$http.post('/Wxsite/Site/api',{
			    	api_name: "deviceOrder",
			    	order_no: vis.$route.query.order_no
			    }).then(res => {
					this.$toast.clear();

					if(res.code==1){
						let rd=res.data;
						vis.list=rd;
						vis.setTime=rd.remaining;
						if(rd.remaining>0){
							vis.conversion=vis.formatSeconds(rd.remaining);
							vis.setTime=Number(rd.remaining)-1;
						}else{
							window.clearInterval(vis.tenTime);
							vis.$toast("套餐时间结束！即将跳转到我的空间！");
							setTimeout(()=>{
								vis.$router.replace({ path: "mySpace"})
							},3000);
						}
					}else{
						this.$toast(res.msg);
					}
				})
			},
	        goTel(tel){
	            window.location.href = 'tel://' + tel;
	        },
			formatSeconds(value) {
		        var secondTime = parseInt(value);// 秒
		        var minuteTime = 0;// 分
		        var hourTime = 0;// 小时
		        if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
		            //获取分钟，除以60取整数，得到整数分钟
		            minuteTime = parseInt(secondTime / 60);
		            //获取秒数，秒数取佘，得到整数秒数
		            secondTime = parseInt(secondTime % 60);
		            //如果分钟大于60，将分钟转换成小时
		            if(minuteTime > 60) {
		                //获取小时，获取分钟除以60，得到整数小时
		                hourTime = parseInt(minuteTime / 60);
		                //获取小时后取佘的分，获取分钟除以60取佘的分
		                minuteTime = parseInt(minuteTime % 60);
		            }
		        }
		        var result = "" + (parseInt(secondTime)<10?"0" +parseInt(secondTime):parseInt(secondTime)) + "";

		        if(minuteTime > 0) {
		            result = "" + (parseInt(minuteTime)<10?"0" +parseInt(minuteTime):parseInt(minuteTime)) + ":" + result;
		        }
		        if(hourTime > 0) {
		            result = "" + parseInt(hourTime) + ":" + result;
		        }else{
		        	result = "00:" + result;
		        }
		        return result;
		    }
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.onState{
		min-height: 100vh;
		background: url('~@/assets/imgs/timeDown.png') #f9f9f9 no-repeat;
		background-size:100%;
	}
</style>