import Vue from 'vue'
import App from "./App"
import router from "./router"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as echarts from "echarts/lib/echarts"
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts


new Vue({
  router,
  render: h=>h(App)
}).$mount('#app')
