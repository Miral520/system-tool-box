import Vue from 'vue'
import App from 'entry/index.vue'
import router from 'router'
import store from 'store'
import utils from 'utils/utils'
import Antd from 'ant-design-vue';
import vuescroll from 'vuescroll';
import 'ant-design-vue/dist/antd.css';
import 'animate.css'

declare var global: any;

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

Vue.prototype.$fn = utils.mixin;
Vue.prototype.$var = utils.vars;

Vue.config.productionTip = false;

// 存储本地分区
global.ipcRenderer.on('disks', (event: any, message: any) => {
  let disks: any = [];
  message.forEach((disk: any) => {
    if(disk._blocks) {
      disks.push({
        name: disk._mounted.substring(0, disk._mounted.length - 1),
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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
