import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composables/useApi'
import { createVideoService } from '../services/video'
import { useToastStore } from './toast'
import type { VideoFormat, VideoCreate, VideoStatus } from '../types/video'
import { getErrorMessage } from '../utils/error'
import { useUserStore } from './user'

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
      isLoading.value = true
      error.value = ''
      const response = await videoService.parse(url)
      if (response.data.code === 200) {
        videoInfo.value = response.data.data
        // 处理formats信息
        if (response.data.data?.formats) {
          availableFormats.value = response.data.data.formats.map((format: any) => ({
            id: format.format_id,
            format_id: format.format_id,
            quality: format.quality,
            label: `${format.height || ''}p ${format.ext}`,
            filesize: format.filesize || 0,
            url: format.url,
            ext: format.ext,
            vcodec: format.vcodec,
            acodec: format.acodec
          })).filter((format: any) =>
            format.vcodec !== 'none' &&
            format.acodec !== 'none' &&
            format.height
          ).sort((a: any, b: any) => parseInt(b.label) - parseInt(a.label))

          userStore.fetchProfile()
        }
      } else {
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
  const downloadVideo = async () => {
    if (!userStore.isLoggedIn) {
      toastStore.showToast('Please login to download', 'error')
      return
    }

    if (userStore.getCredits() < 3) {
      toastStore.showToast('Insufficient credits. You need 3 credits to download.', 'error')
      return
    }

    if (!videoUrl.value) return

    try {
      downloadStatus.value = 'downloading'
      await userStore.deductCredits(3)
      downloadProgress.value = 0

      // 获取选中格式的URL
      const selectedFormat = availableFormats.value.find(f => f.format_id === format.value)
      if (!selectedFormat && format.value !== 'auto') {
        throw new Error('Selected format not found')
      }

      const response = await api.post('/download', {
        url: selectedFormat?.url || videoUrl.value,
        format: format.value
      }, {
        responseType: 'blob'  // Add this to get binary data
      })

      const fileName = videoInfo.value?.title || 'video'
      const extension = format.value === 'audio' ? 'mp3' : 'mp4'

      // 创建下载链接
      const url = window.URL.createObjectURL(response.data)  // response.data is already a Blob
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
    resetState
  }
})