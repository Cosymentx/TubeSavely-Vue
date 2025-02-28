import type { AxiosInstance } from 'axios'
import type { ToastStore } from '../stores/toast'

export const createInterceptors = (api: AxiosInstance, toastStore: ToastStore) => {
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

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      // 对所有非登录请求添加认证头
      if (token && !config.url?.includes('/auth/login')) {
        // 确保 headers 对象存在
        config.headers = config.headers || {}
        // 设置认证头
        config.headers.Authorization = `Bearer ${token}`
        
        // 设置默认的请求配置
        config.maxRedirects = config.maxRedirects || 5
        config.withCredentials = true
        
        // 确保重定向请求也携带认证信息
        if (!config.beforeRedirect) {
          config.beforeRedirect = (options, { headers }) => {
            options.headers = { ...headers, Authorization: `Bearer ${token}` }
            options.withCredentials = true
          }
        }
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}