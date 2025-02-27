<template>
  <div v-if="video" class="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 p-4 mt-4">
    <div class="flex items-start space-x-4">
      <!-- Thumbnail -->
      <div class="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
        <img 
          :src="video.thumbnail" 
          :alt="video.title"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <h3 class="text-gray-800 font-medium truncate">{{ video.title }}</h3>
        <p class="text-gray-500 text-sm mt-1">{{ video.duration }}</p>
        <div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
          <div class="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{{ formatNumber(video.view_count || 0) }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>{{ formatNumber(video.like_count || 0) }}</span>
          </div>
        </div>
        <div class="flex items-center space-x-2 mt-2">
          <span class="text-sm text-gray-600">Available formats:</span>
          <div class="flex items-center space-x-1">
            <span 
              v-for="format in video.formats" 
              :key="format"
              class="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded"
            >
              {{ format }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Video {
  title: string
  thumbnail: string
  duration: string
  formats: string[]
  view_count?: number
  like_count?: number
}

defineProps<{
  video?: Video
}>()

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
</script>