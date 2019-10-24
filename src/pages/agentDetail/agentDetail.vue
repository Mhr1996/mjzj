<template>
	<div class="agentDetail">
		<div class="bgCloor cf csb" style="align-items: initial;">
			<div class="br relative cf p15 mauto block mt15" style="width: 5.67rem;border:0.02rem solid #fff;    z-index: 11;">
				<div class="mb10">mumu</div>
				<div class="mb10">代理编号：00077</div>
				<div class="mb10">手机号码：13364463382</div>
				<div class="mb10">代理类型：白金代理</div>
				<div class="mb10">地      址：深圳市南山区大虫商务中心</div>
				<img src="@/assets/imgs/title.png" class="br50" style="width: 1.38rem;height: 1.38rem;position: absolute;top: .2rem;right: .2rem;" />
			</div>
		</div>
		<div class="p12 mlr_12 b-r mt80 relative" style="border: solid 2px #707070;">
			<div class="center mb20 mt12">下单金额</div>
			<div class="yearBtn">2019年</div>
			<div class="csb plr_12 cgd br5 ptb_6 plr_12 cf mb10">
				<span>1月</span><span>￥1560.00</span>
			</div>
			<div class="csb plr_12 cgd br5 ptb_6 plr_12 cf mb10">
				<span>1月</span><span>￥1560.00</span>
			</div>
			<div class="csb plr_12 cgd br5 ptb_6 plr_12 cf mb10">
				<span>1月</span><span>￥1560.00</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:"agentDetail",
		components:{
		},
		data(){
			return {
			}
		},
		created(){

		},
		methods:{
			
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.agentDetail{
		min-height: 100vh;
		/*background-color: #f9f9f9;*/
	}
	.bgCloor{
		height: 3.4rem;
		background: -webkit-linear-gradient(top,#ff846f,#feb0a0); /* Safari 5.1-6.0 */
	    background: -o-linear-gradient(top,#ff846f,#feb0a0); /* Opera 11.1-12.0 */ 
	    background: -moz-linear-gradient(top,#ff846f,#feb0a0); /* Firefox 3.6-15 */
	    background: linear-gradient(top,#ff846f,#feb0a0); /* 标准语法 */
	    position: relative;
	    &:before{
	    	content:'';
	    	position: absolute;
	    	background: url('~@/assets/imgs/b2.png') no-repeat;
		     width: 100%;
		    height: .88rem;
		    left: 0;
		    z-index: 10;
		    background-size: 100%;
		    bottom: -.87rem;
	    }
	}
	.yearBtn{
		position:absolute;
		right: .2rem;
		top: .2rem;
		line-height: .42rem;
		text-align: center;
		width:1.3rem;
		height: .42rem;
		color: #ffff;
		background-color: #ff836e;
		@include border-radius(.05rem);
	}
</style>