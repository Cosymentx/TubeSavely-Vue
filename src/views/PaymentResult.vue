<template>
  <div class="relative min-h-screen overflow-hidden">
    <BackgroundEffect />

    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div
        class="w-full max-w-md overflow-hidden rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-2xl p-8 text-center shadow-xl border border-white/20 dark:border-gray-700/30">

        <!-- Loading State -->
        <div v-if="loading" class="py-8">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[#f32b2b] mx-auto mb-6"></div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verifying Payment</h2>
          <p class="text-gray-600 dark:text-gray-300">Please wait while we confirm your payment...</p>
        </div>

        <template v-else>
          <!-- Status Icon -->
          <div class="mb-6">
            <div :class="[
              'mx-auto w-16 h-16 rounded-full flex items-center justify-center',
              pending ? 'bg-blue-100 dark:bg-blue-900/30' : success ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
            ]">
              <Icon :icon="pending ? 'ri:time-line' : success ? 'ri:check-line' : 'ri:close-line'" :class="[
                'w-8 h-8',
                pending ? 'text-blue-500' : success ? 'text-green-500' : 'text-red-500'
              ]" />
            </div>
          </div>

          <!-- Status Message -->
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ pending ? 'Payment Processing' : success ? 'Payment Successful' : 'Payment Failed' }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            {{ pending ? 'Payment is not confirmed yet. Your credits will appear after the payment is verified.' : success ? 'Your credits have been successfully recharged' : 'There was an error processing your payment'
            }}
          </p>
        </template>
        <!-- Payment Details -->
        <div v-if="success" class="space-y-4 mb-8">
          <div class="bg-white/30 dark:bg-gray-700/30 rounded-lg p-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600 dark:text-gray-400">Payment Amount</span>
              <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatAmount(amount, currency) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">Credits Received</span>
              <span class="text-lg font-semibold text-[#f32b2b]">+{{ credits }}</span>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="!success && !pending && errorMessage" class="mb-8">
          <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-red-600 dark:text-red-400">
            {{ errorMessage }}
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="!loading" class="flex space-x-4">
          <template v-if="success">
            <button @click="goToProfile" class="flex-1 btn-primary">
              View Credits
            </button>
            <button @click="goToHome" class="flex-1 btn-secondary">
              Back to Home
            </button>
          </template>
          <template v-else>
            <button v-if="pending" @click="retryPayment" class="flex-1 btn-primary">
              Check Again
            </button>
            <button @click="goToProfile" class="flex-1 btn-secondary">
              View Credits
            </button>
            <button @click="goToHome" class="flex-1 btn-secondary">
              Back to Home
            </button>
          </template>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { usePaymentStore } from '../stores/payment'
import { useUserStore } from '../stores/user'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Footer from '../components/layout/Footer.vue'

const route = useRoute()
const router = useRouter()
const paymentStore = usePaymentStore()
const userStore = useUserStore()

const loading = ref(true)
const success = ref(false)
const pending = ref(false)
const currency = ref<'CNY' | 'USD'>('USD')
const amount = ref<number>()
const credits = ref<number>()
const errorMessage = ref<string>()

onMounted(async () => {
  const order_id = route.query.internal_order_id as string
  const status = route.query.status as string

  if (status === 'success' && order_id) {
    try {
      for (let attempt = 0; attempt < 30; attempt++) {
        const result = await paymentStore.getPaymentStatus(order_id)
        if (!result) throw new Error('Could not verify the payment. Check your payment history or try again.')
        amount.value = result.amount
        currency.value = result.currency === 'CNY' ? 'CNY' : 'USD'
        credits.value = result.credits
        if (result.status === 'completed') {
          success.value = true
          await userStore.fetchProfile()
          break
        }
        if (['failed', 'refunded'].includes(result.status)) {
          errorMessage.value = `Payment ${result.status}. No credits were added.`
          break
        }
        pending.value = true
        if (attempt < 29) await new Promise(resolve => setTimeout(resolve, 2000))
      }
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Payment verification failed'
      pending.value = false
    }
  } else {
    success.value = false
    errorMessage.value = 'Payment incomplete'
  }
  // Set loading to false after payment status check
  loading.value = false
})

const formatAmount = (value?: number | string, code: 'CNY' | 'USD' = 'USD') =>
  value !== undefined ? new Intl.NumberFormat(undefined, { style: 'currency', currency: code }).format(Number(value)) : ''

const goToProfile = () => {
  router.push('/profile')
}

const goToHome = () => {
  router.push('/')
}

const retryPayment = () => {
  window.location.reload()
}
</script>
