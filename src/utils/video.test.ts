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
  it('groups equivalent YouTube mirrors by visible quality and keeps the preferred format', () => {
    const result = normalizeFormats([
      { format_id: '137-a', ext: 'mp4', quality: '', width: 1920, height: 1080, fps: 30, vcodec: 'avc1.640028', acodec: 'none', tbr: 4500, url: 'https://a.googlevideo.com/v', filesize: 90 },
      { format_id: '137-b', ext: 'mp4', quality: '', width: 1920, height: 1080, fps: 30, vcodec: 'avc1.640028', acodec: 'none', tbr: 4700, url: 'https://b.googlevideo.com/v', filesize: 95 },
      { format_id: '248', ext: 'webm', quality: '', width: 1920, height: 1080, fps: 30, vcodec: 'vp9', acodec: 'none', tbr: 3200, url: 'https://c.googlevideo.com/v' },
    ])
    expect(result.map(item => item.format_id)).toEqual(['137-b', '248'])
  })

  it('keeps HDR and high-frame-rate variants distinct and labels them clearly', () => {
    const result = normalizeFormats([
      { format_id: 'sdr', ext: 'mp4', quality: '', width: 3840, height: 2160, fps: 30, vcodec: 'av01', acodec: 'none', dynamic_range: 'SDR', url: 'https://example.com/sdr' },
      { format_id: 'hdr', ext: 'mp4', quality: '', width: 3840, height: 2160, fps: 60, vcodec: 'av01', acodec: 'none', dynamic_range: 'HDR10', url: 'https://example.com/hdr' },
    ])
    expect(result).toHaveLength(2)
    expect(result[0].label).toContain('2160p 60fps HDR AV1 MP4')
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
