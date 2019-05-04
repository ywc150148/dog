<template>
  <div class="lazyimg">
    <img :src="rtimg" v-show="okshow">
  </div>
</template>

<script>
export default {
  props: ["src"],
  name: "",
  data() {
    return {
      okshow: false,
      nosrc:
        "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1979198230,3799788659&fm=27&gp=0.jpg"
    };
  },
  computed: {
    rtimg: function() {
      return this.okshow===true?this.src:this.nosrc;
    }
  },
  mounted() {

    let src = this.src;

    if (src != "") {
      let image = new Image();
      image.src = src;
      image.onload = () => {
        console.log("ok----------");
        this.okshow = true;
      };

       image.onerror = () => {
        console.log("no----------");
        this.okshow = false;
      }
    } 
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.lazyimg {
  width: 100%;
}

.lazyimg img {
  display: block;
  width: 100%;
}
</style>
