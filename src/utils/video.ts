import type { VideoFormat } from '../types/video'

function codecFamily(codec?: string): string {
  if (!codec || codec === 'none') return 'none'
  const value = codec.toLowerCase()
  if (value.includes('av01') || value.includes('av1')) return 'av1'
  if (value.includes('vp9')) return 'vp9'
  if (value.includes('hvc1') || value.includes('hev1') || value.includes('hevc') || value.includes('h265')) return 'hevc'
  if (value.includes('avc1') || value.includes('h264')) return 'h264'
  if (value.includes('opus')) return 'opus'
  if (value.includes('mp4a') || value.includes('aac')) return 'aac'
  return value.split(/[.\s-]/)[0]
}

function dynamicRange(format: VideoFormat): string {
  const value = (format.dynamic_range || format.format_note || '').toLowerCase()
  if (/hdr|hlg|pq/.test(value)) return 'hdr'
  return 'sdr'
}

function displayResolution(format: VideoFormat): number | undefined {
  if (format.width && format.height) return Math.min(format.width, format.height)
  return format.height || format.width
}

function userVisibleKey(format: VideoFormat): string {
  const resolution = displayResolution(format) || 0
  const fps = format.fps ? Math.round(format.fps) : 0
  const videoCodec = codecFamily(format.vcodec)
  const audioCodec = codecFamily(format.acodec)
  const hasAudio = audioCodec !== 'none'
  return JSON.stringify([
    resolution,
    fps,
    videoCodec,
    dynamicRange(format),
    hasAudio,
    format.ext.toLowerCase(),
  ])
}

function preferenceScore(format: VideoFormat): number {
  let score = 0
  if (format.ext.toLowerCase() === 'mp4') score += 100
  if (codecFamily(format.acodec) !== 'none') score += 40
  if (format.filesize) score += 10
  if (format.tbr) score += Math.min(format.tbr / 1000, 20)
  return score
}

function formatLabel(format: VideoFormat): string {
  const resolution = displayResolution(format)
  const parts = [resolution ? `${resolution}p` : 'Original']
  if (format.fps && format.fps >= 50) parts.push(`${Math.round(format.fps)}fps`)
  if (dynamicRange(format) === 'hdr') parts.push('HDR')
  const codec = codecFamily(format.vcodec)
  if (codec !== 'none' && codec !== 'h264') parts.push(codec.toUpperCase())
  parts.push(format.ext.toUpperCase())
  return parts.join(' ')
}

export function normalizeFormats(formats: VideoFormat[]): VideoFormat[] {
  const preferred = new Map<string, VideoFormat>()

  for (const format of formats) {
    if (!format.url) continue

    const key = (format.width || format.height || format.fps || format.tbr || format.vcodec || format.acodec)
      ? userVisibleKey(format)
      : format.url

    const current = preferred.get(key)
    if (!current || preferenceScore(format) > preferenceScore(current)) {
      preferred.set(key, format)
    }
  }

  return [...preferred.values()]
    .map(format => ({ ...format, id: format.format_id, label: formatLabel(format) }))
    .sort((a, b) => {
      const resolutionDiff = (displayResolution(b) || 0) - (displayResolution(a) || 0)
      if (resolutionDiff) return resolutionDiff
      const fpsDiff = (b.fps || 0) - (a.fps || 0)
      if (fpsDiff) return fpsDiff
      if (dynamicRange(a) !== dynamicRange(b)) return dynamicRange(a) === 'hdr' ? -1 : 1
      return preferenceScore(b) - preferenceScore(a)
    })
}

export async function requireMediaBlob(blob: Blob): Promise<Blob> {
  if (/json|text\/|html/i.test(blob.type)) {
    let message = 'The server did not return a media file.'
    try {
      const data = JSON.parse(await blob.text())
      message = data.msg || data.detail || data.message || message
    } catch { /* Keep the readable fallback for HTML/text errors. */ }
    throw new Error(message)
  }
  if (!blob.size) throw new Error('The downloaded file is empty.')
  return blob
}
