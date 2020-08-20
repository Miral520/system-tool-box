import Vue from 'vue'
import App from 'entry/index.vue'
import router from 'router'
import store from 'store'
import utils from 'utils/utils'
import Antd from 'ant-design-vue';
import vuescroll from 'vuescroll';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import 'ant-design-vue/dist/antd.css';
import 'animate.css'

declare var global: any;
declare var eStore: any;

Vue.use(Antd);

Vue.use(vuescroll, {
  ops: {
    scrollPanel: {
      easing: 'easeInOutQuint',
    },
    bar: {
      background: '#dddee0',
      onlyShowBarOnScroll: false,
    },
  },
});

Vue.prototype.locale = locale;

Vue.prototype.$fn = utils.mixin;
Vue.prototype.$var = utils.vars;
Vue.prototype.$getJsonP = utils.mixin.getJsonP;
Vue.prototype.$axios = utils.mixin.getData;
Vue.prototype.$axiosAll = utils.mixin.getAllDate;
Vue.prototype.$getFiles = utils.mixin.getFiles;
Vue.prototype.$cities = utils.cities;
Vue.prototype.$weather = utils.weather;

Vue.config.productionTip = false;

// 存储本地分区
global.ipcRenderer.on('disks', (event: any, message: any) => {
  let disks: any = [];
  message.forEach((disk: any) => {
    if(disk._blocks) {
      disks.push({
        name: disk._mounted,
        total: Vue.prototype.$fn.setByte(disk._blocks),
        used: Vue.prototype.$fn.setByte(disk._used),
        free: Vue.prototype.$fn.setByte(disk._blocks),
        fileSystem: '未知',
        percent: parseFloat(disk._capacity),
      });
    }
  });
  store.commit('setdisksData', disks);
});

// 从本地获取用户设置
store.commit('setConfig', eStore.get('config') ? eStore.get('config') : {});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
