<template>
	<div class="deviceCodeOpen oh bz ">
		<div class="csb plr_20 lh50 cgf br m10 relative" style="height:1rem;">
			<input type="tel" v-model="macno" placeholder="请输入设备编码" Fv="0" FvInfo="设备编码不能为空">
		</div>
		<button class="submitBtn2 mt50 w70" @click="submit">确认</button>
	</div>
</template>

<script>
	export default{
		name:"deviceCodeOpen",
		components:{
		},
		data(){
			return {
				macno:''
			}
		},
		created(){
		},
		methods:{
			submit(){
				let vis=this;
				if(this.$tool.formVerification()){
					vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
				    vis.$http.post('/Wxsite/Site/api',{
				    	api_name: "deviceCalculate",
				    	manco:vis.macno
				    }).then(res => {
						vis.$toast.clear();
						let rd=res.data;

						if(res.code==1){
							vis.$router.push({path:'choice',query:{ macno: vis.macno}})
						}else{
							vis.$toast(res.msg);
						}
					})
				}
			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.deviceCodeOpen{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
</style>