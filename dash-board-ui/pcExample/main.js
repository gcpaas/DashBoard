import 'babel-polyfill'
import promise from 'es6-promise'

import Vue from 'vue'
import ElementUI from 'element-ui'

import App from './App'
import store from './store'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/index.scss'
import { registerConfig } from 'gc-starter-dashboard-ui'
import remoteComponents from '@/remoteComponents/exports.js'
Vue.use(ElementUI, { size: 'mini' })

registerConfig(
  {
    routers: {
      pageManagementUrl: '/'
    },
    httpConfigs: {
      baseURL: window.CONFIG?.baseUrl
    },
    customTheme: {
      '--db-background-header': '#007aff', // 头部颜色
      '--db-background-leftPanel': '#eef2f7', // 左侧组件栏背景色
      '--db-background-1': '#fff', // 整体背景色
      '--db-background-2': '#fff', // 布局背景色
      '--db-background-3': '#f6f7fb', // 列表背景色
      '--db-el-background-1': '#fff', // 组件背景色，输入框...
      '--db-el-background-2': '#F5F7FA', // 组件背景色，按钮、分页、加载...
      '--db-el-background-3': '#F5F7FA', // 组件背景色，表格头部、下拉框hover...
      '--db-el-title': '#76838f', // 标题字体颜色
      '--db-el-text': '#36474f', // 一般字体颜色
      '--db-el-color-primary': '#409EFF', // elment-ui主题色，激活
      '--db-el-border': 'transparent' // 边框颜色
    },
    customPlots: [],
    // 远程组件列表
    remoteComponents
  },
  router
)

promise.polyfill()
// 自定义指令
Vue.use(ElementUI, { size: 'mini' })
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
