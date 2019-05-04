// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './config/store.js'
import api from './config/api.js'

import axios from './config/axios.js'
Vue.prototype.$axios = axios

// 自己写的组件
// import lazyimg from './components/global/lazyimg'
// Vue.use(lazyimg);

import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  error: require('./assets/imgs/error.png'),
  loading: ''
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
