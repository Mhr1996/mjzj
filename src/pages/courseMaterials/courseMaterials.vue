<template>
	<div class="courseMaterials wrap bz pb35">
		<div class="csb center lh80 cf mb10" style="background-color:#4aa59a;">
			<div class="w100" :class="{active:type==0}" @click="switchType(0)">全部</div>
			<div class="w100" :class="{active:type==2}" @click="switchType(2)">免费</div>
			<div class="w100" :class="{active:type==1}" @click="switchType(1)">积分视频</div>
		</div>
		<van-list
			  v-model="loading"
			  :finished="finished"
			  finished-text="没有更多了"
			  :offset="100"
			  @load="getList"
			  class="plr_10"
			>
			<div class="w100 csb wrap h100 plr_6 bz">
				<div style="width:3.3rem;height: 3.9rem;" class="b-r o-f mb10" v-for="(item,index) of orderList" :key="index" @click="prevideo(item.video_url,item.course_id)">
					<img :src="item.pic" style="width:100%; height:2.8rem;">
					<div class="cgp p5" style="height:.64rem;">
						<p class="mb5 ellipsis">{{item.title}}</p>
						<p class="c9 fz13">{{item.createat}}<span class="r" style="color:#e5561c;">{{item.grade}}积分</span></p>
					</div>
				</div>
			</div>
		</van-list>
		<div v-show="currentVideo!=''" class="palyVideo" @click="prevideo('')" style="position: fixed;width: 100%;height: 100%; top: 0; left: 0;background-color: rgba(0, 0, 0, 0.44);z-index: 30;">
           <iframe :src="currentVideo" frameborder="0" allowfullscreen="" style="width:6.4rem;height:10rem;top: 50%;left: 50%;position: fixed;margin-top: -5rem;margin-left: -3.2rem;z-index: 31;"></iframe>
        </div>
		<div class="company">美容仪有限公司</div>
	</div>
</template>

<script>
	export default{
		name:"courseMaterials",
		components:{
		},
		data(){
			return {
				finished : false,
				loading  : false,
				orderList: [],
				page     : 1,
				currentVideo:'',
				type:0
			}
		},
		created(){
			
		},
		methods:{
			getList(type){
				let vis=this,hd=null;
				this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
				vis.$http.post("/wxsite/course/api",{
					api_name:"course_list"
					,page:vis.page
					,type: vis.type
				}).then(res => {
					vis.$toast.clear();
					if (res.code == 1) {
						let rd=res.data;
						for(let i=0;i<rd.length;i++){
							rd[i].createat=vis.$tool.handleDate(rd[i].ctime);
						}
						vis.orderList=[...vis.orderList,...rd];
						if (res.data.length<10) {
							vis.finished = true
						}
						vis.page++;
					}else{
						vis.$toast(res.msg);
					}
					vis.loading = false;
				})
			},
	        prevideo(src,id){
	        	let vis=this;
	        	if(src==""){
	        		vis.currentVideo=src;	
	        	}else{
					vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
					vis.$http.post("/wxsite/course/api",{
						api_name:"courseDeductIntegral"
						,course_id:id
					}).then(res => {
						vis.$toast.clear();
						if (res.code == 1) {
							if(res.data.video_url==""){
								vis.$toast("视频地址格式错误，无法播放！");
								return;
							}
							vis.currentVideo=res.data.video_url+"?rel=0&amp;autoplay=1";
						}else{
							vis.$toast(res.msg);
						}
						vis.loading = false;
					})
	        	}
	        },
	        switchType(id){
	        	if(this.loading==false){
	        		this.orderList=[];
					this.page=1;     
					this.type=id
		        	this.getList();
	        	}
	        }
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.courseMaterials{
		min-height: 100vh;
		/*background-color: #f9f9f9;*/
	}
	.active{
		background: -webkit-linear-gradient(top,#4aa59a,#62d7c8); /* Safari 5.1-6.0 */
	    background: -o-linear-gradient(top,#4aa59a,#62d7c8); /* Opera 11.1-12.0 */ 
	    background: -moz-linear-gradient(top,#4aa59a,#62d7c8); /* Firefox 3.6-15 */
	    background: linear-gradient(top,#4aa59a,#62d7c8); /* 标准语法 */
	}
</style>