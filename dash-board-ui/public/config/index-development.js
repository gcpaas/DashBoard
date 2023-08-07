window.ENV = 'development'
var developmentConfig = {
  baseUrl: 'http://192.168.212.55:8082/dashboardServer'
}
// 必须的
window.CONFIG = configDeepMerge(window.CONFIG, developmentConfig)
