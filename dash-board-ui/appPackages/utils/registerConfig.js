/**
 * 对象属性合并，与 Object.assign 语法不同
 * @param target
 * @param source
 * @returns {{}}
 */
function configDeepMerge (target, source) {
  const merged = {}
  for (const each in source) {
    if (target.hasOwnProperty(each) && source.hasOwnProperty(each)) {
      if (
        typeof target[each] === 'object' &&
        typeof source[each] === 'object'
      ) {
        merged[each] = configDeepMerge(target[each], source[each])
      } else {
        merged[each] = source[each]
      }
    } else if (source.hasOwnProperty(each)) {
      merged[each] = source[each]
    }
  }
  for (const eachTarget in target) {
    if (!(eachTarget in source) && target.hasOwnProperty(eachTarget)) {
      merged[eachTarget] = target[eachTarget]
    }
  }
  return merged
}
// 自动注册路由
function registerRouters (config, router) {
  // 没有router对象不注册路由
  if (!router) {
    return
  }
  const routers = [
    {
      path: config?.routers?.appPreviewUrl,
      name: 'Preview',
      component: () =>
        require.ensure([], () => require('app/DashboardAppRun'))
    }
  ]
  // 如果router有addRoutes方法
  if (router?.addRoutes) {
    router?.addRoutes(routers)
  } else {
    // eslint-disable-next-line no-unused-expressions
    routers?.forEach((route) => {
      // eslint-disable-next-line no-unused-expressions
      router?.addRoute(route)
    })
  }
}

// 注册配置
function registerTheme (config) {
  const defaultTheme = {
    '--db-background-header': '#007aff', // 头部颜色
    '--db-background-1': '#fff', // 整体背景色
    '--db-background-2': '#fff', // 布局背景色
    '--db-el-background-1': '#fff', // 组件背景色，输入框...
    '--db-el-background-2': '#F5F7FA', // 组件背景色，按钮、分页、加载...
    '--db-el-background-3': '#F5F7FA', // 组件背景色，表格头部、下拉框hover...
    '--db-el-title': '#36474f', // 标题字体颜色
    '--db-el-text': '#36474f', // 一般字体颜色
    '--db-el-color-primary': '#409EFF', // elment-ui主题色，激活
    '--db-el-border': 'transparent' // 边框颜色
  }
  const mergedTheme = { ...defaultTheme, ...config?.customTheme }
  const style = document.createElement('style')
  style.type = 'text/css'
  let themeStr = ''
  for (const key in mergedTheme) {
    themeStr += `${key}:${mergedTheme[key]};`
  }
  // 给body添加class db-body-theme-wrap
  document.body.classList.add('db-body-theme-wrap')
  style.innerHTML = `.db-body-theme-wrap {${themeStr}}`
  document.getElementsByTagName('head')[0].appendChild(style)
}

// 注册配置
export default function (config, router) {
  // 默认路由
  config.routers = {
    appPreviewUrl: '/dashboard/app-preview',
    ...config.routers
  }
  window.DS_CONFIG = {}
  window.DS_CONFIG = configDeepMerge(window.DS_CONFIG, config)

  // 注册路由
  registerRouters(config, router)
  // 注册自定义主题
  registerTheme(config)
}
