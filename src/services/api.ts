import axios from 'axios'
import { createInterceptors } from './interceptors'
import type { ToastStore } from '../stores/toast'
import { createFeedbackService } from './feedback'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9527/api/v1'

const createApi = (toastStore: ToastStore) => {
  const token = localStorage.getItem('token')
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    withCredentials: true,
    maxRedirects: 5,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  createInterceptors(api, toastStore)
  return api
}

export const createApiService = (toastStore: ToastStore) => {
  const api = createApi(toastStore)
  
  return {  
    axiosInstance: api,
    feedbackService: createFeedbackService(api)
  }
}