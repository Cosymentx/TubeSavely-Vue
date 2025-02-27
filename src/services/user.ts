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
    return api.put('/users/password', data)
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

  getPoints: (): ApiResult<number> => {
    return api.get('/points')
  },

  getDownloadHistory: (page = 1, limit = 10) => {
    return api.get(`/users/downloads?page=${page}&limit=${limit}`)
  },

  getPointHistory: (skip = 0, limit = 10) => {
    return api.get(`/points/history?skip=${skip}&limit=${limit}`)
  },

  addPoints: (points: number, action: string, description?: string) => {
    return api.post('/points/add', { points, action, description })
  },

  deductPoints: (points: number, action: string, description?: string) => {
    return api.post('/points/deduct', { points, action, description })
  }
})