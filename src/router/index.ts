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
    showFooter: true,
    component: Home
  },
  {
    path: '/files',
    name: '文件系统',
    icon: 'folder',
    showFooter: false,
    component: () => import('views/Files/index.vue'),
  },
  {
    path: '/railway',
    name: '火车票',
    icon: 'wallet',
    showFooter: false,
    component: () => import('views/Railway/index.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to: any, from: any, next: any) => {
  store.commit('setLocation', to.name);
  for (let i = 0; i < routes.length; i++) {
    if(routes[i].name === to.name) {
      store.commit('setFooterDisplay', routes[i].showFooter);
      break;
    }
  }
  next();
})

export default router
