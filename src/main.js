import Vue from 'vue'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import 'bootstrap3/dist/css/bootstrap.css'

import router from './router/router.js'

import store from './store/index.js'

import axios_instance from './axiosInterceptors/withAudit.js'

Vue.prototype.$axios = axios_instance
Vue.use(ElementUI)
Vue.config.productionTip = false

 

new Vue({
  render: h => h(App),
  store,
  router,
  beforeCreate(){
    // console.log(this);
  }
}).$mount('#app')
