window.ENV = 'development'
var developmentConfig = {
  baseUrl: 'http://gcpaas.gccloud.com/dashboardServer',
  fileUrlPrefix: 'http://gcpaas.gccloud.com/dashboardServer' + '/static'
}
window.CONFIG={}
// 必须的
window.CONFIG = configDeepMerge(window.CONFIG, developmentConfig)
