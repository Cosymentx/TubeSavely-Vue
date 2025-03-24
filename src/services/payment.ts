import type { AxiosInstance } from 'axios'
import type { ApiResult } from '../types/api'
import type {
  PaymentCreate,
  PaymentResponse,
  Payment,
  PaymentResult,
  CreditAmount
} from '../types/payment'
import { Paging } from '@/types/paging'

export const createPaymentService = (api: AxiosInstance) => ({
  createPayment: (data: PaymentCreate): ApiResult<PaymentResponse> => {
    return api.post('/payments/create', null, {
      params: {
        credit_amount_id: data.credit_amount_id,
        currency: data.currency,
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
  },

  getCreditAmounts: (): ApiResult<CreditAmount[]> => {
    return api.get('/credit_amount/list')
  }
})