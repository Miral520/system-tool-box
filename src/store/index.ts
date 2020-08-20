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

    // 逻辑分区
    disks: [],

    // 临时存储用户设置
    config: {},

    // 外网IP
    ip: '',

    // 主题
    theme: 'light',
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

    // 设置逻辑分区
    setdisksData(state: any, data: any) {
      state.disks = data;
    },

    // 设置临时存储用户设置
    setConfig(state: any, data: any) {
      state.config = data;
    },

    // 设置外网IP
    setIP(state: any, data: String) {
      state.ip = data;
    },

    // 设置主题
    setTheme(state: any, data: any) {
      state.theme = data;
    },
  },
  actions: {

  },
  modules: {
    
  }
})
