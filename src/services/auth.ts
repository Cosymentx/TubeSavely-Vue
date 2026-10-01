import type { UserLogin, UserCreate, AuthResponse } from '../types/user'
import type { ApiResult } from '../types/api'
import type { AxiosInstance } from 'axios'

// 生成随机 state 用于防止 CSRF 攻击
function generateState(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
}

export const createAuthService = (api: AxiosInstance) => ({
  login: (data: UserLogin): ApiResult<AuthResponse> => {
    return api.post('/auth/login', data)
  },

  register: (data: UserCreate): ApiResult<AuthResponse> => {
    // 移除前端验证字段
    const { confirmPassword, ...registerData } = data
    return api.post('/auth/register', registerData)
  },

  refresh: (): ApiResult<AuthResponse> => {
    return api.post('/auth/refresh')
  },

  logout: () => {
    void api.post('/auth/logout').catch(() => undefined)
    // 清除所有认证相关的存储项
    localStorage.removeItem('token')
    localStorage.removeItem('userState')
    localStorage.removeItem('oauth_state')
    localStorage.removeItem('redirect_url')
  },

  // 修改社交登录方法，实现标准 OAuth 流程
  socialLogin: async (provider: string) => {
    // 生成并保存 state
    const state = generateState()
    localStorage.setItem('oauth_state', state)
    
    // 保存当前 URL 用于登录后重定向
    const currentPath = window.location.pathname
    if (currentPath !== '/login') {
      localStorage.setItem('redirect_url', currentPath)
    }

    // 获取 OAuth URL
    const { data } = await api.get(`/auth/oauth/${provider}/url`, { 
      params: { state }
    })

    // 重定向到第三方登录页面
    if (data.code === 200 && data.data?.url) {
      window.location.href = data.data.url
    } else {
      throw new Error('Failed to get OAuth URL')
    }
  },

  // 处理 OAuth 回调
  handleOAuthCallback: async (provider: string, code: string, state: string): ApiResult<AuthResponse> => {
    // 验证 state
    const savedState = localStorage.getItem('oauth_state')
    if (!savedState || savedState !== state) {
      throw new Error('Invalid state parameter')
    }

    // 清除 state
    localStorage.removeItem('oauth_state')

    // 发送验证请求，改为 GET 请求并使用 query 参数
    return api.get(`/auth/oauth/${provider}/callback`, {
      params: { code, state }
    })
  },

  // 获取重定向 URL
  getRedirectUrl: () => {
    const redirectUrl = localStorage.getItem('redirect_url')
    localStorage.removeItem('redirect_url')
    return redirectUrl || '/'
  }
})
