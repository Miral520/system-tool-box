import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 面包屑数据
    breadcrumb: '首页',

    // 启动器运行环境
    mode: 'prod',

    // 系统信息
    sysInfo: {},

    // 显示底部
    showFooter: true,
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

    // 设置系统信息
    setSys(state: any, data: any) {
      state.sysInfo = data;
    },

    // 设置底部
    setFooterDisplay(state: any, show: Boolean) {
      state.showFooter = show;
    },
  },
  actions: {

  },
  modules: {
    
  }
})
