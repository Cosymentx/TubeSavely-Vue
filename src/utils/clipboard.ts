import { useToastStore } from '../stores/toast'

export const useClipboard = () => {
  const toastStore = useToastStore()

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toastStore.showToast('Copied to clipboard', 'success')
    } catch (err) {
      toastStore.showToast('Failed to copy', 'error')
    }
  }

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      return text
    } catch (err) {
      toastStore.showToast('Failed to paste', 'error')
      return null
    }
  }

  return {
    copyToClipboard,
    pasteFromClipboard
  }
}