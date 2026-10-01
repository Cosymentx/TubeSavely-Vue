<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeDialog" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-2xl p-8 text-left align-middle shadow-xl transition-all dark:border dark:border-gray-700/30">
              <DialogTitle as="h3" class="text-xl font-medium leading-6 text-gray-900 dark:text-white mb-6">
                Recharge Credits
              </DialogTitle>

              <!-- Credit Packages -->
              <div class="mb-8">
                <p class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Select credits</p>
                <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <button v-for="amount in predefinedAmounts" :key="amount.id" @click="selectedAmount = amount"
                    :class="[
                      'p-4 rounded-lg border text-center transition-all duration-200 hover:scale-105',
                      selectedAmount?.id === amount.id
                        ? 'border-[#f32b2b] bg-[#f32b2b]/10 text-[#f32b2b] shadow-md'
                        : 'border-gray-300 dark:border-gray-700 hover:border-[#f32b2b] hover:bg-[#f32b2b]/5'
                    ]">
                    <div class="text-lg font-medium">{{ amount.credits }} Credits</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatAmount(amount) }}
                    </div>
                  </button>
                </div>
              </div>

              <!-- Payment Methods -->
              <div class="mb-8">
                <p class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Payment method</p>
                <p v-if="configuredMethods.length === 0" class="text-sm text-gray-500">No payment method is available.</p>
                <div class="grid grid-cols-2 gap-4">
                  <button v-for="method in configuredMethods" :key="method.id" @click="selectedPaymentMethod = method"
                    :class="[
                      'flex items-center justify-center p-5 rounded-lg border transition-all duration-200 hover:scale-105 text-gray-800 dark:text-white',
                      selectedPaymentMethod?.id === method.id
                        ? 'border-[#f32b2b] bg-[#f32b2b]/10 text-[#f32b2b] shadow-md'
                        : 'border-gray-300 dark:border-gray-700 hover:border-[#f32b2b] hover:bg-[#f32b2b]/5'
                    ]">
                    <!-- Official Brand Icons -->
                    <span class="mr-3 flex items-center justify-center shrink-0">
                      <!-- Stripe Official Icon -->
                      <svg v-if="method.id === 'stripe'" class="w-6 h-6 transition-colors"
                        :class="selectedPaymentMethod?.id === method.id ? 'text-[#f32b2b]' : 'text-[#635BFF]'"
                        viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                      </svg>

                      <!-- Creem Official Icon -->
                      <svg v-else-if="method.id === 'creem'" class="w-6 h-6 transition-colors"
                        :class="selectedPaymentMethod?.id === method.id ? 'text-[#f32b2b]' : 'text-gray-900 dark:text-white'"
                        viewBox="0 0 121 121" fill="currentColor">
                        <path d="M22.1102 11C24.1187 11.0001 25.9669 12.0982 26.9281 13.8619L51.2059 58.4106C52.5699 60.9134 55.7048 61.8368 58.2077 60.473C60.7108 59.109 61.6342 55.9742 60.2701 53.4712L41.5466 19.113C39.554 15.4566 42.2004 11 46.3645 11H103.806C107.885 11 110.539 15.2933 108.715 18.9416L65.0579 106.254C63.0356 110.298 57.2654 110.298 55.2431 106.254L11.5863 18.9416C9.76212 15.2933 12.4156 11 16.4946 11H22.1102Z"/>
                      </svg>

                      <!-- Alipay Official Icon -->
                      <svg v-else-if="method.id === 'alipay'" class="w-6 h-6 transition-colors"
                        :class="selectedPaymentMethod?.id === method.id ? 'text-[#f32b2b]' : 'text-[#1677FF]'"
                        viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.695 15.07c3.426 1.158 4.203 1.22 4.203 1.22V3.846c0-2.124-1.705-3.845-3.81-3.845H3.914C1.808.001.102 1.722.102 3.846v16.31c0 2.123 1.706 3.845 3.813 3.845h16.173c2.105 0 3.81-1.722 3.81-3.845v-.157s-6.19-2.602-9.315-4.119c-2.096 2.602-4.8 4.181-7.607 4.181-4.75 0-6.361-4.19-4.112-6.949.49-.602 1.324-1.175 2.617-1.497 2.025-.502 5.247.313 8.266 1.317a16.796 16.796 0 0 0 1.341-3.302H5.781v-.952h4.799V6.975H4.77v-.953h5.81V3.591s0-.409.411-.409h2.347v2.84h5.744v.951h-5.744v1.704h4.69a19.453 19.453 0 0 1-1.986 5.06c1.424.52 2.702 1.011 3.654 1.333m-13.81-2.032c-.596.06-1.71.325-2.321.869-1.83 1.608-.735 4.55 2.968 4.55 2.151 0 4.301-1.388 5.99-3.61-2.403-1.182-4.438-2.028-6.637-1.809"/>
                      </svg>

                      <!-- WeChat Pay Official Icon -->
                      <svg v-else-if="method.id === 'wechat'" class="w-6 h-6 transition-colors"
                        :class="selectedPaymentMethod?.id === method.id ? 'text-[#f32b2b]' : 'text-[#07C160]'"
                        viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                      </svg>

                      <!-- PayPal Official Icon -->
                      <svg v-else-if="method.id === 'paypal'" class="w-6 h-6 transition-colors"
                        :class="selectedPaymentMethod?.id === method.id ? 'text-[#f32b2b]' : 'text-[#003087] dark:text-[#0079C1]'"
                        viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.016 19.198h-4.2a.562.562 0 0 1-.555-.65L5.093.584A.692.692 0 0 1 5.776 0h7.222c3.417 0 5.904 2.488 5.846 5.5-.006.25-.027.5-.066.747A6.794 6.794 0 0 1 12.071 12H8.743a.69.69 0 0 0-.682.583l-.325 2.056-.013.083-.692 4.39-.015.087zM19.79 6.142c-.01.087-.01.175-.023.261a7.76 7.76 0 0 1-7.695 6.598H9.007l-.283 1.795-.013.083-.692 4.39-.134.843-.014.088H6.86l-.497 3.15a.562.562 0 0 0 .555.65h3.612c.34 0 .63-.249.683-.585l.952-6.031a.692.692 0 0 1 .683-.584h2.126a6.793 6.793 0 0 0 6.707-5.752c.306-1.95-.466-3.744-1.89-4.906z"/>
                      </svg>

                      <!-- Generic / Fallback -->
                      <span v-else class="text-xl">💳</span>
                    </span>

                    <span class="text-base font-medium">{{ method.name }}</span>
                  </button>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="isLoading" class="flex items-center justify-center py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f32b2b]"></div>
              </div>

              <!-- Error Message -->
              <div v-if="error" class="mb-6 p-4 rounded-lg bg-red-50 text-red-500 text-sm">
                {{ error }}
              </div>

              <!-- Action Buttons -->
              <div class="mt-8 flex justify-end space-x-4">
                <button type="button" class="btn-secondary" @click="closeDialog">
                  Cancel
                </button>

                <button type="button" class="btn-primary"
                  :disabled="!selectedAmount || !selectedPaymentMethod || isLoading" @click="handleRecharge">
                  {{ isLoading ? 'Processing...' : 'Recharge Now' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { useToastStore } from '../../stores/toast'
import { usePaymentStore } from '../../stores/payment'
import type { CreditAmount, PaymentMethod, PaymentMethodType } from '../../types/payment'

const toastStore = useToastStore()
const paymentStore = usePaymentStore()

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const isLoading = ref(false)
const error = ref('')

const predefinedAmounts = ref<CreditAmount[]>([])
const configuredMethods = ref<PaymentMethod[]>([])

const fallbackPaymentMethods: PaymentMethod[] = [
  {
    id: 'stripe',
    name: 'Card (Stripe)',
    currencies: ['USD', 'CNY']
  },
  {
    id: 'creem',
    name: 'Card (Creem)',
    currencies: ['USD']
  }
]

const selectedAmount = ref<CreditAmount | null>(null)
const selectedPaymentMethod = ref<PaymentMethod | null>(null)

const formatAmount = (amount: CreditAmount) => {
  // If payment method only supports CNY (e.g. Alipay), show CNY symbol
  if (selectedPaymentMethod.value?.id === 'alipay' && !selectedPaymentMethod.value.currencies?.includes('USD')) {
    return `¥ ${(amount.amount_cny ?? 0).toFixed(2)}`
  }
  // Default to USD
  return `$ ${(amount.amount_usd ?? 0).toFixed(2)}`
}

const selectDefaultPaymentMethod = () => {
  selectedPaymentMethod.value = configuredMethods.value.find(method => method.id === 'stripe')
    ?? configuredMethods.value[0]
    ?? null
}

watch(() => props.isOpen, (open) => {
  if (open && predefinedAmounts.value.length > 0) {
    if (!selectedAmount.value) {
      selectedAmount.value = predefinedAmounts.value[0]
    }
    if (!selectedPaymentMethod.value) {
      selectDefaultPaymentMethod()
    }
  }
})

onMounted(async () => {
  try {
    const [prices, methods] = await Promise.all([
      paymentStore.getCreditsAmount(),
      paymentStore.getPaymentMethods(),
    ])
    predefinedAmounts.value = (prices ?? []).filter(item => item.is_active)
    configuredMethods.value = methods?.length ? methods : fallbackPaymentMethods
    selectDefaultPaymentMethod()
    if (props.isOpen) {
      selectedAmount.value = predefinedAmounts.value[0] ?? null
    }
  } catch {
    configuredMethods.value = fallbackPaymentMethods
    selectDefaultPaymentMethod()
    toastStore.showToast('Could not load credit packages or payment methods', 'error')
  }
})

const closeDialog = () => {
  error.value = ''
  selectedAmount.value = null
  selectedPaymentMethod.value = null
  isLoading.value = false
  emit('close')
}

const handleRecharge = async () => {
  if (!selectedAmount.value || !selectedPaymentMethod.value) return

  try {
    isLoading.value = true
    const currency = selectedPaymentMethod.value.currencies?.includes('USD')
      ? 'USD'
      : (selectedPaymentMethod.value.currencies?.[0] ?? 'USD')

    const response = await paymentStore.createPayment(
      selectedAmount.value.id,
      currency,
      selectedPaymentMethod.value.id as PaymentMethodType
    )

    if (!response) {
      throw new Error('Payment initiation failed')
    }

    switch (selectedPaymentMethod.value.id) {
      case 'alipay':
        window.location.href = response.payment_url
        break

      case 'wechat':
        pollPaymentStatus(response.order_id)
        break

      case 'paypal':
      case 'stripe':
      case 'airwallex':
      case 'creem':
        window.location.href = response.payment_url
        break
    }
  } catch (err) {
    console.error('Payment failed:', err)
    error.value = err instanceof Error ? err.message : 'Payment failed'
    toastStore.showToast(error.value, 'error')
    isLoading.value = false
  }
}

const pollPaymentStatus = async (orderId: string) => {
  const maxAttempts = 30
  let attempts = 0

  const checkStatus = async () => {
    try {
      const { status } = await paymentStore.getPaymentStatus(orderId)
      if (status === 'pending') {
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 3000)
        }
      } else if (status === 'completed') {
        toastStore.showToast('Payment successful!', 'success')
        closeDialog()
        emit('success')
        return
      } else if (status === 'failed') {
        toastStore.showToast('Payment failed. Please try again.', 'error')
        return
      } else if (status === 'refunded') {
        toastStore.showToast('Payment refunded. Please try again.', 'error')
        return
      }
    } catch (err) {
      console.error('Failed to check payment status:', err)
    }
  }

  checkStatus()
}
</script>
