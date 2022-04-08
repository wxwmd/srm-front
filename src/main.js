import Vue from 'vue'
import App from './App.vue'
import router from './config/router/router'

import store from './config/vuex/store'
import bus from './config/bus/bus'
import api from './config/network/api'
import * as echarts from 'echarts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ajax from './config/network/ajax'

import QuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'

import Print from 'vue-print-nb'
Vue.use(Print);

Vue.use(QuillEditor)

Vue.config.productionTip = false

Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$echarts = echarts;
Vue.prototype.$ajax = ajax;
Vue.prototype.$bus = bus;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

