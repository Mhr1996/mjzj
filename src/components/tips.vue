<template>
	<div class="tips">
		<div class="content" v-show="tipsList.onOff">
			<div v-if="tipsList.title"  class="border-bottom title">提示</div>
			<div v-if="tipsList.img_src"><img :src="tipsList.img_src"></div>
			<div v-if="tipsList.state"  class="state" v-html="tipsList.state"  ></div>
			<div v-if="tipsList.msg"	class="msg" :style="`font-size:`+tipsList.size" v-html="tipsList.msg"></div>
			<div v-if="tipsList.submit" class="button" @click="know">确定</div>
		</div>
		<div class="blackShadow" v-show="tipsList.onOff" @click="hide"></div>
	</div>
</template>

<script>
	export default{
		name:"tips",
		props:[
			"tipsList"
		],
		methods:{
			know(){
				this.$emit("know");
			},
			hide(){
				if(tipsList.boxOff){
					tipsList.onOff=false;
				}
			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';

	.blackShadow{
		background-color: #000;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.5;
		z-index: 10;
	}
	.content{
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: 11;
		background-color: #fff;
		width: 80%;
		margin-left: -40%;
		@include border-radius(.14rem);
		margin-top: -2.5rem;
		overflow: hidden;
		img{
			width: 1rem;
			height: 1rem;
			margin: .7rem auto 0;
			display: block;
		}
		.button{
			width: 100%;
			height: 1rem;
			line-height: 1rem;
			text-align: center;
			background-color: $this_y;
			color: #fff;
		}
		.state{
			font-size: .32rem;
			text-align: center;
			padding-top: .4rem;
		}
		.msg{
			text-align: center;
			padding: .4rem 0;
			font-size: .24rem;
			width:90%;
			margin: 0 auto;
    		line-height: 120%;
			p{
				margin-bottom: .3rem;
			}
		}
		.title{
			height: 1.2rem;
			line-height: 1.2rem;
			text-align: center;
			font-size: .32rem;
			font-weight: bold;
		}
	}
</style>