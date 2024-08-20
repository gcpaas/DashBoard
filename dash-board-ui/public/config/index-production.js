window.ENV = 'production'
var productionConfig = {
  baseUrl: 'http://gcpaas.gccloud.com/dashboardServer',
  fileUrlPrefix: 'http://gcpaas.gccloud.com/dashboardServer' + '/static'
}
// 必须的
window.CONFIG = {}
window.CONFIG = configDeepMerge(window.CONFIG, productionConfig)
