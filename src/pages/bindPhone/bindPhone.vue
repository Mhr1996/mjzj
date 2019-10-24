<template>
	<div class="bindPhone">
		<div class="head"><img src="@/assets/imgs/title.png" class="titlePink mtb_100"></div>
		<div class="info">
			<div class="row mb10 cgf border-bottom phone">
				<input type="text" placeholder="请输入手机号" v-model="mobile" Fv="2">
			</div>
			<div class="row mb10 cgf verCode">
				<input type="text" placeholder="请输入验证码" v-model="code" Fv="0"  FvInfo="请输入验证码">
				<validate @click="getCode"></validate>
			</div>
		</div>
		<button class="submitBtn2 mt50" @click="submit" style="width: 90%;">确定</button>
	</div>
</template>

<script>
import validate from '@/components/validate'
	export default{
		name:"bindPhone",
		components:{
			validate
		},
		data(){
			return {
				mobile:"",
				code:""
			}
		},
		created(){
			// this.$router.history.go(-1);
			
		},
		methods:{
			sendVer(){
				let self=this;
				this.$http.post("/Wxsite/User/api",{
					api_name:"sendCode"
					,mobile :this.mobile
				}).then(res => {
					if (res.code == 1) {
						self.$toast("发送成功，请注意查收");
					}else{
						self.$toast(res.msg);
					}
				})
			},
			getCode(cb){
				let re=/^1[0-9]{10}$/;
				if(!re.test(this.mobile)){
					this.$toast("手机号格式不正确!");
					return;
				}
				cb(this.sendVer);
			},
			submit(){
				let vis = this;
				if(this.$tool.formVerification()){
					this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
					this.$http.post("/Wxsite/Site/api",{
						api_name:"userMobileSet"
						,mobile :this.mobile
						,sms_code :this.code
					}).then(res => {
						if (res.code == 1) {
							vis.$tool.setSession("isBinding","true");
							vis.$toast({
					            duration: 0,       // 持续展示 toast
					            forbidClick: true, // 禁用背景点击
					            message: '设置成功!'
					        });
							setTimeout(()=>{
								vis.$toast.clear();
								window.location.href=vis.$tool.getSession("windowUrl")
								//vis.$router.push({path: "nearby"})
							},2000)
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

	.bindPhone{
		padding: 0 .46rem;
		margin: 0 auto;
		background: url('~@/assets/imgs/bg1.jpg') no-repeat;
		background-size: 100% 100%;
		min-height: 100vh;
	}
	.head{
		display: flex;
		img{
			width: 1.8rem;
			height: 1.8rem;
			display: block;
			margin: 2rem auto;
		}
	}
	.verBtn{
		z-index: 10;
		font-size:.26rem;
		width:1.9rem;
	}
	.info{
		padding: 0 .28rem;
		box-sizing: border-box;
		.row{
			height: 0.8rem;
			line-height: 0.8rem;
			position: relative;
			padding-left: .3rem;
			padding-right: .3rem;

			@include border-radius(1rem);
			@include box-shadow-abroad(0 0rem 0.02rem 0.02rem #ececec);
			input{
				width: 100%;
				color: #666;
				background-color: #fff;
			}
		}
	}
</style>