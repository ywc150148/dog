<template>
  <div id="app">

    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {

    };
  },
  components: {},
  mounted() {
    const self = this;
    this.setFontsize();

    window.onresize = () => {
      self.setFontsize();
    };
  },
  methods: {
    setFontsize: function() {
      let windowW =
        document.documentElement.offsetWidth > 750
          ? 750
          : document.documentElement.offsetWidth;
      document.documentElement.style.fontSize = (windowW / 750) * 100 + "px";
    }
  }
};
</script>

<style lang="scss">
@import "./assets/css/iconfont.css";
@import "./assets/css/common/_base.scss";
@import "./assets/css/common/_reset.css";
@import "./assets/css/common/_common.css";

#app {
  position: relative;
}
</style>
