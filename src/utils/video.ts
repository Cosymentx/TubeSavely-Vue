import type { VideoFormat } from '../types/video'

export function normalizeFormats(formats: VideoFormat[]): VideoFormat[] {
  const seen = new Set<string>()
  return formats.filter(format => {
    if (!format.url) return false
    const key = format.width || format.height || format.tbr
      ? JSON.stringify([format.ext, format.width, format.height, format.fps, format.tbr, format.vcodec, format.acodec, format.filesize])
      : format.url
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).map(format => {
    const size = format.width && format.height ? Math.min(format.width, format.height) : format.height
    const label = `${size ? `${size}p` : 'Original'} ${format.ext.toUpperCase()}`
    return { ...format, id: format.format_id, label }
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
