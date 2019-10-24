<template>
  <div class="registerAgent pt20 bz">
    <div class="contenct" style="background-color: initial;">
      <img :src="headImg" style="width:1.7rem;height:1.7rem;" class="mauto db mt20 mb50 titlePink">
      <div class=" plr_20 flex-c lh80 cgf b-r mb10 pl10 bst">
        <span style="width:1.5rem;">姓名</span>
        <input type="text" placeholder="请输入姓名" v-model="name" class="flex1" name="" Fv="0" FvInfo="请输入姓名"/>
      </div>
      <div class=" plr_20 flex-c lh80 cgf b-r mb10 pl10 bst">
        <span style="width:1.5rem;">手机号码</span>
        <input type="tel" maxlength="11" placeholder="请输入手机号码" v-model="mobile" class="flex1" name=""  Fv="2"/>
      </div>
      <div class=" plr_20 flex-c lh80 cgf b-r mb10 pl10 bst" v-if="agentLevel.length>0">
        <span style="width:1.5rem;">申请级别</span>
        <select class="flex1" v-model="selectedLevel">
            <option value="">请选择申请级别</option>
            <option v-for="(item,index) in agentLevel" :value="item.agent_type_id" :key="index">{{item.title}} —— {{item.money}}元</option>
        </select>
      </div>
      <div class=" plr_20 flex-c lh80 cgf b-r mb10 pl10 bst">
        <span style="width:1.5rem;">支付方式</span>
        <select class="flex1" v-model="paytype">
          <option value="1">微信</option>
          <option value="2">支付宝</option>
        </select>
      </div>
      <div class=" plr_20 fsb lh80 cgf b-r mb10 pl10 bst">
        <span style="width:1.5rem;">推荐代理</span>
        <input type="text" placeholder="请输入推荐代理的手机号码" v-model="recommend_mobile" class="flex1" name=""/>
      </div>
      <div class=" plr_20 fsb lh80 cgf b-r mb10 pl10 bst relative">
        <span style="width:1.5rem;">附近代理</span>
        <input type="text" placeholder="请输入附近代理的手机号" v-model="near_mobile" class="flex1" name="" @click="go"/>
        <img src="@/assets/imgs/list.png" class="list" @click="go">
      </div>
    </div>
    <button class="submitBtn2 mt50" @click="submit">确认提交支付</button>
    <van-popup v-model="timeS" position="bottom" :overlay="timeS" :close-on-click-overlay="false" style="background-color: #f9f9f9;" @click-overlay="go">
        <div class="cgf br p12 mb10 mlr_15 totems cgf" v-for="(item,index) of orderList" :key="index" @click="checkItem(item)">
            <div class="h100 cca2" style="height: 1.1rem;">
                <span>代理名称:{{item.name}}</span>
                <div class="c9 csb"><span>距离你：{{item.distance}}m</span><div>代理手机号：<span class="cg">{{item.mobile}}</span></div></div>
            </div>
        </div>
    </van-popup>
  </div>
</template>

<script>
    import {chooseWXPay} from '@/assets/js/wxJsSdk.js'


    export default {
        name: "registerAgent",
        components: {},
        data() {
            return {
                name: '',
                selectedLevel: '', //选择的级别
                paytype: 1,
                mobile: '',
                agentLevel: [], //代理级别
                money: 0,
                near_agent_id:'',
                recommend_mobile:'' || this.$route.query.mobile,
                near_mobile:'',
                headImg: '',
                latitude:'' || '22.990714',
                longitude:'' || '113.704505',
                address: '',
                orderList:[],
                agent_id:'',
                timeS: false
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                let vis=this;
                this.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
                this.$http.post('/wxsite/index/getTicket',{}).then(res => {
                    vis.$toast.clear();
                    if (res.code==1) {
                        //获取ticket
                        let timestamp= (new Date().getTime() / 1000).toFixed(0)
                        ,nonceStr=res.nonceStr
                        ,ticket=this.$tool.wx_js(res.data.ticket,timestamp,nonceStr);
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端//alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: res.data.appid, // 必填，公众号的唯一标识
                            timestamp: timestamp, // 必填，生成签名的时间戳
                            nonceStr:  nonceStr, // 必填，生成签名的随机串
                            signature: ticket ,// 必填，签名，见附录1
                            jsApiList: [
                                'checkJsApi',
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQQ',
                                'onMenuShareWeibo',
                                'hideMenuItems',
                                'showMenuItems',
                                'hideAllNonBaseMenuItem',
                                'showAllNonBaseMenuItem',
                                'translateVoice',
                                'startRecord',
                                'stopRecord',
                                'onRecordEnd',
                                'playVoice',
                                'pauseVoice',
                                'stopVoice',
                                'uploadVoice',
                                'downloadVoice',
                                'chooseImage',
                                'previewImage',
                                'uploadImage',
                                'downloadImage',
                                'getNetworkType',
                                'openLocation',
                                'getLocation',
                                'hideOptionMenu',
                                'showOptionMenu',
                                'closeWindow',
                                'scanQRCode',
                                'chooseWXPay',
                                'openProductSpecificView',
                                'addCard',
                                'chooseCard',
                                'openCard'
                            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                        //正式的时候替换
                        wx.getLocation({
                            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                            success: function (res) {
                                vis.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                vis.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                            }
                        });
                    }else{
                        this.$toast(res.data.msg);
                    }
                })
            })
        },
        methods: {
            //获取代理级别
            getAgentLevel() {
                let vis=this;
                this.$http.post('/wxsite/agent/api', {
                    api_name: 'agent_level'
                }).then(res => {
                    if (res.code === 1) {
                        vis.agentLevel = res.data;
                        //vis.selectedLevel = vis.agentLevel[0].agent_type_id;
                    }
                })
            },
            submit() {
                if(this.$tool.formVerification()){
                    if(this.selectedLevel==""){
                        this.$toast('请选择申请级别');
                        return;
                    }
                    let vis = this;
                    this.$toast.loading({
                        duration: 0,       // 持续展示 toast
                        forbidClick: true, // 禁用背景点击
                        loadingType: 'spinner',
                        message: '申请中...'
                    });

                    this.$http.post('/wxsite/agent/api', {
                        api_name: 'apply_agent',
                        agent_type_id: vis.selectedLevel,
                        name: vis.name,
                        mobile: vis.mobile,
                        recommend_mobile: vis.recommend_mobile,
                        near_agent_id: vis.near_agent_id,
                        paytype: vis.paytype,
                        lng:vis.longitude,
                        lat:vis.latitude
                    }).then(res => {
                        if (res.code === 1) {
                            vis.$toast.success('提交成功');
                            setTimeout(()=>{
                                vis.$router.push({
                                    path:'mySpace'
                                })
                            },2000)
                        } else {
                            this.$toast(res.msg);
                        }
                    })
                }
            },
            go(){
               this.timeS=!this.timeS;
            },
            getList(){
                let vis=this,hd=null;
                vis.$http.post("/wxsite/agent/api",{
                    api_name:"near_agent",
                    lat:vis.latitude,
                    lng:vis.longitude,
                    page:1,
                }).then(res => {
                    if (res.code == 1) {
                        let rd=res.data;
                        let center = new qq.maps.LatLng(vis.latitude,vis.longitude);
                        for(let i=0;i<rd.length;i++){
                            if(rd[i].lat!=""&&rd[i].lng!=""){
                                let marker_loc = new qq.maps.LatLng(rd[i].lat,rd[i].lng);
                                rd[i].distance=Math.floor(qq.maps.geometry.spherical.computeDistanceBetween(center, marker_loc));
                            }
                        }
                        vis.orderList=[...vis.orderList,...rd];
                        if (rd.length<10) {
                            vis.finished = true
                        }
                        vis.page++;
                    }else{
                        vis.$toast(res.msg);
                        vis.finished = true;
                    }
                    vis.loading = false;
                })
            },
            checkItem(item){
                this.near_agent_id=item.agent_id;
                this.near_mobile=item.mobile;
                this.timeS=false;
            }
        },
        created() {
            this.getAgentLevel();
            this.getList();
            this.headImg=this.$tool.getStore("headImg");
        }
    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .registerAgent {
    height: 100vh;
    background-color: #f9f9f9;

  }
  .list{
    width: .32rem;
    height: .26rem;
    position: absolute;
    top: .25rem;
    right: .25rem;
    z-index: 10;
  }
  .totems{
        position:relative;
        &:after{
            position:absolute;
            content:'';
            width:.05rem;
            height: .24rem;
            background-color: #4ba59b;
            left: 0;
            top: .4rem;
        }
    }
</style>
