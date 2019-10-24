<template>
  <div class="record pt10">


    <div class="cgf br p12 mb10 mlr_15 totems" v-for="(item,index) in dataList" :key="index">
      <div class="mb20 csb">
        <span>{{item.name}}</span> <span>{{item.uname}}</span>
      </div>
      <div class="csb">
        <span class="c9">{{item.start_time}}</span><span class="co">{{item.money}}元</span>
      </div>
    </div>

    <no-data v-if="noData"></no-data>

  </div>
</template>

<script>

    import noData from '@/components/noData.vue'

    export default {
        name: "record",
        components: {},
        data() {
            return {
                dataList: [],
                noData: false
            }
        },

        components: {
            noData
        },

        methods: {

            //获取使用记录
            getRecord() {

                this.$toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '加载中...'
                });


                this.$http.post('/wxsite/User/api', {
                    api_name: "record",
                    user_id: localStorage.user_id
                }).then(res => {
                    this.$toast.clear();
                    if (res.code === 1) {

                        if (res.data.length > 0) {
                            this.dataList = res.data;
                        } else {
                            // this.$toast('暂无数据');
                            this.noData = true;
                        }

                    } else {
                        this.$toast(res.msg);
                    }

                })

            },

        },
        created() {
            this.getRecord();
        },
    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .record {
    min-height: 100vh;
    background-color: #f9f9f9;
  }

  .totems {
    position: relative;

    &:after {
      position: absolute;
      content: '';
      width: .04rem;
      height: .24rem;
      background-color: #ff836e;
      left: 0;
      top: .23rem;
    }
  }
</style>
