// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 导入全局样式
import '@/assets/index.css'

// 导入elementui - js
import ElementUI from 'element-ui'
// 导入elementui - css
import 'element-ui/lib/theme-chalk/index.css'

// 在main.js一次性导入axios
import axios from 'axios'
// 将axios添加到vue的原型中，实例对象可以直接使用原型对象中的属性和方法。 所有组件都是vue的实例
Vue.prototype.$http = axios

// 配置公共路径，配置好公共路径后，每次使用axios发送请求，只需要写当前接口的的路径（比如：/users）就可以了
// axios在发送请求前，会将baseURL+ /users 得到完整路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

// 只要配置了拦截器，所有的请求都会走拦截器，可以在拦截器统一处理 headers
// 1-请求拦截器
axios.interceptors.request.use(function(config) {
  // 在请求发送之前做一些事情
  // endsWith字符串的方法，用来判断是不是以参数为结尾，如果是返回true

  // 如果判断是登录接口 就不需要添加Authorization请求头
  if (!config.url.endsWith('/login')) {
    config.headers['Authorization'] = localStorage.getItem('token')
  }
  console.log('请求拦截器', config)
  return config
})
// 2-响应拦截器
axios.interceptors.response.use(function(response) {
  // 在获取到相应数据时做一些事
  console.log('响应拦截器', response)
  if (response.data.meta.status === 401) {
    // 因为不是在组件中，无法通过this.$router来访访问路由实例
    // 可以直接通过上面导入的路由模块中的router（路由实例）来访问到路由对象
    router.push('/login')
    localStorage.removeItem('token')
  }
  return response
})
// 安装插件
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,

  // 注册App组件为当前实例的局部组件，然后才可以在template中使用该组件
  components: { App },
  template: '<App/>'
})
