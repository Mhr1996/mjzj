<template>
  <div class="agentUpgrade pt20 bz">
    <div class="contenct" style="background-color: initial;">
      <img :src="imgHead" style="width:1.7rem;height:1.7rem;" class="mauto db mt20 mb50 titlePink">
      <div class=" plr_20 flex-c lh80 cgf b-r mb10 pl10 bst">
        <span style="width:1.5rem;">姓名</span>
        <input type="text" placeholder="请输入姓名" v-model="name" class="flex1" Fv="0" FvInfo="请输入姓名"/>
      </div>
      <div class=" plr_20 flex-c lh80 cgf b-r mb10 pl10 bst">
        <span style="width:1.5rem;">手机号码</span>
        <input type="tel" maxlength="11" placeholder="请输入手机号码" v-model="mobile" class="flex1"  Fv="2"/>
      </div>
      <div class=" plr_20 flex-c lh80 cgf b-r mb10 pl10 bst" v-if="agentLevel.length>0">
        <span style="width:1.5rem;">申请级别</span>
        <select class="flex1" v-model="selectedLevel">
          <option v-for="(item,index) in agentLevel" :value="item.agent_type_id" :key="index">{{item.title}}</option>
        </select>
      </div>
      <div class=" plr_20 fsb lh80 cgf b-r mb10 pl10 bst">
        <span style="width:1.5rem;">推荐代理</span>
        <input type="text" placeholder="请输入推荐代理的手机号码" v-model="recommend_mobile" class="flex1"/>
      </div>
    </div>
    <button class="submitBtn2 mt50" @click="submit">确认提交</button>
  </div>
</template>

<script>
    import {chooseWXPay} from '@/assets/js/wxJsSdk.js'


    export default {
        name: "agentUpgrade",
        components: {},
        data() {
            return {
                imgHead:'',
                name: '',
                selectedLevel: '', //选择的级别
                mobile: '',
                agentLevel: [], //代理级别
                recommend_mobile:''
            }
        },

        methods: {
            //获取代理级别
            getAgentLevel() {
                let vis=this;
                vis.$toast.loading({duration:0, forbidClick:true, mask:true, loadingType:'spinner', message:'加载中...'});
                vis.$http.post('/wxsite/agent/api', {
                    api_name: 'agent_level'
                }).then(res => {
                  vis.$toast.clear();
                    if (res.code === 1&&res.data.length>0) {
                        vis.agentLevel = res.data;
                        vis.selectedLevel = vis.agentLevel[0].agent_type_id;
                    }
                })
            },
            submit() {
              let vis = this;
              if(vis.$tool.formVerification()){
                this.$toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '申请中...'
                });

                this.$http.post('/wxsite/agent/api', {
                    api_name: 'up_agent',
                    name:vis.name,
                    mobile:vis.mobile,
                    agent_type_id:vis.selectedLevel,
                    recommend_mobile:vis.recommend_mobile
                }).then(res => {
                    if (res.code === 1) {
                        vis.$toast("提交成功，等待平台审核");
                          vis.selectedLevel = vis.agentLevel[0].agent_type_id;
                          vis.name="";
                          vis.mobile="";
                          vis.recommend_mobile="";                   
                        } else {
                        vis.$toast(res.msg);
                    }
                })
              }
            },
          go(){
            this.$router.push({
              path,
              query: query
            });
          }
        },
        created() {
          this.imgHead=this.$tool.getStore("headImg");
          this.getAgentLevel();
        }
    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .agentUpgrade {
    height: 100vh;
    background-color: #f9f9f9;

  }
</style>
