import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// elementUi
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 公共样式
import '@/common/styles/element-ui.scss'
import '@/common/styles/common.scss'
import '@/common/styles/initialize.scss'
import '@/common/iconfont/iconfont.css'
// rem
import './assets/utils/rem.js'

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
