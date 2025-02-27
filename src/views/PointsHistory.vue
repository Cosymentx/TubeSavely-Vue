<template>
  <div class="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900">
    <BackgroundEffect />
    
    <div class="relative flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4 py-16">
      <Navigation />

      <div class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Points History</h1>
        </div>

        <!-- Points Summary -->
        <div class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm mb-8">
          <div class="flex items-end space-x-2">
            <span class="text-3xl font-bold text-[#f32b2b]">{{ userStore.localUser?.points || 0 }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400 mb-1">points available</span>
          </div>
        </div>

        <!-- History List -->
        <div class="space-y-4">
          <div v-for="transaction in pointsHistory" :key="transaction.id" class="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-800 dark:text-white">{{ transaction.description }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(transaction.date) }}</p>
              </div>
              <div :class="[
                'text-lg font-semibold',
                transaction.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              ]">
                {{ transaction.type === 'credit' ? '+' : '-' }}{{ transaction.amount }}
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!pointsHistory.length" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">No points transactions yet</p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Navigation from '../components/layout/Navigation.vue'
import Footer from '../components/layout/Footer.vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

interface PointsTransaction {
  id: number
  type: 'credit' | 'debit'
  amount: number
  description: string
  date: string
}

const pointsHistory = ref<PointsTransaction[]>([
  {
    id: 1,
    type: 'credit',
    amount: 10,
    description: 'Welcome bonus',
    date: new Date().toISOString()
  },
  {
    id: 2,
    type: 'debit',
    amount: 3,
    description: 'Video download',
    date: new Date().toISOString()
  }
])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
