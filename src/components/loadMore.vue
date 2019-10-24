<template>
  <!--    上拉加载组件-->
  <div class="infinite-loading"
       ref="scroller"
       @touchstart="touchStartHandle($event)"
       @touchmove="touchMoveHandle($event)"
  >
    <slot></slot>
    <div class="load-more">
      <div class="bottom-tips">
        <template v-if="isLoading">
          <svg viewBox="25 25 50 50" class="loading-hint">
            <circle cx="50" cy="50" r="20" fill="none"></circle>
          </svg>
          <span class="loading-txt">加载中...</span>
        </template>
        <span v-else-if="!hasMore && isShowBottom" class="tips-txt">没有更多了</span>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'loadMore',
        props: {
            // 是否还有更多数据
            hasMore: {
                type: Boolean,
                default: true
            },
            // 是否加载中
            isLoading: {
                type: Boolean,
                default: false
            },
            //是否显示底部到底文字
            isShowBottom: {
                type: Boolean,
                default: false
            },
            // 距离底部多远加载
            threshold: {
                type: Number,
                default: 200
            },
            useWindow: {
                type: Boolean,
                default: true
            },
            // 是否展示懒加载模块内容，一般适用于选项卡切换
            isShowMod: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                startX: 0,
                startY: 0,
                diffX: 0,
                diffY: 0,
                beforeScrollTop: 0
            }
        },

        mounted: function () {
            this.scrollListener();
        },

        methods: {
            touchStartHandle(e) {
                try {
                    this.startX = Number(e.changedTouches[0].pageX);
                    this.startY = Number(e.changedTouches[0].pageY);
                } catch (e) {
                    console.log(e.message);
                }
            },
            touchMoveHandle(e) {
                let endX = Number(e.changedTouches[0].pageX);
                let endY = Number(e.changedTouches[0].pageY);
                this.diffX = endX - this.startX;
                this.diffY = endY - this.startY;
            },

            scrollListener() {
                window.addEventListener('scroll', this.handleScroll, false);
                window.addEventListener('resize', this.handleScroll, false);
            },

            requestAniFrame() {
                return (
                    window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                    }
                );
            },

            handleScroll() {
                this.requestAniFrame()(() => {
                    if (!this.hasMore || !this.isScrollAtBottom() || this.isLoading || !this.isShowMod) {
                        return false;
                    } else {
                        this.$emit('loadmore');
                    }
                })
            },

            calculateTopPosition(el) {
                if (!el) {
                    return 0;
                }
                return el.offsetTop + this.calculateTopPosition(el.offsetParent);
            },

            getWindowScrollTop() {
                return window.pageYOffset !== undefined ?
                    window.pageYOffset :
                    (document.documentElement || document.body.parentNode || document.body)
                        .scrollTop;
            },

            isScrollAtBottom() {
                let offsetDistance;

                const windowScrollTop = this.getWindowScrollTop();
                if (this.useWindow) {
                    offsetDistance =
                        this.calculateTopPosition(this.$refs.scroller) +
                        this.$refs.scroller.offsetHeight -
                        windowScrollTop - window.innerHeight;
                } else {
                    const {
                        scrollHeight,
                        clientHeight,
                        scrollTop
                    } = this.$refs.scroller;
                    offsetDistance = scrollHeight - clientHeight - scrollTop;
                }

                // 保证是往下滑动的
                let beforeScrollTop = this.beforeScrollTop;
                this.beforeScrollTop = windowScrollTop;

                return (offsetDistance <= this.threshold && windowScrollTop >= this.beforeScrollTop);
            }
        },

        destroyed() {
            window.removeEventListener('scroll', this.handleScroll, false);
            window.removeEventListener('resize', this.handleScroll, false);
        }
    }
</script>

<style scoped lang="scss">
  .infinite-loading {
    .bottom-tips {
      width: 100%;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #e6e6e6;
      font-size: .24rem;

      .loading-txt {
        padding-left: .2rem;
        color: #FF836E;
      }

      .loading-hint {
        display: inline-block;
        height: .32rem;
        width: .32rem;
        color: #FF836E;
        /*animation: rotate 1s infinite;*/
        circle {
          stroke: currentColor;
          stroke-width: 3;
          stroke-linecap: round;
          animation: van-circular 1.5s ease-in-out infinite;
          background-color: white;
        }
      }

      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .tips-txt {
        position: relative;

        &:after,
        &:before {
          content: "";
          height: 1px;
          width: 20px;
          background-color: #e6e6e6;
          position: absolute;
          top: 50%;
          margin-top: -0.5px;
        }

        &:before {
          left: -25px;
        }

        &:after {
          right: -25px;
        }
      }
    }
  }

</style>
