import type {VideoCreate, VideoFormat, VideoDownloadOptions, Video } from '../types/video'
import type { ApiResult } from '@/types/api'
import type { Paging } from '@/types/paging'
import type { AxiosInstance } from 'axios'
import { requireMediaBlob } from '../utils/video'

export const createVideoService = (api: AxiosInstance) => ({
  parse: (url: string): ApiResult<VideoCreate> => {
    return api.get(`/videos/parse?url=${encodeURIComponent(url)}`, { timeout: 120000 })
  },
  getInfo: (url: string): ApiResult<VideoCreate> => {
    return api.post('/videos/info', { url })
  },

  getFormats: (url: string): ApiResult<VideoFormat[]> => {
    return api.get(`/videos/formats?url=${encodeURIComponent(url)}`)
  },
  
  getVideoHistory: (offset: number = 0, limit: number = 20): ApiResult<Paging<Video>> => {
    return api.get('/videos/history', {
      params: { offset, limit }
    })
  },

  deleteVideo: (id: number): ApiResult<void> => {
    return api.delete(`/videos/${id}`)
  },

  download: (
    url: string,
    options: VideoDownloadOptions,
    onProgress?: (progress: number, loaded: number, total: number) => void,
    signal?: AbortSignal
  ): Promise<Blob> => {
    return api.post<Blob>('/videos/download',
      { url, ...options },
      {
        responseType: 'blob',
        timeout: 300000,
        signal,
        onDownloadProgress: (progressEvent) => {
          if (onProgress) {
            const loaded = progressEvent.loaded || 0
            const total = progressEvent.total || 0
            let progress = 0
            if (total > 0) {
              progress = Math.min(100, Math.round((loaded * 100) / total))
            }
            onProgress(progress, loaded, total)
          }
        }
      }
    ).then(response => requireMediaBlob(response.data)).catch(async error => {
      if (error.response?.data instanceof Blob) {
        await requireMediaBlob(error.response.data)
      }
      throw error
    })
  }
})
