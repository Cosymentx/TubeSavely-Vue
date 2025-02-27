import { createApiService } from '../services/api'
import { useToastStore } from '../stores/toast'

export const useApi = () => {
  const toastStore = useToastStore()
  return createApiService(toastStore)
} 