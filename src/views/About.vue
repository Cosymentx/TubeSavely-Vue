
<template>
  <div class="relative min-h-screen overflow-hidden">
    <BackgroundEffect />
    
    <div class="relative flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4 py-16">
      <Navigation />

      <div class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <!-- 标题部分 -->
        <div class="mb-12">
          <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">About TubeSavely</h1>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            Your trusted companion for video downloading
          </p>
        </div>
        
        <!-- 主要内容 -->
        <div class="space-y-8 text-gray-600 dark:text-gray-300">
          <!-- 介绍部分 -->
          <section class="space-y-4">
            <p class="text-lg">
              TubeSavely is a powerful and user-friendly video downloader that helps you save your favorite online videos for offline viewing. 
              Built with modern technology and a focus on user experience, we strive to make video downloading simple and efficient.
            </p>
            
            <p class="text-lg">
              Whether you're an educator collecting educational content, a content creator gathering inspiration, or simply someone who wants to watch videos offline, 
              TubeSavely provides you with the tools you need.
            </p>
          </section>

          <!-- 核心特性 -->
          <section class="mt-12">
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Core Features</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-start space-x-4 p-4 rounded-xl bg-white/30 dark:bg-gray-700/30 border border-white/10 dark:border-gray-600/10">
                <div class="flex-shrink-0">
                  <Icon icon="ri:download-cloud-line" class="w-6 h-6 text-[#f32b2b]" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800 dark:text-white mb-2">Multi-Platform Support</h3>
                  <p>Download videos from 30+ popular platforms including YouTube, TikTok, Instagram, and more.</p>
                </div>
              </div>

              <div class="flex items-start space-x-4 p-4 rounded-xl bg-white/30 dark:bg-gray-700/30 border border-white/10 dark:border-gray-600/10">
                <div class="flex-shrink-0">
                  <Icon icon="ri:hd-line" class="w-6 h-6 text-[#f32b2b]" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800 dark:text-white mb-2">Quality Options</h3>
                  <p>Choose from various quality options, from 360p to 4K, to match your needs.</p>
                </div>
              </div>

              <div class="flex items-start space-x-4 p-4 rounded-xl bg-white/30 dark:bg-gray-700/30 border border-white/10 dark:border-gray-600/10">
                <div class="flex-shrink-0">
                  <Icon icon="ri:file-list-3-line" class="w-6 h-6 text-[#f32b2b]" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800 dark:text-white mb-2">Format Flexibility</h3>
                  <p>Convert and download in various formats including MP4, MP3, and more.</p>
                </div>
              </div>

              <div class="flex items-start space-x-4 p-4 rounded-xl bg-white/30 dark:bg-gray-700/30 border border-white/10 dark:border-gray-600/10">
                <div class="flex-shrink-0">
                  <Icon icon="ri:shield-check-line" class="w-6 h-6 text-[#f32b2b]" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800 dark:text-white mb-2">Safe & Secure</h3>
                  <p>No registration required, no ads, and no personal data collection.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 使用指南 -->
          <section class="mt-12">
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">How It Works</h2>
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#f32b2b]/10 flex items-center justify-center">
                  <span class="text-[#f32b2b] font-semibold">1</span>
                </div>
                <p>Copy the video URL from any supported platform</p>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#f32b2b]/10 flex items-center justify-center">
                  <span class="text-[#f32b2b] font-semibold">2</span>
                </div>
                <p>Paste the URL into TubeSavely's download box</p>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#f32b2b]/10 flex items-center justify-center">
                  <span class="text-[#f32b2b] font-semibold">3</span>
                </div>
                <p>Select your preferred format and quality</p>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#f32b2b]/10 flex items-center justify-center">
                  <span class="text-[#f32b2b] font-semibold">4</span>
                </div>
                <p>Click download and enjoy your video offline!</p>
              </div>
            </div>
          </section>

          <!-- 免责声明 -->
          <section class="mt-12 p-6 rounded-xl bg-gray-50/50 dark:bg-gray-700/30 border border-gray-200/10 dark:border-gray-600/10">
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Legal Notice</h2>
            <p class="text-sm mb-2">
              TubeSavely is designed for downloading videos that are either in the public domain, under open licenses, or that you have explicit permission to download. Please respect copyright laws and content creators' rights. We do not host any copyrighted content on our servers.
            </p>
            <p class="text-sm">
              Please be aware that using this tool may violate the Terms of Service of certain platforms. Users are responsible for ensuring their use complies with all applicable laws and platform policies in their jurisdiction.
            </p>
          </section>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Navigation from '../components/layout/Navigation.vue'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Footer from '../components/layout/Footer.vue'
</script>
