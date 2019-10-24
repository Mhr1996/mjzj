<template>
	<div class="alipay">
		<img src="@/assets/imgs/yd.jpg" alt="" class="w100" v-if="showOff">
		<div class="payHtml" v-html="payHtml"></div>
	</div>
</template>

<script>
	export default{
		name:"alipay",
		components:{
		},
		data(){
			return {
				payHtml:'',
				showOff:false
			}
		},
		created(){
			let vis=this;
			var ua = navigator.userAgent.toLowerCase(); //判断设备和浏览器的工作
			if(ua.match(/MicroMessenger/i) == "micromessenger") {
			    this.showOff=true;
			}else{
				if(window.sessionStorage.getItem("submitOrder")){
			    	alert("支付完成，请回到商城进行查看。");
			    	window.sessionStorage.removeItem("submitOrder");
			    	
			    	window.opener=null;
					window.open('','_self');
					window.close();
					return;
			    }

				window.sessionStorage.setItem("submitOrder", "true");
			 	this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
				this.$http.post('/wxsite/goods/api',{
					api_name: "submitOrder",
		    		goods_id: vis.$route.query.goods_id,
		    		number: vis.$route.query.number,
		    		address_id: vis.$route.query.address_id,
		    		type: vis.$route.query.type,
		    		pay_type:1,
		    		token:vis.$route.query.token
				}).then(res => {
					vis.payHtml=res;
					setTimeout(()=>{
						document.getElementById("alipaysubmit").submit()
					},3000)
				}) 
			}
			
			
		},
		methods:{
			
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.alipay{
		min-height: 100vh;
		background-color: #f4f3f8;
	}
</style>