/*
 * @description:
 * @Author: wujian
 * @Date: 2022-10-11 14:17:48
 * @LastEditors: wujian
 * @LastEditTime: 2022-11-16 11:10:03
 */
import Vue from 'vue'
import Router from 'vue-router'
import staticRoutes from './staticRoutes'

Vue.use(Router)
//保存原型对象的Push
let originPush = Router.prototype.push
let originReplace = Router.prototype.replace
//重写push方法
Router.prototype.push = function (location, res, rej) {
  if (res && rej) {
    originPush.call(this, location, res, rej)
  } else {
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    )
  }
}
//重写replace方法
Router.prototype.replace = function (location, res, rej) {
  if (res && rej) {
    originReplace.call(this, location, res, rej)
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {}
    )
  }
}
/**
 * 路由配置项说明
 *
 * 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * hidden: true // (默认 false)

 * 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * redirect: 'noRedirect'

 * 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 * 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 * 若你想不管路由下面的 children 声明的个数都显示你的根路由
 * 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * alwaysShow: true

 * name: 'router-name' //设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta: {
    title: 'title' //设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name' //设置该路由的图标，指向【src/assets/icons/svg】目录下.svg文件即可
    noCache: true //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    breadcrumb: false // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

/**
 * 固定路由
 */
export const baseRoutes = [
  ...staticRoutes,
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index')
  }
]

export const constantRoutes = []

const createRouter = () =>
  new Router({
    mode: process.env.VUE_APP_HISTORY === 'y' ? 'history' : 'hash',
    base: process.env.VUE_APP_HISTORY === 'y' ? process.env.VUE_APP_BASE : null,
    scrollBehavior: () => ({ y: 0 }),
    routes: baseRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
