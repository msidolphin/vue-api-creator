// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import api from './api'
import ApiCreator from '../src'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(ApiCreator, {
  baseURL: '/hero',
  modules: api,
  beforeRequest (options) {
    // noop
  },
  afterRequest (response) {
    // noop
  },
  onError (err) {
    Vue.prototype.$notify.error({
      title: '请求异常',
      dangerouslyUseHTMLString: true,
      message: `<div>${err.msg}</div>`
    })
  },
  mock: 'https://www.easy-mock.com/mock/5d47c2e6cc39e6446fe43320/api/backend'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
