import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composables/useApi'
import { createPaymentService } from '../services/payment'
import { useToastStore } from './toast'
import type {
  Payment,
  PaymentResponse,
  PaymentResult,
  PaymentMethodType,
  PaymentHistory
} from '../types/payment'
import type { ApiResponse } from '../types/api'
import type { AxiosResponse } from 'axios'


export const usePaymentStore = defineStore('payment', () => {
  const isLoading = ref(false)
  const paymentHistory = ref<Payment[]>([])
  const error = ref<string | null>(null)

  const toastStore = useToastStore()
  const apiService = useApi()
  const api = apiService.axiosInstance
  const paymentService = createPaymentService(api)

  const createPayment = async (amount: number, points: number, payment_method: PaymentMethodType) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await paymentService.createPayment({
        amount,
        points,
        payment_method
      })

      return ((response as unknown as AxiosResponse<ApiResponse<PaymentResponse>>).data).data
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create payment'
      error.value = errorMessage
      toastStore.showToast(errorMessage, 'error')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const getPaymentStatus = async (orderId: string) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await paymentService.getPaymentStatus(orderId)
      return response.data.data as any
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get payment status'
      error.value = errorMessage
      toastStore.showToast(errorMessage, 'error')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const verifyPayment = async (orderId: string) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await paymentService.verifyPayment(orderId)
      return ((response as unknown as AxiosResponse<ApiResponse<PaymentResult>>).data).data
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to verify payment'
      error.value = errorMessage
      toastStore.showToast(errorMessage, 'error')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const getPaymentHistory = async (page = 1, limit = 10) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await paymentService.getPaymentHistory(page, limit)
      const history = ((response as unknown as AxiosResponse<ApiResponse<PaymentHistory>>).data).data
      paymentHistory.value = history.payments
      return history
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get payment history'
      error.value = errorMessage
      toastStore.showToast(errorMessage, 'error')
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    paymentHistory,
    error,
    createPayment,
    getPaymentStatus,
    verifyPayment,
    getPaymentHistory
  }
}) 