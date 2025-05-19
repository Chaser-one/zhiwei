import Vue from  'vue'
import VueRouter from "vue-router"
import DBA from "@/pages/admin/views/DBA"
import Review from "@/pages/admin/views/Review"
import TipOff from "@/pages/admin/views/TipOff"
import Permission from "@/pages/admin/views/Permission"
import DBManager from "@/pages/admin/views/DBManager"
import ArticleDetail from "@/components/Article-Detail"
Vue.use(VueRouter)
let projectRouterConfig = [
  {
    path:'/',
    redirect:'/dataView'
  },
  {
    path:'/dataView',
    component:DBA
  },
  {
    path:'/review',
    component:Review
  },
  {
    path:'/tipOff',
    component:TipOff
  },
  {
    path:'/permission',
    component:Permission
  },
  {
    path:'/dbManager',
    component:DBManager
  },
  {
    path:'/article/:id',
    component:ArticleDetail
  },
]

export default new VueRouter({
  routes: projectRouterConfig,
  // mode:'history'
})
