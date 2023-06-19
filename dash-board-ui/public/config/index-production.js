window.ENV = 'production'
var productionConfig = {
  baseUrl: 'http://gcpaas.gccloud.com/dashboardServer'
}
// 必须的
window.CONFIG = configDeepMerge(window.CONFIG, productionConfig)
