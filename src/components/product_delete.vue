<template>
	<div class="master">
		<div v-for="item of productList" class="product" :key="item.id">
			<div class="boxImg"><img src="@/assets/imgs/ic_dengdai.png"></div>
			<div class="info">
				<p class="m-b-20 name">{{item.name}}</p>
				<div class="textInfo m-b-20">
					<span class="t-co">￥{{item.price}}</span>
					<span class="t-cg">{{item.note}}</span>
				</div>
			</div>
		</div>
		<div class="product">
			<div class="boxImg"><img src="@/assets/imgs/ic_dengdai.png"></div>
			<div class="info">
				<p class="m-b-20">日本龙角散柠檬味润喉含片</p>
				<div class="textInfo m-b-20">
					<span class="t-co">￥4.00</span>
					<span class="t-cg">非处方药</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:"product",
		props:{
			productList: Array
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';

	.master{
		margin:0 .2rem;
		display: flex;
		flex-wrap: wrap;
		justify-content:space-between;
	}
	.product{
		width: 48.5%;
		margin-bottom:.1rem;
		.boxImg{
			width: 100%;
			height: 3.2rem;	
			border: 1px solid #e5e5e5;
			margin-bottom: .2rem;
			overflow:hidden;
			img{
				width: 100%;
			}
		}
		.info{
			flex-direction: row-reverse;
			flex-wrap: wrap;
			.name{
				@include oneLines;
			}
		}
		.textInfo{
			justify-content: space-between;
			display: flex;
		}
	}
	.m-b-20{
		margin-bottom: .2rem;
	}
</style>