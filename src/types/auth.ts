import type { User } from './user'

export interface AuthResponse {
  access_token: string
  user: User
}

export interface ApiResponse<T> {
  code: number
  msg?: string
  data?: T
}

export type AuthResponseData = AuthResponse 