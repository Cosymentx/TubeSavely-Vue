<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- 背景效果 -->
    <BackgroundEffect />

    <!-- Main Content -->
    <div class="relative flex flex-col items-center min-h-screen max-w-7xl mx-auto px-4 pt-20 lg:pt-40">
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
                  <div class="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {{ videoStore.videoInfo.description || 'Experience seamless video downloading with our service.Choose from various quality options to suit your needs.' }}
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
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <button v-for="format in filteredFormats" :key="format.format_id" @click="selectFormat(format)"
                    :class="[
                      'px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm w-full',
                      selectedFormat?.format_id === format.format_id
                        ? 'bg-[#f32b2b]/10 text-[#f32b2b] border-2 border-[#f32b2b] shadow-[#f32b2b]/10'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#f32b2b] hover:bg-[#f32b2b]/5'
                    ]">
                    <div class="flex flex-col items-start gap-1">
                      <div class="flex items-center justify-between w-full">
                        <span class="font-semibold">{{ format.format_note || `${format.height || 720}p` }}</span>
                        <span class="text-xs opacity-75">{{ format.ext.toUpperCase() }}</span>
                      </div>
                      <div class="flex flex-col text-xs opacity-75 text-left">
                        <span>Resolution: {{ format.width }}x{{ format.height }}</span>
                        <span>Codec: {{ format.vcodec !== 'none' ? format.vcodec : format.acodec }}</span>
                        <span v-if="format.filesize">Size: {{ (format.filesize / 1024 / 1024).toFixed(1) }} MB</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Download Button -->
          <button @click="handleDownload" :disabled="isDownloadDisabled"
            class="w-full btn-primary py-3 relative overflow-hidden">
            <span v-if="!videoStore.videoUrl">Enter Video URL</span>
            <span v-else-if="!videoStore.videoInfo">Parse Video First</span>
            <span v-else-if="!selectedFormat">Select Format</span>
            <span v-else>Download {{ selectedFormat.label }}</span>
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
    <Transition appear enter-active-class="transition-all duration-1000 ease-in-out"
      enter-from-class="transform -translate-y-16 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition-all duration-300 ease-in" leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-16 opacity-0">
      <div v-if="!userStore.isLoggedIn"
        class="fixed top-16 sm:top-[4.5rem] left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/10 shadow-lg text-gray-700 dark:text-white text-sm sm:text-base animate-float whitespace-nowrap">
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
    </Transition>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useVideoStore } from '../stores/video'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'
import type { VideoFormat } from '../types/video'
import Logo from '../components/logo.vue'
import Navigation from '../components/layout/Navigation.vue'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Error from '../components/common/Error.vue'
import Footer from '../components/layout/Footer.vue'

const videoStore = useVideoStore()
const userStore = useUserStore()
const toastStore = useToastStore()

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
    videoStore.setVideoUrl(text)
  } catch (err) {
    console.error('Failed to paste from clipboard')
  }
}

const selectedFormat = ref<VideoFormat | null>(null)

const selectFormat = (format: VideoFormat) => {
  selectedFormat.value = format
}

// 根据用户偏好设置选择默认格式
const selectDefaultFormat = () => {
  if (!filteredFormats.value.length) return

  const { defaultQuality } = userStore.preferences

  // 根据用户偏好的质量选择格式
  let selectedFormat = filteredFormats.value[0] // 默认选择第一个

  // if (defaultQuality !== 'best') {
  //   // 查找最接近用户偏好质量的格式
  //   const targetHeight = parseInt(defaultQuality)
  //   selectedFormat = filteredFormats.value.find(format => 
  //     format.height === targetHeight
  //   ) || filteredFormats.value[0]
  // }

  selectFormat(selectedFormat)
}

// 修改 handleParse 方法
const handleParse = async () => {
  if (videoStore.videoUrl) {
    // 验证URL格式
    const urlPattern = /^(https?:\/\/)?(([\.\w-]+)\.[a-z]{2,}|localhost)(:\d+)?(\/\S*)?$/i
    const isValidUrl = urlPattern.test(videoStore.videoUrl)

    if (!isValidUrl) {
      videoStore.error = 'Please enter a valid URL'
      return
    }

    if (!videoStore.videoUrl.startsWith('http://') && !videoStore.videoUrl.startsWith('https://')) {
      videoStore.error = 'URL must start with http:// or https://'
      return
    }
    await videoStore.parseVideo()
  }
}

// 修改下载按钮的禁用条件
const isDownloadDisabled = computed(() => {
  return !videoStore.videoInfo ||
    !selectedFormat.value ||
    videoStore.isLoading ||
    videoStore.downloadStatus === 'downloading'
})

const parseIcon = 'ri:search-line'
const clearIcon = 'ri:close-circle-fill'
const pasteIcon = 'ri:clipboard-line'

const formatMenuRef = ref<HTMLElement | null>(null)
const isFormatMenuOpen = ref(false)

const selectedOption = computed(() => {
  selectDefaultFormat()
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

  return videoStore.videoInfo.formats
    .filter(format => {
      // 根据选择的格式类型进行筛选
      if (videoStore.format === 'auto') {
        // 自动模式：选择同时包含视频和音频的mp4格式，排除m3u8格式
        return format.ext === 'mp4' &&
          format.url &&
          !format.url.includes('.m3u8')
      } else if (videoStore.format === 'audio') {
        // 音频模式：选择只有音频的格式
        return format.acodec !== 'none' && format.vcodec === 'none'
      } else if (videoStore.format === 'mute') {
        // 无声视频模式：选择只有视频没有音频的格式
        return format.vcodec !== 'none' && format.acodec === 'none' &&
          format.url && !format.url.includes('.m3u8')
      }
      return false
    })
    .sort((a, b) => {
      if (videoStore.format === 'audio') {
        // 音频按比特率从高到低排序
        return (b.tbr || 0) - (a.tbr || 0)
      } else {
        // 视频按分辨率从高到低排序
        const resA = (a.height || 0) * (a.width || 0)
        const resB = (b.height || 0) * (b.width || 0)
        return resB - resA
      }
    })
})
const handleDownload = async () => {
  if (!userStore.isLoggedIn) {
    toastStore.showToast('Please login to download', 'error')
    return
  }

  if (userStore.getCredits() < 3) {
    toastStore.showToast('Insufficient credits. You need 3 credits to download.', 'error')
    return
  }

  if (!selectedFormat.value || !videoStore.videoInfo) return

  try {
    // 根据用户偏好设置处理下载
    const { autoConvert, notifications } = userStore.preferences

    // 如果启用了自动转换且格式不是 MP4
    if (autoConvert && selectedFormat.value.ext !== 'mp4') {
      toastStore.showToast('Converting to MP4...', 'info')
      // TODO: 实现格式转换逻辑
    }

    // 开始下载
    window.open(selectedFormat.value.url, '_blank')

    // 扣除积分
    await userStore.deductCredits(3)

    // 如果启用了通知
    if (notifications) {
      toastStore.showToast('Download started!', 'success')
    }
  } catch (error) {
    toastStore.showToast('Failed to start download', 'error')
  }
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
    transform: translate(-50%, 0);
  }

  50% {
    transform: translate(-50%, -2px);
  }
}

.animate-float {
  animation: float 2s ease-in-out infinite;
  animation-delay: 1s;
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.form-container {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
</style>