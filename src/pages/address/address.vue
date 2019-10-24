<template>
	<div class="addressAlias">
		<div class="item cgf p12 mb10" v-for="(item,index) of list" :key="index"  >
			<div style="padding: .12rem 0 .24rem .78rem;" class="bbde fz12" @click="selectProduct(item)">
				<p class="mb12">收货人：{{item.fullname}} {{item.mobile}}</p>
				<p>收货地址：{{item.address}}{{item.location}}</p>
			</div>
			<div class="csb pt15">
				<div class="relative csb" :class="{'active': item.status==1}" @click="setDefault(item)"><span class="icon mr15"></span>默认地址</div>
				<div>
					<button class="del mr15" @click="del(item.id)">删除</button>
					<router-link class="edit" tag="button" :to="{path:'address_edit',query:{id:item.id}}">编辑</router-link>
				</div>
			</div>
			<img src="@/assets/imgs/selection.png" class="gxd" v-show="item.checked==true"/>
		</div>
		<div v-if="list.length==0" class="center lh50">
			暂无数据
		</div>
		<router-link tag="div" style="position: fixed;width: 100%;text-align: center;height: .88rem;background-color: #fff;bottom: 0;line-height: .88rem;z-index: 10;" :to="{path:'address_edit',query:{type:'add'}}">
			<img src="@/assets/imgs/add2.png" style="width:.3rem;height:.3rem;vertical-align: initial;" class="mr10">新增收货地址
		</router-link>
	</div>
</template>

<script>
	export default{
		name:"addressAlias",
		components:{},
		data(){
			return {
				list:[],
				finalOrderDate:[]
			}
		},
		created(){
			let vis=this;
			//finalOrderDate结算订单信息
			if(this.$route.query.finalOrder==1){
				this.finalOrderDate = JSON.parse(this.$tool.getSession("finalOrderDate"));
			}

			vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
		    this.$http.post('/wxsite/Userspace/api',{
		    	api_name: "userAddressList",
		    	page:1,
		    	pagesize:999,
		    }).then(res => {
				this.$toast.clear();
				let rd=res.data;

				if(res.code==1){
					vis.list=rd;
					vis.list.forEach((item, index) => {
						if(typeof item.checked == 'undefined') {
							this.$set(item, 'checked', false);
						}
						if(vis.$route.query.finalOrder==1){
							if(vis.finalOrderDate.address_data!=null&&item.id==vis.finalOrderDate.address_data.address_id){
								this.$set(item, 'checked', true);
							}
						}else if(index==0){
							this.$set(item, 'checked', true);
						}
					})
				}else{
					this.$toast(res.msg);
				}
			})
		},
		methods:{
			selectProduct(item) {
				let vis=this;
				// 订单结算换地址则 直接选中回到订单结算页面
				if(vis.$route.query.finalOrder==1){
					if(vis.finalOrderDate.address_data==null){
						vis.finalOrderDate.address_data={};
					}
					vis.finalOrderDate.address_data["address"]=item.address;
					vis.finalOrderDate.address_data["address_id"]=item.id;
					vis.finalOrderDate.address_data["fullname"]=item.fullname;
					vis.finalOrderDate.address_data["location"]=item.location;
					vis.finalOrderDate.address_data["mobile"]=item.mobile;
					this.$tool.setSession("finalOrderDate",vis.finalOrderDate);
					this.$router.push({name: "finalOrder"});
					return;
				}
				
				this.list.forEach((item, index) => {
					item.checked=false;
				})
				item.checked=true;
			},
			del(id){
				let vis=this;
				this.$dialog.confirm({
				  title: '提示',
				  message: '确定删除地址吗？'
				}).then(() => {
				  	let vis=this;
					this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
				    this.$http.post('/wxsite/Userspace/api',{
				    	api_name: "userAddressDel",
				    	id:id,
				    }).then(res => {
						this.$toast.clear();
						let rd=res.data;

						if(res.code==1){
							vis.list.forEach((item, index) => {
								if(item.id==id){
									vis.list.splice(index,1)
								}
							})
						}else{
							this.$toast(res.msg);
						}
					})
				}).catch(() => {
				  // on cancel
				});
			},
			setDefault(item){
				let vis=this;
			    this.$http.post('/wxsite/Userspace/api',{
			    	api_name: "setStatus",
			    	address_id: item.id,
			    }).then(res => {
					let rd=res.data;

					if(res.code==1){
						vis.$toast("设置成功");
						for(let i=vis.list.length;i--;){
							vis.list[i].status=0;
						}
						item.status=1;
					}else{
						this.$toast(res.msg);
					}
				})
			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.adG{
		background: url('~@/assets/imgs/selection.png') no-repeat;
		background-position: .2rem .4rem;
		background-size: .65rem;
	}
	.item .gxd{
		width: .65rem;
		position: absolute;
		right: 0;
		top: 0;
	}
	.item{
		background: url('~@/assets/imgs/address.png') no-repeat;
		background-size: .42rem;
    	background-position: .2rem .4rem;
    	background-color: #fff;
    	position: relative;
	}
	.addressAlias{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
	.edit, .del{
		width: .81rem;
		height: .36rem;
		color: #4aa59a;
		line-height: .36rem;
		border-radius: .10rem;
		border: solid .02rem #4aa59a;
	}
	.icon{
		display: block;
		width: .29rem;
		height: .29rem;
		margin-right: .20rem;
    	background: url('~@/assets/imgs/circular1.png') no-repeat;
		background-size: 100%;
	}
	.active .icon{
		background: url('~@/assets/imgs/circular.png') no-repeat;
		background-size: 100%;
	}
</style>