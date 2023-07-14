import 'dashPackages/assets/style/common/index.scss'
import 'dashPackages/assets/style/bsTheme.scss'

import * as $dashboardAxios from 'dashPackages/js/utils/http.js'

import $dashboardStore from 'dashPackages/js/store'
// 仪表盘管理页面
import DashboardManagement from 'dashPackages/DashboardMag'

import DashboardAppRun from 'dashPackages/DashboardAppRun'
// 渲染整个dashboard的渲染引擎
import DashboardRun from 'dashPackages/DashboardRun'
// 仪表盘设计引擎
import DashboardDesign from 'dashPackages/DashboardDesign'
// 数据源管理
import DataSourceManagement from 'dashPackages/DataSourceManagement'
// 数据集管理
import DataSetManagement from 'dashPackages/DataSetManagement'

// 仪表盘 vuex store数据
// import dashboardStore from 'dashPackages/js/store'
// 注册基础配置
import registerConfig from 'dashPackages/js/utils/registerConfig'
// 更新主题
import updateTheme from 'dashPackages/js/utils/updateTheme'

const DashboardSourceMag = () => import('./SourceMag')
// 大屏组件管理页面
const DashboardComponentMag = () => import('./DashboardComponentMag')

// 存储组件列表
const components = [
  DashboardManagement,
  DashboardRun,
  DashboardDesign,
  DataSetManagement,
  DataSourceManagement,
  DashboardAppRun,
  DashboardSourceMag,
  DashboardComponentMag
]

function install (Vue) {
  components.map(component => {
    Vue.component(component.name, component)
  })
}

export {
  install,
  DashboardManagement,
  DashboardRun,
  DashboardDesign,
  DataSetManagement,
  DataSourceManagement,
  DashboardAppRun,
  DashboardSourceMag,
  DashboardComponentMag,
  $dashboardAxios,
  $dashboardStore,

  registerConfig,
  updateTheme
}

export default {
  install,
  DashboardManagement,
  DashboardRun,
  DashboardDesign,
  DataSetManagement,
  DataSourceManagement,
  DashboardAppRun,
  DashboardSourceMag,
  DashboardComponentMag,
  $dashboardAxios,
  $dashboardStore,

  registerConfig,
  updateTheme
}
