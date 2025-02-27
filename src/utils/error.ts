import type { AxiosError } from 'axios'

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // For axios error wrapped in Error object
    const axiosError = error as any
    if (axiosError.response?.data) {
      return axiosError.response.data.detail || axiosError.response.data.message || error.message
    }
    return error.message
  }

  const axiosError = error as AxiosError<any>
  if (axiosError.response?.data) {
    // Handle direct string error message
    if (typeof axiosError.response.data === 'string') {
      return axiosError.response.data
    }

    // Handle FastAPI error format
    if (axiosError.response.data.detail) {
      // Check if it's a validation error
      if (typeof axiosError.response.data.detail === 'object') {
        return axiosError.response.data.detail.msg || 'Validation error'
      }
      return axiosError.response.data.detail
    }

    // Handle other error formats
    if (axiosError.response.data.message) {
      return axiosError.response.data.message
    }
  }

  return 'An unexpected error occurred'
}