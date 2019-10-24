<template>
	<div class="fundManagement">
		<div class="mb10 relative" style="z-index: 10;">
			<div class="bgCloor cf csb" style="align-items: initial;">
				<div class="w100 mt20"></div>
			</div>
		</div>
		<div class="cgf cg center cca priceBtn" style="width:3.68rem;height: 1.2rem;border-radius: 1.2rem;">
			<div>流动资金</div>
			<div>￥{{flow_money}}</div>
		</div>
		<div class="mauto cgf br priceRow">
			<div class="bbde plr_15 bz flex" style="height: .8rem;line-height: .8rem">
				提现到：
				<!-- <div class="pr20 mr5 rg" @click="go"><img src="@/assets/imgs/wx.png" class="mr10" style="width: .44rem;height: .44rem;">微信</div> -->
				<div class="pr20 mr5 rg active"><img src="@/assets/imgs/bankCar.png" class="mr10" style="width: .36rem;height: .26rem;">银行卡</div>
			</div>
			<div class="bbde plr_15 bz">
				<p class="mt10">提现金额</p>
				<div class="mt20 mb10" style="display: flex; align-items: flex-end;">
					<img src="@/assets/imgs/money.png" style="width: .61rem;height: .85rem;">
					<input type="text" class="flex1 pl10" name="" style=" height: .85rem;font-size: .85rem;" v-model="money" Fv="4">
				</div>
			</div>
			<p  class="plr_15 bz fz13" style="height: .54rem;line-height: .54rem">注：提现金额不能少于￥{{withdraw_money}}</p>
		</div>
		<div class="submitBtn2 w60" style="margin-bottom: .15rem;" @click="withdraw">提现</div>
		<router-link to="fundDetails" tag="div" class="submitBtn2 w60 cg" style="margin-top: 0rem;background: #ffffff; border-radius: 44px; border: solid 2px #4aa59a;    color: #1d9889;">查看资金明细</router-link>
	</div>
</template>

<script>
	export default{
		name:"fundManagement",
		components:{
		},
		data(){
			return {
				withdraw_money:100,
				money:'',
				flow_money: this.$route.query.flow_money
			}
		},
		created(){},
		methods:{
			withdraw(){
				let vis=this;
				if(this.$tool.formVerification()){
					if(Number(vis.money)<vis.withdraw_money){
						vis.$toast("提现金额不能少于￥"+vis.withdraw_money);
						return;
					}
					if(Number(vis.money)>vis.flow_money){
						vis.$toast("提现金额不能大于流动资金");
						return;
					}
					this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
				    this.$http.post('/wxsite/myspace/api',{
				    	api_name: "cashSubmit",
				    	money: Number(vis.money),
				    	type: 2
				    }).then(res => {
						this.$toast.clear();

						if(res.code==1){
							vis.$toast("提交成功,请等待审核");
							vis.money='';
						}else{
							vis.$toast(res.msg);
							if(res.msg=="请绑定或选择默认银行卡"){
								setTimeout(()=>{
									vis.$router.push({
					                    path,
					                    query: query
					                });
								},1000);
							}
						}
					})
				}
			},
			go(){

			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.fundManagement{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
	.bgCloor{
		height: 1rem;
		background: -webkit-linear-gradient(top,#4aa59a,#57c0b3); /* Safari 5.1-6.0 */
	    background: -o-linear-gradient(top,#4aa59a,#57c0b3); /* Opera 11.1-12.0 */ 
	    background: -moz-linear-gradient(top,#4aa59a,#57c0b3); /* Firefox 3.6-15 */
	    background: linear-gradient(top,#4aa59a,#57c0b3); /* 标准语法 */
	    position: relative;
	    /*&:after{
	    	content:'';
	    	position: absolute;
	    	left: 50%;
	    	top: 50%;
	    	width: 0.02rem;
	    	height: .5rem;
	    	background-color: #fff;
	    	margin-top: -.5rem;
	    }*/
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
	.invite{
		width: 7rem;
		background-color: #fff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		height:2.3rem;
		margin: 0 auto;
		border-radius: .2rem;
		margin-top: -1rem;
		z-index: 10;
		position: relative;
		.ccc{
			height: 1.73rem;
			width: 1.35rem;
			position: relative;
			background: url('~@/assets/imgs/ms5.png');
			background-size: 100% 100%;
		}
	}
	.puyButton{
		width: 2rem;height: .4rem;line-height: .4rem;border:0.02rem solid #fff;
		display: block;
		margin: 0 auto;
		margin-top: .1rem;
		@include border-radius(.2rem);
	}
	.ccc{
		justify-content: initial;
	}
	.priceBtn{
		width: 3.68rem;
		height: 1.2rem;
		position: absolute;
		left: 50%;
		top: 1.1rem;
		margin-left: -1.84rem;
		z-index: 11;
	}
	.priceRow{
		width: 7rem;
    	margin-top: 1.6rem;
    	background: url('~@/assets/imgs/p1.png');
		background-size: 100% 100%;
	}
	.rg{
		background: url('~@/assets/imgs/radio.png') no-repeat;
		background-size: .27rem .27rem;
		background-position: right;
		&.active{
			background: url('~@/assets/imgs/radio2.png') no-repeat;
			background-size: .27rem .27rem;
			background-position: right;
		}
	}
</style>