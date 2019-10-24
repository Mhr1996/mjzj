<template>
	<div class="handleTime">
		<span>{{text}}</span><input type="text" name="DateTime" v-model="DateTime" placeholder="请选择" @click="setTimne($event)" readonly="readonly" Fv="0" :FvInfo="text+`时间不能为空`">
		<van-popup v-model="timeS" position="bottom" :overlay="timeS" :close-on-click-overlay="false">
		  	<van-datetime-picker
			  	type="date"
			  	@confirm="setDate"
			  	@cancel="close"
			  	:min-date="minDate"
			/>
		</van-popup>
	</div>
</template>

<script>
	export default{
		name:"handleTime",
		props:[
			"text",
			"id",
			"type"
		],
		data(){
			return{
				minDate:new Date(this.$tool.Pastdate(0).cDate),
				DateTime: "",
				timeS:false
			}
		},
		methods:{
			setDate(value){
				let vSecond=value.getTime();
				
				this.DateTime=this.$tool.handleDate(vSecond,this.type);
				this.timeS=false;

				let seed={
					date:this.$tool.handleDate(vSecond,1),
					datedense:new Date(vSecond),
					id:this.id
				};
				this.$emit("getTime",seed);
			},
			close(){
				this.timeS=false;
			},
			setTimne(e){
				this.timeS=true;
			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '@/assets/css/common.scss';

	input::-webkit-input-placeholder {
	    color: #cccccc;
	}
	span+input{
		width: 65%;
	}
	span{
		width: 35%;
		color: $g9;
		display: inline-table;
	}
</style>