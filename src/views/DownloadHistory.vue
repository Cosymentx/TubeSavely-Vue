<template>
  <div class="relative min-h-screen overflow-hidden">
    <BackgroundEffect />
    
    <div class="relative flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4 py-16">
      <Navigation />

      <div class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Download History</h1>
          <div class="flex items-center space-x-2">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search downloads..."
              class="px-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#f32b2b]/50 transition-all w-64"
            />
            <div class="w-44">
              <CustomSelect
                v-model="statusFilter"
                :options="[
                  { value: 'all', label: 'All Status' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'failed', label: 'Failed' },
                  { value: 'downloading', label: 'Downloading' }
                ]"
              />
            </div>
          </div>
        </div>

        <!-- Downloads List -->
        <div class="space-y-4">
          <div v-for="download in filteredDownloads" :key="download.id" 
               class="flex items-center justify-between p-4 bg-white/30 dark:bg-gray-700/30 rounded-lg border border-white/10 dark:border-gray-600/30 hover:bg-white/40 dark:hover:bg-gray-600/40 transition-all">
            <div class="flex items-center space-x-4 flex-1">
              <div class="w-12 h-12 rounded-lg bg-[#f32b2b]/10 flex items-center justify-center">
                <Icon :icon="download.status === 'completed' ? 'ri:check-line' : download.status === 'failed' ? 'ri:close-line' : 'ri:download-line'" 
                     :class="[
                       'w-6 h-6',
                       download.status === 'completed' ? 'text-green-500' : 
                       download.status === 'failed' ? 'text-[#f32b2b]' : 
                       'text-[#f32b2b]'
                     ]"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-gray-800 dark:text-white font-medium truncate">{{ download.title }}</p>
                <div class="flex items-center space-x-4 mt-1">
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(download.date) }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ download.quality }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatSize(download.size) }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button v-if="download.status === 'failed'"
                      @click="retryDownload(download.id)"
                      class="p-2 text-[#f32b2b] hover:bg-[#f32b2b]/10 rounded-lg transition-all"
                      title="Retry Download">
                <Icon icon="ri:refresh-line" class="w-5 h-5" />
              </button>
              <button v-if="download.status === 'completed'"
                      @click="openFile(download.id)"
                      class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                      title="Open File">
                <Icon icon="ri:folder-open-line" class="w-5 h-5" />
              </button>
              <button @click="deleteDownload(download.id)"
                      class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                      title="Delete">
                <Icon icon="ri:delete-bin-line" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredDownloads.length === 0" class="text-center py-12">
            <Icon icon="ri:inbox-line" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400 text-lg">No downloads found</p>
            <p class="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {{ searchQuery ? 'Try different search terms' : 'Your download history will appear here' }}
            </p>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredDownloads.length > 0" class="mt-6 flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ totalDownloads }} downloads
          </p>
          <div class="flex items-center space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50"
            >
              <Icon icon="ri:arrow-left-s-line" class="w-5 h-5" />
            </button>
            <span class="text-sm text-gray-600 dark:text-gray-400">Page {{ currentPage }}</span>
            <button
              @click="currentPage++"
              :disabled="endIndex >= totalDownloads"
              class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50"
            >
              <Icon icon="ri:arrow-right-s-line" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useToastStore } from '../stores/toast'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Navigation from '../components/layout/Navigation.vue'
import Footer from '../components/layout/Footer.vue'
import CustomSelect from '../components/ui/CustomSelect.vue'

const toastStore = useToastStore()

interface Download {
  id: number
  title: string
  date: string
  quality: string
  size: number
  status: 'completed' | 'failed' | 'downloading'
}

// Mock data - 实际应该从API获取
const downloads = ref<Download[]>([
  {
    id: 1,
    title: 'Why Vue.js is Amazing.mp4',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    quality: '1080p',
    size: 1024 * 1024 * 150,
    status: 'completed'
  },
  {
    id: 2,
    title: 'Learn TypeScript in 2024.mp4',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    quality: '720p',
    size: 1024 * 1024 * 80,
    status: 'completed'
  },
  {
    id: 3,
    title: 'Building Modern Web Apps.mp4',
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    quality: '1080p',
    size: 1024 * 1024 * 200,
    status: 'failed'
  },
  {
    id: 4,
    title: 'Advanced CSS Techniques.mp4',
    date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    quality: '720p',
    size: 1024 * 1024 * 120,
    status: 'downloading'
  }
])

// Filters
const searchQuery = ref('')
const statusFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10

// Computed
const filteredDownloads = computed(() => {
  let filtered = downloads.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(d => d.title.toLowerCase().includes(query))
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(d => d.status === statusFilter.value)
  }

  return filtered
})

const totalDownloads = computed(() => filteredDownloads.value.length)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalDownloads.value))

// Actions
const retryDownload = (id: number) => {
  // TODO: Implement retry logic
  toastStore.showToast('Retrying download...', 'info')
}

const openFile = (id: number) => {
  // TODO: Implement open file logic
  toastStore.showToast('Opening file...', 'info')
}

const deleteDownload = (id: number) => {
  // TODO: Implement delete logic
  downloads.value = downloads.value.filter(d => d.id !== id)
  toastStore.showToast('Download deleted', 'success')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}
</script>
