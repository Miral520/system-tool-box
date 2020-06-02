import Vue from 'vue'
import App from 'entry/index.vue'
import router from 'router'
import store from 'store'
import utils from 'utils/utils'
import Antd from 'ant-design-vue';
import vuescroll from 'vuescroll';
import 'ant-design-vue/dist/antd.css';
import 'animate.css'

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

Vue.prototype.$fn = utils.mixin;
Vue.prototype.$var = utils.vars;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
