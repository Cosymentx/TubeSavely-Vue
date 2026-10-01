import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composables/useApi'
import { createVideoService } from '../services/video'
import { useToastStore } from './toast'
import type { VideoFormat, VideoCreate, VideoStatus } from '../types/video'
import { getErrorMessage } from '../utils/error'
import { useUserStore } from './user'
import { normalizeFormats } from '../utils/video'

export const useVideoStore = defineStore('video', () => {
  const userStore = useUserStore()
  const toastStore = useToastStore()
  const apiService = useApi()
  const api = apiService.axiosInstance
  const videoUrl = ref('')
  const format = ref('auto')
  const isLoading = ref(false)
  const error = ref('')
  const videoInfo = ref<VideoCreate | null>(null)
  const downloadProgress = ref(0)
  const downloadStatus = ref<VideoStatus>('idle')
  const availableFormats = ref<VideoFormat[]>([])
  const videoService = createVideoService(api)

  const resetState = () => {
    error.value = ''
    downloadProgress.value = 0
    downloadStatus.value = 'idle'
  }

  const setVideoUrl = async (url: string) => {
    videoUrl.value = url
    if (url) {
      await fetchVideoInfo(url)
    } else {
      videoInfo.value = null
      availableFormats.value = []
      resetState()
    }
  }

  const setFormat = (newFormat: string) => {
    format.value = newFormat
    resetState()
  }

  const fetchVideoInfo = async (url: string) => {
    try {
      if (!userStore.isLoggedIn) {
        toastStore.showToast('Please login to download', 'error')
        return
      }

      if (userStore.getCredits() < 3) {
        toastStore.showToast('Insufficient credits. You need 3 credits to download.', 'error')
        return
      }
      isLoading.value = true
      error.value = ''
      videoInfo.value = null
      availableFormats.value = []
      const response = await videoService.parse(url)
      if (response.data.code === 200) {
        videoInfo.value = response.data.data
        // 处理formats信息
        if (response.data.data?.formats) {
          availableFormats.value = normalizeFormats(response.data.data.formats)
          videoInfo.value = { ...response.data.data, formats: availableFormats.value }

          userStore.fetchProfile()
        }
      } else {
        error.value = response.data.msg || 'Unable to parse this video'
        toastStore.showToast(response.data.msg, 'error')
      }
    } catch (err) {
      error.value = getErrorMessage(err)
      toastStore.showToast(error.value, 'error')
      videoInfo.value = null
      availableFormats.value = []
    } finally {
      isLoading.value = false
    }
  }

  const deleteVideo = async (id: number) => {
    try {
      isLoading.value = true
      const response = await videoService.deleteVideo(id)
      if (response.data.code === 200) {
        toastStore.showToast('Video deleted successfully!', 'success')
      } else {
        toastStore.showToast(response.data.msg, 'error')
      }
    } catch (err) {
      error.value = getErrorMessage(err)
      toastStore.showToast(error.value, 'error')
    } finally {
      isLoading.value = false
    }
  }

  const downloadVideo = async (selectedFormat: VideoFormat) => {
    if (!userStore.isLoggedIn) {
      toastStore.showToast('Please login to download', 'error')
      return
    }

    if (!videoInfo.value?.url || !selectedFormat.url) return

    try {
      downloadStatus.value = 'downloading'
      downloadProgress.value = 0

      // Credits are charged once on successful parsing. Download uses that result.
      const blob = await videoService.download(videoInfo.value.url, {
        format_id: selectedFormat.format_id,
        quality: selectedFormat.quality
      }, progress => {
        downloadProgress.value = progress
      })

      const fileName = (videoInfo.value?.title || 'video').replace(/[\\/:*?"<>|]/g, '_')
      const extension = selectedFormat.ext || 'mp4'

      // 创建下载链接
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${fileName}.${extension}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      downloadStatus.value = 'completed'
      toastStore.showToast('Download completed successfully!', 'success')
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      error.value = errorMessage
      downloadStatus.value = 'failed'
      toastStore.showToast(errorMessage, 'error')
    }
  }
  const parseVideo = async () => {
    if (!videoUrl.value) return
    await fetchVideoInfo(videoUrl.value)
  }

  const getVideoHistory = async (offset: number = 0, limit: number = 10) => {
    try {
      isLoading.value = true
      const response = await videoService.getVideoHistory(offset, limit)
      if (response.data.code === 200) {
        return response.data.data
      } else {
        toastStore.showToast(response.data.msg, 'error')
      }
    } catch (err) {
      error.value = getErrorMessage(err)
      toastStore.showToast(error.value, 'error')
    } finally {
      isLoading.value = false
    }
  }

  return {
    videoUrl,
    format,
    isLoading,
    error,
    videoInfo,
    downloadProgress,
    downloadStatus,
    availableFormats,
    setVideoUrl,
    setFormat,
    downloadVideo,
    parseVideo,
    resetState,
    getVideoHistory,
    deleteVideo
  }
})
