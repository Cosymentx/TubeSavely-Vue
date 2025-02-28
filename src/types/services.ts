import type { VideoBase, VideoFormat, Video, VideoCreate, VideoDownload } from './video'
import type { User, UserLogin, UserCreate } from './user'
import type { ApiResult } from './api'
import type { Feedback, FeedbackCreate } from './feedback'
import type { Task, TaskCreate } from './task'
import type { Payment, PaymentCreate } from './payment'

export interface AuthService {
  login(data: UserLogin): ApiResult<{ token: string; user: User }>
  register(data: UserCreate): ApiResult<{ token: string; user: User }>
  logout(): void
  getCurrentUser(): ApiResult<User>
}

export interface VideoService {
  getInfo(url: string): ApiResult<VideoBase>
  getFormats(url: string): ApiResult<VideoFormat[]>
  createVideo(data: VideoCreate): ApiResult<Video>
  getVideoById(id: number): ApiResult<Video>
  getUserVideos(): ApiResult<Video[]>
  getDownloads(): ApiResult<VideoDownload[]>
  download(videoId: number, formatId: string): ApiResult<void>
}

export interface UserService {
  getProfile(): ApiResult<User>
  updateProfile(data: Partial<User>): ApiResult<User>
  deductCredits(credits: number): ApiResult<User>
}

export interface FeedbackService {
  submit(data: FeedbackCreate): ApiResult<Feedback>
  getHistory(): ApiResult<Feedback[]>
  getById(id: number): ApiResult<Feedback>
}

export interface TaskService {
  create(data: TaskCreate): ApiResult<Task>
  getById(id: number): ApiResult<Task>
  getUserTasks(): ApiResult<Task[]>
  cancel(id: number): ApiResult<Task>
}

export interface PaymentService {
  create(data: PaymentCreate): ApiResult<Payment>
  getById(id: number): ApiResult<Payment>
  getUserPayments(): ApiResult<Payment[]>
  verify(id: number): ApiResult<Payment>
  cancel(id: number): ApiResult<Payment>
}