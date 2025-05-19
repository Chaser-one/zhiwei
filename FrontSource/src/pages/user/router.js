import Vue from  'vue'
import VueRouter from "vue-router"
import ChatHome from "@/pages/user/views/ChatHome"
import BlogList from "@/pages/user/views/BlogList"

Vue.use(VueRouter)
let projectRouterConfig = [
  {
    path:'/',
    redirect:'/home/article'
  },{
    path: '/home/:module',
    name:'home',
    component:() => import('./views/Home')
  },{
    path:'/editor',
    name:'editor',
    component:()=> import('./views/Article-Edit')
  },{
    path:'/article/:id',
    name:'articleDetail',
    component:()=> import('../../components/Article-Detail')
  },{
    path: '/chatHome',
    name:'chatHome',
    component:ChatHome
  },{
    path: '/blogList/:searchKey',
    name:'blogList',
    component: BlogList
  }
]

export default new VueRouter({
  routes: projectRouterConfig,
  // mode:'history'
})
