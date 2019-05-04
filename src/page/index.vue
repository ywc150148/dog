<template>
  <div class="index">
    <div class="tab-swiper">
      <div class="swiper-container" :style="{minHeight:viewHeight}">
        <div class="swiper-wrapper">
          <div class="swiper-slide swiper-slide-0">
            <div
              :class="swiperActive!=0?'swiper-slide-hidden':''"
              :style="{opacity:swiperActive===0?'1':'0',transition: '1.2s',marginBottom: '0.2rem'}"
            >
              <ul class="index-content" v-show="message.length>0">
                <li v-for="(item,index) in message" :key="index">
                  <img v-lazy="item" :style="{background:randomBg()}">
                </li>
              </ul>
            </div>
            <loadmore
              :state="lm.state"
              :throttle="lm.throttle"
              :pretrigger="120"
              @onGetdata="triggerBottom"
              @onBottom="triggerBottom"
              @onRest="handelRest"
              @click.stop
            ></loadmore>

            <!-- <div class="text-center" v-show="message.length<1">Loading...</div> -->
          </div>

          <div
            class="swiper-slide"
            :style="{height:swiperActive!=1?viewHeight:'auto',overflow:'hidden'}"
          >
            <!-- <div>
              <div class="text-center">
                <p
                  class="text-center"
                  :style="{margin:'0.5rem 0'}"
                >{{getStats===true?'hello,dog person':'登录状态：未登录'}}</p>
                <p @click="handeLoginin" v-show="getStats!==true">登录</p>
                <p @click="handeLoginout" v-show="getStats===true">退出</p>
              </div>
            </div>-->

            <p class="breeds-tips text-center">选择显示以下哪个品种的狗狗的随机图片？</p>

            <ul class="breeds-ul">
              <li :class="cateActive===666?'cateActive':''">
                <p class="breeds-name" @click="onBreedsli('breeds','',666)">
                  All
                  <span :class="cateActive===666&&cate=='breeds'?'iconfont icon-flag-o1':'none'"></span>
                </p>
              </li>
              <li
                :class="[item.states===true?'breeds-ul-li-auto':'',cateActive===index?'cateActive':'']"
                v-for="(item,index) in breedslist"
                :key="index"
              >
                <div class="flex-between-center">
                  <p class="breeds-name" @click="onBreedsli(item.name,'',index)">
                    {{item.name}}
                    <span
                      :class="cateActive===index&&cate==item.name?'iconfont icon-flag-o1':'none'"
                    ></span>
                  </p>
                  <span
                    class="iconfont icon-angle-down"
                    @click.stop="breedslist[index].states = !breedslist[index].states"
                    v-show="item.arr!=''"
                  ></span>
                </div>
                <div class="breeds-sub" :class="item.states===true?'breeds-sub-auto':''">
                  <!-- <p class="breeds-sub-title">子品种：</p> -->
                  <p
                    class="breeds-sub-child"
                    v-for="(child,i) in item.arr"
                    :key="i"
                    @click="onBreedsli(item.name,child,index)"
                  >
                    {{child}}
                    <span
                      :class="cateActive===index&&catesub==child?'iconfont icon-bug':'none'"
                    ></span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div id="app-tabbar" :style="{bottom:hideTabber===true?'-1rem':'0',transition: '.5s'}">
      <ul class="app-tabbar-ul flex-wrap-between-center">
        <li v-for="(item,index) in tabber" :key="index" @click="onTabbar(index)">
          <div
            class="app-tabbar-ul-li-child flex-wrap-center"
            :class="tabbarActive===index?'tabbarActive':''"
          >
            <span class="iconfont" :class="tabbarActive===index?item.icon:item.iconActive"></span>
            <span v-if="item.name!=''">{{item.name}}</span>
          </div>
        </li>
      </ul>
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
    var mySwiper;
    return {
      tabbarActive: 0,
      tabber: [
        { name: "dog", icon: "icon-dog", iconActive: "icon--dog" },
        {
          name: "类别",
          icon: "icon-dog_help",
          iconActive: "icon-dog_walk"
        }
      ],
      message: [],
      breedslist: [],
      cate: "breeds",
      catesub: "",
      cateActive: 666,
      swiperActive: 0,
      viewH: 0,
      pageYOffset: 0,
      scrollTop: 0,
      unmarkpageY: false,
      page: 1,
      limit: 20,
      lm: {
        state: 0,
        throttle: false
      },
      hideTabber: false
    };
  },
  watch: {
    swiperActive(n) {
      this.tabbarActive = n; // 改变taber

      if (n === 1 && this.breedslist == "") {
        this.getBreedsList();
      }
    },
    tabbarActive(n) {
      if (n === 0) {
        this.handelscrollTo();
        this.unmarkpageY = false;
      }
    },
    scrollTop(n, o) {
      // if(n>=100) {
      this.hideTabber = n >= 100 && n > o ? true : false;
      // }
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
      this.scrollTop = window.pageYOffset;
      // console.log("this.scrollTop--", this.scrollTop);

      if (this.unmarkpageY === false) {
        this.pageYOffset = window.pageYOffset;
        // console.log("onscroll---this.pageYOffset--", this.pageYOffset);
      }
    };

    this.mySwiper = new Swiper(".swiper-container", {
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

          if (this.activeIndex === 1) {
            window.setTimeout(() => {
              window.scrollTo(0, 0);

              // console.log("切换结束时this.pageYOffset--", self.pageYOffset);
            }, 100);
          }
        },
        touchStart: function(event) {
          self.unmarkpageY = true;
        },
        touchMove: function(event) {
          if (this.activeIndex === 0) {
            this.pageYOffset = window.pageYOffset;
          }
        },
        touchEnd: function(event) {
          //你的事件
          // if (this.activeIndex) {
          //   window.setTimeout(() => {
          //     this.pageYOffset = window.pageYOffset;
          //   }, 100);
          // }
        }
      }
    });
  },
  methods: {
    getData: function() {
      const self = this;

      this.lm.throttle = true;
      this.lm.state = 1;
      let breed = this.cateActive !== 666 ? "breed/" : "";
      let catesub = this.catesub != "" ? "/" + this.catesub : "";
      let plural = this.cateActive !== 666 ? "/images/" : "/image/";
      let url =
        "https://dog.ceo/api/" +
        breed +
        this.cate +
        catesub +
        plural +
        "random/" +
        self.limit;

      this.$axios
        .get(url, {
          params: {}
        })
        .then(function(response) {
          if (response.data.status === "success") {
            self.message = self.message.concat(response.data.message);
            self.page++;
            self.lm.state = self.message.length >= self.count ? 2 : 0;
            self.lm.throttle = false;
          }
        })
        .catch(function(error) {
          self.lm.throttle = false;
          self.lm.state = self.message.length >= self.count ? 2 : 3;
        });
    },
    getBreedsList: function() {
      const self = this;
      this.$axios
        .get(API.OPEN.dogceo.breeds_list, {
          params: {}
        })
        .then(function(response) {
          if (
            response.data.status === "success" &&
            response.data.message != ""
          ) {
            let arr = [];

            for (var a in response.data.message) {
              arr.push({
                name: a,
                states: false,
                arr: response.data.message[a]
              });
            }

            self.breedslist = arr;

            // console.log("self.breedslist", self.breedslist);
          }
        })
        .catch(function(error) {});
    },
    triggerBottom: function() {
      // console.log("dddddddddddd");

      // console.log("this.unmarkpageY------", this.unmarkpageY);
      // console.log("this.lm.throttle------", this.lm.throttle);
      // 触发底部
      if (this.lm.throttle === false) {
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
      // console.log("handelscrollTo----------", this.pageYOffset);
    },
    onTabbar: function(index) {
      this.swiperActive = index;
      this.mySwiper.slideTo(index, 500, false);

      if (index === 1) {
        window.setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      }
    },
    randomBg: function() {
      let bg = "#" + Math.floor(Math.random() * 256).toString(10);
      return bg;
    },
    onBreedsli: function(name, subname, index) {
      this.cate = name;
      this.catesub = subname;
      this.cateActive = index;
      this.message = [];
      this.lm.throttle = false;
      this.unmarkpageY === false;
      this.pageYOffset = 0;
      this.getData();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/assets/css/common/_base.scss";
@import "@/assets/css/index.scss";
</style>


