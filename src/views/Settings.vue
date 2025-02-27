<template>
  <div class="relative min-h-screen overflow-hidden">
    <BackgroundEffect />
    
    <div class="relative flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4 py-16">
      <Navigation />

      <div class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Settings</h1>

        <!-- Download Preferences -->
        <div class="space-y-6">
          <div>
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Download Preferences</h2>
            <div class="space-y-6">
              <!-- Default Quality -->
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Default Video Quality</label>
                <CustomSelect
                  v-model="preferences.defaultQuality"
                  :options="[
                    { value: 'best', label: 'Best Available' },
                    { value: '1080p', label: '1080P' },
                    { value: '720p', label: '720P' },
                    { value: '480p', label: '480P' },
                    { value: '360p', label: '360P' }
                  ]"
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This will be used as the default quality when downloading videos
                </p>
              </div>
              
              <!-- Auto Convert -->
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Auto Convert to MP4</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Automatically convert videos to MP4 format</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="preferences.autoConvert"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#f32b2b]"></div>
                </label>
              </div>

              <!-- Notification -->
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Download Notifications</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Get notified when downloads complete</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="preferences.notifications"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#f32b2b]"></div>
                </label>
              </div>

              <!-- Concurrent Downloads -->
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Maximum Concurrent Downloads</label>
                <CustomSelect
                  v-model="preferences.maxConcurrent"
                  :options="[
                    { value: '1', label: '1 download at a time' },
                    { value: '2', label: '2 downloads at a time' },
                    { value: '3', label: '3 downloads at a time' }
                  ]"
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Higher numbers may affect download speed and system performance
                </p>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <button
            @click="savePreferences"
            :disabled="isLoading || !hasChanges"
            class="btn-primary w-full"
          >
            {{ isLoading ? 'Saving...' : 'Save Preferences' }}
          </button>
        </div>

        <!-- Logout -->
        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="logout"
            class="btn-danger w-full"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'
import { useRouter } from 'vue-router'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Navigation from '../components/layout/Navigation.vue'
import Footer from '../components/layout/Footer.vue'
import CustomSelect from '../components/ui/CustomSelect.vue'

const userStore = useUserStore()
const toastStore = useToastStore()
const router = useRouter()
const isLoading = ref(false)

// 保存初始设置用于比较变化
const initialPreferences = {
  defaultQuality: 'best',
  autoConvert: true,
  notifications: true,
  maxConcurrent: '2'
}

const preferences = ref({ ...initialPreferences })

const hasChanges = computed(() => {
  return JSON.stringify(preferences.value) !== JSON.stringify(initialPreferences)
})

const savePreferences = async () => {
  try {
    isLoading.value = true
    // TODO: Implement preferences update API call
    // await userStore.updatePreferences(preferences.value)
    
    // 更新初始值
    Object.assign(initialPreferences, preferences.value)
    
    toastStore.showToast('Preferences saved successfully', 'success')
  } catch (err) {
    toastStore.showToast('Failed to save preferences', 'error')
  } finally {
    isLoading.value = false
  }
}

const logout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (err) {
    toastStore.showToast('Failed to sign out', 'error')
  }
}
</script>
