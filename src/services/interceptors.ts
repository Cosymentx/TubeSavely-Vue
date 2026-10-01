import type { AxiosInstance } from 'axios'
import type { ToastStore } from '../stores/toast'

export const createInterceptors = (api: AxiosInstance, toastStore: ToastStore) => {
  let refreshPromise: Promise<string | null> | null = null

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      config.headers = config.headers || {}

      const isAuthBootstrap =
        config.url?.includes('/auth/login') ||
        config.url?.includes('/auth/register') ||
        config.url?.includes('/auth/refresh')

      if (token && !isAuthBootstrap) {
        config.headers.Authorization = `Bearer ${token}`
      }

      config.maxRedirects = 0
      config.withCredentials = true
      config.validateStatus = (status) =>
        (status >= 200 && status < 300) || status === 307

      return config
    },
    (error) => Promise.reject(error)
  )

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as typeof error.config & { _retry?: boolean }
      const status = error.response?.status
      const url = originalRequest?.url || ''
      const isRefreshRequest = url.includes('/auth/refresh')
      const isLoginRequest = url.includes('/auth/login') || url.includes('/auth/register')

      if (status === 401 && !isRefreshRequest && !isLoginRequest && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          if (!refreshPromise) {
            refreshPromise = api.post('/auth/refresh')
              .then((response) => {
                const token = response.data?.data?.access_token as string | undefined
                if (!token) return null
                localStorage.setItem('token', token)
                if (response.data?.data?.user) {
                  localStorage.setItem('userState', JSON.stringify(response.data.data.user))
                }
                return token
              })
              .finally(() => {
                refreshPromise = null
              })
          }

          const newToken = await refreshPromise
          if (newToken) {
            originalRequest.headers = originalRequest.headers || {}
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          }
        } catch {
          // Fall through to the normal expired-session cleanup.
        }
      }

      let errorMessage = ''
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('userState')
        errorMessage = error.response?.data?.detail || error.response?.data?.msg || 'Session expired, please login again'
      } else if (error.response) {
        errorMessage = error.response.data?.detail || error.response.data?.msg || error.response.data?.message || 'Server error'
      } else if (error.request) {
        errorMessage = 'Network error, please check your connection'
      } else {
        errorMessage = error.message || 'Request configuration error'
      }

      if (!isRefreshRequest) {
        toastStore.showToast(errorMessage, 'error')
      }
      return Promise.reject(error)
    }
  )
}
