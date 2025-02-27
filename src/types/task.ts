export type TaskType = 'convert' | 'generate'
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface TaskBase {
  title: string
  description?: string
  input_url?: string
  input_params?: Record<string, any>
  output_format?: string
  points_cost: number
}

export interface TaskCreate extends TaskBase {
  task_type: TaskType
}

export interface TaskUpdate {
  status?: TaskStatus
  error_message?: string
  output_url?: string
  progress?: number
}

export interface Task extends TaskBase {
  id: number
  user_id: number
  task_type: TaskType
  status: TaskStatus
  error_message?: string
  output_url?: string
  progress?: number
  created_at: string
  updated_at: string
}

export interface TaskHistory {
  tasks: Task[]
  total: number
  page: number
  limit: number
} 