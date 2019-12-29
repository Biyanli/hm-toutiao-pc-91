import VueRouter from 'vue-router'
import Vue from 'vue'

import Login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import NotFound from '@/views/404'
import Article from '@/views/article'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 登录
    { path: '/login', component: Login },
    { path: '/',
      component: Home,
      children: [
      // 欢迎页面
        { path: '/', component: Welcome },
        { path: '/article', component: Article }
      ] },

    // 通配以上规则没有的地址
    { path: '*', component: NotFound }
  ]
})

export default router
