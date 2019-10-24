<template>
	<div class="removeSession">
		123
	</div>
</template>

<script>
	export default{
		name:"removeSession",
		components:{
		},
		data(){
			return {
			}
		},
		created(){
			localStorage.clear();
			sessionStorage.clear();
			this.$toast("清除成功")
		},
		methods:{
			
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.removeSession{
		min-height: 100vh;
		/*background-color: #f9f9f9;*/
	}
</style>