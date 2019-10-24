<template>
	<div class="starRating">
		<span class="stars active" :class="item" v-for="(item,index) of itemClasses" @click="setStars(index)" track-by="index"></span>
	</div>
</template>

<script>
	export default{
		name:"starRating",
		data(){
			return{
				score:5
			}
		},
		computed:{ //计算属性
			itemClasses(){
				let result = []; // 返回的是一个数组,用来遍历输出星星
				let score = Math.floor(this.score * 2 ) / 2; // 计算所有星星的数量
				let hasDecimal = score % 1 !== 0; // 非整数星星判断
				let integer = Math.floor(score); // 整数星星判断
				for(let i=0;i<integer;i++){ // 整数星星使用on
					result.push("on"); // 一个整数星星就push一个CLS_ON到数组
				}
				if(hasDecimal){ // 非整数星星使用half
					result.push("half"); // 类似

				} 
				while(result.length < 5){// 余下的用无星星补全,使用off
					result.push("off");
				}
				return result;
			}
		},
		methods:{
			setStars:function(index){
				this.score = index + 1
				this.$emit("getScore",this.score);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.starRating{
		display: flex;
		justify-content: space-around;
		width: 4.5rem;
		margin: 0 auto;
		margin-bottom: .58rem;
		.stars{
			width: .6rem;
			height: .6rem;
			background:url('~@/assets/imgs/greyStars.png') no-repeat;
			background-size: .6rem;
		}
		.stars.on{
			background:url('~@/assets/imgs/openStars.png') no-repeat;
			background-size: .6rem;
		}
	}
</style>