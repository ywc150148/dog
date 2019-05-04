<template>
  <div class="index">
    <div class="tab-swiper">
      <div class="swiper-container" :style="{minHeight:viewHeight}">
        <div class="swiper-wrapper">
          <div class="swiper-slide swiper-slide-0" >
            <div :class="swiperActive!=0?'swiper-slide-hidden':''" :style="{opacity:swiperActive===0?'1':'0',transition: '0.8s'}">
              <p>首页</p>
              <ul class="index-content" v-show="datalist.length>0">
                <!-- <li v-for="(item,index) in datalist" :key="index">
                  <p>{{index}}、{{item.title}}</p>
                  <router-link :to="'/read/'+item.id">阅读</router-link>
                </li> -->
              </ul>
              <loadmore
                :state="lm.state"
                :throttle="lm.throttle"
                :pretrigger="5"
                @onGetdata="triggerBottom"
                @onBottom="triggerBottom"
                @onRest="handelRest"
                v-show="count>limit && datalist.length>1"
              ></loadmore>
            </div>
          </div>

          <div class="swiper-slide">
            <div>
              <p>登录状态：{{getStats===true?'你好，xxx':'未登录'}}</p>
              <p @click="handeLoginin">点击登录</p>
              <p @click="handeLoginout">退出登录</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 加载更多
import Swiper from "swiper";
import "swiper/dist/css/swiper.css";
import loadmore from "@/components/common/loadmore";

export default {
  name: "index",
  data() {
    return {
      datalist: [],
      count: 999999999,
      page: 1,
      limit: 10,
      lm: {
        state: 0,
        throttle: false
      },
      swiperActive: 0,
      viewH: 0,
      pageYOffset: 0,
      unmarkpageY: false
    };
  },
  watch: {
    swiperActive(n) {
      if (n === 0) {
        window.setTimeout(() => {
          this.handelscrollTo();
          this.unmarkpageY = false;
        }, 100);
      }
    }
  },
  components: {
    loadmore
  },
  computed: {
    getStats: function() {
      return this.$store.state.isLogin;
    },
    viewHeight: function() {
      return this.viewH > 0 ? this.viewH + "px" : "100%";
    }
  },
  mounted() {
    this.getData();
    const self = this;

    this.viewH = document.documentElement.clientHeight;

    window.onresize = () => {
      this.viewH = document.documentElement.clientHeight;
    };

    window.onscroll = () => {
      if (this.unmarkpageY === false) {
        this.pageYOffset = window.pageYOffset;
      }
    };

    var mySwiper = new Swiper(".swiper-container", {
      direction: "horizontal", // 垂直滚动：vertical, 横向滚动：horizontal
      initialSlide: 0, // 初始显示下标为n的Slide
      autoplay: false,
      observer: true, // 修改swiper自己或子元素时，自动初始化swiper
      observeParents: true, //修改swiper的父元素时，自动初始化swiper
      on: {
        // 回调
        init: function() {
          self.swiperActive = this.activeIndex; // 当前Slide下标
        },
        slideChangeTransitionEnd: function() {
          // 切换结束时 执行的方法
          self.swiperActive = this.activeIndex;
        },
        touchStart: function(event) {
          self.unmarkpageY = true;
        },
      }
    });
  },
  methods: {
    getData: function() {
      const self = this;

      this.lm.throttle = true;
      this.lm.state = 1;

      this.$axios
        .get('https://dog.ceo/api/breeds/list/all', {
          params: {
            data: 0,
            page: self.page,
            limit: self.limit
          }
        })
        .then(function(response) {
          if (response.data.code == 200) {
            console.log("ip-----",response)
            self.datalist = self.datalist.concat(response.data.data);
            self.page++;
            self.lm.state = self.datalist.length >= self.count ? 2 : 0;
            self.lm.throttle = false;
          }
        })
        .catch(function(error) {
          self.lm.throttle = false;
          self.lm.state = self.datalist.length >= self.count ? 2 : 3;
        });
    },
    triggerBottom: function() {
      // 触发底部
      if (this.datalist.length < this.count && this.lm.throttle === false && this.unmarkpageY === false) {
        this.getData();
      }
    },
    handelRest: function() {
      // 点击重试
      this.triggerBottom();
    },
    handeLoginin: function() {
      this.$store.commit("login_in", true);
    },
    handeLoginout: function() {
      this.$store.commit("login_out", false);
    },
    handelscrollTo: function() {
      window.scrollTo(0, this.pageYOffset);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/assets/css/common/_base.scss";

.index {
  width: 100%;
  padding: torem(20px);
  box-sizing: border-box;
  background: darkcyan;
}

.tab-swiper {
  width: 100%;
}

.swiper-container {
  position: relative;
  width: 100%;
}

.swiper-slide {
  width: 100%;
}

.swiper-slide-hidden {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.index h1 {
  text-align: center;
}

.index-content {
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.index-content li {
  margin-bottom: torem(20px);
  padding: torem(20px);
  width: 100%;
  text-align: left;
  box-sizing: border-box;
  background: #ffffff;
  cursor: pointer;
}
</style>


