<template>
	<div class="addBank">
		<div class="csb plr_20 lh50 cgf bbef relative"  style="height:1rem;">
			<input type="text" v-model="name" placeholder="请输入银行名称" class="w100" Fv="0" FvInfo="银行名称不能为空">
		</div>
		<div class="csb plr_20 lh50 cgf bbef "  style="height:1rem;">
			<input type="tel" v-model="account" placeholder="请输入银行账号" class="w100" Fv="0" FvInfo="银行账号不能为空">
		</div>
		<button class="submitBtn2 mt50 w70" @click="submit">确认</button>
	</div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
	export default{
		name:"addBank",
		components:{
		},
		data(){
			return {
				name:'',
				account:''
			}
		},
		created(){

		},
		methods:{
			submit(){
				let vis=this;
				if(this.$tool.formVerification()){
					let off=new Promise((resolve, reject) => {
						//支付宝验证银行卡信息
						axios({
				            url: 'https://ccdcapi.alipay.com/validateAndCacheCardInfo.json',
				            method: 'post',
				            data: qs.stringify({
						    	cardNo:Number(vis.account),
						    	cardBinCheck:'true'
					   		}),
				            headers: {
				                'Content-Type': 'application/x-www-form-urlencoded' //数据被编码为名称/值对。这是标准的编码格式
				            }
				        }).then((res1, error) => {
				            if (res1.data.validated) {
				                resolve(res1.data)
				                console.log(res1.data);
				            } else {
				                reject(error)
				            }
				        })
					})
					off.then(function(data){
				        vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
					    vis.$http.post('/wxsite/myspace/api',{
					    	api_name: "addBankAccount",
					    	name:vis.name,
					    	account:vis.account
					    }).then(res => {
							vis.$toast.clear();
							let rd=res.data;

							if(res.code==1){
								vis.$toast("添加成功");
								vis.name="";
								vis.account="";
								setTimeout(()=>{
									vis.$router.history.go(-1);
								},3000);
							}else{
								vis.$toast(res.msg);
							}
						})
				    }, 
				    function(reason, data){
				        vis.$toast("银行账号不正确！");
				    })
					
				}
			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.addBank{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
</style>