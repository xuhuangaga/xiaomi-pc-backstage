import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Layout from '../views/layout/Layout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'home',
        component: Home,
        meta:{
          index:'/',
          title:'首页'
        }
      },
      {
        path: '/carousel',
        name: 'carousel',
        component: ()=>import('../views/carousel/carousel.vue'),
        meta:{
          index:'/carousel',
          title:'轮播图管理'
        }
      },
      {
        path: '/nav',
        name: 'nav',
        component: ()=>import('../views/nav/nav.vue'),
        meta:{
          index:'/nav',
          title:'导航管理'
        }
      },
      {
        path: '/recommend',
        name: 'recommend',
        component: ()=>import('../views/recommend/recommend.vue'),
        meta:{
          index:'/recommend',
          title:'推荐导航'
        }
      },
      {
        path: '/user',
        name: 'user',
        component: ()=>import('../views/user/user.vue'),
        meta:{
          index:'/user',
          title:'用户管理'
        }
      },
      {
        path: '/product',
        name: 'product',
        component: ()=>import('../views/product/product.vue'),
        meta:{
          index:'/product',
          title:'添加商品'
        }
      },
      {
        path: '/class',
        name: 'class',
        component: ()=>import('../views/class/class.vue'),
        meta:{
          index:'/class',
          title:'商品分类'
        }
      },
      {
        path: '/parameter',
        name: 'parameter',
        component: ()=>import('../views/parameter/parameter.vue'),
        meta:{
          index:'/parameter',
          title:'商品参数'
        }
      },
      {
        path: '/spec',
        name: 'spec',
        component: ()=>import('../views/spec/spec.vue'),
        meta:{
          index:'/spec',
          title:'商品规格'
        }
      },
      {
        path: '/model',
        name: 'model',
        component: ()=>import('../views/model/model.vue'),
        meta:{
          index:'/spec',
          title:'商品模型'
        }
      },
      {
        path: '/specparams',
        name: 'specparams',
        component: ()=>import('../views/specparams/specparams.vue'),
        meta:{
          index:'/specparams',
          title:'规格参数'
        }
      },
      {
        path: '/seckill',
        name: 'seckill',
        component: ()=>import('../views/seckill/seckill.vue'),
        meta:{
          index:'/seckill',
          title:'商品秒杀'
        }
      },
      {
        path: '/coupon',
        name: 'coupon',
        component: ()=>import('../views/coupon/coupon.vue'),
        meta:{
          index:'/coupon',
          title:'优惠券'
        }
      },
      {
        path: '/orders',
        name: 'orders',
        component: ()=>import('../views/orders/orders.vue'),
        meta:{
          index:'/orders',
          title:'订单管理'
        }
      },
      {
        path: '/notice',
        name: 'notice',
        component: ()=>import('../views/notice/notice.vue'),
        meta:{
          index:'/notice',
          title:'通知管理'
        }
      },
      {
        path: '/customer',
        name: 'customer',
        component: ()=>import('../views/customer/customer.vue'),
        meta:{
          index:'/customer',
          title:'客服管理'
        }
      }
    ]
  }
]



const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  //如果没有登录 跳转到登录
  if (to.name === "login") {
    next()
  } else {
    localStorage.getItem('xiaomi-pc-admin')! ? next() : next('/login')
  }
})
export default router