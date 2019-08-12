import Vue from 'vue'
import Router from 'vue-router'

// 导入 Login 组件（注意，不要添加 .vue 后缀）
import Login from '@/components/login/Login'
// 导入首页组件
import Home from '@/components/home/Home'
// 导入用户列表组件
import Users from '@/components/users/Users'
// 导入权限列表组件
import Rights from '@/components/rights/Rights'
// 导入角色列表组件
import Roles from '@/components/roles/Roles'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        { path: 'users', component: Users },
        { path: 'rights', component: Rights },
        { path: 'roles', component: Roles }
      ]
    }
  ]
})
// 全局导航守卫
// 所有的路由都会先走守卫，添加导航守卫后，不管是访问那个路由，都会执行beforeEach回调函数中的代码
// 因为所有的路由，都会经过该导航守卫，所以就可以在这个导航守卫的回调函数中
// 判断有没有登录
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    // 如果访问的是login页面，直接放行，也就是任何人不管有没有登录
    // 都可以访问登录页面
    // 直接调用 next() 方法，表示：访问的是哪个页面，就展示这个页面的内容
    next()
  } else {
    // 访问的不是登录页面

    // 判断用户是否登录成功，
    // 1 当用户登录成功，直接调用 next() 方法放行
    // 2 当用户没有登录，应该调用 next('/login') 跳转到登录页面，让用户登录

    // 通过登录成功时候保存的token，来作为有没有登录成功的条件
    const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
