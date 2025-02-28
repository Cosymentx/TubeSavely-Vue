<template>
  <div class="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900">
    <BackgroundEffect />
    
    <div class="relative flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4 py-16">
      <Navigation />

      <div class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <!-- Profile Header -->
        <div class="flex items-center space-x-6 mb-8">
          <UserAvatar 
            :username="userStore.localUser?.username || ''"
            :avatar="userStore.localUser?.avatar||''"
            size="md"
            class="w-20 h-20"
          />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ userStore.localUser?.username }}</h1>
                <p class="text-gray-600 dark:text-gray-300">{{ userStore.localUser?.email }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Member since {{ formatDate(userStore.localUser?.created_at) }}</p>
              </div>
              <button
                @click="openEditProfile"
                class="btn-secondary"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <!-- Credits Info -->
        <div class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm mb-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Credits History</h3>
            <div class="flex items-center space-x-3">
              <button
                @click="openRechargeDialog"
                class="btn-primary"
              >
                Recharge Credits
              </button>
              <RouterLink 
                to="/credits-history"
                class="text-sm text-[#f32b2b] hover:underline"
              >
                View All
              </RouterLink>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-white/30 dark:bg-gray-700/30 rounded-lg border border-white/10 dark:border-gray-600/30">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-lg bg-[#f32b2b]/10 flex items-center justify-center">
                  <Icon icon="ri:coins-line" class="w-5 h-5 text-[#f32b2b]" />
                </div>
                <div>
                  <p class="text-gray-800 dark:text-white font-medium">Current Balance</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Each video download costs 3 credits</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ userStore.localUser?.credits || 0 }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">credits</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Downloads</h3>
            <p class="text-3xl font-bold text-[#f32b2b]">{{ stats.downloads }}</p>
          </div>
          <div class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Saved Videos</h3>
            <p class="text-3xl font-bold text-[#f32b2b]">{{ stats.savedVideos }}</p>
          </div>
          <div class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Total Size</h3>
            <p class="text-3xl font-bold text-[#f32b2b]">{{ formatSize(stats.totalSize) }}</p>
          </div>
        </div>

        <!-- Download History -->
        <div class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Download History</h3>
            <RouterLink 
              to="/download-history"
              class="text-sm text-[#f32b2b] hover:underline"
            >
              View All
            </RouterLink>
          </div>
          <div class="space-y-4">
            <div v-for="download in downloadHistory" :key="download.id" class="flex items-center justify-between p-3 bg-white/30 dark:bg-gray-700/30 rounded-lg border border-white/10 dark:border-gray-600/30">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-lg bg-[#f32b2b]/10 flex items-center justify-center">
                  <Icon :icon="download.status === 'completed' ? 'ri:check-line' : download.status === 'failed' ? 'ri:close-line' : 'ri:download-line'" 
                       :class="[
                         'w-5 h-5',
                         download.status === 'completed' ? 'text-green-500' : 
                         download.status === 'failed' ? 'text-[#f32b2b]' : 
                         'text-[#f32b2b]'
                       ]"
                  />
                </div>
                <div>
                  <p class="text-gray-800 dark:text-white font-medium truncate max-w-[200px]">{{ download.title }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(download.date) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-800 dark:text-white">{{ download.quality }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatSize(download.size) }}</p>
              </div>
            </div>
            
            <div v-if="downloadHistory.length === 0" class="text-center py-8">
              <Icon icon="ri:inbox-line" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p class="text-gray-500 dark:text-gray-400">No downloads yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Dialog -->
    <EditProfileDialog
      :is-open="isEditProfileOpen"
      @close="closeEditProfile"
      @saved="handleProfileSaved"
    />

    <!-- Recharge Dialog -->
    <RechargeDialog
      :is-open="isRechargeOpen"
      @close="closeRechargeDialog"
      @success="handleRechargeSuccess"
    />

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Navigation from '../components/layout/Navigation.vue'
import Footer from '../components/layout/Footer.vue'
import UserAvatar from '../components/user/UserAvatar.vue'
import EditProfileDialog from '../components/user/EditProfileDialog.vue'
import RechargeDialog from '../components/user/RechargeDialog.vue'

const toastStore = useToastStore()
const userStore = useUserStore()
const isEditProfileOpen = ref(false)
const isRechargeOpen = ref(false)

// Mock data - 实际应该从API获取
const stats = ref({
  downloads: 42,
  savedVideos: 15,
  totalSize: 1024 * 1024 * 1024 * 2.5 // 2.5GB
})

interface Download {
  id: number
  title: string
  date: string
  quality: string
  size: number
  status: 'completed' | 'failed' | 'downloading'
}

// Mock data - 实际应该从API获取
const downloadHistory = ref<Download[]>([
  {
    id: 1,
    title: 'Why Vue.js is Amazing.mp4',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    quality: '1080p',
    size: 1024 * 1024 * 150, // 150MB
    status: 'completed'
  },
  {
    id: 2,
    title: 'Learn TypeScript in 2024.mp4',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    quality: '720p',
    size: 1024 * 1024 * 80, // 80MB
    status: 'completed'
  },
  {
    id: 3,
    title: 'Building Modern Web Apps.mp4',
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    quality: '1080p',
    size: 1024 * 1024 * 200, // 200MB
    status: 'failed'
  }
])

const openEditProfile = () => {
  isEditProfileOpen.value = true
}

const closeEditProfile = () => {
  isEditProfileOpen.value = false
}

const handleProfileSaved = () => {
  // Refresh user data if needed
}

const openRechargeDialog = () => {
  isRechargeOpen.value = true
}

const closeRechargeDialog = () => {
  isRechargeOpen.value = false
}

const handleRechargeSuccess = async () => {
  // Refresh user data to get updated credits
  await userStore.fetchProfile()
  toastStore.showToast('Credits recharged successfully!', 'success')
}

const formatDate = (date: string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}
</script>