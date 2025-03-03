<template>
  <div class="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900">
    <BackgroundEffect />

    <div class="relative flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4 py-16">
      <Navigation />

      <div
        class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <!-- Profile Header -->
        <div class="flex items-center space-x-6 mb-8">
          <UserAvatar :username="userStore.localUser?.username || ''" :avatar="userStore.localUser?.avatar || ''"
            size="md" class="w-20 h-20" />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ userStore.localUser?.username }}</h1>
                <p class="text-gray-600 dark:text-gray-300">{{ userStore.localUser?.email }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Member since {{
            formatDate(userStore.localUser?.created_at) }}</p>
              </div>
              <button @click="openEditProfile" class="btn-secondary">
                <!-- Edit Profile -->
                Change Password
              </button>
            </div>
          </div>
        </div>

        <!-- Credits Info -->
        <div
          class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm mb-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Credits History</h3>
            <div class="flex items-center space-x-3">
              <button @click="openRechargeDialog" class="btn-primary">
                Recharge Credits
              </button>
              <RouterLink to="/credits-history" class="text-sm text-[#f32b2b] hover:underline">
                View All
              </RouterLink>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="credit in recentCreditsHistory" :key="credit.id"
              class="flex items-center justify-between p-3 bg-white/30 dark:bg-gray-700/30 rounded-lg border border-white/10 dark:border-gray-600/30">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-lg bg-[#f32b2b]/10 flex items-center justify-center">
                  <Icon :icon="credit.credits >= 0 ? 'ri:add-line' : 'ri:subtract-line'" :class="[
            'w-5 h-5',
            credit.credits >= 0 ? 'text-green-500' : 'text-[#f32b2b]'
          ]" />
                </div>
                <div>
                  <p class="text-gray-800 dark:text-white font-medium">{{ credit.action }}</p>
                  <p class="text-gray-800 dark:text-white text-sm">{{ credit.description }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(credit.created_at) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p :class="[
            'text-lg font-semibold',
            credit.credits >= 0 ? 'text-green-600' : 'text-[#f32b2b]'
          ]">
                  {{ credit.credits >= 0 ? '+' : '' }}{{ credit.credits }}
                </p>
                <p class="text-sm text-gray-500 whitespace-nowrap">Balance: {{ userStore.getCredits() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Stats -->
        <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Downloads</h3>
            <p class="text-3xl font-bold text-[#f32b2b]">{{ stats.downloads }}</p>
          </div>
          <div
            class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Saved Videos</h3>
            <p class="text-3xl font-bold text-[#f32b2b]">{{ stats.savedVideos }}</p>
          </div>
          <div
            class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Total Size</h3>
            <p class="text-3xl font-bold text-[#f32b2b]">{{ formatSize(stats.totalSize) }}</p>
          </div>
        </div> -->

        <!-- Download History -->
        <div
          class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Download History</h3>
            <RouterLink to="/download-history" class="text-sm text-[#f32b2b] hover:underline">
              View All
            </RouterLink>
          </div>
          <div class="space-y-4">
            <div v-for="video in recentVideoHistory" :key="video.id"
              class="flex items-center justify-between p-3 bg-white/30 dark:bg-gray-700/30 rounded-lg border border-white/10 dark:border-gray-600/30">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-lg bg-[#f32b2b]/10 flex items-center justify-center">
                  <Icon
                    :icon="video.author === 'completed' ? 'ri:check-line' : video.author === 'failed' ? 'ri:close-line' : 'ri:download-line'"
                    :class="[
            'w-5 h-5',
            video.author === 'completed' ? 'text-green-500' :
            video.author === 'failed' ? 'text-[#f32b2b]' :
                'text-[#f32b2b]'
          ]" />
                </div>
                <div>
                  <p class="text-gray-800 dark:text-white font-medium">{{ video.title }} - <span>{{ video.author }}</span></p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(video.created_at) }}</p>
                </div>
              </div>
              <div class="text-right">
                <!-- <p class="text-sm font-medium text-gray-800 dark:text-white">{{ video.quality }}</p> -->
                <!-- <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatSize(video.size) }}</p> -->
              </div>
            </div>

            <div v-if="recentVideoHistory.length === 0" class="text-center py-8">
              <Icon icon="ri:inbox-line" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p class="text-gray-500 dark:text-gray-400">No downloads yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Dialog -->
    <EditProfileDialog :is-open="isEditProfileOpen" @close="closeEditProfile" @saved="handleProfileSaved" />

    <!-- Recharge Dialog -->
    <RechargeDialog :is-open="isRechargeOpen" @close="closeRechargeDialog" @success="handleRechargeSuccess" />

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useVideoStore } from '@/stores/video'
import { useToastStore } from '../stores/toast'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Navigation from '../components/layout/Navigation.vue'
import Footer from '../components/layout/Footer.vue'
import UserAvatar from '../components/user/UserAvatar.vue'
import EditProfileDialog from '../components/user/EditProfileDialog.vue'
import RechargeDialog from '../components/user/RechargeDialog.vue'
import type { CreditBase } from '@/types/credits'
import type { Video } from '@/types/video'

const toastStore = useToastStore()
const userStore = useUserStore()
const videoStore = useVideoStore()
const isEditProfileOpen = ref(false)
const isRechargeOpen = ref(false)

// Mock data - 实际应该从API获取
// const stats = ref({
//   downloads: 42,
//   savedVideos: 15,
//   totalSize: 1024 * 1024 * 1024 * 2.5 // 2.5GB
// })

const recentCreditsHistory = ref<CreditBase[]>([])
const recentVideoHistory = ref<Video[]>([])

const getRecentCreditsHistory = async () => {
  try {
    const result = await userStore.getCreditHistory(0, 1) // 只获取最近1条记录
    recentCreditsHistory.value = result?.records!!
  } catch (error) {
    toastStore.showToast('Failed to load credits history', 'error')
  }
}

const getRecentVideoHistory = async () => {
  try {
    const result = await videoStore.getVideoHistory(0, 5) // 只获取最近1条记录
    recentVideoHistory.value = result?.records!!
  } catch (error) {
    toastStore.showToast('Failed to load videos history', 'error')
  }
}

onMounted(async () => {
  await getRecentCreditsHistory()
  await getRecentVideoHistory()
})

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
</script>