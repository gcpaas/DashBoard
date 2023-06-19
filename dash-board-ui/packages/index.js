import 'packages/assets/style/common/index.scss'
import 'packages/assets/style/bsTheme.scss'
// 仪表盘管理页面
import DashboardManagement from 'packages/DashboardMag'
// 渲染整个dashboard的渲染引擎
import DashboardRun from 'packages/DashboardRun'
// 仪表盘设计引擎
import DashboardDesign from 'packages/DashboardDesign'
// 数据源管理
import DataSourceManagement from 'packages/DataSourceManagement'
// 数据集管理
import DataSetManagement from 'packages/DataSetManagement'

// 仪表盘 vuex store数据
import dashboardStore from 'packages/js/store'
// 注册基础配置
import registerConfig from 'packages/js/utils/registerConfig'
// 更新主题
import updateTheme from 'packages/js/utils/updateTheme'

// 存储组件列表
const components = [
  DashboardManagement,
  DashboardRun,
  DashboardDesign,
  DataSetManagement,
  DataSourceManagement
]

const $dashboard = {
  dashboardStore
}

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

  $dashboard,
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

  $dashboard,
  registerConfig,
  updateTheme
}
