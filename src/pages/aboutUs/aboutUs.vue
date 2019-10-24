<template>
	<div class="aboutUs bz oh" style="display: flex;height: 100vh;flex-direction:column;">
		 <div style="height:28%; width: 100%; box-sizing: border-box; display: flex;justify-content: center;align-items: center;">
		     <div class="banner" style="height:100%;">
			<img :src="list.logo" class="w100 h100">
		</div>
		    </div>
		    <div style="height:56%; width: 100%; box-sizing: border-box; overflow-y: auto;" class="p15 lh28"  v-html="list.about_company">
		    </div>
		    <div style="height:17%; width: 100%; box-sizing: border-box;">
		      <div class="company_info">
			<p>联系电话：{{list.mobile}}</p>
			<p>公司地址：{{list.address}}</p>
			<p>公司传真：{{list.fax}}</p>
		</div>
		<div style="background-color:#4aa69b; height:.6rem;line-height:.6rem;position: fixed;bottom: 0;left: 0;" class="w100 cf center">
			{{list.company_name}}
		</div>
		    </div>
		<!-- <div class="banner" style="height:3.69rem;">
			<img :src="list.logo" class="w100 h100">
		</div>
		<div class="p20" style="padding-bottom: .6rem;height: 6.2rem; overflow-y: auto;" v-html="list.about_company"></div>
		<div style="background-color:#4aa69b; height:.6rem;line-height:.6rem;position: fixed;bottom: 0;left: 0;" class="w100 cf center">
			{{list.company_name}}
		</div>
		<div class="company_info">
			<p>联系电话：{{list.mobile}}</p>
			<p>公司地址：{{list.address}}</p>
			<p>公司传真：{{list.fax}}</p>
		</div> -->
	</div>
</template>

<script>
	export default{
		name:"aboutUs",
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
	.aboutUs{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
	.company_info{
	    padding: 15px;
	    line-height: .4rem;
	    width: 100%;
	    box-sizing: border-box;
	        height: 1.8rem;
	}
</style>