/*
 * @description:
 * @Author: wujian
 * @Date: 2022-11-04 13:47:55
 * @LastEditors: xing.heng
 * @LastEditTime: 2023-06-13 11:07:48
 */
// npm run serve 开发运行时需要修改该配置文件
window.ENV = 'development'
/**
 * 直接按照格式定义参数即可，避免重复 window.SITE_CONFIG[xxx]=yyy
 */
 var developmentConfig = {
  starter: {
    logo:{
      login:'/static/images/login/logo.png'
    }
  },
    baseUrl: 'http://127.0.0.1:8082/dashboardServer'
}
// 必须的
window.SITE_CONFIG = configDeepMerge(window.SITE_CONFIG,developmentConfig)
