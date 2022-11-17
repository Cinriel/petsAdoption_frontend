import Vue from 'vue'
import VueRouter from 'vue-router'
import {getCookie} from '../utils/index.js'
import {Message} from 'element-ui'

Vue.use(VueRouter)
/*解决当前导航点击两次回报错*/
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  // 首页
  {
    path:"",
    name: 'index',
    component:()=>import("../components/PageIndex.vue")
  },
  // 搜索中心
  {
    path: '/search',
    name:'search',
    component: ()=>import("../components/search/PetsIndex.vue")
  },
  // 用户中心
  {
    path: '/user',
    name:"user",
    component: ()=>import('../components/user/IndexInterface.vue'),
    meta:{"auth":true},
    children:[
      {
        path: '',
        name: 'userCenter',
        component: ()=>import('../components/user/UserCenter.vue'),
        meta:{"auth":true}
      },
      {
        path:"postPets",
        component: ()=>import('../components/user/PostPets.vue'),
        name:'postPets',
        meta:{"auth":true},
        children:[
          {
            name:'baseInfo',
            path:"",
            meta:{"auth":true},
            component: ()=>import('../components/user/PostPets/BaseInfo.vue')
          },
          {
            name:'detailInfo',
            path:"detailInfo",
            meta:{"auth":true},
            component: ()=>import('../components/user/PostPets/DetailInfo.vue')
          },
          {
            name:"allInfo",
            path:'allInfo',
            component: ()=>import('../components/user/PostPets/AllInfo.vue'),
            meta: {
              keepAlive: false, // 不需要被缓存
              auth:true
            }
          }
        ]
      },
      {
        path:"wishList",
        name: 'wishList',
        meta:{"auth":true},
        component: ()=>import('../components/user/WishList.vue')   
      },
      {
        path:"myAdoptedPets",
        name: 'myAdoptedPets',
        meta:{"auth":true},
        component: ()=>import('../components/user/MyAdoptedPets.vue')   
      },
      {
        path:"managePets",
        name: 'managePets',
        meta:{"auth":true},
        component: ()=>import('../components/user/ManagePets.vue'),
      },
    ]
  },
  // 登录
  {
    path:"/login",
    name:"login",
    component: ()=>import('../components/user/UserLogin.vue')
  },
  // 注册
  {
    path:"/register",
    name:"register",
    component: ()=>import('../components/user/UserRegister.vue')
  },
  // 宠物详情
  {
    path:'/detail/:id',
    component: ()=>import('../components/PetDetailPage.vue')
  },
  // 领养下单
  {
    path:'/createOrder',
    name:"createOrder",
    meta:{"auth":true},
    component: ()=>import('../components/user/CreateOrder.vue')
  }

]
  

const router = new VueRouter({routes})



// 路由导航守卫
router.beforeEach((to, from, next) => {
  if(to.meta.auth){
    let uid = getCookie("uid")
    //存在继续往后走
    if (uid) {
      next()
    }else{
      Message({message: '请先登录再执行操作', type: 'warning', center: true, duration: 1500});
      setTimeout(() => {
        next({ name: 'login', params: { from: from.fullPath } })
      }, 1000);
    }
  }else{
    next()
  }
});

export default router
