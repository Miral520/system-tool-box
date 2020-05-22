import Vue from 'vue'
import App from 'entry/index.vue'
import router from 'router'
import store from 'store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import vuescroll from 'vuescroll';

Vue.use(Antd);

Vue.use(vuescroll, {
  ops: {
    scrollPanel: {
      easing: 'easeInOutQuint',
    },
    bar: {
      background: '#dddee0',
    },
  },
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
