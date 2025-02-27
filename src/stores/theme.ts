import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 从 localStorage 获取初始主题，如果没有则使用系统主题
  const getInitialTheme = (): 'dark' | 'light' => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const theme = ref<'dark' | 'light'>(getInitialTheme())

  // 监听主题变化并更新 DOM 和 localStorage
  watch(theme, (newTheme) => {
    // 更新 DOM
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // 保存到 localStorage
    localStorage.setItem('theme', newTheme)
  }, { immediate: true })

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const isDark = computed(() => theme.value === 'dark')

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    // 只有当没有保存的主题时才跟随系统
    if (!localStorage.getItem('theme')) {
      theme.value = e.matches ? 'dark' : 'light'
    }
  })

  return {
    theme,
    isDark,
    toggleTheme
  }
}) 