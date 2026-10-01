export interface VideoFormatBase {
  format_id: string
  ext: string
  quality: string
  format?: string
  filesize?: number
  url?: string
}

export interface VideoFormat extends VideoFormatBase {
  id?: string
  label?: string
  format_note?: string
  width?: number
  height?: number
  vcodec?: string
  acodec?: string
  tbr?: number
  fps?: number
}

export interface VideoBase {
  url: string
  title: string
  duration: string
  thumbnail: string
  platform: string
  video_id: string
  description?: string
  author?: string
  author_url?: string
  view_count?: string
  like_count?: string
  created_at?: string
}

export interface VideoCreate extends VideoBase {
  formats: VideoFormat[]
}

export interface VideoUpdate {
  title?: string
  description?: string
  thumbnail?: string
}

export interface Video extends VideoBase {
  id: number
  formats: VideoFormat[]
  created_at: string
  updated_at: string
}

export type VideoStatus = 'idle' | 'downloading' | 'completed' | 'failed'

export interface VideoDownloadBase {
  video_url: string
  video_title: string
  format: string
}

export interface VideoDownload extends VideoDownloadBase {
  id: number
  status: VideoStatus
  error?: string
  user_id: number
  video_id: number
  download_time: string
}

// 下载选项
export interface VideoDownloadOptions {
  format_id: string
  quality?: string
  output_dir?: string
  filename?: string
}
