window.ENV = 'development'
var developmentConfig = {
  baseUrl: 'http://localhost:8082/dashboardServer',
  fileUrlPrefix: 'http://localhost:8082/dashboardServer' + '/static'
}
// 必须的
window.CONFIG = configDeepMerge({}, developmentConfig)
