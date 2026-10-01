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
  const downloadLoaded = ref(0)
  const downloadTotal = ref(0)
  const downloadStatus = ref<VideoStatus>('idle')
  const availableFormats = ref<VideoFormat[]>([])
  const videoService = createVideoService(api)

  const resetState = () => {
    error.value = ''
    downloadProgress.value = 0
    downloadLoaded.value = 0
    downloadTotal.value = 0
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
      downloadStatus.value = 'preparing'
      downloadProgress.value = 0
      downloadLoaded.value = 0
      downloadTotal.value = selectedFormat.filesize || 0

      // Credits are charged once on successful parsing. Download uses that result.
      const blob = await videoService.download(
        videoInfo.value.url,
        {
          format_id: selectedFormat.format_id,
          quality: selectedFormat.quality
        },
        (progress, loaded, total) => {
          downloadStatus.value = 'downloading'
          downloadLoaded.value = loaded
          if (total > 0) {
            downloadTotal.value = total
            downloadProgress.value = progress
          } else if (selectedFormat.filesize && selectedFormat.filesize > 0) {
            downloadTotal.value = selectedFormat.filesize
            downloadProgress.value = Math.min(99, Math.round((loaded * 100) / selectedFormat.filesize))
          } else {
            // 估算平滑进度（当未知总体大小时）
            downloadProgress.value = Math.min(95, Math.round((1 - Math.exp(-loaded / (15 * 1024 * 1024))) * 100))
          }
        }
      )

      downloadProgress.value = 100
      if (downloadTotal.value === 0 && downloadLoaded.value > 0) {
        downloadTotal.value = downloadLoaded.value
      }

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

      // 下载完成后2.5秒自动重置回常态
      setTimeout(() => {
        if (downloadStatus.value === 'completed') {
          downloadStatus.value = 'idle'
          downloadProgress.value = 0
          downloadLoaded.value = 0
          downloadTotal.value = 0
        }
      }, 2500)
    } catch (err: any) {
      let errorMessage = getErrorMessage(err)
      if (err?.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text()
          const json = JSON.parse(text)
          errorMessage = json.detail || json.message || json.msg || errorMessage
        } catch {
          // ignore
        }
      }
      error.value = errorMessage
      downloadStatus.value = 'failed'
      toastStore.showToast(errorMessage, 'error')

      // 失败后3.5秒重置回常态
      setTimeout(() => {
        if (downloadStatus.value === 'failed') {
          downloadStatus.value = 'idle'
        }
      }, 3500)
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
    downloadLoaded,
    downloadTotal,
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
