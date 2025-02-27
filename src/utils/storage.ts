export const useLocalStorage = <T>(key: string, initialValue?: T) => {
  const read = (): T | undefined => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      localStorage.removeItem(key)
      return initialValue
    }
  }

  const write = (value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to write to localStorage:', error)
    }
  }

  const remove = () => {
    localStorage.removeItem(key)
  }

  return {
    get: read,
    set: write,
    delete: remove
  }
} 