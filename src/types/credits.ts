export interface CreditBase {
  id: number
  user_id: number
  credits: number
  action: 'Recharge' | 'Consume'
  type: number//1-recharge,2-consume
  description: string
  created_at: string
}