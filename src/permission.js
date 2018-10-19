import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import { constantRouterMap, asyncRouterMap } from './router'

// 匹配路由列表
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else { // 没有配置权限的全部显示
    return true
  }
}

// 递归路由列表
function routerFilter(roles, routerList) {
  var accessedRouters = []
  routerList.forEach(element => {
    if (hasPermission(roles, element)) {
      accessedRouters.push(element)
      if (element.children && element.children.length > 0) {
        element.children = routerFilter(roles, element.children)
      }
    }
  })
  return accessedRouters
}

// 格式化服务端返回的路由列表
function formatRouterList(routerList) {
  var accessedRouters = []

  routerList.forEach(element => {
    accessedRouters.push(element)
    if (element.component && element.component !== '') {
      var componentPath = element.component
      element.component = () => import(`@/views/${componentPath}`)
      if (element.children && element.children.length > 0) {
        element.children = formatRouterList(element.children)
      }
    }
  })

  // var asyncRouters = [{
  //   path: '/',
  //   redirect: '/dashboard',
  //   name: 'Dashboard',
  //   hidden: true,
  //   children: [{
  //     path: 'dashboard'
  //     //component: () => import('@/views/dashboard/index')
  //   }]
  // }
  // ]
  // //  path1='layout/Layout'
  // //  path2='dashboard/index'
  // var test1='layout/Layout'
  // import 中使用es6的模板字符串 占位符 因为import中不能有变量
  // asyncRouters[0].component = () => import(`@/views/${test1}`)
  // asyncRouters[0].children[0].component = () => import('./views/dashboard/index')


  return accessedRouters
}


const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          const roles = res.roles
          var accessedRouters = []
          //采用客户端过滤方式路由
          accessedRouters = routerFilter(roles, asyncRouterMap)
          //console.log(accessedRouters)
          // 采用服务端返回的权限列表
          //accessedRouters = formatRouterList(res.routerList)

          router.addRoutes(accessedRouters)
          router.options.routes = constantRouterMap.concat(accessedRouters)

          next({
            ...to,
            replace: true
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
