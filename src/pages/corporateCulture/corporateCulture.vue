<template>
	<div class="corporateCulture">
		<div class="banner" style="height:3.69rem;">
			<img :src="list.logo" class="w100 h100">
		</div>
		<div class="p20" style="padding-bottom: .7rem;" v-html="list.education"></div>
		<div style="background-color:#4aa69b; height:.6rem;line-height:.6rem;position: fixed;bottom: 0;left: 0;" class="w100 cf center">
			{{list.company_name}}
		</div>
	</div>
</template>

<script>
	export default{
		name:"corporateCulture",
		components:{
		},
		data(){
			return {
				list:{}
			}
		},
		created(){
			let vis=this;
			this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
		    this.$http.post('/wxsite/company/api',{
		    	api_name: "company_info"
		    }).then(res => {
				this.$toast.clear();
				
				if(res.code==1){
					vis.list=res.data;
				}else{
					this.$toast(res.msg);
				}
			})
		},
		methods:{
			
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.corporateCulture{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
	.company_info{
		position: fixed;
	    left: 0;
	    padding: 15px;
	    bottom: .6rem;
	    line-height: .4rem;
	    width: 100%;
	    box-sizing: border-box;
	        height: 1.8rem;
	}
</style>