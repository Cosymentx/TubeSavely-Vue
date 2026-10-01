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
} from '../types/payment'
import type { ApiResponse } from '../types/api'
import type { AxiosResponse } from 'axios'
import { Paging } from '@/types/paging'


export const usePaymentStore = defineStore('payment', () => {
  const isLoading = ref(false)
  const paymentHistory = ref<Paging<Payment>>()
  const error = ref<string | null>(null)

  const toastStore = useToastStore()
  const apiService = useApi()
  const api = apiService.axiosInstance
  const paymentService = createPaymentService(api)

  const getCreditsAmount = async () => {
    const result = await paymentService.getCreditAmounts()
    return result.data.data
  }

  const createPayment = async (id: number, currency: string, payment_method: PaymentMethodType) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await paymentService.createPayment({
        credit_amount_id: id,
        currency,
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

  const getPaymentHistory = async (offset = 1, limit = 10) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await paymentService.getPaymentHistory(offset, limit)
      paymentHistory.value = response.data.data!!
      return paymentHistory.value
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
    getCreditsAmount,
    getPaymentMethods: async () => {
      const response = await paymentService.getPaymentMethods()
      return response.data.data
    },
    createPayment,
    getPaymentStatus,
    verifyPayment,
    getPaymentHistory
  }
})
