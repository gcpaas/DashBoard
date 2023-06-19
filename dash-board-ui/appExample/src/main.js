import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router, { resetRouter } from './router'
import store from './store'
import * as http from './http'
import '@/permission' // permission control

import Vant from 'vant'
// 引入全部样式
import 'vant/lib/index.less'
// 引入全局样式
import '@/assets/css/index.less'
// 移动端适配
import 'amfe-flexible'
import '@/assets/icons'
import { registerConfig } from 'gc-starter-dashboard-app-ui'
registerConfig({
  httpConfigs: {
    baseURL: `http://127.0.0.1:8082/dashboardServer`
  }
}, router)
Vue.use(Vant)
Vue.config.productionTip = false

// 和web千行框架一样
// 挂载全局
Vue.prototype.$resetRouter = resetRouter
// 全局挂载axios
// get 请求封装
Vue.prototype.$get = http.get
// post 请求封装
Vue.prototype.$post = http.post
// put 请求封装
Vue.prototype.$put = http.put
// delete 请求封装
Vue.prototype.$del = http.del
// 文件下载 请求封装
Vue.prototype.$download = http.download
// 包装请求地址
Vue.prototype.$wrapUrl = http.wrapUrl

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
