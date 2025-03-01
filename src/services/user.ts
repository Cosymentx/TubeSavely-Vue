import type { User, UserUpdate, UserPasswordUpdate } from '../types/user'
import type { ApiResult } from '../types/api'
import type { AxiosInstance } from 'axios'

export const createUserService = (api: AxiosInstance) => ({
  getProfile: (): ApiResult<User> => {
    return api.get('/users/profile')
  },

  updateProfile: (data: UserUpdate): ApiResult<User> => {
    const formData = new FormData()

    if (data.avatar instanceof FormData) {
      formData.append('avatar', data.avatar.get('avatar') as File)
      return api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }

    return api.put('/users/profile', data)
  },

  updatePassword: (data: UserPasswordUpdate): ApiResult<void> => {
    return api.put('/users/profile', data)
  },

  updateAvatar: (file: File): ApiResult<void> => {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.put('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  getCredits: (): ApiResult<number> => {
    return api.get('/credits')
  },

  getDownloadHistory: (page = 1, limit = 10) => {
    return api.get(`/users/downloads?page=${page}&limit=${limit}`)
  },

  getCreditsHistory: (skip = 0, limit = 10) => {
    return api.get(`/credits/history?skip=${skip}&limit=${limit}`)
  },

  addCredits: (credits: number, action: string, description?: string) => {
    return api.post('/credits/add', { credits, action, description })
  },

  deductCredits: (credits: number, action: string, description?: string) => {
    return api.post('/credits/deduct/', { credits, action, description })
  }
})