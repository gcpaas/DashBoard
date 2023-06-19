/*
 * @description: TODO: permission 权限控制，此处参考web端千行框架，省略了路由权限部门，后续更新
 * @Date: 2022-10-09 09:17:08
 */

import router from './router'
import store from './store'
import * as tokenCacheService from '@/http/cache/tokenCacheService'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/dashboard', '/404', '/dashboard/preview','/dashboard/app-preview']

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const token = tokenCacheService.get()
  if (!token) {
    //  还没有登录过,如果是白名单路由，那么不登录也可以访问
    if (whiteList.indexOf(to.path) !== -1) {
      next()
      return
    }
    // 没有登录的话 需要跳转到登录页面，如果是单点登录的话需要调整到认证服务器的登录地址
    if (window.SITE_CONFIG.starter.cas.enable) {
      window.location.href = window.SITE_CONFIG.starter.cas.loginUrl
      return
    }
    next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    return
  }
  if (to.path === '/login') {
    return
  }
  next()
  // 这里认为已经登录了，有没有过期这里不校验
  try {
    // next({ ...to, replace: true })
  } catch (error) {
    // 清除 token
    await store.dispatch('user/resetToken')
    // 清除当前用户获取到的菜单
    next(`/login`)
  }
})

router.afterEach(() => {
  // 顶部进度条结束
  NProgress.done()
})
