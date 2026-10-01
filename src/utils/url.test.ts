import { describe, it, expect } from 'vitest'
import { isValidUrl, extractDouyinUrl } from './url'

describe('url utils', () => {
  describe('isValidUrl', () => {
    it('should validate valid http/https URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:5173')).toBe(true)
      expect(isValidUrl('https://sub.domain.com/path?query=1#hash')).toBe(true)
    })

    it('should reject invalid strings', () => {
      expect(isValidUrl('')).toBe(false)
      expect(isValidUrl('not-a-url')).toBe(false)
    })
  })

  describe('extractDouyinUrl', () => {
    it('should extract Douyin short link from text', () => {
      const text = '7.12 复制打开抖音，看看【小助手】的作品 https://v.douyin.com/abc1234/ 精彩内容'
      expect(extractDouyinUrl(text)).toBe('https://v.douyin.com/abc1234/')
    })

    it('should return null when no Douyin link is present', () => {
      expect(extractDouyinUrl('hello world')).toBeNull()
      expect(extractDouyinUrl('https://youtube.com/watch?v=123')).toBeNull()
    })
  })
})
