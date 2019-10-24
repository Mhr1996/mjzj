<template>
	<div class="bankCar p15 bz" style="    padding-bottom: 1rem;">
		<van-list
			  v-model="loading"
			  :finished="finished"
			  finished-text="没有更多了"
			  :offset="100"
			  @load="getList"
			   class="car"
			>
			<div class="list flex wrap cf mb15" style="padding-bottom: .1rem;" v-for="(item,index) of orderList" :key="index" @click="setDefault(item.id)" @touchstart="delItem(item)" @touchend="emptyTime">
				<p class="w100">{{item.name}}</p>
				<div class="csb w100" style="align-items: flex-end; padding: 0 1rem;">
					<span v-for="(item,index) of item.ko" :key="index">{{item}}</span>
				</div>
			</div>
		</van-list>
		<router-link tag="div" class="addCar" to="addBank">
			<img src="@/assets/imgs/add2.png" style="width:.3rem;height:.3rem;vertical-align: initial;" class="mr10">添加银行卡
		</router-link>
	</div>
</template>

<script>
	export default{
		name:"bankCar",
		components:{
		},
		data(){
			return {
				finished : false,
				loading  : false,
				orderList: [],
				page     : 1,
				pagesize : 10,
				Loop:null,
				show:false
			}
		},
		created(){

		},
		methods:{
			getList(){
				let vis=this,hd=null;
				vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
				vis.$http.post("/wxsite/myspace/api",{
					api_name:"bankAccountList"
				}).then(res => {
					vis.$toast.clear();
					if (res.code == 1) {
						let rd=res.data;
						for(let i=0;i<rd.length;i++){
							let sz= rd[i].account,ko=[];
							console.log(rd)
							for (let i=0;i<sz.length;i+=4){
								ko[ko.length]=sz.substr(i,4);
							}
							rd[i].ko=ko;
						}
						vis.orderList=[...vis.orderList,...rd];
						if (rd.length<10) {
							vis.finished = true
						}
						vis.page++;
						console.log(vis.orderList)
					}else{
						vis.$toast(res.msg);
					}
					vis.loading = false;
				})
			},
			setDefault:function (id) {
				let vis=this;
			    vis.$dialog.confirm({
					title: '提示',
					message: '设置为默认银行卡吗？'
				}).then(() => {
				  	vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
				    vis.$http.post('/wxsite/myspace/api',{
				    	api_name: "isDefault",
				    	id: id
				    }).then(res => {
						vis.$toast.clear();
						let rd=res.data;

						if(res.code==1){
							vis.$toast("设置成功");
						}else{
							vis.$toast(res.msg);
						}
					})
				}).catch(() => {
				  // on cancel
				});
			},
			emptyTime:function () {
			    clearTimeout(this.Loop); //清空定时器，防止重复注册定时器
			},
			delItem(item){
				let vis=this;
				clearTimeout(vis.Loop); //再次清空定时器，防止重复注册定时器
			    vis.Loop = setTimeout(function() {
			        vis.$dialog.confirm({
						title: '提示',
						message: '确认删除银行卡？'
					}).then(() => {
					  	vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
					    vis.$http.post('/wxsite/myspace/api',{
					    	api_name: "delBankAccount",
					    	id: item.id
					    }).then(res => {
							vis.$toast.clear();
							let rd=res.data;

							if(res.code==1){
								vis.$toast("删除成功");
								vis.page=1;
								vis.orderList=[];
								vis.getList();
							}else{
								vis.$toast(res.msg);
							}
						})
					}).catch(() => {
					  // on cancel
					});
			    }.bind(vis), 1000);
				
				
			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.bankCar{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
	.list{
		height:2.19rem;
		background: url('~@/assets/imgs/bankCar.jpg') #f9f9f9 no-repeat;
		background-size: 100% 100%;
    	padding: .3rem;
    	@include box-siz();
	}
	.addCar{
		position: fixed;width: 100%;text-align: center;height: .88rem;background-color: #fff;bottom: 0;line-height: .88rem;z-index: 10;left:0;
	}
	* {
		-webkit-touch-callout:none;
		-webkit-user-select:none;
		-khtml-user-select:none;
		-moz-user-select:none;
		-ms-user-select:none;
		user-select:none;
	}
</style>