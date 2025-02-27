<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <!-- Modal Content -->
    <div class="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl w-full max-w-3xl max-h-[80vh] shadow-2xl border border-white/10 flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200/10 dark:border-gray-700/10">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Supported Platforms</h2>
        <button @click="$emit('close')" 
          class="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 
                 hover:bg-[#f32b2b]/10 dark:hover:bg-[#f32b2b]/20 
                 rounded-full transition-all 
                 text-gray-800 dark:text-white 
                 hover:text-[#f32b2b] dark:hover:text-[#f32b2b] 
                 text-xl font-medium">
          ×
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="service in services" :key="service.name" 
               class="flex flex-col items-center p-3 rounded-xl backdrop-blur-sm border border-white/5
                      hover:bg-[#f32b2b]/10 transition-all duration-300 group">
            <Icon :icon="service.icon" class="w-10 h-10 mb-2 text-gray-600 dark:text-gray-300 group-hover:text-[#f32b2b] transition-colors" />
            <span class="text-sm font-medium text-center text-gray-600 dark:text-gray-300 group-hover:text-[#f32b2b] transition-colors">{{ service.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()

const services = [
  // 主流国际平台
  { name: 'YouTube', icon: 'mdi:youtube' },
  { name: 'TikTok', icon: 'ic:baseline-tiktok' },
  { name: 'Instagram', icon: 'mdi:instagram' },
  { name: 'Twitter', icon: 'mdi:twitter' },
  { name: 'Facebook', icon: 'mdi:facebook' },
  { name: 'Twitch', icon: 'mdi:twitch' },
  
  // 中国平台
  { name: 'Bilibili', icon: 'ri:bilibili-fill' },
  { name: 'Youku', icon: 'ri:video-fill' },
  { name: 'iQIYI', icon: 'ri:play-circle-fill' },
  { name: 'Douyin', icon: 'ri:douyin-fill' },
  { name: 'WeChat', icon: 'ri:wechat-fill' },
  { name: 'Weibo', icon: 'ri:weibo-fill' },
  { name: 'Xiaohongshu', icon: 'ri:book-2-fill' },
  { name: 'Zhihu', icon: 'ri:zhihu-fill' },
  
  // 视频平台
  { name: 'Vimeo', icon: 'mdi:vimeo' },
  { name: 'Dailymotion', icon: 'simple-icons:dailymotion' },
  { name: 'Niconico', icon: 'simple-icons:niconico' },
  { name: 'Rutube', icon: 'ri:play-circle-fill' },
  { name: 'Vevo', icon: 'ri:music-fill' },
  
  // 社交平台
  { name: 'Reddit', icon: 'mdi:reddit' },
  { name: 'LinkedIn', icon: 'mdi:linkedin' },
  { name: 'Pinterest', icon: 'mdi:pinterest' },
  { name: 'Tumblr', icon: 'mdi:tumblr' },
  { name: 'VK', icon: 'ri:vk-fill' },
  
  // 音频平台
  { name: 'Soundcloud', icon: 'mdi:soundcloud' },
  { name: 'Spotify', icon: 'mdi:spotify' },
  { name: 'Bandcamp', icon: 'ri:music-fill' },
  { name: 'QQ Music', icon: 'ri:qq-fill' },
  { name: 'NetEase Music', icon: 'ri:netease-cloud-music-fill' },
  
  // 直播平台
  { name: 'Huya', icon: 'ri:live-fill' },
  { name: 'Douyu', icon: 'ri:game-fill' },
  { name: 'Kuaishou', icon: 'ri:camera-fill' }
]
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(243, 43, 43, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(243, 43, 43, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(243, 43, 43, 0.5);
}
</style>