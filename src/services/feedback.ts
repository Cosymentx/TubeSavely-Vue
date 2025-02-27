import type { AxiosInstance } from 'axios'
import type { ApiResult } from '../types/api'
import type { Feedback, FeedbackCreate } from '../types/feedback'
import type { FeedbackService } from '../types/services'

export const createFeedbackService = (api: AxiosInstance): FeedbackService => ({
  submit: (data: FeedbackCreate): ApiResult<Feedback> => {
    return api.post('/feedback', data)
  },

  getHistory: (): ApiResult<Feedback[]> => {
    return api.get('/feedback/history')
  },

  getById: (id: string): ApiResult<Feedback> => {
    return api.get(`/feedback/${id}`)
  }
})

export default createFeedbackService
