import { describe, expect, it } from 'vitest'
import { normalizeFormats, requireMediaBlob } from './video'

describe('backend media response mapping', () => {
  it('preserves dimensions and backend preference for equal-quality mirrors', () => {
    const result = normalizeFormats([
      { format_id: 'bitrate-1-2', ext: 'mp4', quality: '', height: 1920, width: 1080, url: 'https://www.tiktok.com/play', filesize: 42, tbr: 1000 },
      { format_id: 'bitrate-1-0', ext: 'mp4', quality: '', height: 1920, width: 1080, url: 'https://cdn.example/a.mp4', filesize: 42, tbr: 1000 },
    ])
    expect(result[0]).toMatchObject({ format_id: 'bitrate-1-2', height: 1920, width: 1080, label: '1080p MP4', filesize: 42 })
    expect(result).toHaveLength(1)
  })
  it('keeps valid formats with unknown dimensions', () => {
    expect(normalizeFormats([{ format_id: 'play', ext: 'mp4', quality: '', url: 'https://example.com/v.mp4' }])[0].label).toBe('Original MP4')
  })
  it('rejects API errors returned as blobs rather than saving them as video', async () => {
    await expect(requireMediaBlob(new Blob([JSON.stringify({ code: 502, msg: 'Video expired' })], { type: 'application/json' }))).rejects.toThrow('Video expired')
    await expect(requireMediaBlob(new Blob(['<html>Bad gateway</html>'], { type: 'text/html' }))).rejects.toThrow('media file')
    await expect(requireMediaBlob(new Blob([]))).rejects.toThrow('empty')
  })
  it('accepts a nonempty media response', async () => {
    const blob = new Blob(['fixture media'], { type: 'video/mp4' })
    await expect(requireMediaBlob(blob)).resolves.toBe(blob)
  })
})
