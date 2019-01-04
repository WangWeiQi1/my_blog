// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import './assets/icon/iconfont.css'
import VueLazyLoad from 'vue-lazyload'
import hzqingVueTimeline from 'hzqing-vue-timeline'
Vue.use(hzqingVueTimeline)

Vue.config.productionTip = false

Vue.use(VueLazyLoad,{
  loading: require('common/image/erha.jpg')
})

Vue.use(ElementUI);

import 'common/stylus/reset.styl'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
