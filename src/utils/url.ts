/**
 * 从文本中提取抖音链接
 * @param text 包含链接的文本
 * @returns 提取到的抖音链接，如果没有找到则返回null
 */

export const isValidUrl = (url: string): boolean => {
  try {
    const urlPattern = /^(https?:\/\/)?(([\.\w-]+)\.[a-z]{2,}|localhost)(:\d+)?(\/\S*)?$/i
    return urlPattern.test(url)
  } catch (e) {
    return false
  }
}

export function extractDouyinUrl(text: string): string | null {
  const regex = /https:\/\/v\.douyin\.com\/[\w-]+\/?/
  const match = text.match(regex)
  return match ? match[0] : null
}