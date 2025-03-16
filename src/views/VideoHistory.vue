<template>
  <div class="relative min-h-screen overflow-hidden">
    <BackgroundEffect />

    <div class="relative flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4 py-16">
      <Navigation />

      <div
        class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Extraction History</h1>
          <div class="flex items-center space-x-2">
            <!-- <input
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
            </div> -->
          </div>
        </div>

        <!-- Downloads List -->
        <div class="space-y-4">
          <div v-for="video in paging.records" :key="video.id"
            class="flex items-center justify-between p-4 bg-white/30 dark:bg-gray-700/30 rounded-lg border border-white/10 dark:border-gray-600/30 hover:bg-white/40 dark:hover:bg-gray-600/40 transition-all">
            <div class="flex items-center space-x-4 flex-1">
              <div class="w-10 h-10 rounded-lg bg-[#f32b2b]/10 flex items-center justify-center flex-shrink-0">
                <Icon
                  :icon="video.author === 'completed' ? 'ri:check-line' : video.author === 'failed' ? 'ri:close-line' : 'ri:download-line'"
                  :class="[
            'w-6 h-6',
            video.author === 'completed' ? 'text-green-500' :
              video.author === 'failed' ? 'text-[#f32b2b]' :
                'text-[#f32b2b]'
          ]" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-gray-800 dark:text-white font-medium ">{{ video.title }}</p>
                <div class="flex items-center space-x-4 mt-1">
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(video.created_at) }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ video.author }}</p>
                  <!-- <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatSize(video?.size) }}</p> -->
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <!-- <button v-if="video.author === 'failed'" @click="retryDownload(video.id)"
                class="p-2 text-[#f32b2b] hover:bg-[#f32b2b]/10 rounded-lg transition-all" title="Retry Download">
                <Icon icon="ri:refresh-line" class="w-5 h-5" />
              </button>
              <button v-if="video.author === 'completed'" @click="openFile(video.id)"
                class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                title="Open File">
                <Icon icon="ri:folder-open-line" class="w-5 h-5" />
              </button> -->
              <button @click="deleteVideo(video.id)"
                class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                title="Delete">
                <Icon icon="ri:delete-bin-line" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="paging.total === 0" class="text-center py-12">
            <Icon icon="ri:inbox-line" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400 text-lg">No extraction history found</p>
            <p class="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Your extraction history will appear here
            </p>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="paging.records.length > 0" class="mt-6 flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ paging.current }}-{{ paging.pages }} of {{ paging.total }} extractions
          </p>
          <div class="flex items-center space-x-2">
            <button @click="loadPage(currentPage - 1)" :disabled="currentPage === 1"
              class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50">
              <Icon icon="ri:arrow-left-s-line" class="w-5 h-5" />
            </button>
            <span class="text-sm text-gray-600 dark:text-gray-400">Page {{ currentPage }}</span>
            <button @click="loadPage(currentPage + 1)" :disabled="paging.current >= paging.pages"
              class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50">
              <Icon icon="ri:arrow-right-s-line" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer />

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this extraction record? This
          action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteConfirm = false"
            class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
            Cancel
          </button>
          <button @click="confirmDelete()"
            class="px-4 py-2 bg-[#f32b2b] text-white rounded-lg hover:bg-[#f32b2b]/90 transition-all">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useToastStore } from '../stores/toast'
import { useVideoStore } from '../stores/video'
import { Video } from '@/types/video'
import type { Paging } from '@/types/paging'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Navigation from '../components/layout/Navigation.vue'
import Footer from '../components/layout/Footer.vue'

// 删除确认对话框状态
const showDeleteConfirm = ref(false)
const videoToDelete = ref<number | null>(null)

const toastStore = useToastStore()
const vidoStore = useVideoStore()

const pageSize = 5
const paging = ref<Paging<Video>>({
  current: 1,
  records: [],
  total: 0,
  size: pageSize,
  pages: 0
})

const currentPage = ref(1)

const loadPage = async (page: number) => {
  try {
    const result = await vidoStore.getVideoHistory(page, pageSize)
    paging.value = result!!
    currentPage.value = page
  } catch (error) {
    toastStore.showToast('Failed to load videos history', 'error')
  }
}

const deleteVideo = (id: number) => {
  videoToDelete.value = id
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!videoToDelete.value) return

  try {
    await vidoStore.deleteVideo(videoToDelete.value)
    // 从当前页面记录中移除已删除的视频
    paging.value.records = paging.value.records.filter(video => video.id !== videoToDelete.value)
    paging.value.total--

    // 如果当前页已空且不是第一页，加载上一页
    if (paging.value.records.length === 0 && currentPage.value > 1) {
      await loadPage(currentPage.value - 1)
    }
    // 如果当前页不为空但记录数小于页面大小，重新加载当前页
    else if (paging.value.records.length < pageSize && paging.value.total > 0) {
      await loadPage(currentPage.value)
    }

    toastStore.showToast('Extraction deleted', 'success')
  } catch (error) {
    toastStore.showToast('Failed to delete extraction', 'error')
  } finally {
    showDeleteConfirm.value = false
    videoToDelete.value = null
  }
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

onMounted(() => {
  loadPage(currentPage.value)
})

</script>
