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
      { path: 'messages', name: 'MessageCenter', component: () => import('@/views/common/MessageCenter.vue') }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/components/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('@/components/admin/Dashboard.vue') }
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
    next('/home') // 非管理员被强行踢回首页
  } else {
    next()
  }
})

export default router;