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
      if (token && !config.url?.includes('/auth/login')) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}