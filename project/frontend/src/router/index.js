import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/userStore'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/dashboard', redirect: '/home' },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/auth/Login.vue'),
    meta: { requiresAuth: false, title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/components/auth/Register.vue'),
    meta: { requiresAuth: false, title: '注册' }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/components/auth/ForgotPassword.vue'),
    meta: { requiresAuth: false, title: '忘记密码' }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/components/auth/ResetPassword.vue'),
    meta: { requiresAuth: false, title: '重置密码' }
  },

  // 主布局下的页面
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'home', name: 'Home', component: () => import('@/components/home/Home.vue'), meta: { title: '首页' } },
      { path: 'profile', name: 'Profile', component: () => import('@/components/profile/Profile.vue'), meta: { title: '个人中心' } },

      // 订单模块
      { path: 'order/list', name: 'OrderList', component: () => import('@/components/order/OrderList.vue'), meta: { title: '代取订单' } },
      { path: 'order/publish', name: 'OrderPublish', component: () => import('@/components/order/OrderPublish.vue'), meta: { title: '发布订单' } },
      { path: 'order/:id', name: 'OrderDetail', component: () => import('@/components/order/OrderDetail.vue'), meta: { title: '订单详情' } },

      // 二手市场
      { path: 'market/list', name: 'GoodsList', component: () => import('@/components/market/GoodsList.vue'), meta: { title: '二手市场' } },
      { path: 'market/publish', name: 'GoodsPublish', component: () => import('@/components/market/GoodsPublish.vue'), meta: { title: '发布商品' } },
      { path: 'market/:id', name: 'GoodsDetail', component: () => import('@/components/market/GoodsDetail.vue'), meta: { title: '商品详情' } },

      // 图书馆
      { path: 'library/booking', name: 'SeatBooking', component: () => import('@/components/library/SeatBooking.vue'), meta: { title: '图书馆服务' } },
      { path: 'library/my', name: 'MyBookings', component: () => import('@/components/library/MyBookings.vue'), meta: { title: '我的预约' } },

      // 钱包
      { path: 'wallet', name: 'Wallet', component: () => import('@/components/wallet/Wallet.vue'), meta: { title: '我的钱包' } },

      // 论坛模块
      { path: 'forum/list', name: 'PostList', component: () => import('@/components/forum/PostList.vue'), meta: { title: '论坛广场' } },
      { path: 'forum/publish', name: 'PostPublish', component: () => import('@/components/forum/PostPublish.vue'), meta: { title: '发布帖子' } },
      { path: 'forum/:id', name: 'PostDetail', component: () => import('@/components/forum/PostDetail.vue'), meta: { title: '帖子详情' } },
    ]
  },

  // 管理后台（独立布局）
  // src/router/index.js 找到这个位置修改
{
  path: '/admin',
  component: () => import('@/components/admin/AdminLayout.vue'),
  meta: { requiresAuth: true, requiresAdmin: true },
  children: [
    // ... 其他路由保持不变
    { 
      path: 'messages', 
      name: 'MessageCenter', 
      // 关键修改：将 component 的路径改为你在截图里看到的实际位置
      component: () => import('@/views/common/MessageCenter.vue'), 
      meta: { title: '消息通知' } 
    },
  ]
},

  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/components/common/NotFound.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 核心修复点：如果检测到误把 logout 作为参数传入了订单详情页，强行在前端拦截并执行登出
  if (to.path.includes('logout') || to.params.id === 'logout' || to.path === '/do-not-route') {
    const userStore = useUserStore()
    userStore.clearToken()
    next('/login')
    return
  }

  document.title = to.meta.title ? `${to.meta.title} - 景艺大服务平台` : '景艺大服务平台'

  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

  if (to.meta.requiresAuth !== false && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    next('/home')
  } else if (to.meta.requiresAdmin && userInfo.username !== 'admin') {
    next('/home')   // 非管理员访问后台 → 重定向到首页
  } else {
    next()
  }
})

export default router