import Vue from 'vue'
import App from '@entry/index.vue'
// import router from './router'
// import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import vuescroll from 'vuescroll';

// Vue.use(vuescroll, {
//   ops: {}, // 在这里设置全局默认配置
//   name: 'myScroll' // 在这里自定义组件名字，默认是vueScroll
// });

Vue.config.productionTip = false

new Vue({
  // router,
  // store,
  render: h => h(App)
}).$mount('#app')
