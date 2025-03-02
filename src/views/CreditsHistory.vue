<template>
  <div class="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900">
    <BackgroundEffect />

    <div class="relative flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4 py-16">
      <Navigation />

      <div
        class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Credits History</h1>
        </div>

        <!-- Credits Summary -->
        <div
          class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm mb-8">
          <div class="flex items-end space-x-2">
            <span class="text-3xl font-bold text-[#f32b2b]">{{ userStore.localUser?.credits || 0 }}</span>
            <span class="text-2xl text-gray-500 dark:text-gray-400 mb-1">credits available</span>
          </div>
        </div>

        <!-- History List -->
        <div class="space-y-4">
          <div v-for="credit in paging.records" :key="credit.id"
            class="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-2xl font-medium text-gray-800 dark:text-white">{{ credit.action }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ credit.description }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(credit.created_at) }}</p>
              </div>
              <div :class="[
                'text-1xl font-semibold',
                credit.credits >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 text-[#f32b2b]'
              ]">
                {{ credit.credits >= 0 ? '+' : '' }}{{ credit.credits }}
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="paging.total >= 5" class="flex justify-center mt-6 space-x-2">
            <button class="btn-secondary px-4 py-2" :disabled="currentPage === 1" @click="loadPage(currentPage - 1)">
              Previous
            </button>
            <button class="btn-secondary px-4 py-2" :disabled="currentPage >= paging.pages"
              @click="loadPage(currentPage + 1)">
              Next
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!paging?.total" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">No credits transactions yet</p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Navigation from '../components/layout/Navigation.vue'
import Footer from '../components/layout/Footer.vue'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import type { CreditBase } from '@/types/credits'
import type { Paging } from '@/types/paging'
const userStore = useUserStore()
const toastStore = useToastStore()
const currentPage = ref(0)
const pageSize = 5
const paging = ref<Paging<CreditBase>>({
  current: 0,
  records: [],
  total: 0,
  size: pageSize,
  pages: 0
})

const loadPage = async (page: number) => {
  try {
    const result = await userStore.getCreditHistory(page, pageSize)
    paging.value = result!!
    currentPage.value = page
  } catch (error) {
    toastStore.showToast('Failed to load credits history', 'error')
  }
}

onMounted(() => {
  loadPage(currentPage.value)
})

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
