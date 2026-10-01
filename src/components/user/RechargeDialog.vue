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

              <div class="mb-8">
                <label class="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Currency
                  <select v-model="currencyCode" class="ml-3 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                    <option value="CNY">CNY (¥)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </label>
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
                      {{ currencyCode === 'CNY' ? '¥' : '$' }} {{ formatAmount(amount) }}
                    </div>
                  </button>
                </div>
              </div>

              <div class="mb-8">
                <p class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Payment method</p>
                <p v-if="paymentMethods.length === 0" class="text-sm text-gray-500">No payment method is available for this currency.</p>
                <div class="grid grid-cols-2 gap-4">
                  <button v-for="method in paymentMethods" :key="method.id" @click="selectedPaymentMethod = method"
                    :class="[
                      'flex items-center justify-center p-5 rounded-lg border transition-all duration-200 hover:scale-105',
                      selectedPaymentMethod?.id === method.id
                        ? 'border-[#f32b2b] bg-[#f32b2b]/10 text-[#f32b2b] shadow-md'
                        : 'border-gray-300 dark:border-gray-700 hover:border-[#f32b2b] hover:bg-[#f32b2b]/5'
                    ]">
                    <span aria-hidden="true" class="mr-3 text-xl">{{ method.id === 'alipay' ? '◈' : '▣' }}</span>
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
import { computed, ref, watch, onMounted } from 'vue'
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
const currencyCode = ref<'CNY' | 'USD'>(navigator.language.toLowerCase().startsWith('zh') ? 'CNY' : 'USD')
const paymentMethods = computed(() => configuredMethods.value.filter(method => method.currencies.includes(currencyCode.value)))
const formatAmount = (amount: CreditAmount) => (currencyCode.value === 'CNY' ? amount.amount_cny : amount.amount_usd).toFixed(2)
const selectedAmount = ref<CreditAmount | null>(null)
const selectedPaymentMethod = ref<PaymentMethod | null>(null)

const selectDefaultPaymentMethod = () => {
  selectedPaymentMethod.value = paymentMethods.value.find(method => method.id === (currencyCode.value === 'CNY' ? 'alipay' : 'stripe'))
    ?? paymentMethods.value[0]
    ?? null
}

watch(currencyCode, selectDefaultPaymentMethod)
watch(() => props.isOpen, (open) => {
  if (open && predefinedAmounts.value.length > 0) {
    selectedAmount.value = predefinedAmounts.value[0]
    selectDefaultPaymentMethod()
  }
})

onMounted(async () => {
  try {
    const [prices, methods] = await Promise.all([
      paymentStore.getCreditsAmount(),
      paymentStore.getPaymentMethods(),
    ])
    predefinedAmounts.value = (prices ?? []).filter(item => item.is_active)
    configuredMethods.value = methods ?? []
    selectDefaultPaymentMethod()
    if (props.isOpen) selectedAmount.value = predefinedAmounts.value[0] ?? null
  } catch {
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
    const response = await paymentStore.createPayment(
      selectedAmount.value.id,
      currencyCode.value,
      selectedPaymentMethod.value.id as PaymentMethodType
    )

    if (!response) {
      throw new Error('Payment initiation failed')
    }

    // 根据不同支付方式处理跳转
    switch (selectedPaymentMethod.value.id) {
      case 'alipay':
        window.location.href = response.payment_url
        break

      case 'wechat':
        // 显示微信支付二维码
        // 实现二维码显示逻辑
        // 同时开始轮询支付状态
        pollPaymentStatus(response.order_id)
        break

      case 'paypal':
      case 'stripe':
      case 'airwallex':
      case 'creem':
        // PayPal、Stripe和Airwallex使用重定向方式
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

// 添加轮询支付状态的函数
const pollPaymentStatus = async (orderId: string) => {
  const maxAttempts = 30 // 最多轮询10次
  let attempts = 0

  const checkStatus = async () => {
    try {
      const { status } = await paymentStore.getPaymentStatus(orderId)
      if (status === 'pending') {
        console.log('Payment is pending...')
        // 继续轮询
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 3000) // 每3秒检查一次
        }
      } else
        if (status === 'completed') {
          // 支付成功
          toastStore.showToast('Payment successful!', 'success')
          closeDialog()
          emit('success')
          return
        } else if (status === 'failed') {
          // 支付失败
          toastStore.showToast('Payment failed. Please try again.', 'error')
          return
        } else if (status === 'refunded') {
          toastStore.showToast('Payment refunded. Please try again.', 'error')
          return
        }
    } catch (error) {
      console.error('Failed to check payment status:', error)
    }
  }

  checkStatus()
}
</script>