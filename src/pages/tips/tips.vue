<template>
	<div class="tips">
		<div class="contenct" style="background-color: initial;">
			<img src="@/assets/imgs/title.png" style="width:1.7rem;height:1.7rem;" class="mauto db mt50 mb50 titlePink">
			<div class="center mb10">您不是此门店代理</div>
			<div class="center">请成为此门店会员在进行扫码</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:"tips",
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
	.tips{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
</style>