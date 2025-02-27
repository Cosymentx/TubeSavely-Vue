import { defineStore } from 'pinia'
import { ref } from 'vue'

type ToastType = 'success' | 'error' | 'info'

export interface ToastStore {
  show: boolean
  message: string
  type: ToastType
  showToast: (message: string, type?: ToastType, duration?: number) => void
}

export const useToastStore = defineStore('toast', () => {
  const show = ref(false)
  const message = ref('')
  const type = ref<ToastType>('info')
  let timeout: number | null = null

  const showToast = (newMessage: string, newType: ToastType = 'info', duration = 3000) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    message.value = newMessage
    type.value = newType
    show.value = true

    timeout = window.setTimeout(() => {
      show.value = false
    }, duration)
  }

  return {
    show,
    message,
    type,
    showToast
  }
}) 