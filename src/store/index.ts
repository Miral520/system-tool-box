import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 面包屑数据
    breadcrumb: '首页',

    // 启动器运行环境
    mode: 'prod',
  },
  mutations: {
    // 设置面包屑
    setLocation(state: any, name: any) {
      state.breadcrumb = name;
    },

    // 启动器运行环境
    setMode(state: any, mode: any) {
      state.mode = mode;
    },
  },
  actions: {

  },
  modules: {
    
  }
})
