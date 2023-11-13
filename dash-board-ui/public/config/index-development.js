window.ENV = 'development'
var developmentConfig = {
  baseUrl: 'http://gcpaas.gccloud.com/dashboardServer',
  fileUrlPrefix: 'http://gcpaas.gccloud.com/dashboardServer' + '/static'
}
// 必须的
window.CONFIG = configDeepMerge(window.CONFIG, developmentConfig)
