window.ENV = 'development'
var developmentConfig = {
  baseUrl: 'http://localhost:8082/dashboardServer',
  fileUrlPrefix: 'http://localhost:8082/dashboardServer' + '/static'
}
window.CONFIG={}
// 必须的
window.CONFIG = configDeepMerge(window.CONFIG, developmentConfig)
