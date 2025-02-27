import type { AxiosResponse } from 'axios'

export interface ApiResponse<T> {
  code: number
  msg: string
  data: T | null
}

export interface ApiError {
  code: number
  msg: string
  data: null
}

export type ApiResult<T> = Promise<AxiosResponse<ApiResponse<T>>> 