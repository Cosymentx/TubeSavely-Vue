export interface UserBase {
  username: string
  email: string
  credits: number
  is_superuser: boolean
  avatar?: string
  bio?: string
  oauth_provider?: string
  oauth_id?: string
  has_password: boolean
}

export interface UserCreate {
  username: string
  email: string
  password: string
  confirmPassword?: string  // 前端验证用，不发送给后端
  is_superuser?: boolean
}

export interface UserUpdate {
  username?: string
  email?: string
  password?: string
  credits?: number
  avatar?: string | FormData
  bio?: string
}

export interface User extends UserBase {
  id: number
  created_at: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface UserPasswordUpdate {
  current_password: string
  new_password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}