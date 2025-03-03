import type {VideoBase, VideoCreate, VideoFormat, VideoDownloadOptions, Video } from '../types/video'
import type { ApiResult } from '@/types/api'
import type { Paging } from '@/types/paging'
import type { AxiosInstance } from 'axios'

export const createVideoService = (api: AxiosInstance) => ({
  parse: (url: string): ApiResult<VideoCreate> => {
    return api.get(`/videos/parse?url=${encodeURIComponent(url)}`)
  },
  getInfo: (url: string): ApiResult<VideoCreate> => {
    return api.post('/videos/info', { url })
  },

  getFormats: (url: string): ApiResult<VideoFormat[]> => {
    return api.get(`/videos/formats?url=${encodeURIComponent(url)}`)
  },
  
  getVideoHistory: (page: number = 0, size: number = 20): ApiResult<Paging<Video>> => {
    return api.get('/videos/history', {
      params: { page, size }
    })
  },

  deleteVideo: (id: number): ApiResult<void> => {
    return api.delete(`/videos/${id}`)
  },

  download: (
    url: string, 
    options: VideoDownloadOptions, 
    onProgress?: (progress: number) => void
  ): Promise<Blob> => {
    return api.post<Blob>('/videos/download', 
      { url, ...options },
      {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        }
      }
    ).then(response => response.data)
  }
})