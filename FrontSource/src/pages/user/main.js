import Vue from 'vue'
import App from "./App"
import router from "./router"
import ElementUI from 'element-ui'
import 'highlight.js/styles/darcula.css'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h=>h(App)
}).$mount('#app')
