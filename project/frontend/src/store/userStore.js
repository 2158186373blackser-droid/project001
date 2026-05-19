import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginAPI, getUserInfo, logout as logoutAPI } from '@/api/auth'
import { getWallet } from '@/api/wallet'
import router from '@/router'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  // ==================== 状态 ====================

  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))
  const balance = ref(Number(localStorage.getItem('userBalance')) || 0)
  const isLoggedIn = computed(() => !!token.value)

  // ==================== Token 操作 ====================

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const clearToken = () => {
    token.value = ''
    balance.value = 0
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('userBalance')
  }

  // ==================== 余额操作 ====================

  /**
   * 设置余额并持久化到 localStorage
   * @param {number} value
   */
  const setBalance = (value) => {
    balance.value = Number(value)
    localStorage.setItem('userBalance', value)
  }

  /**
   * 从服务器获取最新余额
   */
  const fetchBalance = async () => {
    try {
      const res = await getWallet()
      if (res.code === 200 && res.data) {
        // res.data.balance 可能是字符串（如 "95.00"），转为数字
        setBalance(Number(res.data.balance))
      }
    } catch (error) {
      console.error('获取余额失败:', error)
    }
  }

  // ==================== 登录 / 登出 / 用户信息 ====================

  const login = async (credentials) => {
    try {
      const res = await loginAPI(credentials)

      setToken(res.data.token)
      if (res.data.refreshToken) {
        localStorage.setItem('refreshToken', res.data.refreshToken)
      }

      userInfo.value = res.data.user
      localStorage.setItem('userId', res.data.user.id)
      localStorage.setItem('userInfo', JSON.stringify(res.data.user))

      // 登录成功后立即获取余额
      await fetchBalance()

      ElMessage.success('登录成功')
      const redirect = router.currentRoute.value.query.redirect || '/home'
      router.push(redirect)

      return { success: true }
    } catch (error) {
      if (error.requireCaptcha) {
        return {
          success: false,
          requireCaptcha: true,
          remainAttempts: error.remainAttempts,
          message: error.message
        }
      }
      return {
        success: false,
        message: error.message || '登录失败'
      }
    }
  }

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo()
      userInfo.value = res.data
      localStorage.setItem('userId', res.data.id)
      localStorage.setItem('userInfo', JSON.stringify(res.data))
      return userInfo.value
    } catch (error) {
      console.error('获取用户信息失败:', error)
      if (error.response?.status === 401) {
        clearToken()
        router.push('/login')
      }
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutAPI()
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      clearToken()
      userInfo.value = null
      router.push('/login')
      ElMessage.success('已退出登录')
    }
  }

  const checkAuth = async () => {
    if (!token.value) return false
    try {
      await fetchUserInfo()
      return true
    } catch (error) {
      return false
    }
  }
  // 确保 userInfo 正确从 localStorage 获取，且 admin 角色判断一致
const isAdmin = computed(() => {
  const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
  return user.username === 'admin';
});

  // ==================== 导出 ====================
  return {
    token,
    userInfo,
    balance,
    isLoggedIn,
    setToken,
    clearToken,
    setBalance,
    fetchBalance,
    login,
    logout,
    fetchUserInfo,
    checkAuth
  }
})