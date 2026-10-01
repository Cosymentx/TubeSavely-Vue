import type { AxiosInstance } from 'axios'
import type { ToastStore } from '../stores/toast'

export const createInterceptors = (api: AxiosInstance, toastStore: ToastStore) => {

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      // 确保 headers 对象存在
      config.headers = config.headers || {}
      
      // 对所有非登录请求添加认证头
      if (token && !config.url?.includes('/auth/login')) {
        // 设置认证头
        config.headers.Authorization = `Bearer ${token}`
      }

      // 全局请求配置
      config.maxRedirects = 0  // 禁止自动重定向
      config.withCredentials = false  // 使用 Bearer Token 鉴权，无需跨域 Cookie 凭证
      config.validateStatus = function (status) {
        // 自定义响应状态码的验证
        return status >= 200 && status < 300 || status === 307  // 允许307状态码
      }
      
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      let errorMessage = ''

      if (error.response) {
        // Handle 401 unauthorized error
        if (error.response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('userState')
          errorMessage = error.response.data?.detail || error.response.data?.message || 'Session expired, please login again'
        } else {
          errorMessage = error.response.data?.detail || error.response.data?.message || 'Server error'
        }
      } else if (error.request) {
        errorMessage = 'Network error, please check your connection'
      } else {
        errorMessage = error.message || 'Request configuration error'
      }

      toastStore.showToast(errorMessage, 'error')

      return Promise.reject(error)
    }
  )
}
