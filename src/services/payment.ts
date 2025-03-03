import type { AxiosInstance } from 'axios'
import type { ApiResult } from '../types/api'
import type { 
  PaymentCreate, 
  PaymentResponse, 
  Payment, 
  PaymentResult,
  PaymentHistory 
} from '../types/payment'
import { Paging } from '@/types/paging'

export const createPaymentService = (api: AxiosInstance) => ({
  createPayment: (data: PaymentCreate): ApiResult<PaymentResponse> => {
    return api.post('/payments/create', null, {
      params: {
        credits: data.credits,
        payment_method: data.payment_method
      }
    })
  },

  getPaymentStatus: (orderId: string): ApiResult<Payment> => {
    return api.get(`/payments/status/${orderId}`)
  },

  verifyPayment: (orderId: string): ApiResult<PaymentResult> => {
    return api.post(`/payments/verify/${orderId}`)
  },

  getPaymentHistory: (page = 1, size = 10): ApiResult<Paging<Payment>> => {
    return api.get(`/payments/history?page=${page}&limit=${size}`)
  }
}) 