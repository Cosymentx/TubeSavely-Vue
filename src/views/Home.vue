<template>
  <div class="relative min-h-screen overflow-x-clip">
    <!-- 背景效果 -->
    <BackgroundEffect />

    <!-- Main Content -->
    <div class="relative flex flex-col items-center min-h-screen max-w-7xl mx-auto px-4 pt-20 lg:pt-20">
      <Navigation />

      <!-- Logo Section -->
      <div class="mb-8 lg:mb-10 text-center animate-fade-in">
        <div class="relative w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4 lg:mb-6">
          <!-- 增强光晕效果 -->
          <div class="absolute inset-0 rounded-full bg-gradient-to-r from-[#f32b2b]/20 to-[#ff4b4b]/20 blur-[50px]">
          </div>
          <div class="absolute inset-0 rounded-full bg-gradient-to-r from-[#f32b2b]/30 to-[#ff4b4b]/30 blur-2xl"></div>
          <div class="absolute inset-0 rounded-full bg-gradient-to-r from-[#f32b2b]/50 to-[#ff4b4b]/50 blur-xl"></div>
          <div
            class="relative w-full h-full rounded-full bg-gradient-to-br from-[#f32b2b] to-[#ff4b4b] flex items-center justify-center shadow-lg backdrop-blur-sm">
            <Logo class="w-10 h-10 lg:w-12 lg:h-12 text-white" />
          </div>
        </div>
        <h1 class="text-4xl lg:text-5xl font-bold mb-2 lg:mb-3 text-gray-800 dark:text-white">
          TubeSavely
        </h1>
        <p class="text-base lg:text-lg text-gray-600 dark:text-gray-300">Download videos in your preferred format</p>
      </div>

      <!-- Main Input Section -->
      <div class="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <div
          class="relative form-container bg-white/40 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/30 rounded-2xl backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04),0_16px_64px_rgba(0,0,0,0.06)] p-6 lg:p-8">
          <!-- URL Input -->
          <div class="relative mb-8 lg:mb-10">
            <div class="relative flex items-center gap-2">
              <!-- Format Selection -->
              <div class="relative w-24" ref="formatMenuRef">
                <button @click="toggleFormatMenu"
                  class="w-full flex items-center justify-between px-2 py-[0.75rem] min-h-[46px] bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#f32b2b]/30 transition-colors group shadow-sm">
                  <div class="flex items-center gap-1">
                    <Icon :icon="selectedOption.icon"
                      class="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-[#f32b2b] transition-colors" />
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-200">{{ selectedOption.label }}</span>
                  </div>
                  <Icon :icon="isFormatMenuOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'"
                    class="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>

                <Transition enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0">
                  <div v-if="isFormatMenuOpen"
                    class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                    <button v-for="option in formatOptions" :key="option.id" @click="selectFormatOption(option)"
                      class="w-full flex items-center gap-1.5 px-2 py-1.5 hover:bg-[#f32b2b]/5 transition-colors"
                      :class="[
                  videoStore.format === option.id
                    ? 'text-[#f32b2b] bg-[#f32b2b]/5'
                    : 'text-gray-700 dark:text-gray-200'
                ]">
                      <Icon :icon="option.icon" class="w-4 h-4" />
                      <span class="text-xs font-medium">{{ option.label }}</span>
                    </button>
                  </div>
                </Transition>
              </div>

              <input v-model="videoStore.videoUrl" type="text" placeholder="Paste video URL here..."
                :disabled="videoStore.isLoading || videoStore.downloadStatus === 'downloading'"
                class="flex-1 form-input bg-white dark:bg-gray-800 text-gray-800 dark:text-white pr-[120px]" />
              <div class="absolute right-2 flex items-center space-x-2">
                <button v-if="videoStore.videoUrl" @click="videoStore.setVideoUrl('')"
                  class="p-2 hover:bg-[#f32b2b]/5 dark:hover:bg-[#f32b2b]/10 rounded-full transition-all duration-300 group">
                  <Icon :icon="clearIcon" class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-[#f32b2b]" />
                </button>
                <button v-if="!videoStore.videoUrl" @click="handlePaste"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-[#f32b2b]/5 dark:bg-[#f32b2b]/10 hover:bg-[#f32b2b]/10 dark:hover:bg-[#f32b2b]/20 text-[#f32b2b] rounded-lg transition-colors">
                  <Icon :icon="pasteIcon" class="w-4 h-4" />
                  <span class="text-sm font-medium">Paste</span>
                </button>
                <button v-else @click="handleParse" :disabled="videoStore.isLoading"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-[#f32b2b]/5 dark:bg-[#f32b2b]/10 hover:bg-[#f32b2b]/10 dark:hover:bg-[#f32b2b]/20 text-[#f32b2b] rounded-lg transition-colors disabled:opacity-50">
                  <Icon v-if="!videoStore.isLoading" :icon="parseIcon" class="w-4 h-4" />
                  <div v-else class="w-4 h-4 border-2 border-[#f32b2b]/30 border-t-[#f32b2b] rounded-full animate-spin">
                  </div>
                  <span class="text-sm font-medium">{{ videoStore.isLoading ? 'Parsing...' : 'Parse' }}</span>
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <Error v-if="videoStore.error" :message="videoStore.error" class="mt-2" />

            <!-- Video Info -->
            <div v-if="videoStore.videoInfo"
              class="mt-4 p-6 bg-white/30 dark:bg-gray-800/30 rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg backdrop-blur-xl">
              <div class="flex items-start gap-6">
                <div class="relative group">
                  <div
                    class="absolute -inset-2 bg-gradient-to-r from-[#f32b2b]/20 to-[#ff4b4b]/20 rounded-xl blur-xl group-hover:blur-2xl transition-all">
                  </div>
                  <img :src="videoStore.videoInfo.thumbnail" alt="Video thumbnail"
                    class="relative w-32 h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-xl font-semibold text-gray-800 dark:text-white truncate">{{ videoStore.videoInfo.title
                    }}</h3>
                  <div class="flex items-center gap-2 mt-2">
                    <Icon icon="ri:time-line" class="w-4 h-4 text-[#f32b2b]" />
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ formatDuration(videoStore.videoInfo.duration)
                      }}</p>
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <Icon icon="ri:video-line" class="w-4 h-4 text-[#f32b2b]" />
                    <p class="text-sm text-gray-600 dark:text-gray-300">Available in multiple formats</p>
                  </div>
                  <div v-if="videoStore.videoInfo.description" class="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {{ videoStore.videoInfo.description }}
                  </div>
                  <div class="flex items-center gap-4 mt-3">
                    <div class="flex items-center gap-2">
                      <Icon icon="ri:eye-line" class="w-4 h-4 text-[#f32b2b]" />
                      <span class="text-sm text-gray-600 dark:text-gray-300">{{
                    formatNumber(videoStore.videoInfo.view_count || '0') }} views</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Icon icon="ri:thumb-up-line" class="w-4 h-4 text-[#f32b2b]" />
                      <span class="text-sm text-gray-600 dark:text-gray-300">{{
                  formatNumber(videoStore.videoInfo.like_count || '0') }} likes</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Available Formats -->
              <div class="mt-6 lg:mt-8 space-y-3 lg:space-y-4">
                <div class="flex items-center gap-2">
                  <Icon icon="ri:download-cloud-line" class="w-4 h-4 text-[#f32b2b]" />
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-200">Available Formats:</p>
                </div>
                <div id="video-format-options" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button v-for="format in visibleFormats" :key="format.format_id" @click="selectFormat(format)"
                    :disabled="isBusy"
                    :class="[
                  'px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm w-full',
                  isBusy ? 'opacity-60 cursor-not-allowed' : '',
                  selectedFormat?.format_id === format.format_id
                    ? 'bg-[#f32b2b]/10 text-[#f32b2b] border-2 border-[#f32b2b] shadow-[#f32b2b]/10'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#f32b2b] hover:bg-[#f32b2b]/5'
                ]">
                    <div class="flex flex-col items-start gap-1">
                      <div class="flex items-center justify-between w-full">
                        <span class="font-semibold">{{ format.label || format.format_note || 'Original' }}</span>
                        <span class="text-xs opacity-75">{{ format.ext.toUpperCase() }}</span>
                      </div>
                      <div class="flex flex-col text-xs opacity-75 text-left">
                        <span v-if="format.width && format.height">Resolution: {{ format.width }}x{{ format.height }}</span>
                        <span v-if="format.vcodec || format.acodec">Codec: {{ format.vcodec !== 'none' ? format.vcodec : format.acodec }}</span>
                        <span v-if="format.filesize">Size: {{ (format.filesize / 1024 / 1024).toFixed(1) }} MB</span>
                        <span v-if="format.tbr">Bitrate: {{ (format.tbr / 1000).toFixed(1) }} Mbps</span>
                      </div>
                    </div>
                  </button>
                </div>
                <button v-if="filteredFormats.length > 4" type="button"
                  :aria-expanded="showAllFormats" aria-controls="video-format-options"
                  class="text-sm font-medium text-[#f32b2b] hover:underline"
                  @click="showAllFormats = !showAllFormats">
                  {{ showAllFormats ? 'Show fewer' : `Show all ${filteredFormats.length} formats` }}
                </button>
              </div>
            </div>
          </div>

          <!-- Real-time Download Progress Card -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div
              v-if="isBusy"
              class="mb-4 p-4 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-[#f32b2b]/20 dark:border-[#f32b2b]/30 backdrop-blur-md shadow-sm space-y-2.5"
            >
              <div class="flex items-center justify-between text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-medium">
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 border-2 border-[#f32b2b]/30 border-t-[#f32b2b] rounded-full animate-spin"></div>
                  <span>{{ videoStore.downloadStatus === 'preparing' ? 'Preparing video stream...' : 'Downloading video...' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span v-if="videoStore.downloadTotal > 0" class="text-xs opacity-75 font-mono">
                    {{ formatBytes(videoStore.downloadLoaded) }} / {{ formatBytes(videoStore.downloadTotal) }}
                  </span>
                  <span v-else-if="videoStore.downloadLoaded > 0" class="text-xs opacity-75 font-mono">
                    {{ formatBytes(videoStore.downloadLoaded) }} transferred
                  </span>
                  <span class="font-bold text-[#f32b2b] font-mono text-sm">
                    {{ videoStore.downloadProgress }}%
                  </span>
                </div>
              </div>

              <!-- Track -->
              <div class="w-full h-2.5 bg-gray-200 dark:bg-gray-700/80 rounded-full overflow-hidden relative shadow-inner">
                <div
                  class="h-full bg-gradient-to-r from-[#f32b2b] to-[#ff4b4b] rounded-full transition-all duration-200 ease-out relative"
                  :style="{ width: `${videoStore.downloadProgress}%` }"
                >
                  <div class="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>

              <div class="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                <span>{{ selectedFormat?.format_note || `${selectedFormat?.height || 720}p` }} · {{ selectedFormat?.ext?.toUpperCase() }}</span>
                <span>The file will be saved automatically once transfer finishes</span>
              </div>
            </div>
          </Transition>

          <!-- Download Action Button with Interactive States -->
          <button
            @click="handleButtonClick"
            :disabled="isButtonDisabled"
            class="w-full py-3.5 px-6 rounded-xl font-medium relative overflow-hidden transition-all duration-300 shadow-md flex items-center justify-center gap-2 select-none group"
            :class="buttonThemeClass"
          >
            <!-- Progress Fill background inside Button -->
            <div
              v-if="isBusy"
              class="absolute inset-0 bg-white/20 dark:bg-white/25 transition-all duration-200 ease-out pointer-events-none"
              :style="{ width: `${videoStore.downloadProgress}%` }"
            ></div>

            <!-- Bottom Progress Line -->
            <div
              v-if="isBusy"
              class="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-black/20 pointer-events-none"
            >
              <div
                class="h-full bg-white dark:bg-gray-100 transition-all duration-200 ease-out"
                :style="{ width: `${videoStore.downloadProgress}%` }"
              ></div>
            </div>

            <!-- Content Container -->
            <div class="relative z-10 flex items-center justify-center gap-2">
              <!-- Case 1: Preparing -->
              <template v-if="videoStore.downloadStatus === 'preparing'">
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Preparing download...</span>
              </template>

              <!-- Case 2: Downloading with Progress -->
              <template v-else-if="videoStore.downloadStatus === 'downloading'">
                <Icon icon="ri:download-2-line" class="w-5 h-5 animate-bounce" />
                <span class="font-semibold">Downloading... {{ videoStore.downloadProgress }}%</span>
                <span v-if="videoStore.downloadTotal > 0" class="text-xs opacity-85 font-mono hidden sm:inline">
                  ({{ formatBytes(videoStore.downloadLoaded) }} / {{ formatBytes(videoStore.downloadTotal) }})
                </span>
                <span v-else-if="videoStore.downloadLoaded > 0" class="text-xs opacity-85 font-mono hidden sm:inline">
                  ({{ formatBytes(videoStore.downloadLoaded) }})
                </span>
              </template>

              <!-- Case 3: Completed Success -->
              <template v-else-if="videoStore.downloadStatus === 'completed'">
                <Icon icon="ri:checkbox-circle-fill" class="w-5 h-5 text-emerald-200" />
                <span class="font-semibold">Downloaded Successfully!</span>
              </template>

              <!-- Case 4: Failed -->
              <template v-else-if="videoStore.downloadStatus === 'failed'">
                <Icon icon="ri:error-warning-fill" class="w-5 h-5 text-amber-200" />
                <span>Download Failed — Click to Retry</span>
              </template>

              <!-- Case 5: Parsing in progress -->
              <template v-else-if="videoStore.isLoading">
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Parsing Video...</span>
              </template>

              <!-- Case 6: URL entered but not parsed -->
              <template v-else-if="videoStore.videoUrl && !videoStore.videoInfo">
                <Icon icon="ri:search-line" class="w-5 h-5" />
                <span>Parse Video</span>
              </template>

              <!-- Case 7: Parsed, but no format selected -->
              <template v-else-if="videoStore.videoInfo && !selectedFormat">
                <Icon icon="ri:file-list-3-line" class="w-5 h-5" />
                <span>Select a Format</span>
              </template>

              <!-- Case 8: Ready to Download -->
              <template v-else-if="selectedFormat">
                <Icon icon="ri:download-cloud-2-line" class="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                <span>Download {{ selectedFormat.label || `${selectedFormat.height || 720}p ${selectedFormat.ext.toUpperCase()}` }}</span>
                <span v-if="selectedFormat.filesize" class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-normal opacity-90 hidden sm:inline">
                  {{ formatBytes(selectedFormat.filesize) }}
                </span>
              </template>

              <!-- Case 9: Empty URL initial state -->
              <template v-else>
                <Icon icon="ri:link" class="w-5 h-5 opacity-70" />
                <span>Enter Video URL</span>
              </template>
            </div>
          </button>

          <!-- Terms -->
          <div class="text-center mt-6 lg:mt-8">
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              by continuing, you agree to our
              <router-link to="/terms" class="text-[#f32b2b] hover:text-[#ff4b4b] transition-colors">
                terms and ethics of use
              </router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <!-- <Loading v-if="videoStore.isLoading" /> -->
    </div>
    <Transition appear enter-active-class="transition-all duration-700 ease-out"
      enter-from-class="-translate-y-8 opacity-0" enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-300 ease-in" leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-8 opacity-0">
      <div v-if="!userStore.isLoggedIn"
        class="fixed top-16 sm:top-[4.5rem] left-0 right-0 z-20 flex justify-center pointer-events-none px-4">
        <div
          class="pointer-events-auto animate-float relative flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/10 shadow-lg text-gray-700 dark:text-white text-sm sm:text-base whitespace-nowrap">
          <div
            class="absolute inset-0 rounded-full bg-gradient-to-r from-[#f32b2b]/10 to-[#ff4b4b]/10 dark:from-[#f32b2b]/20 dark:to-[#ff4b4b]/20 blur">
          </div>
          <div class="relative flex items-center gap-2 flex-nowrap">
            <Icon icon="ri:shield-star-line" class="w-4 h-4 sm:w-5 sm:h-5 text-[#f32b2b] shrink-0" />
            <span class="font-medium">Get <span class="text-[#f32b2b] mr-1">unlimited</span>access</span>
            <div class="flex items-center border-l border-gray-300/50 dark:border-white/20 shrink-0 ml-2">
              <router-link to="/register"
                class="px-2.5 py-0.5 text-[#f32b2b] hover:bg-[#f32b2b]/10 rounded-lg transition-colors font-medium ml-2">
                Sign up
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useVideoStore } from '../stores/video'
import { useUserStore } from '../stores/user'
import type { VideoFormat } from '../types/video'
import { isValidUrl, extractDouyinUrl } from '../utils/url'
import { formatBytes } from '../utils/format'
import { deduplicateFormatsForMode } from '../utils/video'
import Logo from '../components/logo.vue'
import Navigation from '../components/layout/Navigation.vue'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Error from '../components/common/Error.vue'
import Footer from '../components/layout/Footer.vue'

const videoStore = useVideoStore()
const userStore = useUserStore()

// 添加格式化时长的函数
const formatDuration = (duration: string) => {
  const seconds = parseInt(duration)
  if (isNaN(seconds)) return duration

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const pad = (num: number) => num.toString().padStart(2, '0')

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`
  } else {
    return `${pad(minutes)}:${pad(remainingSeconds)}`
  }
}
const formatNumber = (num: number | string): string => {
  const n = typeof num === 'string' ? parseInt(num) : num
  if (isNaN(n)) return '0'

  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + 'M'
  } else if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'K'
  }
  return n.toString()
}
const formatOptions = [
  {
    id: 'auto',
    icon: 'ri:cloud-line',
    label: 'AUTO'
  },
  {
    id: 'audio',
    icon: 'ri:headphone-line',
    label: 'AUDIO'
  },
  {
    id: 'mute',
    icon: 'ri:volume-off-vibrate-line',
    label: 'MUTE'
  }
]

const handlePaste = async () => {
  try {
    const text = await navigator.clipboard.readText()
    console.log('Pasted text:', text)
    if (!isValidUrl(text)) {
      videoStore.error = 'Please enter a valid URL'
      return
    }
    let realVideoUrl = text

    // 如果包含抖音域名，尝试提取真实链接
    if (realVideoUrl.includes('douyin.com')) {
      realVideoUrl = extractDouyinUrl(realVideoUrl) || realVideoUrl
    }

    videoStore.setVideoUrl(realVideoUrl)
  } catch (err) {
    console.error('Failed to paste from clipboard')
  }
}

const selectedFormat = ref<VideoFormat | null>(null)
const showAllFormats = ref(false)

const selectFormat = (format: VideoFormat) => {
  selectedFormat.value = format
}

// 修改 handleParse 方法
const handleParse = async () => {
  if (videoStore.videoUrl) {

    let url = videoStore.videoUrl
    if (!isValidUrl(url)) {
      videoStore.error = 'Please enter a valid URL'
      return
    }

    if (url.includes('douyin.com')) {
      url = extractDouyinUrl(url) || url
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      videoStore.error = 'URL must start with http:// or https://'
      return
    }
    await videoStore.parseVideo()
  }
}

const isBusy = computed(() => {
  return videoStore.downloadStatus === 'preparing' || videoStore.downloadStatus === 'downloading'
})

const isButtonDisabled = computed(() => {
  if (isBusy.value) return true
  if (videoStore.isLoading) return true
  if (!videoStore.videoUrl) return true
  if (videoStore.videoInfo && !selectedFormat.value) return true
  return false
})

const buttonThemeClass = computed(() => {
  if (videoStore.downloadStatus === 'completed') {
    return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
  }
  if (videoStore.downloadStatus === 'failed') {
    return 'bg-red-700 hover:bg-red-800 text-white shadow-red-700/20 cursor-pointer'
  }
  if (isBusy.value) {
    return 'bg-gradient-to-r from-[#d92222] to-[#f32b2b] text-white cursor-wait'
  }
  if (videoStore.isLoading) {
    return 'bg-[#f32b2b]/70 text-white cursor-wait'
  }
  if (!videoStore.videoUrl) {
    return 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-700 cursor-not-allowed shadow-none'
  }
  if (videoStore.videoInfo && !selectedFormat.value) {
    return 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none'
  }
  return 'bg-gradient-to-r from-[#f32b2b] to-[#ff4b4b] hover:from-[#e02020] hover:to-[#f32b2b] text-white hover:shadow-lg hover:shadow-[#f32b2b]/25 cursor-pointer active:scale-[0.99]'
})

const handleButtonClick = async () => {
  if (isBusy.value || videoStore.isLoading) return

  // URL已填写但尚未解析时，点击大按钮直接触发解析
  if (videoStore.videoUrl && !videoStore.videoInfo) {
    await handleParse()
    return
  }

  // 正常下载流程
  await handleDownload()
}

const parseIcon = 'ri:search-line'
const clearIcon = 'ri:close-circle-fill'
const pasteIcon = 'ri:clipboard-line'

const formatMenuRef = ref<HTMLElement | null>(null)
const isFormatMenuOpen = ref(false)

const selectedOption = computed(() => {
  return formatOptions.find(option => option.id === videoStore.format) || formatOptions[0]
})

const toggleFormatMenu = () => {
  isFormatMenuOpen.value = !isFormatMenuOpen.value
}

const selectFormatOption = (option: typeof formatOptions[0]) => {
  videoStore.setFormat(option.id)
  isFormatMenuOpen.value = false
}

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  if (formatMenuRef.value && !formatMenuRef.value.contains(event.target as Node)) {
    isFormatMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
// 添加handleDownload函数
// 添加格式过滤和排序逻辑
const filteredFormats = computed(() => {
  if (!videoStore.videoInfo?.formats) return []

  const mode = videoStore.format as 'auto' | 'audio' | 'mute'
  const candidates = videoStore.videoInfo.formats.filter(format => {
    if (mode === 'auto') {
      return format.vcodec !== 'none' &&
        format.ext === 'mp4' &&
        !!format.url &&
        !format.url.includes('.m3u8')
    } else if (mode === 'audio') {
      return format.acodec !== 'none' &&
        format.vcodec === 'none' &&
        !!format.url
    } else if (mode === 'mute') {
      return format.vcodec !== 'none' &&
        format.acodec === 'none' &&
        !!format.url &&
        !format.url.includes('.m3u8')
    }
    return false
  })

  return deduplicateFormatsForMode(candidates, mode)
    .sort((a, b) => {
      if (mode === 'audio') {
        return (b.tbr || 0) - (a.tbr || 0)
      }
      const resA = (a.height || 0) * (a.width || 0)
      const resB = (b.height || 0) * (b.width || 0)
      if (resB !== resA) return resB - resA
      return (b.fps || 0) - (a.fps || 0)
    })
})
const visibleFormats = computed(() => showAllFormats.value ? filteredFormats.value : filteredFormats.value.slice(0, 4))

watch([() => videoStore.videoInfo, () => videoStore.format], () => { showAllFormats.value = false })

watch(filteredFormats, formats => {
  if (!formats.some(format => format.format_id === selectedFormat.value?.format_id)) {
    selectedFormat.value = formats[0] || null
  }
}, { immediate: true })

const handleDownload = async () => {
  if (!selectedFormat.value || !videoStore.videoInfo) return
  await videoStore.downloadVideo(selectedFormat.value)
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

.animate-float {
  animation: float 2s ease-in-out infinite;
}

.backdrop-blur-xl {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.form-container {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transform: translateZ(0);
}
</style>
