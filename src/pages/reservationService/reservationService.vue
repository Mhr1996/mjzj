<template>
	<div class="reservationService bz oh">
		 <van-list
			  v-model="loading"
			  :finished="finished"
			  finished-text="没有更多了"
			  :offset="100"
			  @load="getList"
			>
			<div class="m12 oh cgf plr_12" v-for="(item,index) of orderList" :key="index">
				<div class="relative mb10 b-r" style="height: 3rem;" @click="selectProduct(item)">
					<img src="@/assets/imgs/30min.png" style="width:2rem;position: absolute;left: 1.21rem; top: .5rem; z-index: 11;">
					<div class="timeBlock active" style="left: 1.2rem;">{{item.total_time}}min</div>
					<div class="conceal">
						<span style="font-size: .4rem;line-height:1.64rem;">{{item.title}}</span>
					</div>
				</div>
				<div v-show="item.checked">
					<div>
						<p class="mb10">到店时间</p>
						<div class="flex mb10">
							<select class="w100 lh40" @change="ifTime(item.shop_project_id)" v-model="op_time" style="height: .8rem; border: 1px solid #e4e4e4; ">
								<option value="" v-if="item.time_range.length>0">请选择到店时间</option>
								<option value="" v-else>预约已满</option>
								<option v-for="(item,index) in item.time_range" :value="item.st_c" :key="index">
									{{item.start_time}} —— {{item.end_time}}
								</option>
							</select>
						</div>
					</div>
					<div>
						<p>营业时间：</p>
						<div class="flex wrap csb">
							<span class="m10 c6">{{bH_sT}} —— {{bH_eT}}</span>
							
						</div>
					</div>
					<div v-if="item.has_range.length!=0">
						<p>预约已满时间：</p>
						<div class="flex wrap" v-for="(item,index) of item.has_range" :key="index">
							<span class="m10 c6">{{item.start_time}} —— {{item.end_time}}</span>
						</div>
					</div>
					<div class="submitBtn2" style="margin: .4rem auto;" @click="submit">确定</div>
				</div>
			</div>
		</van-list>
	</div>
</template>

<script>
	import HandleTime from '@/components/handleTime'
	export default{
		name:"reservationService",
		components:{
			HandleTime
		},
		data(){
			return {
				currentDate:'',
				currentTime:'',
				finished : false,
				loading  : false,
				orderList: [],
				page     : 1,
				pagesize : 10,
				bH_sT: this.$route.query.start_time,
				bH_eT: this.$route.query.end_time,
				op_time:'',
				submitOff: false
			}
		},
		created(){
			console.log(new Date(this.$tool.Pastdate(0).cDate))
		},
		methods:{
			getTime(seed){
				if (seed.id=="start") {
					this.startTime=seed.datedense;
				}else{
					this.endTime=seed.datedense;
				}

				if (this.startTime!=""&&this.endTime!="") {
					if(this.endTime.getTime()<this.startTime.getTime()){
						this.$toast("结束时间不可晚于开始服务时间!");
						return;
					}

					if(this.endTime.getTime()-this.startTime.getTime()<86400000){
						if(this.endTime.getDate()-this.startTime.getDate()>0){
							this.intervalTime=2;
							return;
						}
						this.intervalTime=1;
					}else{
						this.intervalTime=Math.ceil((this.endTime-this.startTime)/(24*60*60*1000)+1);	
					}
					
				}
			},
			getList(){
				let vis=this,hd=null;
				vis.$http.post("/wxsite/shop/api",{
					api_name:"yuyue_list",
					shop_id: vis.$route.query.shop_id
				}).then(res => {
					if (res.code == 1) {
						let rd=res.data;
						
						for(let i=0;i<rd.length;i++){
							if (typeof rd[i].checked == 'undefined') {
								this.$set(rd[i], 'checked', false)
							}
							for(let d=0;d<rd[i].time_range.length;d++){
								rd[i].time_range[d].st_c=rd[i].time_range[d].start_time; //时间戳
								rd[i].time_range[d].start_time=vis.$tool.handleDate(Number(rd[i].time_range[d].start_time)*1000,"mdhm");
								rd[i].time_range[d].end_time=vis.$tool.handleDate(Number(rd[i].time_range[d].end_time)*1000,"mdhm");
							}
							for(let d=0;d<rd[i].has_range.length;d++){
								rd[i].has_range[d].st_c=rd[i].has_range[d].start_time; //时间戳
								rd[i].has_range[d].start_time=vis.$tool.handleDate(Number(rd[i].has_range[d].start_time)*1000,"mdhm");
								rd[i].has_range[d].end_time=vis.$tool.handleDate(Number(rd[i].has_range[d].end_time)*1000,"mdhm");
							}
						}
						vis.orderList=[...vis.orderList,...rd];
						if (rd.length<10) {
							vis.finished = true
						}
						vis.page++;
					}else{
						vis.$toast(res.msg);
						vis.finished = true
					}
					vis.loading = false;
				})
			},
			close(){
				this.timeD=false;
				this.timeS=false;
			},
			ifTime(){
				let shop_project_id='',vis=this;
				if(this.op_time==""){
					this.$toast("请选择预约时间");
					return;
				}

				for(let i=0;i<this.orderList.length;i++){
					if (this.orderList[i].checked == true) {
						shop_project_id=this.orderList[i].shop_project_id;
					}
				}

				this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
			    this.$http.post('/wxsite/shop/api',{
			    	api_name: "op_time",
			    	shop_project_id: shop_project_id,
			    	op_time: this.op_time
			    }).then(res => {
					this.$toast.clear();
					let rd=res.data;

					if(res.code==1){
						vis.submitOff=true;
					}else{
						vis.submitOff=false;
						vis.op_time = "";
						this.$toast(res.msg);
					}
				})
			},
			selectProduct(item) {
				if (typeof item.checked == 'undefined') {
					this.$set(item, 'checked', true)
				}else{
					for(let i=this.orderList.length;i--;){
						this.op_time="";
						this.orderList[i].checked=false;
					}
					item.checked = !item.checked;
					
					
				}
			},
			submit(){
				let vis = this , shop_project_id = '';

				for(let i=0;i<this.orderList.length;i++){
					if (this.orderList[i].checked == true) {
						shop_project_id=this.orderList[i].shop_project_id;
					}
				}

				if(shop_project_id==""){
					this.$toast("请选择预约项目");
					return;
				}

				if(!vis.submitOff){
					this.$toast("不可预约当前时间，请重新选择");
					return;
				}

				this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
			    this.$http.post('/wxsite/shop/api',{
			    	api_name: "opm_submits",
			    	shop_project_id: shop_project_id,
			    	op_time: this.op_time
			    }).then(res => {
					this.$toast.clear();
					let rd=res.data;

					if(res.code==1){
						this.$toast("预约成功，请准时到达！");
						setTimeout(()=>{
							window.location.reload();
						},2000)
					}else{
						vis.submitOff=false;
						vis.op_time = "";
						this.$toast(res.msg);
					}
				})
			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.reservationService{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
	.conceal{
		width: 3.65rem;
		height: 1.64rem;
		background-color: #c6f6de;
		border-radius: .10rem .80rem .80rem .10rem;
		color: #49a598;
		position: absolute;
		left: 2.3rem;
		top: .71rem;
		z-index: 10;
		padding-left: 1rem;
		@include box-siz();
	}
	.timeBlock{
		position: absolute;
		width: 2rem;
		height: 2rem;
		top: 0.4rem;
		z-index: 10;
		text-align: center;
		line-height: 2.2rem;
		font-weight: bold;
		color: #4AA59A;
		z-index: 13;
	}
</style>