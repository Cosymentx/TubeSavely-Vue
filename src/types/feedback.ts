export type FeedbackType = 'bug' | 'feature' | 'other'
export type FeedbackStatus = 'pending' | 'processing' | 'completed'

export interface FeedbackBase {
  name?: string
  email?: string
  content: string
  type: FeedbackType
}

export interface FeedbackCreate extends FeedbackBase {
}

export interface FeedbackUpdate {
  content?: string
  status?: FeedbackStatus
}

export interface Feedback extends FeedbackBase {
  id: number
  user_id: number
  status: FeedbackStatus
  created_at: string
  updated_at: string
}

export interface FeedbackHistory {
  feedbacks: Feedback[]
  total: number
  page: number
  limit: number
}
