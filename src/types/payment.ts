export type PaymentMethodType = 'alipay' | 'wechat' | 'stripe' | 'paypal'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed'

// 支付方式定义
export interface PaymentMethod {
  id: PaymentMethodType
  name: string
  icon: string
}

// 预定义金额选项
export interface PaymentAmount {
  points: number
  price: number
  amount?: number
  discount?: number
}

// 基础支付信息
export interface PaymentBase {
  points: number
  amount: number
  payment_method: PaymentMethodType
}

// 创建支付请求
export interface PaymentCreate extends PaymentBase {
}

// 创建支付响应
export interface PaymentResponse {
  order_id: string
  amount: number
  points: number
  payment_url: string
}

// 支付订单信息
export interface Payment extends PaymentBase {
  id: number
  user_id: number
  order_id: string
  status: PaymentStatus
  transaction_id?: string
  error_message?: string
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