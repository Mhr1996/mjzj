<template>
	<div class="confirmOrder o-f">
		<div class="mlr_15 cgf relative mt15 b-r" style="height: 3rem;">
			<img src="@/assets/imgs/30min.png" style="width:2rem;position: absolute;left: 1.21rem; top: .5rem; z-index: 11;">
			<div class="timeBlock active" style="left: 1.2rem;">{{time}}min</div>
			<div class="conceal">
				￥<span style="font-size: .6rem;line-height:1.64rem;">{{charge}}</span>
			</div>
		</div>
		<div class="mlr_15 relative b-r">
			<div class="ml10 mt20 mb10 fz12">支付方式</div>
			<div class="cgf relative" style="padding: .27rem .34rem;">
				<div><img src="@/assets/imgs/wx.png" style="width: .56rem; margin-right: .13rem;">微信支付</div>
				<div class="radio"></div>
			</div>
		</div>
		<div class="submitBtn2" style="margin-top: .97rem;" @click="sumbit">支付</div>
	</div>
</template>

<script>
	export default{
		name:"confirmOrder",
		components:{
		},
		data(){
			return {
				time:'',
				charge:''
			}
		},
		created(){
			this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
			this.time=this.$route.query.time;
			this.charge=this.$route.query.charge;
			this.$toast.clear();
		},
		methods:{
			sumbit(){
				let vis = this;
				this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});

				this.$http.post('/Wxsite/Site/api',{

					api_name: "pay_ment",
					macno:vis.$route.query.macno,
			    	device_set_id:vis.$route.query.device_set_id,
			    	beautician_id:vis.$route.query.beautician_id
			    }).then(res => {
					let rd=res.data;
			    	if (res.code==1) {
						WeixinJSBridge.invoke(
							'getBrandWCPayRequest', {
								appId: rd.wxPay.appId,     //公众号名称，由商户传入     
								timeStamp: rd.wxPay.timeStamp,         //时间戳，自1970年以来的秒数     
								nonceStr: rd.wxPay.nonceStr, //随机串     
								package: rd.wxPay.package,     
								signType: rd.wxPay.signType,         //微信签名方式：     
								paySign: rd.wxPay.paySign //微信签名 
							},
							function(jso){
								if(jso.err_msg == "get_brand_wcpay_request:ok"){
									vis.$toast.clear();
									vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
								    vis.$http.post('/Wxsite/Site/api',{
								    	api_name: "openDevice",
								    	order_no:rd.order_number
								    }).then(ret => {
										vis.$toast.clear();
										let rd2=ret.data;

										if(ret.code==1){
											vis.$router.push({ path: "onState",query:{order_no:rd.order_number,time:vis.time}});
										}else{
											vis.$toast("提示：" + ret.msg);
										}
									})
									
								}else{
									vis.$toast({
					                    duration: 0,       // 持续展示 toast
					                    forbidClick: true, // 禁用背景点击
					                    message: '取消支付!'
					                });
									setTimeout(()=>{
										window.location.reload();
									},2000);
								}
							}
						); 
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
	.confirmOrder{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
	.conceal{
		width: 3.65rem;
	    height: 1.64rem;
	    background-color: #c6f6de;
	    border-radius: .10rem .80rem .80rem .10rem;
	    color: #49a598;
	    position: absolute;
	    left: 2.3rem;
	    top: .71rem;
	    z-index: 10;
	    padding-left: 1rem;
	    @include box-siz();
	}
	.timeBlock{
		position: absolute;
		width: 2rem;
		height: 2rem;
		top: 0.4rem;
		z-index: 10;
		text-align: center;
		line-height: 2.2rem;
		font-weight: bold;
		color: #4AA59A;
		z-index: 13;
	}
	.radio{
		width: .29rem;
		height: .29rem;
		margin-right: .24rem;
		margin-top: 0.32rem;
		background: url('~@/assets/imgs/circular.png') no-repeat;
		background-size: 100%;
		border: 0px solid;
	    position: absolute;
	    top: .1rem;
	    right: 0.1rem;
	}
</style>