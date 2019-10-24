<template>
	<div class="myCard">
		<div class="relative jb_g mb10 flex-c" style="height: 4.36rem;">
			<div class="ccc center cg">
				<p style="font-weight: bold;font-size: .4rem;" class="mb10" v-if="list!=null">{{list.frequency}}</p>
				<p>可用套餐次数</p>
			</div>
			<div class="absolute" style="right: 0.2rem;top: 0.1rem;">
				<router-link class="room ccc fz12 cp cg" tag="div" to="discountPackage">
					<span>我要</span><span>充值</span>
				</router-link>
				<router-link class="room ccc fz12 cp cg" tag="div" to="rechargeList">
					<span>充值</span><span>列表</span>
				</router-link>
			</div>
		</div>	
		<div class="flex ac jc mb10 mlr_10 br ptb_10" style="border: solid 4px #4aa59a;" v-if="list!=null&&list.card_id_arr!=null">
			<img src="@/assets/imgs/circular1.png" alt="" class="plr_10 off" style="width:.21rem;height:.21rem;">
			<img src="@/assets/imgs/circular.png" alt="" class="plr_10 on" style="width:.21rem;height:.21rem;">
			<div>
				<div class="mb5 c9 fc w14" v-show="list.card_id_arr.card_id==1">
					<img src="@/assets/imgs/bjk.png" class="mr5 img_card">{{list.card_id_arr.card_name}}
				</div>
				<div class="mb5 c9 fc w14 jin_color" v-show="list.card_id_arr.card_id==2">
					<img src="@/assets/imgs/j.png" class="mr5 img_card">{{list.card_id_arr.card_name}}
				</div>
				<div class="mb5 c9 fc w14 zuan_color" v-show="list.card_id_arr.card_id==3">
					<img src="@/assets/imgs/z.png" class="mr5 img_card">{{list.card_id_arr.card_name}}
				</div>
				<span class="c9" :class="{'zuan_color':list.card_id_arr.card_id==3,'jin_color':list.card_id_arr.card_id==2}">￥{{list.card_id_arr.card_money}}</span>
			</div>
			<div class="flex1 flex ac jc semicircle ml5">
				<div class="num cg">共{{list.card_id_arr.card_num}}次</div>
				<ul class="activity cca2 cebter">
					<li v-for="(item2,index) of list.card_id_arr.class" :key="index" class="ellipsis mauto mtb_5">{{item2.class_number}}次{{item2.class_name}}</li>
				</ul>
				<img src="@/assets/imgs/card5.png" alt="" style="width: 1.1rem;">
			</div>
		</div>
		<div class="p12 mlr_12 b-r" style="border: solid 2px #707070;"  v-if="list!=null&&list.records_log.length>0&&list.card_id_arr!=null">
			<div class="center mb20 mt12">消费记录</div>
			<div class="csb plr_12 cgd br5 ptb_6 plr_12 cf mb10" v-for="(item,index) of list.records_log">
				<p class="center w100">{{item.ctime}}</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:"myCard",
		components:{
		},
		data(){
			return {
				list:null
			}
		},
		created(){
			let vis=this;
			this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
		    this.$http.post('/wxsite/Userspace/api',{
		    	api_name: "MyCardItem"
		    }).then(res => {
				this.$toast.clear();
				console.log(res)
				if(res.code==1){
					let rd=res.data;
					console.log(rd)
					vis.list=rd;
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
	.myCard{
		min-height: 100vh;
		/*background-color: #f9f9f9;*/
	}
	.room{
		width:1.06rem;
		height:1.06rem;
		background: url('~@/assets/imgs/card1.png') no-repeat;
		background-size: 100%;
		margin-top: .17rem;
		margin-bottom: .2rem;
	}
	.room.ask{
		background: url('~@/assets/imgs/card3.png') no-repeat;
		background-size: 100%;
	}
	.center.ccc{
		background: url('~@/assets/imgs/card2.png') no-repeat;width: 3.05rem;height: 3.05rem;background-size: 100%;
	}
	.cardInfo{
		background: url('~@/assets/imgs/card4.png') no-repeat;
		background-size: .15rem;
		background-position: left center;
    	height: 100%;
	}
	.infoCard{
		background: url('~@/assets/imgs/card5.png') no-repeat;
		background-size: .7rem;
    	background-position: right .2rem top .1rem;
	}
	.activity{
		li{
			padding-left: .2rem;
			background: url('~@/assets/imgs/card6.png') no-repeat;
			background-size: .09rem;
    		background-position: center left;
		}
	}
	.jin_color{
		color: #ffb03e;
	}
	.zuan_color{
		color: #000;
	}
	.cardInfo{
		background: url('~@/assets/imgs/card4.png') no-repeat;
		background-size: .15rem;
		background-position: left center;
    	height: 100%;
	}
	.infoCard{
		
	}
	.activity{
		li{
			padding-left: .2rem;
			background: url('~@/assets/imgs/card6.png') no-repeat;
			background-size: .09rem;
    		background-position: center left;
    		width: 2.3rem;
		}
	}
	.icon{
		width: .29rem;
		height: .29rem;
		left:.1rem;
		top: .58rem;
		background: url('~@/assets/imgs/circular1.png') no-repeat;
		background-size: 100%;
	}
	.active .icon{
		background: url('~@/assets/imgs/circular.png') no-repeat;
		background-size: 100%;
	}
	.jin_color{
		color: #ffb03e;
	}
	.zuan_color{
		color: #000;
	}
	.w15_h8{
		width: 2.15rem;height: .8rem;
	}
	.img_card{
		width: .43rem;height: .31rem;
		width: .43rem;height: .31rem;
		width: .43rem;height: .31rem;
	}
	.serviceNum{
		position: absolute;
	    left: 0;
	    top: 32px;
	    width: 1.4rem;
	    text-align: center;
	}
	.num{
		width: 1.1rem;
	    text-align: center;
	    padding-left: .1rem;
	}
	.w14{
		width: 1.4rem;
	}
	.semicircle{
		background: url('~@/assets/imgs/card4.png') repeat-y;
		background-size: .12rem;
	}
	.on{
		display:none;
	}
	.active{
		.off{
			display:none;
		}
		.on{
			display:block;
		}
	}
</style>