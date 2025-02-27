<template>
  <div class="relative min-h-screen overflow-hidden">
    <BackgroundEffect />
    
    <div class="relative flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4 py-16">
      <Navigation />

      <div class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <!-- 标题部分 -->
        <div class="mb-12">
          <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">Supported Platforms</h1>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            Download videos from your favorite platforms with ease
          </p>
        </div>
        
        <!-- 平台列表 -->
        <div class="space-y-8">
          <!-- 当前支持的平台 -->
          <div>
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Currently Supported</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <div v-for="platform in platforms" :key="platform.name" 
               class="flex flex-col items-center p-4 rounded-xl backdrop-blur-sm border border-white/5
                      hover:bg-[#f32b2b]/10 transition-all duration-300 group">
            <Icon :icon="platform.icon" class="w-10 h-10 mb-2 text-gray-600 dark:text-gray-300 group-hover:text-[#f32b2b] transition-colors" />
            <span class="text-sm font-medium text-center text-gray-600 dark:text-gray-300 group-hover:text-[#f32b2b] transition-colors">{{ platform.name }}</span>
          </div>
            </div>
          </div>

          <!-- 即将支持的平台 -->
          <div class="mt-12">
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Coming Soon</h2>
            <div class="backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 rounded-xl border border-white/10 dark:border-gray-700/20 p-6">
              <p class="text-gray-600 dark:text-gray-300">
                We're constantly working to expand our platform support. Stay tuned for updates as we add more platforms to our list.
              </p>
              <div class="mt-4 flex flex-wrap gap-3">
                <span v-for="platform in comingSoon" :key="platform" 
                      class="px-3 py-1 text-sm backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 rounded-full text-gray-600 dark:text-gray-300 border border-white/20 dark:border-gray-700/30">
                  {{ platform }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navigation from '../components/layout/Navigation.vue'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import { Icon } from '@iconify/vue'
import Footer from '../components/layout/Footer.vue'

const platforms = [
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
  { name: 'Douyin', icon: 'ic:baseline-tiktok' },
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

const comingSoon = [
  'Vimeo',
  'Dailymotion',
  'Twitch',
  'Reddit',
  'LinkedIn',
  'Pinterest'
]
</script>
