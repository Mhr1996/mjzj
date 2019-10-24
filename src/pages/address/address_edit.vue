<template>
	<div class="address_edit oh" v-wechat-title="this.title">
		<div class="contenct mt20">
			<div class="row bbef plr_15 fc" style="height: 1rem;line-height: 1rem;">
				<img src="@/assets/imgs/pink1.png" class="mr20" style="width:.37rem;" />
				<input type="text" class="flex1" placeholder="请输入收件人" v-model="fullname" Fv="0" FvInfo="收件人不能为空">
			</div>
			<div class="row bbef plr_15 fc" style="height: 1rem;line-height: 1rem;">
				<img src="@/assets/imgs/pink2.png" class="mr20"  style="width:.39rem;"/>
				<input type="text" class="flex1" placeholder="请输入手机号" v-model="mobile" Fv="2">
			</div>
			<div class="row bbef plr_15 fc" style="height: 1rem;line-height: 1rem;">
				<img src="@/assets/imgs/pink3.png" class="mr20"  style="width:.31rem;"/>
				<input type="text" class="flex1 c3" placeholder="所在地区" onfocus="this.blur();" @click="areaS=!areaS" v-model="address" Fv="0" FvInfo="联系地址不能为空">
				<img src="@/assets/imgs/right.png"/>
			</div>
			<div class="row bbef plr_15 fc" style="height: 1rem;line-height: 1rem;">
				<img src="@/assets/imgs/pink4.png" class="mr20"  style="width:.36rem;"/>
				<input type="text" class="flex1" placeholder="请输入详细地址" Fv="0" v-model="location" FvInfo="详细地址不能为空">
			</div>
		</div>
		<div class="contenct w90 mauto cgf b-r o-f mt30" @click="status=!status" :class="{active:status}">
			<div class="row bbef plr_15 fc" style="height: 1rem;line-height: 1rem;">
				<span class="icon mr15"></span>
				<span>设为默认地址</span>
			</div>
		</div>
		<button class="submitBtn2 mt50" @click="submit">保存</button>
		<van-popup v-model="areaS" position="bottom" :overlay="areaS">
		  	<van-area 
		  		:area-list="areaList"
		  		@cancel="close"
		  		@confirm="setArea"
		  	/>
		</van-popup>
	</div>
</template>

<script>
	import area from '@/assets/js/area'
	export default{
		name:"address_edit",
		components:{},
		data(){
			return {
				fullname:'',
				mobile:'',
				location:'',
				status:false,
				title:"新增地址",
				areaS:false,
				areaList:area.address,
				address:"",
				area :{
					province: ""
				    ,city	: ""
				    ,area	: ""
				}
			}
		},
		created(){ 
			let vis=this;
			if(vis.$route.query.id){
				vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
				vis.$http.post("/wxsite/Userspace/api",{
					api_name:"userAddressFind"
					,address_id:vis.$route.query.id
				}).then(res => {
					vis.$toast.clear();
					if (res.code == 1) {
						let rd=res.data;
						vis.fullname=rd.fullname
						vis.mobile=rd.mobile
						vis.location=rd.location
						vis.address=rd.address
						vis.status=rd.status == 1 ? true : false;
					}else{
						vis.$toast(res.msg);
					}
				})
			}
		},
		methods:{
			setArea(value){
				this.address=value[0].name+value[1].name+value[2].name;
				this.area.province=value[0].code;
				this.area.city=value[1].code;
				this.area.area=value[2].code;
				this.areaS=false;
			},
			close(){
				this.areaS=false;
			},
			submit(){
				let vis=this;
				if(this.$tool.formVerification()){
					this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
					this.$http.post("/wxsite/Userspace/api",{
						api_name:"userAddressInsert"
						,fullname: vis.fullname
						,mobile:vis.mobile
						,address: vis.address
						,location: vis.location
						,status: vis.status ? 1 : 0
						,id:vis.$route.query.id||""
					}).then(res => {
						vis.$toast.clear();
						if (res.code == 1) {
							this.$toast.success({duration:0, forbidClick:true, loadingType:'spinner', message:'提交成功'});
							setTimeout(()=>{
								this.$router.history.go(-1);
							},3000);
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
	.address_edit{
		min-height: 100vh;
		background-color: #f9f9f9;
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