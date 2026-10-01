export type PaymentMethodType = 'alipay' | 'wechat' | 'stripe' | 'paypal' | 'airwallex' | 'creem'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed'

// 支付方式定义
export interface PaymentMethod {
  id: PaymentMethodType
  name: string
  currencies: Array<'CNY' | 'USD'>
}

// 信用点数价格配置
export interface CreditAmount {
  id: number
  credits: number
  amount_cny: number
  amount_usd: number
  is_active: boolean
  currency?: string
  symbol?: string
  amount?: number
  created_at: string
  updated_at: string
}

// 基础支付信息
export interface PaymentBase {
  // credits: number
  // amount: number
  payment_method: PaymentMethodType
}

// 创建支付请求
export interface PaymentCreate extends PaymentBase {
  credit_amount_id?: number
  currency?: string
}

// 创建支付响应
export interface PaymentResponse {
  order_id: string
  amount: number | string
  currency: 'CNY' | 'USD'
  credits: number
  payment_url: string
}

// 支付订单信息
export interface Payment extends PaymentBase {
  id: number
  user_id: number
  order_id: string
  status: PaymentStatus
  amount: number | string
  currency: 'CNY' | 'USD'
  credits: number
  trade_no?: string
  created_at: string
  updated_at: string
  paid_at?: string
}

// 支付结果
export interface PaymentResult {
  success: boolean
  message: string
  transaction_id?: string
}

export interface PaymentUpdate {
  status?: PaymentStatus
  transaction_id?: string
  error_message?: string
}

export interface PaymentHistory {
  payments: Payment[]
  total: number
  page: number
  limit: number
}
