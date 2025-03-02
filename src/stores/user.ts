import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '../composables/useApi'
import { createAuthService } from '../services/auth'
import { createUserService } from '../services/user'
import type { User, UserLogin, UserCreate, UserUpdate, UserPasswordUpdate } from '../types/user'
import { useToastStore } from './toast'
import { getErrorMessage } from '../utils/error'

export const useUserStore = defineStore('user', () => {
  const localUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const toastStore = useToastStore()
  const apiService = useApi()
  const api = apiService.axiosInstance
  const authService = createAuthService(api)
  const userService = createUserService(api)

  // 初始化状态
  const initState = () => {
    const savedUser = localStorage.getItem('userState')
    const savedToken = localStorage.getItem('token')
    if (savedUser && savedToken) {
      localUser.value = JSON.parse(savedUser)
    }
  }

  // 初始化
  initState()

  const setUser = (userData: User | null) => {
    localUser.value = userData
    if (userData) {
      localStorage.setItem('userState', JSON.stringify(userData))
    } else {
      localStorage.removeItem('userState')
    }
  }

  const login = async (loginData: UserLogin) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await authService.login(loginData)
      const result = response.data

      if (result.code === 200 && result.data) {
        const { access_token, user: userData } = result.data
        localStorage.setItem('token', access_token)
        setUser(userData)
        toastStore.showToast('Login successful', 'success')
        return true
      } else {
        toastStore.showToast(result.msg || 'Login failed', 'error')
        return false
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.msg || err.message || 'Login failed'
      error.value = errorMessage
      toastStore.showToast(errorMessage, 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (registerData: UserCreate) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await authService.register(registerData)
      const result = response.data

      if (result.code === 200 && result.data) {
        const { access_token, user: userData } = result.data
        localStorage.setItem('token', access_token)
        setUser(userData)
        toastStore.showToast('Registration successful', 'success')
        return true
      } else {
        toastStore.showToast(result.msg || 'Registration failed', 'error')
        return false
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.msg || err.message || 'Registration failed'
      error.value = errorMessage
      toastStore.showToast(errorMessage, 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    toastStore.showToast('Logged out successfully', 'success')
  }

  const socialLogin = async (provider: 'google' | 'github' | 'wechat') => {
    try {
      isLoading.value = true
      error.value = null
      await authService.socialLogin(provider)
      return true
    } catch (err) {
      const message = getErrorMessage(err)
      error.value = message
      toastStore.showToast(message, 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const handleOAuthCallback = async (provider: string, code: string, state: string) => {
    try {
      isLoading.value = true
      const response = await authService.handleOAuthCallback(provider, code, state)
      const result = response.data

      if (result.code === 200 && result.data) {
        const { access_token, user: userData } = result.data
        localStorage.setItem('token', access_token)
        setUser(userData)
        toastStore.showToast('Login successful!', 'success')
        return true
      } else {
        error.value = result.msg || 'Login failed'
        toastStore.showToast(result.msg || 'Login failed', 'error')
        return false
      }
    } catch (err) {
      const message = getErrorMessage(err)
      error.value = message
      toastStore.showToast(message, 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const getRedirectUrl = () => {
    return authService.getRedirectUrl()
  }

  const fetchProfile = async () => {
    try {
      isLoading.value = true
      const response = await userService.getProfile()
      setUser(response.data.data)
      return true
    } catch (err) {
      const message = getErrorMessage(err)
      toastStore.showToast(message, 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (form: UserUpdate) => {
    try {
      isLoading.value = true
      const response = await userService.updateProfile(form)
      setUser(response.data as any)
      toastStore.showToast('Profile updated successfully', 'success')
      return true
    } catch (err) {
      const message = getErrorMessage(err)
      toastStore.showToast(message, 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const updateAvatar = async (file: File) => {
    try {
      isLoading.value = true
      const response = await userService.updateAvatar(file)
      setUser(response.data as any)
      toastStore.showToast('Avatar updated successfully', 'success')
      return true
    } catch (err) {
      const message = getErrorMessage(err)
      toastStore.showToast(message, 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const updatePassword = async (params: UserPasswordUpdate) => {
    try {
      isLoading.value = true
      let result
      if(localUser.value?.has_password) {
        result = await userService.updatePassword(params)
      } else {
        result = await userService.setPassword(params)
      }

      if (result?.data?.code === 200) {
        fetchProfile()
        if(localUser.value?.has_password) {
          toastStore.showToast('Password updated successfully', 'success')
        } else {
          toastStore.showToast('Password set successfully', 'success')
        }
        return true
      } else {
        toastStore.showToast(result?.data?.msg || 'Password update failed', 'error')
        return false
      }
    } catch (err) {
      const message = getErrorMessage(err)
      toastStore.showToast(message, 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const deductCredits = async (credits: number) => {
    try {
      isLoading.value = true
      const response = await api.post('/credits/deduct', { credits })
      return response.data
    } catch (err) {
      const message = getErrorMessage(err)
      toastStore.showToast(message, 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const getCredits = () => {
    return localUser.value?.credits || 0
  }

  const isLoggedIn = computed(() => {
    return !!localUser.value && !!localStorage.getItem('token')
  })

  return {
    localUser,
    isLoading,
    error,
    isLoggedIn,
    login,
    register,
    logout,
    socialLogin,
    handleOAuthCallback,
    getRedirectUrl,
    fetchProfile,
    updateProfile,
    updatePassword,
    updateAvatar,
    deductCredits,
    getCredits
  }
})