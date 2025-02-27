import type { VideoCreate, VideoFormat, VideoDownloadOptions } from '../types/video'
import type { ApiResult } from '../types/api'
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