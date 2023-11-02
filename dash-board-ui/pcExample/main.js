import 'babel-polyfill'
import promise from 'es6-promise'

import Vue from 'vue'
import ElementUI from 'element-ui'

import App from './App'
import store from './store'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/index.scss'
import { registerConfig } from '@gcpaas/dash-board-ui'
import * as $dashboardAxios from 'dashPackages/js/utils/http.js'
import remoteComponents from '@/remoteComponents/exports.js'
import customDatasetComponents from '@/customDatasetComponents/exports.js'
Vue.use(ElementUI, { size: 'mini' })
registerConfig(
  {
    routers: {
      pageManagementUrl: '/'
    },
    httpConfigs: {
      baseURL: window.CONFIG?.baseUrl,
      // 现在文件路径保存的是相对路径，所以需要加上前缀,这个值一般和后端的gc.starter.file.urlPrefix一致
      fileUrlPrefix: window.CONFIG.fileUrlPrefix ? window.CONFIG.fileUrlPrefix : window.CONFIG?.baseUrl + '/static',
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
    // 允许上传的资源库文件类型
    sourceExtends: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico', 'xls', 'xlsx', 'csv'],
    // datasetTypeList: ['original', 'custom'],
    // sourceTypeList: [
    //   { label: 'Mysql', code: 'mysql', name: 'com.mysql.jdbc.Driver', url: 'jdbc:mysql://localhost:3306/db_name?serverTimezone=GMT%2B8&useUnicode=true&characterEncoding=utf-8&useSSL=false&useOldAliasMetadataBehavior=true' },
    //   { label: 'ClickHouse', code: 'clickhouse', name: 'ru.yandex.clickhouse.ClickHouseDriver', url: 'jdbc:clickhouse://localhost:8123/db_name' },
    //   { label: 'test', code: 'test', name: 'test', url: 'test' }
    // ],
    datasetAuth: ['unAdd', 'unEdit', 'unDelete'], // 数据集按钮权限 新增 编辑 删除
    customPlots: [],
    // 远程组件列表
    remoteComponents,
    customDatasetComponents

  },
  router
)

promise.polyfill()
// 自定义指令
Vue.use(ElementUI, { size: 'mini' })
Vue.prototype.$dashboardAxios = $dashboardAxios
Vue.config.productionTip = false
/* eslint-disable no-new */
// 兼容ie下双向绑定事件
Vue.prototype.inputChange = function (e) {
  return e.target.value
}
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
