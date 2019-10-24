<template>
  <div class="myCollection oh">
    <div class=" br m15">
      <loadMore @loadmore="getCollection(page)"
                :is-show-mod="true"
                :has-more="isHasMore"
                :is-loading="isLoading"
                :threshold="200">
                <div class="fsb p12 cgf bbf5" v-for="(item,index) in collect" :key="index" tag="div">
                    <router-link :to="{path:'commodityDetails' , query:{goods_id:item.goods_id}}" :src="item.img" class="br5 mr15" style="width:1.05rem;height: 1.05rem;" tag="img"></router-link>
          <div class="fsb flex1">
            <div class=" cca2 flex1" style="height: 1.05rem;">
              <router-link :to="{path:'commodityDetails' , query:{goods_id:item.goods_id}}"tag="p">{{item.title}}</router-link>
              <p class="co">￥{{item.member_price }}</p>
            </div>
            <img src="@/assets/imgs/love.png" class="p15" style="width:.36rem; height: .32rem;"
              @click="cancelCollection(item.goods_id)">
          </div>
        </div>
      </loadMore>
    </div>

    <no-data v-if="noData"></no-data>

  </div>
</template>

<script>
    import loadMore from '@/components/loadMore.vue'
    import noData from '@/components/noData.vue'

    export default {
        name: "myCollection",
        components: {
            loadMore,
            noData
        },
        data() {
            return {
                page: 1,
                isHasMore: true,    //是否还有更多数据
                isLoading: false,   //是否加载中
                collect: [],
                noData: false

            }
        },

        methods: {

            //获取我的收藏列表
            getCollection(page = 1) {
                this.isLoading = true;
                this.$http.post('/wxsite/goods/api', {
                    api_name: 'myFavor',
                    p: page,
                    pagesize: 10
                }).then(res => {
                    this.isLoading = false;
                    if (res.code === 1) {
                        let data = res.data;
                        if (data.length === 0 && page == 1 && this.collect.length === 0) {
                            // this.$toast('暂无数据');
                            this.noData = true;
                            return false
                        } else if (data.length === 0) {
                            this.$toast('没有更多数据~');
                            this.isHasMore = false;
                            return false
                        }
                        this.collect.push(...data);
                        this.page++;
                    }

                }).catch(err => {
                    this.isLoading = false;
                    this.isHasMore = false;
                })


            },

            //取消收藏
            cancelCollection(id) {
                this.$dialog.confirm({
                    title: '取消收藏',
                    message: '您确定要取消收藏吗?',
                    confirmButtonColor: '#FF836E'
                }).then(() => {
                    // on confirm
                    this.$toast.loading({
                        duration: 0,
                        forbidClick: true,
                        loadingType: 'spinner',
                        message: '取消中..'
                    });

                    this.$http.post('/wxsite/goods/api', {
                        api_name: 'doCancelFavor',
                        goods_id: id
                    }).then(res => {
                        this.$toast.clear();
                        if (res.code === 1) {
                            this.$toast.success('取消收藏成功');
                            this.collect=[];
                            this.getCollection();
                        } else {
                            this.$toast.fail(res.msg);
                        }

                    })


                })
            }


        },

        created() {
            this.getCollection()
        },
    }
</script>

<style lang="scss" scoped>
  @import '@/assets/css/common.scss';

  .myCollection {
    min-height: 100vh;
    background-color: #f9f9f9;
    .no-data{
      transform: translateY(-2.5rem);
    }
  }


</style>
