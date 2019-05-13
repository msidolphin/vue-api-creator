// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import api from './api'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ApiCreator from '../dist'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(ApiCreator, {
  modules: api,
  beforeRequest (options) {
    console.log(options)
  },
  axios: {
    baseURL: '/hero'
  },
  mock: 'http://rap2api.taobao.org/app/mock/165812'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
