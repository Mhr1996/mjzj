<template>
  <div class="agentManage pt10">
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :offset="100"
    @load="getList"
    >
        <div class="mt10 mlr_10 cgf slip p15 bz fsb br5" v-for="(item,index) in orderList " :key="index "
        style="height:2.2rem;" @click="goDetail(item.agent_id)">
            <img :src="item.head_img" class="br5 mr15" style="width: 1.33rem;height: 1.33rem;"/>
            <div class="cca2 flex1 pl15" style="border-left: .12rem dotted #489f97;">
                <p>{{item.name}}</p>
                <p class="c9">代理编号:{{item.number}}</p>
                <p class="c9">手机号:{{item.mobile}}</p>
            </div>
        </div>
    </van-list>
  </div>
</template>

<script>


    export default {
        name: "agentManage",
        data() {
            return {
                finished : false,
                loading  : false,
                orderList: [],
                page     : 1,
                pagesize : 10
            }
        },
        methods: {
            getList() {
                let vis=this;
                this.$toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '加载中...'
                });

                this.$http.post('/wxsite/Userspace/api', {
                    api_name: 'agentGroupList',
                    page: vis.page,
                    pagesize : vis.pagesize
                }).then(res => {
                    this.$toast.clear();
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
            goDetail(id) {
                this.$router.push({
                    path: '/agentDetail',
                    query: {id}
                })
            }

        },
        created() { }
    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .agentManage {
    min-height: 100vh;
    background-color: #f9f9f9;
  }

  .slip {
    border-top: .12rem solid #7fded6;
    border-bottom: .12rem solid #7fded6;
    border-left: .1rem solid #7fded6;
    border-right: .1rem solid #7fded6;
  }
</style>
