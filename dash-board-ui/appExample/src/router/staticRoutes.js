// 静态无需权限路由配置，另需在permission.js中增加白名单
export default [
  {
    path: '/',
    // 这里需要name字段，供add.router添加路由，添加到布局路由下的依据
    name: 'AppLayout',
    component: () => import('@/layout/HomeTab'),
    redirect: '/dashboard',
    meta: {
      name: '首页'
    },
    children: [
      {
        path: '/dashboard',
        name: 'DashBoard',
        component: () => import('@/views/dashboard/Preview.vue'),
        meta: {
          name: 'DashBoard'
        }
      }
    ]
  }
]
