import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from 'store'
import Home from 'views/Home/index.vue'

Vue.use(VueRouter)

const routes: Array<any> = [
  {
    path: '/',
    name: '首页',
    icon: 'home',
    component: Home
  },
  {
    path: '/files',
    name: '文件系统',
    icon: 'folder',
    component: () => import('views/Files/index.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to: any, from: any, next: any) => {
  store.commit('setLocation', to.name);
  next();
})

export default router
