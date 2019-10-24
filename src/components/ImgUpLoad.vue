<template>
	<div class="ImgUpLoad">
		<input @change="fileChange($event)" type="file" :id="file" style="display: none" accept="image/*" >
		<div class="item" v-for="(item,index) of imgLook" :key="index" :style="{width:width,height:height}">
			<img :src="item"/><span class="del" @click="delImg(index)">删除</span>
		</div>
		<div class="item add" @click="chooseType()"  :style="{width:width,height:height}"><!-- <img src="@/assets/imgs/add.png"/> --></div>
	</div>
</template>

<script>
	export default{
		name:"ImgUpLoad",
		props:[
			"width",
			"height",
			"file"
		],
		data(){
			return{
				imgLook: [],
				imgFile: []
			}
		},
		methods:{
			chooseType() {
		        document.getElementById(this.file).click();
		    },
		    fileChange(e) {
		    	if(this.imgFile.length>6){
		    		this.$toast('最多上传六张图片');
		    		return false;
		    	}
		    	let that = this;
		    	let file = e.target.files[0];
		    	if (file) {
		    		this.imgFile.push(file);
		    		let reader = new FileReader();
		    		reader.readAsDataURL(file);
		    		reader.onload = function (e) {
		    			that.imgLook.push(this.result);
		    		}
		    		this.$emit("setImgFile", this.imgFile, this.file);
		    	}
		    },
		    delImg(index){
		    	this.imgLook.splice(index,1);
		    	this.imgFile.splice(index,1);
		    	this.$emit("delImgFile", index, this.file);
		    }
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';
	.ImgUpLoad{
		display: flex;
		flex-wrap: wrap;
	}
	.item{
		overflow: hidden;
		margin-bottom: .2rem;
		margin: .14rem 0;
	    padding: 0 .1rem;
	    box-sizing: border-box;
	    position: relative;
		img{
			width: 100%;
		}
		.del{
			position: absolute;
		    top: 0;
		    right: .1rem;
		    width: .6rem;
		    height: 0.3rem;
		    line-height: 0.3rem;
		    text-align: center;
		    font-size: 0.24rem;
		    background-color: #e05959;
		    padding: .08rem;
		    color: #fff;
		    z-index: 10;
		}
	}
	.item.add{
		background: url("~@/assets/imgs/add.png") no-repeat;
    	background-size: 50%;
    	background-position: 50% 50%;
    	border: 1px dashed #ccc;
	}
</style>