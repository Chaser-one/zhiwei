import Vue from  'vue'
import VueRouter from "vue-router"
import BgCanvas from "@/pages/login/Components/BgCanvas"
Vue.components("BgCanvas",BgCanvas)
Vue.use(VueRouter)
let projectRouterConfig = [

]

export default new VueRouter({
  routes: projectRouterConfig,
  // mode:'history'
})
