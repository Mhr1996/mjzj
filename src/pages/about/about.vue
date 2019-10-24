<template>
  <!--  关于我们-->
  <div class="about bz oh" style="display: flex;height: 100vh;flex-direction:column;">
    <div style="height:30%; width: 100%; box-sizing: border-box; display: flex;justify-content: center;align-items: center;">
      <div class="logo">
        <img :src="about.logo" alt="">
      </div>
    </div>
    <div style="height:5%; width: 100%; box-sizing: border-box;" class="csb">
      <span>版本</span>
      <span>{{about.versions}}</span>
    </div>
    <div style="height:56%; width: 100%; box-sizing: border-box; overflow-y: auto;" class="p15 lh28"  v-html="about.about">
    </div>
    <div style="height:9%; width: 100%; box-sizing: border-box;">
      <div class="fixed-btm">
        <div @click="goTel(about.tel)" class="tel">客服电话：<span>{{about.tel}}</span></div>
        <p>{{about.company_name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "about",
        data() {
            return {
                tel: 'tel:',
                about: {}
            }
        },
        methods: {
          getAbout() {
            let vis=this;
            this.$http.post('/wxsite/User/api', {
              api_name: 'aboutUs'
            }).then(res => {

              if (res.code === 1) {
                vis.about = res.data;
                console.log(vis.about)
                vis.tel += res.data.local_phone
              }else{
                self.$toast(res.msg);
              }
            })
          },
          goTel(tel){
             window.location.href = 'tel://' + tel;
          }
        },
        created() {
            this.getAbout();
        }
    }
</script>

<style scoped lang="scss">

  @import '@/assets/css/common.scss';


  .about {
    width: 100%;
    min-height: 100vh;
    background: #ffffff;

    .logo {

      width: 1.66rem;
      height: 1.66rem;
      box-shadow: 0 5px 0.24rem 0 rgba(74, 166, 155, 0.5);
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .csb {
      height: .8rem;
      color: #ffffff;
      padding: 0 .5rem;
      background: #4aa69b;

      span {
        font-size: .3rem;
        font-weight: bold;
      }
    }

    .content {
      padding: .25rem;
      line-height: 1.6;
      height: 5.5rem;
      overflow-y: auto;
    }

    .fixed-btm {
      width: 100%;

      * {
        font-size: .24rem;
        font-weight: bold;
      }

      .tel {
        display: block;
        text-align: center;
            height: .48rem;
    line-height: .48rem;

        span {
          color: #4aa69b;
        }
      }

      p {
        text-align: center;
        height: .65rem;
        line-height: .65rem;
        color: #ffffff;
        background: #4aa69b;
      }
    }
  }
</style>
