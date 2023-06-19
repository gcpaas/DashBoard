/*
 * @description:
 * @Author: wujian
 * @Date: 2022-11-04 13:48:11
 * @LastEditors: wujian
 * @LastEditTime: 2023-06-05 16:58:18
 */
// npm run build 打包部署时需要修改该配置文件
window.ENV = 'production'
/**
 * 直接按照格式定义参数即可，避免重复 window.SITE_CONFIG[xxx]=yyy
 */
var productionConfig = {
  starter:{
    logo:{
      login:'/static/images/login/logo.png'
    }
  },
  baseUrl: 'http://gcpaas.gccloud.com/dashboardServer',
}
// 必须的
window.SITE_CONFIG = configDeepMerge(window.SITE_CONFIG,productionConfig)
