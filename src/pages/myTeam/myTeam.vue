<template>
	<div class="myTeam pt10">
		<!--  tab切换  -->
    <div class="mb10 mtb_10 cgf cg flex block mauto oh"
         style="height:.68rem;width: 3.85rem;line-height: .68rem;text-align: center;border-radius: 6.8rem;">
      <div :class="['w50 nav',current===index && 'active']" v-for="(nav,index) in tab" :key="index"
           @click="tabClick(index)">{{nav}}
      </div>
    </div>
		<van-list
			  v-model="loading"
			  :finished="finished"
			  finished-text="没有更多了"
			  :offset="100"
			  @load="getList"
			>
			<div class="mt10 mlr_10 cgf slip p15 bz fsb br5 relative" v-for="(item,index) in orderList " :key="index " style="height:2.2rem;" @click="goDetail(item.agent_id)" >
	            <img :src="item.head_img" class="br5 mr15" style="width: 1.33rem;height: 1.33rem;"/>
	            <div class="cca2 flex1 pl15" style="border-left: .12rem dotted #feb7a8;">
	                <p>{{current==0?item.nickname:item.name}}</p>
	                <p class="c9" v-show="current!=0">代理编号:{{current==0?item.agent_code:item.number}}</p>
	                <p class="c9">手机号:{{item.mobile}}</p>
	            </div>
	            <div class="identity" v-show="current==0"
	            :class="{
	            	type_h:item.member_level=='黑金会员',
	            	type_b:item.member_level=='白金会员',
	            	type_y:item.member_level=='黄金会员',
	            	type_t:item.member_level=='体验用户',
	            	type_p:item.member_level=='普通用户'
	            }">
	            {{item.member_level=='黑金会员'?'黑金会员':item.member_level=='白金会员'?'白金会员':item.member_level=='黄金会员'?'黄金会员':item.member_level=='体验用户'?'体验用户':item.member_level=='普通用户'?'普通用户':''}}
	        </div>
	        </div>
		</van-list>
	</div>
</template>

<script>
	export default{
		name:"myTeam",
		components:{
		},
		data(){
			return {
				tab: ['会员', '代理'],
				finished : false,
				loading  : false,
				orderList: [],
				page     : 1,
				pagesize : 10,
				current: 0
			}
		},
		created(){
		},
		methods:{
			getList(type){
				let vis=this,hd=null;
				vis.$http.post("/wxsite/Userspace/api",{
					api_name:"myTeam",
					page:vis.page,
					type: type || 1
				}).then(res => {
					if (res.code == 1) {
						let rd=res.data;
						vis.orderList=[...vis.orderList,...rd];
						if (rd.length<10) {
							vis.finished = true
						}
						vis.page++;
					}else{
						vis.$toast(res.msg);
					}
					vis.loading = false;
				})
			},
			//切换订单状态
            tabClick(index) {
                this.current = index;
                this.orderList = [];
                this.page=1;

                if (index === 0) {
                    this.getList(1)
                } else {
                    this.getList(2)
                }

            },
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.myTeam{
		min-height: 100vh;
		background-color: #f9f9f9;
	}
	.identity{
		height: .55rem;
		line-height: .55rem;
		color: #c880db;
		top: 50%;
		margin-top: -.7rem;
		border:1px solid #c880db;
		border-radius: 10px;
		text-align: center;
		position:absolute;
		right: .2rem;
		@include border-radius(.1rem);
		background: url('~@/assets/imgs/z.png') no-repeat;
		background-size: .34rem;
		background-position: .13rem;
		padding-left: 0.8rem;
		padding-right: .2rem;
		&:after{
			position: absolute;
		    content: '';
		    width: .02rem;
		    height: .3rem;
		    background-color: #c880db;
		    left: 0.64rem;
		    top: 0.13rem;
		}
	}
	.identity.type_h{
		border:1px solid #000;
		color: #000;
		background-image: url('~@/assets/imgs/z.png');
		&:after{
		    background-color: #000;
		}
	}
	.identity.type_b{
		border:1px solid #666666;
		color: #666666;
		background-image: url('~@/assets/imgs/bjk.png');
		&:after{
		    background-color: #666666;
		}
	}
	.identity.type_y{
		border:1px solid #f19e2f;
		color: #f19e2f;
		background-image: url('~@/assets/imgs/j.png');
		&:after{
		    background-color: #f19e2f;
		}
	}
	.identity.type_t{
		border:1px solid #999;
		color: #999;
		background:inherit;
		padding-left: .2rem;
		&:after{
			display:none;
		    background-color: #999;
		}
	}
	.identity.type_p{
		border:1px solid #999;
		color: #999;
		background:inherit;
		padding-left: .2rem;
		&:after{
			display:none;
		    background-color: #999;
		}
	}
	.slip {
    border-top: .12rem solid #7fded6;
    border-bottom: .12rem solid #7fded6;
    border-left: .1rem solid #7fded6;
    border-right: .1rem solid #7fded6;
  }
  .nav.active {
    color: #fff;
    background-color: #4aa59a;
  }
</style>