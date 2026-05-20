import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', name: 'Login', component: () => import('@/components/auth/Login.vue') },
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'home', name: 'Home', component: () => import('@/components/home/Home.vue') },
      { path: 'messages', name: 'MessageCenter', component: () => import('@/views/common/MessageCenter.vue') },
      
      // 用户基础功能模块
      { path: 'profile', name: 'Profile', component: () => import('@/components/profile/Profile.vue') },
      { path: 'wallet', name: 'Wallet', component: () => import('@/components/wallet/Wallet.vue') },

      // 跑腿订单模块
      { path: 'order/list', name: 'OrderList', component: () => import('@/components/order/OrderList.vue') },
      
      // 二手市场模块
      { path: 'market/list', name: 'MarketList', component: () => import('@/components/market/GoodsList.vue') },
      { path: 'market/publish', name: 'MarketPublish', component: () => import('@/components/market/GoodsPublish.vue') },
      
      // 校园论坛模块
      { path: 'forum/list', name: 'ForumList', component: () => import('@/components/forum/PostList.vue') },
      { path: 'forum/publish', name: 'ForumPublish', component: () => import('@/components/forum/PostPublish.vue') },
      
      // 图书馆模块
      { path: 'library/booking', name: 'LibraryBooking', component: () => import('@/components/library/SeatBooking.vue') },
      { path: 'library/my', name: 'MyBookings', component: () => import('@/components/library/MyBookings.vue') }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/components/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('@/components/admin/Dashboard.vue') },
      
      // ==================== 修改点：加上 s 匹配侧边栏 ====================
      { path: 'users', name: 'AdminUser', component: () => import('@/components/admin/UserList.vue') },
      { path: 'reports', name: 'AdminReport', component: () => import('@/components/admin/ReportList.vue') },
      { path: 'reports/:id', name: 'AdminReportDetail', component: () => import('@/components/admin/ReportDetail.vue') },
      { path: 'logs', name: 'AdminLog', component: () => import('@/components/admin/OperationLog.vue') },
      { path: 'library/verify', name: 'AdminLibraryVerify', component: () => import('@/views/admin/AdminLibraryVerify.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.requiresAdmin && userInfo.username !== 'admin') {
    next('/home') // 非管理员阻止进入后台
  } else {
    next()
  }
})

export default router;