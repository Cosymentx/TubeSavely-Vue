import { ref } from 'vue'

export interface CurrencyConfig {
  code: string
  symbol: string
  rate: number
}

const currencies: Record<string, CurrencyConfig> = {
  CNY: {
    code: 'CNY',
    symbol: '¥',
    rate: 1
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rate: 0.14 // 1 CNY = 0.14 USD (示例汇率)
  }
}

// 默认使用CNY
const currentCurrency = ref<CurrencyConfig>(currencies.CNY)

// 检测用户地区并设置对应货币
export const detectUserCurrency = async (): Promise<CurrencyConfig> => {
  try {
    const response = await fetch('http://ip-api.com/json/?fields=countryCode')
    const data = await response.json()
    
    if (data.countryCode === 'CN') {
      currentCurrency.value = currencies.CNY
    } else {
      currentCurrency.value = currencies.USD
    }
    return currentCurrency.value
  } catch (error) {
    console.error('Failed to detect user currency:', error)
    currentCurrency.value = currencies.USD
    return currentCurrency.value
  }
}

// 格式化价格显示
export const formatPrice = (priceInCNY: number): string => {
  const price = (priceInCNY * currentCurrency.value.rate).toFixed(2)
  return `${currentCurrency.value.symbol}${price}`
}

// 获取当前货币配置
export const getCurrentCurrency = (): CurrencyConfig => {
  return currentCurrency.value
}

// 导出用于价格转换的工具函数
export const convertPrice = (priceInCNY: number): number => {
  return Number((priceInCNY * currentCurrency.value.rate).toFixed(2))
}