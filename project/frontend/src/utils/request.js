import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
  timeout: 10000
})

// 请求拦截器（不变）
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // ----- 全局列表数据标准化 -----
    // 如果后端返回的数据结构是 { code: 200, data: { list: [...], total, ... } }
    // 则自动将 data 替换为 list 数组，并将 total 等附加信息放在 _meta 中
    if (res && res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
      if (Array.isArray(res.data.list)) {
        const { list, ...meta } = res.data
        res._meta = meta        // 其他字段如 total, page, pageSize 保留在 _meta
        res.data = list         // data 直接变成数组
      }
    }
    // ----------------------------------

    if (res.code !== 200) {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || 'Error'))
    }

    return res
  },
  error => {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
      }
      ElMessage.error(error.response.data?.msg || '请求失败')
    }
    return Promise.reject(error)
  }
)

export default service