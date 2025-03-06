export interface UserPreferences {
  defaultQuality: 'best' | '1080p' | '720p' | '480p' | '360p'
  autoConvert: boolean
  notifications: boolean
  maxConcurrent: string | number
}